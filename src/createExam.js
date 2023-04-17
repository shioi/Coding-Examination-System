import { useState, useEffect } from "react";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useAuthContext } from './useAuthContext';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { shadows } from '@mui/system';
import { Divider } from "@mui/material";
import { Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Button from '@mui/material/Button';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

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

    const BootstrapButton = styled(Button)({
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 16,
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        backgroundColor: '#0063cc',
        borderColor: '#0063cc',
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            backgroundColor: '#0069d9',
            borderColor: '#0062cc',
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        },
    });

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: purple[500],
        '&:hover': {
            backgroundColor: purple[700],
        },
    }));


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
            <Box
                sx={{
                    width: "100%",
                    height: "15vh",
                    backgroundColor: '#3498db',
                    boxShadow: 1,
                }}
            >
                <InsertDriveFileIcon />
                <Typography variant="h5" color="white">Conduct Exam</Typography>

                <ColorButton onClick={next}>Next</ColorButton>
            </Box>
            <Box component="form"
                sx={{
                    m: 5
                }}
            >
                <Grid
                    container
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={8}
                >
                    <Box
                        sx={{
                            width: "60%",
                            height: "500",
                            backgroundColor: 'white',
                            boxShadow: 1,
                            m: 5,
                            borderRadius: 2,
                            p: 3,
                            '&:hover': {
                                boxShadow: 10,
                                borderLeft: 1,
                                borderColor: 'secondary.main',
                                borderWidth: "5px"
                            },
                        }}
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
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            width: "60%",
                            height: "500",
                            backgroundColor: 'white',
                            boxShadow: 1,
                            m: 5,
                            borderRadius: 2,
                            p: 3,
                            '&:hover': {
                                boxShadow: 10,
                                borderLeft: 1,
                                borderColor: 'secondary.main',
                                borderWidth: "5px"
                            },
                        }}
                    >
                        <Grid item container xs={10} justifyContent="center">
                            <Grid item xs={4}>
                                <TextField name="Date" InputLabelProps={{ shrink: true, required: true }} type="date" label="Date" value={date} onChange={event => setDate(event.target.value)} />
                            </Grid>

                            <Grid item xs={4}>
                                <TextField name="Time" InputLabelProps={{ shrink: true, required: true }} type="time" label="Time" value={time} onChange={event => setTime(event.target.value)} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField name="duration" label="Duration" value={duration} onChange={event => setDuration(event.target.value)} />
                            </Grid>
                        </Grid>
                    </Box>


                    {testInputFields.map((input, index) => {
                        return (
                            <Box
                                sx={{
                                    width: "60%",
                                    height: "500",
                                    backgroundColor: 'white',
                                    boxShadow: 1,
                                    m: 5,
                                    borderRadius: 2,
                                    p: 3,
                                    '&:hover': {
                                        boxShadow: 10,
                                        borderLeft: 1,
                                        borderColor: 'secondary.main',
                                        borderWidth: "5px"
                                    },
                                }}
                            >
                                <Grid container item spacing={1} justifyContent="center" direction="column" xs={8}

                                    key={index}
                                >
                                    <Grid item>
                                        <Typography variant="p">Question No: {index + 1}</Typography>

                                    </Grid>
                                    <Grid item>

                                        <TextareaAutosize
                                            maxRows={900}
                                            style={{
                                                width: 800,
                                                height: 100
                                            }}
                                            name="Question"
                                            placeholder="Question"
                                            value={input.Question}
                                            onChange={event => handleFormChange(index, event)}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Box
                                            sx={{
                                                m: 1,
                                            }}
                                        >
                                            <TextField
                                                name="Marks"
                                                placeholder="Marks"
                                                value={input.Marks}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                        </Box>
                                    </Grid>
                                    <Divider />

                                    {input["Functions"].map((func, index2) => {
                                        return (
                                            <Grid item container>
                                                <Box key={index2}
                                                    spacing={2}
                                                    sx={{
                                                        p: 2,
                                                        m: 3,
                                                    }}
                                                >
                                                    <Grid item xs={10} container spacing={2}>
                                                        <Grid item>

                                                            <TextField
                                                                name="functionName"
                                                                placeholder="Function Name"
                                                                value={func.functionName}
                                                                onChange={event => handleFuncFormChange(index, index2, event)}
                                                            />
                                                        </Grid>
                                                        <Grid item>

                                                            <select name="Type" onChange={(event) => handleFuncFormChange(index, index2, event)}>
                                                                <option value="value">value</option>
                                                                <option value="output">output</option>
                                                            </select>
                                                        </Grid>
                                                    </Grid>

                                                    {func["TestCases"].map((cases, index3) => {
                                                        return (


                                                            <Grid key={index3} container item spacing={3}
                                                            >
                                                                <Grid item >

                                                                    <TextField
                                                                        name="Input"
                                                                        placeholder="Test Input"
                                                                        value={cases.Input}
                                                                        onChange={event => handleTestFormChange(index, index2, index3, event)}
                                                                    />
                                                                </Grid>
                                                                <Grid item>

                                                                    <TextField
                                                                        name="Output"
                                                                        placeholder="Test Output"
                                                                        value={cases.Output}
                                                                        onChange={event => handleTestFormChange(index, index2, index3, event)}
                                                                    />
                                                                </Grid>
                                                                <Grid item >
                                                                    <ColorButton
                                                                        onClick={() => { deleteField(index, index2) }} type="ColorButton">Delete Test</ColorButton>
                                                                </Grid>
                                                            </Grid>
                                                        )
                                                    })}
                                                    <Grid item container direction="column" spacing={2} xs={6}>
                                                        <Grid item>
                                                            <ColorButton onClick={() => { addFields(index, index2) }} type="ColorButton">Add Test Cases</ColorButton>
                                                        </Grid>
                                                        <Grid item>
                                                            <ColorButton onClick={() => { deleteFunction(index, index2) }} type="ColorButton">Delete Function</ColorButton>
                                                        </Grid>
                                                    </Grid>
                                                </Box>

                                            </Grid>
                                        )
                                    })}
                                    <Grid item >

                                        <ColorButton onClick={() => { addFunction(index) }} type="ColorButton">Add Function</ColorButton>
                                    </Grid>
                                    <Grid item>
                                        < ColorButton onClick={() => { deleteQuestion(index) }} type="ColorButton">Delete Question</ColorButton>
                                    </Grid>


                                </Grid>
                            </Box>


                        )

                    })}
                    <Grid item container xs={10} direction="row" spacing={10}>
                        <Grid
                            item justifyContent="flex-end"

                            alignItems="flex-end">

                            <ColorButton onClick={addQuestion} type="ColorButton">Add Question</ColorButton>
                        </Grid>

                        <Grid item>


                        </Grid>
                    </Grid>
                </Grid >
            </Box >

        </div >
    );
}

//TODO: Make field for choosing stundets

export default CreateExam;