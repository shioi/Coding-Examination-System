import Editor from "@monaco-editor/react";
import { TrendingUpOutlined } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { usePageVisibility } from "react-page-visibility";
import PageVisibility from "react-page-visibility/dist/umd/PageVisibility";
import { useAuthContext } from './useAuthContext';



const EditorView = (props) => {
    const [language, setLanguage] = useState('python');
    const { user } = useAuthContext()
    const [code, setCode] = useState(null);
    const [question, setQuestion] = useState(null);
    const [isActive, setIsActive] = useState(null);
    const handleEditorChange = (value) => {
        setCode(value);
    }
    useEffect(() => {
        setQuestion(props.qId);
        setIsActive(true);
        //TODO: send the code to the server for the question and save it
        //TODO: fetch the code for the selected question and set it in setCode()
        setCode(null);
    }, [props.qId])


    const handleVisibilityChange = (visibility) => {
        setIsActive(!visibility);
        console.log("is there is tab: " + isActive);
    }

    const submitCode = (code, language) => {
        const url = "http://localhost:4000/postcode";
        const finalcode = {
            lang: language,
            content: code,
            questionId: question,
        };
        fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${user.token}` },
            body: JSON.stringify(finalcode)
        })
            .then(res => {
                if (!res.ok) {
                    throw Error("Error occured")
                }
                return res.json();
            })
            .then(data => {
                //console.log(data);
                props.setOutput(data);
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    return (
        <div className="editor-view">
            <PageVisibility onChange={handleVisibilityChange}></PageVisibility>
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
                    height="500px"
                    width="770px"
                    language={language}
                    onChange={handleEditorChange}
                    automaticLayout={true}
                    value={code}
                />
            </div>
            <div className="submit-button">
                <button onClick={() => { submitCode(code, language) }}>Submit Code</button>
            </div>
        </div>

    );
}

export default EditorView;