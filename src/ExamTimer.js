import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket'
import { useAuthContext } from "./useAuthContext";
import PageVisibility from "react-page-visibility/dist/umd/PageVisibility";
import '@fontsource/roboto/300.css';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import { Alert } from '@mui/material';


const WS_URL = new URL('ws://127.0.0.1:8000/?id=1&examid=2&type=p');



const ExamTimer = (props) => {
    const history = useHistory();

    const { user } = useAuthContext()
    const [timeless, setTimeless] = useState(false);
    const [seconds, setSeconds] = useState(null);
    const [isActive, setIsActive] = useState(null);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isMessage, setIsMessage] = useState(false);
    const [tabSwitch, setTabSwitch] = useState(null);

    const examid = props.id
    WS_URL.searchParams.set('id', user.registerNo);
    WS_URL.searchParams.set('examid', examid);
    WS_URL.searchParams.set('type', user.isProf);

    const handleVisibilityChange = (visibility) => {
        setIsActive(!visibility);
        console.log("is there is tab: " + isActive);
        if (isActive) {
            setTabSwitch(user.registerNo + ": Switched the tab!!")
        } else {
            setTabSwitch(user.registerNo + ": Returned to the exam tab!!")
        }
        if (tabSwitch) {
            sendJsonMessage({ id: user.registerNo, tabswitch: true, message: tabSwitch })
        }

    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    function secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }


    const {
        sendJsonMessage,
    } = useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('WebSocket connection established')
        },
        onMessage: (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "time") {

                setSeconds(data.data * 60)
            } else {
                console.log(data.message)
                setMessage(data.message)
                setOpen(true);
                setIsMessage(true);
            }
        },
        onClose: () => {
            console.log("closed")
            history.push('/')
        },
    })


    useEffect(() => {
        setIsActive(true);
    }, [])


    useEffect(() => {

        const id = setInterval(() => {
            setSeconds(seconds - 1);
        }, 1000);

        if (seconds && seconds <= 0) {
            //time ended
            console.log("should end")
            sendJsonMessage({ end: true });
        }

        if (seconds && seconds <= 10 * 60) {
            setTimeless(true);
        }
        return () => {
            clearInterval(id)
        }
    }, [seconds])

    const themeAlert = createTheme({
        typography: {

            allVariants: {
                fontSize: 14,
                color: 'red',
            },

        },
    });



    return (
        <Box
            sx={{
                backgroundColor: 'black',
            }}
        >
            <PageVisibility onChange={handleVisibilityChange}></PageVisibility>
            <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
            >
                <Grid item>
                    {timeless &&
                        <ThemeProvider theme={themeAlert}>
                            <Typography>
                                Time: {secondsToTime(seconds).h} :: {secondsToTime(seconds).m} :: {secondsToTime(seconds).s}
                            </Typography>
                        </ThemeProvider>
                    }
                    {!timeless &&
                        <Typography color="white">
                            Time: {secondsToTime(seconds).h} :: {secondsToTime(seconds).m} :: {secondsToTime(seconds).s}
                        </Typography>
                    }
                    {isMessage &&
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                            <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>{message}</Alert>
                        </Snackbar>
                    }
                </Grid>
            </Grid>
        </Box>
    );
}

export default ExamTimer;