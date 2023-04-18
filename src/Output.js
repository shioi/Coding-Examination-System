import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SettingsEthernet } from "@mui/icons-material";


const Output = (props) => {
    const [out, setOut] = useState(null);
    const [lines, setLines] = useState(null);
    const [error, setError] = useState(false);
    const [errorOut, setErrorOut] = useState(null);
    const [totalPassed, setTotalPassed] = useState(null)
    const [showLine, setShowLine] = useState(true);
    const [title, setTitle] = useState('');
    let k = 0;
    useEffect(() => {
        setOut(props.out);
        if (props.out && props.out.type === "Error") {
            setTotalPassed(null);
            setErrorOut(props.out.data)
            setError(true)
            setLines(null);
            setShowLine(true);
            setTitle("Compile Error")
        } else {
            setErrorOut(null);
            setError(false);
            if (props.out && props.out.type !== "Error") {

                setTotalPassed(props.out.totalTestPassed);
                setLines(props.out.data.split("\n"));
                if (!props.out.totalTestPassed) {
                    setTitle("Failure")
                    setShowLine(true)
                }
                else if (props.out.totalTestPassed["total"] === props.out.totalTestPassed["solved"]) {
                    setTitle("Success")
                    setShowLine(false);
                } else {
                    setTitle("Failure")
                    setShowLine(true)
                }
            }
        }

    }, [props]);

    return (
        <Box className="output">
            <Typography varient="h3">{title}</Typography>
            {out && totalPassed &&
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress variant="determinate" size={90}
                        value={100 * totalPassed['solved'] / totalPassed['total']}
                        style={{ 'color': 'green' }}
                    />

                    <Box>
                        <Typography variant="caption" component="div" color="text.secondary">
                            {`${totalPassed['solved']} / ${totalPassed['total']}`}
                        </Typography>
                    </Box>
                </Box>
            }
            {out && showLine && !error && lines.map((line, index) => {
                k++;
                return (
                    <Box id={index}>
                        <Typography color="red" variant="p" key={k + line} > {line}</Typography>
                    </Box>
                );
            })}
            <div key="error">
                {out && error && errorOut}
            </div>
        </Box >
    );
}

export default Output;