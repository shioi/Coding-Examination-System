import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket'
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useAuthContext } from "./useAuthContext";
import useFetch from './useFetch';

const WS_URL = new URL('ws://127.0.0.1:8000/?id=1&examid=2&type=p');


const MonitorExam = (props) => {
    const { user } = useAuthContext()
    const { eid } = useParams();
    const { data, isLoading, error } = useFetch(`http://localhost:4000/getstudents/${eid}`, user);
    const [activity, setActivity] = useState([]);


    WS_URL.searchParams.set('id', user.registerNo);
    WS_URL.searchParams.set('examid', eid);
    WS_URL.searchParams.set('type', user.isProf);


    const {
        sendJsonMessage,
    } = useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('WebSocket connection established')
        },
        onMessage: (event) => {
            const data = JSON.parse(event.data);
            if (data.userstatus) {

                setActivity(activity => [...activity, data.message])
                console.log(activity)
            }
        },
        onClose: () => {
            console.log("closed")
        },
    })
    const printHello = (reg, id) => {
        const data = document.getElementById(id).value
        sendJsonMessage({ teacher: true, id: reg, message: data })

    }

    return (
        <div>
            <h1>Monitor Exam</h1>
            {data && data.map((student, id) => {
                return (
                    <ul key={id}>
                        <li>{student.registerno}</li>
                        <li>{student.firstname}</li>
                        <form >
                            <input id={id}></input>
                        </form>
                        <button onClick={() => printHello(student.registerno, id)}>Send</button>
                    </ul>
                )
            })}
            <h2>Activity of students</h2>
            {activity && activity.map((act, id) => {
                return (
                    <p key={id}>{act}</p>
                )
            })}
        </div>

    );
}

export default MonitorExam;