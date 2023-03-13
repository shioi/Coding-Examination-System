import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import useFetch from './useFetch';

const Question = (props) => {
    const { qid } = useParams();
    const { data, isLoading, error } = useFetch(`http://localhost:4000/question/${qid}`);
    const [question, setQuestion] = useState(null);
    const [numOfQuestion, setNumOfQuestion] = useState(null);
    const [qusNo, setQusNo] = useState(null);
    useEffect(() => {
        if (data) {
            setNumOfQuestion(Object.keys(data).length);
            setQuestion(data[0]);
            setQusNo(1);
            props.setQueId(data[0].id);
        }
    }, [data])
    return (
        <div className="question">
            <div className="dropdown">
                <button className="dropbtn">Question List</button>
                <div className="dropdown-content">
                    {data && numOfQuestion &&
                        [...Array(numOfQuestion).keys()].map(el => <button key={el} onClick={() => {
                            setQuestion(data[el]);
                            setQusNo(el + 1);
                            props.setQueId(data[el].id);
                            props.setOutput(null)
                        }}> {el + 1} </button>)
                    }
                </div>
            </div>
            <h2>Question: {question && qusNo}</h2>
            <p>
                {question && question.Question}
            </p>
        </div>
    );
}

export default Question;