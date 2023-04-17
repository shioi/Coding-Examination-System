import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket'
import { useParams } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import useFetch from './useFetch';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import { useHistory } from "react-router-dom";
import {
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Typography
} from '@mui/material'

const WS_URL = new URL('ws://127.0.0.1:8000/?id=1&examid=2&type=p');


const MonitorExam = (props) => {
    const history = useHistory();
    const { user } = useAuthContext()
    const { eid } = useParams();
    const { data, isLoading, error } = useFetch(`http://localhost:4000/getstudents/${eid}`, user);
    const [activity, setActivity] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [message, setMessage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

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
    });

    const endExam = () => {
        sendJsonMessage({ endexam: true, examid: eid });
        history.push('/')
    }

    const handleSendClick = () => {
        if (message && selectedStudent) {
            sendJsonMessage({ teacher: true, id: selectedStudent.registerno, message: message });
            setMessage('');
            setSelectedStudent(null);
            setOpenDialog(false);
        }
    };

    return (
        <container>
            <AppBar position="sticky">
                <Typography variant="h4">Monitor Exam</Typography>
            </AppBar>
            <Grid container spacing={10}>
                <Grid item>
                    {data && data.map((student, id) => (
                        <ul key={id}>
                            <li>{student.registerno}</li>
                            <li>{student.firstname} {student.lastname}</li>
                            <Button variant="outlined" onClick={() => {
                                setSelectedStudent(student);
                                setOpenDialog(true);
                            }}>
                                Send Message
                            </Button>
                        </ul>
                    ))}
                </Grid>
                <Grid item>
                    <Typography variant="h5">Activity</Typography>
                    {activity && activity.map((act, id) => (
                        <p key={id}>{act}</p>
                    ))}
                </Grid>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Send Message</DialogTitle>
                    <DialogContent>
                        {selectedStudent && (
                            <>
                                <Typography variant="body1">
                                    Student: {selectedStudent.registerno} - {selectedStudent.firstname} {selectedStudent.lastname}
                                </Typography>
                                <TextField
                                    label="Message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSendClick} color="primary">
                            Send
                        </Button>
                    </DialogActions>
                </Dialog>


            </Grid>
            <Button variant="contained" onClick={endExam}>End Exam</Button>
        </container>
    );
}

export default MonitorExam;
