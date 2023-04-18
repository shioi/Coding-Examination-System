import { useState } from "react";
import CreateExam from "./createExam";
import ChooseStudent from "./ChooseStudent";
import { useAuthContext } from './useAuthContext';
import Navigation from "./nav";


const Conductexam = () => {
    const [step, setStep] = useState(1);
    const { user } = useAuthContext()

    const next = () => {
        setStep(step + 1);
    }

    const prev = () => {
        setStep(step - 1);
    }

    const [testInputFields, setTestInputFields] = useState([
        {
            Question: '',
            Marks: '',
            Functions: [{
                functionName: '',
                Type: 'value',
                TestCases: [{
                    Input: '',
                    Output: ''
                }]
            }]
        }
    ]);
    const [examName, setExamName] = useState('');
    const [subject, setSubject] = useState('');
    const [duration, setDuration] = useState('');
    const [totalMarks, setTotalMarks] = useState('');
    const [password, setPassword] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [select, setSelection] = useState([]);
    const [author, setAuthor] = useState('');

    const submit = (e) => {
        e.preventDefault();
        console.log(testInputFields);
        console.log(select);
        const id = examName + "-" + date;
        setAuthor(user.registerNo)
        const finalsubmission = {
            id: id,
            name: examName,
            duration: duration,
            totalMarks: totalMarks,
            password: password,
            examstatus: "upcoming",
            Date: date,
            Time: time,
            Questions: testInputFields,
            Students: select,
            author: user.registerNo
        }
        console.log(finalsubmission)
        const url = "http://localhost:4000/postquestion";
        fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${user.token}` },
            body: JSON.stringify(finalsubmission)
        })
            .then(res => {
                if (!res.ok) {
                    throw Error("Error occured");
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }


    //changing the step
    switch (step) {
        case 1:
            return (

                <CreateExam
                    examName={examName}
                    subject={subject}
                    duration={duration}
                    totalMarks={totalMarks}
                    password={password}
                    date={date}
                    time={time}
                    testInputFields={testInputFields}
                    setTestInputFields={setTestInputFields}
                    setExamName={setExamName}
                    setSubject={setSubject}
                    setDuration={setDuration}
                    setTotalMarks={setTotalMarks}
                    setPassword={setPassword}
                    setDate={setDate}
                    setTime={setTime}
                    next={next}
                />
            );
        case 2:
            return (
                <ChooseStudent
                    prev={prev}
                    submit={submit}
                    select={select}
                    setSelection={setSelection}
                />
            )
        default:

    }

}

export default Conductexam;