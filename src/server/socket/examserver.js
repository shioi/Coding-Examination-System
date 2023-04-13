const { WebSocketServer, WebSocket } = require('ws');
const http = require('http')
const dbms = require('../db');

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const clients = {}
const clientTeach = {}




const timerExam = () => {
    for (let userId in clients) {
        let client = clients[userId];
        if (client['connection'].readyState === WebSocket.OPEN) {
            client['time']--;
        }
    };
}

function broadcastMessage(json) {
    // We are sending the current data to all connected active clients
    const data = JSON.stringify(json);
    for (let userId in clients) {
        let client = clients[userId];
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    };
}

function individualMessage(connection, data) {
    console.log(data)
    connection.send(JSON.stringify({ type: "time", data: data }));
}

//get timing
const getTime = (examId, userId, connection) => {
    dbms.getTiming(userId, examId, (isFirst, result) => {
        //console.log("inf", result[0])
        if (isFirst) {
            clients[userId]['time'] = result[0].duration * 60
            individualMessage(connection, result[0].duration);
        } else {
            console.log(userId, examId, result)
            clients[userId]['time'] = result[0].remaining_time
            individualMessage(connection, result[0].remaining_time / 60)
        }
    });

}

const handleDisconnect = (userId) => {
    console.log("disconnecting....", userId)
    //store value
    if (userId in clients) {
        dbms.storeTime(userId, clients[userId].exam, clients[userId].time)
        delete clients[userId]
    } else {
        delete clientTeach[userId]
    }


}

const handleMessage = (data) => {
    console.log("hellooooo")
    console.log(data.remaining_time)
}


wsServer.on('connection', function (connection, req) {
    const userUrl = req.url;
    //?id=2247102&examid=CAT-3-2023-04-13&type=1
    const userId = userUrl.substring(userUrl.indexOf('=') + 1, userUrl.indexOf('&'));
    const examId = userUrl.substring(userUrl.indexOf("mid=") + 4, userUrl.lastIndexOf('&'))
    const isProf = userUrl.substring(userUrl.lastIndexOf('=') + 1)
    //    console.log(userId, examId, isProf)
    if (isProf === '0') {
        clients[userId] = { 'connection': connection, 'exam': examId, 'time': 0 };
    } else {
        clientTeach[userId] = { 'connection': connection, 'exam': examId };
    }
    console.log(`${userId} connected`)
    if (isProf === '0') {
        getTime(examId, userId, connection)
        dbms.updateExamStatus(userId, examId, "Attempted");
    }

    connection.on('message', (data) => {
        data = data.toString()
        const jsonData = JSON.parse(data)

        if (jsonData.end && isProf === '0') {
            connection.close()
            dbms.updateExamStatus(userId, examId, "Done");
        }

        if (jsonData.teacher) {
            if (clients[jsonData.id] && clients[jsonData.id].connection.readyState === WebSocket.OPEN) {
                clients[jsonData.id].connection.send(JSON.stringify({ message: jsonData.message }))
            }

        }

        if (jsonData.tabswitch) {
            console.log(jsonData.message)
            //TODO: query the clientTeach 
            for (let userId in clientTeach) {
                let client = clientTeach[userId];
                console.log(client.exam)
                console.log(clients[jsonData.id].exam)
                if (client['connection'].readyState === WebSocket.OPEN && client.exam === clients[jsonData.id].exam) {
                    console.log("sending to: ", userId)
                    client.connection.send(JSON.stringify({ userstatus: true, message: jsonData.message }))
                }
            };

        }
    })

    connection.on('close', () => handleDisconnect(userId));



})

server.listen(port, () => {
    console.log(`Websocket server is running on port ${port}`)
    setInterval(timerExam, 1000);
})

