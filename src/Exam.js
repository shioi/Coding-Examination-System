import useFetch from './useFetch';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
const Exam = () => {
    const commonStyles = {
        bgcolor: 'background.paper',
        borderColor: 'text.primary',
        m: 1,
        border: 3,
    };
    const { data, isLoading, error } = useFetch('http://localhost:4000/getExams');
    return (
        <div className="exam">
            <h1>Current Exams</h1>
            {error && <div>{error}</div>}
            {isLoading && <div>Loading ...</div>}
            {data && data.map((question, index) => {
                return (
                    <Box key={question.id} sx={{ display: 'flex', ...commonStyles, borderRadius: '16px' }}>
                        <ul>
                            <li>
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
                    </Box>
                )
            })}
        </div >
    );
}

export default Exam;