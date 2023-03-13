import { useEffect, useState } from "react";

const Output = (props) => {
    const [out, setOut] = useState(null);
    const [lines, setLines] = useState(null);
    const [error, setError] = useState(false);
    const [errorOut, setErrorOut] = useState(null);
    let k = 0;
    useEffect(() => {
        setOut(props.out);
        if (props.out && props.out.type === "Error") {
            setErrorOut(props.out.data)
            setError(true)
            setLines(null);
        } else {
            setErrorOut(null);
            setError(false);
            if (props.out && props.out.type !== "Error") {
                setLines(props.out.data.split("\n"));
            }
        }

    }, [props]);

    return (
        <div className="output">
            <h2>Output</h2>
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