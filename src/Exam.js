import useFetch from './useFetch';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useAuthContext } from './useAuthContext';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import '@fontsource/roboto/300.css';


const Exam = (props) => {
    const history = useHistory();
    const commonStyles = {
        bgcolor: 'background.paper',
        borderColor: 'text.primary',
        m: 1,
        border: 3,
    };
    const { user } = useAuthContext()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading, error } = useFetch('http://localhost:4000/getExams', user);

    return (
        <div className="exam">
            <Typography variant='h3'>
                Upcoming Exams
            </Typography>

            {error && <div>{error}</div>}
            {isLoading && <div>Loading ...</div>}
            {data && data.map((question, index) => {
                return (
                    <Box key={question.id}
                        sx={{ boxShadow: 6 }}
                    >
                        <ul>
                            <li>
                                <h2>{question.name}</h2>
                                <h3>{question.duration}</h3>
                                <p>Total Marks: {question.totalMarks}</p>
                                <p>Status: {question.examstatus}</p>
                                <p>Date: {question.Date}</p>
                            </li>
                        </ul>
                    </Box>
                )
            })}
        </div >
    );
}

export default Exam;