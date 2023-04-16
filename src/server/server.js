const express = require("express");
var bodyParser = require('body-parser')
const python = require('./services/python.js')
const cors = require('cors');
const dbms = require('./db');
const crypto = require("crypto");
const app = express();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const port = 4000;


const createToken = (id, isProfessor) => {
    return jwt.sign({ id, isProfessor }, process.env.SECRET, { expiresIn: '3d' });
}

app.use(express.static(__dirname + 'public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

app.post("/api/post/login", async (req, res) => {
    const { registerNo, password } = req.body;
    dbms.retriveLogin(registerNo, (error, result) => {
        if (error) {
            res.status(200).json({ error: true, message: "Register Number does not exist" });
        } else if (result.length === 0) {
            res.status(200).json({ error: true, message: "Register Number does not exist" });
        } else {
            bcrypt.compare(password, result[0].password, (err, data) => {
                if (err) throw error;
                if (!data) {
                    res.status(400).json({ message: "Wrong password" });
                } else {
                    dbms.getType(registerNo, (result) => {
                        const isProf = result[0].isProfessor
                        const token = createToken(registerNo, result[0].isProfessor);
                        res.status(200).json({ registerNo, token, isProf });
                    })
                }
            });
        }
    })
});

app.post("/api/post/signup", async (req, res) => {
    const { registerNo, firstname, lastname, email, password, isProfessor } = req.body;
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    dbms.postRegister(registerNo, firstname, lastname, email, hash, isProfessor, (error) => {
        if (error) {
            res.status(400).json({ 'error': true });
        } else {
            const token = createToken(registerNo, isProfessor);
            res.status(200).json({ registerNo, token, 'isProf': isProfessor })
        }
    })
});


//ensure authentication
const requireAuth = require('./requireAuth');

app.use(requireAuth);

const scheduleJobs = () => {
    dbms.getDateTime((result) => {
        for (var key in result) {
            console.log(result[key])
            const data = String(result[key].Date);
            console.log(data)
            const min = parseInt(data.substring(data.indexOf(":") + 1, data.lastIndexOf(":")))
            const hour = parseInt(data.substring(data.indexOf('T') + 1, data.lastIndexOf(":")))
            const date = data.substring(0, data.indexOf('T'))
            const dataArr = date.split('-')
            console.log(min, hour, dataArr)
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var d = new Date(date);
            var dayName = days[d.getDay()];
            console.log(dayName)

            cron.schedule(`0 ${min} ${hour} ${dataArr[2]} ${dataArr[1]} ${dayName}"`, function () {
                console.log("running a task every 10 second");
            });
        }
    })
}

//app.use(scheduleJobs)

app.get("/", (req, res) => {
    res.render('index');
})


app.post('/postcode', (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(data);
    python.runPython(data.content, data.questionId, req.user.id, (data) => {
        res.status(200).json(data);
    });

})

app.post('/postquestion', async (req, res) => {
    const data = req.body;
    //console.log(data);
    const algorithm = "aes-256-cbc";
    const initVector = crypto.randomBytes(16);
    const Securitykey = crypto.randomBytes(32);
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let password = cipher.update(data.password, "utf-8", "hex");
    password += cipher.final("hex");

    //schedule corn
    //Date: '2023-04-19',
    //  Time: '15:00',
    const min = parseInt(data.Time.substring(data.Time.lastIndexOf(":") + 1))
    const hour = parseInt(data.Time.substring(0, data.Time.lastIndexOf(":")))
    const dataArr = data.Date.split('-')
    console.log(min, hour, dataArr)
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(data.Date);
    var dayName = days[d.getDay()];
    console.log(dayName)

    cron.schedule(`0 ${min} ${hour} ${dataArr[2]} ${dataArr[1]} ${dayName}"`, function () {
        //set statu
        dbms.setStatus(data.id)

    });

    console.log(data)
    dbms.postQuestion(data, password, python.convertToTest, (result) => {
        res.status(200);
    })

})

app.get('/getexams', (req, res) => {
    if (req.user.isProfessor === 1) {
        console.log("cannot access")
        res.status(401).json({ error: "cannot access" });
    }
    dbms.getExams(req.user.id, (result) => {
        //check the time
        console.log(result)
        res.status(200).json(result);
    });
})


app.get('/getongoingexam', (req, res) => {
    if (req.user.isProfessor === 1) {
        console.log("cannot access")
        res.status(401).json({ error: "cannot access" });
    }
    dbms.getCurrentExams(req.user.id, (result) => {
        //check the time
        console.log(result)
        res.status(200).json(result);
    });
})


app.get('/getpastexams', (req, res) => {
    if (req.user.isProfessor === 1) {
        console.log("cannot access")
        res.status(401).json({ error: "cannot access" });
    }
    dbms.getPastExams(req.user.id, (result) => {
        //check the time
        console.log(result)
        res.status(200).json(result);
    });
})

app.get('/getteacherexams', (req, res) => {
    dbms.getTeacherExams(req.user.id, (result) => {
        res.status(200).json(result);
    })
})


app.get('/api/get/students', (req, res) => {
    dbms.getStudents((err, result) => {
        if (err) res.status(401).json({ 'error': "Failed to fetch" })
        else {
            res.status(200).json(result)
        }
    })
})


app.get('/question/:qid', (req, res) => {
    const id = req.params.qid;
    //console.log(id);
    dbms.getQuestion(id, (result) => {
        res.status(200).json(result);
    })
})

app.get('/getstudents/:eid', (req, res) => {
    const id = req.params.eid;
    //console.log(id);
    dbms.getStu(id, (result) => {
        res.status(200).json(result);
    })
})


app.listen(port, () => {
    console.log("Listening at " + port);
})

