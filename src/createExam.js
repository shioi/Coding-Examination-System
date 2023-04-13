import { useState, useEffect } from "react";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useAuthContext } from './useAuthContext';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { shadows } from '@mui/system';
import { Divider } from "@mui/material";



const CreateExam = (props) => {

    const { user } = useAuthContext()
    const {
        examName,
        subject,
        duration,
        totalMarks,
        password,
        date,
        time,
        testInputFields,
        setTestInputFields,
        setExamName,
        setSubject,
        setDuration,
        setTotalMarks,
        setPassword,
        setDate,
        setTime,
        next,
    } = props


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



    return (
        <div className="questionForm">
            <div>
            </div>
            <h1>Conduct Exam</h1>
            <Box component="form">
                <Grid
                    container
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={8}
                >
                    <Grid item container spacing={2} direction="column" alignItems="center"
                    >
                        <Grid item xs={4}>
                            <TextField label="name" name="name" value={examName} onChange={event => setExamName(event.target.value)} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField name="Subject" type="text" label="Subject" value={subject} onChange={event => setSubject(event.target.value)} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField name="totalMarks" label="Total Marks" value={totalMarks} onChange={event => setTotalMarks(event.target.value)} />
                        </Grid>

                        <Grid item xs={3}>
                            <TextField name="password" label="Exam Password" value={password} onChange={event => setPassword(event.target.value)} />
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid item container xs={8} justifyContent="center">
                        <Grid item xs={3}>
                            <TextField name="Date" InputLabelProps={{ shrink: true, required: true }} type="date" label="Date" value={date} onChange={event => setDate(event.target.value)} />
                        </Grid>

                        <Grid item xs={3}>
                            <TextField name="Time" InputLabelProps={{ shrink: true, required: true }} type="time" label="Time" value={time} onChange={event => setTime(event.target.value)} />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField name="duration" label="Duration" value={duration} onChange={event => setDuration(event.target.value)} />
                        </Grid>
                    </Grid>

                    {testInputFields.map((input, index) => {
                        return (
                            <Grid container item spacing={2} justifyContent="center" direction="column" xs={10}

                                key={index}
                            >
                                <h3>Question No: {index + 1}</h3>
                                <TextareaAutosize
                                    maxRows={900}
                                    style={{ width: 500 }}
                                    name="Question"
                                    placeholder="Question"
                                    value={input.Question}
                                    onChange={event => handleFormChange(index, event)}
                                />
                                <TextField
                                    name="Marks"
                                    placeholder="Marks"
                                    value={input.Marks}
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


                            </Grid>

                        )

                    })}
                    <button onClick={addQuestion} type="button">Add Question</button>

                    <button onClick={next}>Next</button>
                </Grid>
            </Box>

        </div >
    );
}

//TODO: Make field for choosing stundets

export default CreateExam;