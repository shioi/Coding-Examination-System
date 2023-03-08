import useFetch from './useFetch';
import { Link } from 'react-router-dom';
const Exam = () => {
    const { data, isLoading, error } = useFetch('http://localhost:4000/getExams');
    return (
        <div className="exam">
            <h1>Current Exams</h1>
            {error && <div>{error}</div>}
            {isLoading && <div>Loading ...</div>}
            {data && data.map(question => {
                return (
                    <ul>
                        <li key={question.id}>
                            <h2>{question.name}</h2>
                            <h3>{question.duration}</h3>
                            <p>Total Marks: {question.totalMarks}</p>
                            <p>Status: {question.examstatus}</p>
                            <p>Date: {question.Date}</p>
                            <Link to={`/question/${question.id}`}>
                                <button>Attempt</button>
                            </Link>

                        </li>
                    </ul>
                )
            })}
        </div>
    );
}

export default Exam;