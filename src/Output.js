import { useEffect, useState } from "react";

const Output = (props) => {
    const [out, setOut] = useState(null);
    const [error, setError] = useState(false);
    useEffect(() => {
        setOut(props.out);
        if (props.out && props.out.type === "Error") {
            setError(true)
        } else {
            setError(false);
        }

    }, [props]);
    //checking if its an error or an output
    let lines = [];
    let errorOut;
    if (out && !error) {
        const output = out.data;
        lines = output.split("\n");
        console.log(lines);
    } else if (out) {
        errorOut = out.data;
    }
    return (
        <div className="output">
            <h2>Output</h2>
            {out && !error && lines.map(line => {
                return (
                    <p key={line}>{line}</p>
                );
            })}
            <div key="error">
                {out && error && errorOut}
            </div>
        </div>
    );
}

export default Output;