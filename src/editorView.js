import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";


const EditorView = (props) => {
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState(null);
    const [question, setQuestion] = useState(null);

    const handleEditorChange = (value) => {
        setCode(value);
    }

    useEffect(() => {
        setQuestion(props.qId);
    }, [props])

    const submitCode = (code, language) => {
        const url = "http://localhost:4000/postcode";
        const finalcode = {
            lang: language,
            content: code,
            questionId: question,
        };
        fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalcode)
        })
            .then(res => {
                if (!res.ok) {
                    throw Error("Error occured")
                }
                return res.json();
            })
            .then(data => {
                props.setOutput(data);
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    return (
        <div className="editor-view">
            <div className="dropdown">
                <button className="dropbtn">{language}</button>
                <div className="dropdown-content">
                    <button onClick={() => { setLanguage('python') }}>Python 3.0</button>
                    <button onClick={() => { setLanguage('c') }}>C (gcc)</button>
                </div>
            </div>
            <div className="editor">
                <h3>Write your code here</h3>
                <Editor
                    height="70vh"
                    width="770px"
                    language={language}
                    onChange={handleEditorChange}
                />
            </div>
            <div className="submit-button">
                <button onClick={() => { submitCode(code, language) }}>Submit Code</button>
            </div>
        </div>

    );
}

export default EditorView;