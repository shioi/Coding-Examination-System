import { useState } from "react";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useAuthContext } from './useAuthContext';

const CreateExam = () => {
    const [testInputFields, setTestInputFields] = useState([
        {
            Question: '',
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
    const { user } = useAuthContext()

    const handleFormChange = (index, event) => {
        let data = [...testInputFields];
        data[index][event.target.name] = event.target.value;
        setTestInputFields(data);
    }

    const handleFuncFormChange = (index, index2, event) => {
        let data = [...testInputFields];
        console.log(data[index].Functions[index2][event.target.name])
        data[index].Functions[index2][event.target.name] = event.target.value;
        setTestInputFields(data);
    }

    const handleTestFormChange = (index, index2, index3, event) => {
        let data = [...testInputFields];
        data[index].Functions[index2].TestCases[index3][event.target.name] = event.target.value;
        setTestInputFields(data);
    }

    const addFields = (index, index2) => {
        let newfield = { Input: '', Output: '' }
        let data = [...testInputFields]
        data[index].Functions[index2].TestCases = [...data[index].Functions[index2].TestCases, newfield];
        setTestInputFields(data);
    }

    const deleteField = (index, index2) => {
        let data = [...testInputFields];
        data[index].Functions[index2].TestCases.splice(index2, 1);
        setTestInputFields(data);
    }

    const addQuestion = () => {
        let newfield = {
            Question: '',
            Functions: [{
                functionName: '',
                Type: 'value',
                TestCases: [{
                    Input: '',
                    Output: ''
                }]
            }]
        }
        const newdata = [...testInputFields, newfield];
        setTestInputFields(newdata);
    }

    const addFunction = (index) => {
        let newField = { functionName: '', Type: 'value', TestCases: [{ Input: '', Output: '' }] }
        let data = [...testInputFields];
        data[index].Functions = [...data[index].Functions, newField];
        setTestInputFields(data);
    }

    const deleteQuestion = (index) => {
        let data = [...testInputFields];
        data.splice(index, 1);
        setTestInputFields(data);
    }

    const deleteFunction = (index, index2) => {
        let data = [...testInputFields];
        data[index].Functions.splice(index2, 1)
        setTestInputFields(data);
    }

    const submit = (e) => {
        e.preventDefault();
        console.log(testInputFields);
        const id = examName + "-" + date;
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
        }
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

    return (
        <div className="questionForm">
            <h1>Conduct Exam</h1>
            <Box component="form" onSubmit={submit}>
                <TextField label="name" name="name" value={examName} onChange={event => setExamName(event.target.value)} />
                <TextField name="Subject" type="text" label="Subject" value={subject} onChange={event => setSubject(event.target.value)} />
                <TextField name="totalMarks" label="Total Marks" value={totalMarks} onChange={event => setTotalMarks(event.target.value)} />
                <TextField name="password" label="Exam Password" value={password} onChange={event => setPassword(event.target.value)} />
                <TextField name="Date" InputLabelProps={{ shrink: true, required: true }} type="date" label="Date" value={date} onChange={event => setDate(event.target.value)} />
                <TextField name="Time" InputLabelProps={{ shrink: true, required: true }} type="time" label="Time" value={time} onChange={event => setTime(event.target.value)} />
                <TextField name="duration" label="Duration" value={duration} onChange={event => setDuration(event.target.value)} />
                {testInputFields.map((input, index) => {
                    return (
                        <div key={index}>
                            <h3>Question No: {index + 1}</h3>
                            <TextareaAutosize
                                maxRows={900}
                                style={{ width: 500 }}
                                name="Question"
                                placeholder="Question"
                                value={input.Question}
                                onChange={event => handleFormChange(index, event)}
                            />
                            {input["Functions"].map((func, index2) => {
                                return (
                                    <div key={index2}>
                                        <TextField
                                            name="functionName"
                                            placeholder="Function Name"
                                            value={func.functionName}
                                            onChange={event => handleFuncFormChange(index, index2, event)}
                                        />
                                        <select name="Type" onChange={(event) => handleFuncFormChange(index, index2, event)}>
                                            <option value="value">value</option>
                                            <option value="output">output</option>
                                        </select>
                                        {func["TestCases"].map((cases, index3) => {
                                            return (
                                                <div key={index3}>
                                                    <TextField
                                                        name="Input"
                                                        placeholder="Test Input"
                                                        value={cases.Input}
                                                        onChange={event => handleTestFormChange(index, index2, index3, event)}
                                                    />

                                                    <TextField
                                                        name="Output"
                                                        placeholder="Test Output"
                                                        value={cases.Output}
                                                        onChange={event => handleTestFormChange(index, index2, index3, event)}
                                                    />
                                                    <button onClick={() => { deleteField(index, index2) }} type="button">Delete Test</button>
                                                </div>

                                            )
                                        })}

                                        <button onClick={() => { addFields(index, index2) }} type="button">Add Test Cases</button>
                                        <button onClick={() => { deleteFunction(index, index2) }} type="button">Delete Function</button>
                                    </div>
                                )
                            })}
                            <button onClick={() => { addFunction(index) }} type="button">Add Function</button>
                            < button onClick={() => { deleteQuestion(index) }} type="button">Delete Question</button>


                        </div>

                    )

                })}
                <button onClick={addQuestion} type="button">Add Question</button>

                <button onClick={submit}>Submit</button>
            </Box>
        </div >
    );
}

//TODO: Make field for choosing stundets

export default CreateExam;