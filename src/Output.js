import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


const Output = (props) => {
    const [out, setOut] = useState(null);
    const [lines, setLines] = useState(null);
    const [error, setError] = useState(false);
    const [errorOut, setErrorOut] = useState(null);
    const [totalPassed, setTotalPassed] = useState(null)
    let k = 0;
    useEffect(() => {
        setOut(props.out);
        if (props.out && props.out.type === "Error") {
            setTotalPassed(props.out.totalTestPassed);
            setErrorOut(props.out.data)
            setError(true)
            setLines(null);
        } else {
            setErrorOut(null);
            setError(false);
            if (props.out && props.out.type !== "Error") {
                setTotalPassed(props.out.totalTestPassed);
                setLines(props.out.data.split("\n"));
            }
        }

    }, [props]);

    return (
        <div className="output">
            {out &&
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
            {out && !error && lines.map(line => {
                k++;
                return (
                    <p key={k + line} > {line}</p>
                );
            })}
            <div key="error">
                {out && error && errorOut}
            </div>
        </div >
    );
}

export default Output;