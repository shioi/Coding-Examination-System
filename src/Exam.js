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

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div className="exam">
            <Typography className="examtitle" variant='h6'>
                <center>UPCOMING EXAMS</center>
            </Typography>

            {error && <div>{error}</div>}
            {isLoading && <div>Loading ...</div>}
            {data && data.map((question, index) => {
                return (
                    <Box key={question.id}
                        sx={{ boxShadow: 6 }}
                    >
                        <ul className="examdetails">
                            <li>
                                <h3>{question.name}</h3>
                                <h3>{question.duration}</h3>
                                <p><b>Total Marks  :</b> {question.totalMarks}</p>
                                <p><b>Status       : </b>{question.examstatus}</p>
                                <p><b>Date & Time  :</b> {formatDateTime(question.Date)}</p>
                            </li>
                        </ul>
                    </Box>
                )
            })}
        </div >
    );
}

export default Exam;