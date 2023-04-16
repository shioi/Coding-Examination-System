import useFetch from './useFetch';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAuthContext } from './useAuthContext';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const OngoingExam = (props) => {
    const history = useHistory();
    const commonStyles = {
        bgcolor: 'background.paper',
        borderColor: 'text.primary',
        m: 1,
        border: 3,
    };
    const { user } = useAuthContext();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading, error } = useFetch('http://localhost:4000/getongoingexam', user);

    const handleButtonClick = (data) => {
        console.log(data);
        props.setExamId(data);
        history.push(`/question/${data}`);
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div className="exam">
            <h1>Current Exams</h1>
            {error && <div>{error}</div>}
            {isLoading && <div>Loading ...</div>}
            {data &&
                data.map((question, index) => {
                    return (
                        <Box key={question.id} sx={{ display: 'flex', ...commonStyles, borderRadius: '16px' }}>
                            <ul>
                                <li>
                                    <h2>{question.name}</h2>
                                    <h3>{question.duration}</h3>
                                    <p>Total Marks: {question.totalMarks}</p>
                                    <p>Status: {question.examstatus}</p>
                                    <p>Date: {formatDateTime(question.Date)}</p>
                                    <button onClick={() => handleButtonClick(question.id)}>Attempt</button>
                                </li>
                            </ul>
                        </Box>
                    );
                })}
        </div>
    );
};

export default OngoingExam;
