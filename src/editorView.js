import Editor from "@monaco-editor/react";
import { TrendingUpOutlined } from "@mui/icons-material";
import { Button, Box, MenuItem, Menu } from "@mui/material";
import { createTheme } from "@mui/system";
import { useState, useEffect, useRef } from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled, alpha } from '@mui/material/styles';


import { useAuthContext } from './useAuthContext';

const theme = {
    blue: {
        default: "#3f51b5",
        hover: "#283593"
    },
    pink: {
        default: "#e91e63",
        hover: "#ad1457"
    }
};



const EditorView = (props) => {
    const [language, setLanguage] = useState('python');
    const { user } = useAuthContext()
    const [code, setCode] = useState(null);
    const [question, setQuestion] = useState(null);

    const handleEditorChange = (value) => {
        setCode(value);
    }
    useEffect(() => {
        setQuestion(props.qId);

        //TODO: send the code to the server for the question and save it
        //TODO: fetch the code for the selected question and set it in setCode()
        setCode(null);
    }, [props.qId])

    const changeLang = (val) => {
        setLanguage(val);
        handleClose()
    }

    const StyledMenu = styled((props) => (
        <Menu
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            {...props}
        />
    ))(({ theme }) => ({
        '& .MuiPaper-root': {
            borderRadius: 6,
            marginTop: theme.spacing(1),
            minWidth: 180,
            color:
                theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
            boxShadow:
                'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
                padding: '4px 0',
            },
            '& .MuiMenuItem-root': {
                '& .MuiSvgIcon-root': {
                    fontSize: 18,
                    color: theme.palette.text.secondary,
                    marginRight: theme.spacing(1.5),
                },
                '&:active': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    }));


    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };




    const submitCode = (code, language) => {
        const url = "http://localhost:4000/postcode";
        const finalcode = {
            lang: language,
            content: code,
            questionId: question,
        };
        fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${user.token}` },
            body: JSON.stringify(finalcode)
        })
            .then(res => {
                if (!res.ok) {
                    throw Error("Error occured")
                }
                return res.json();
            })
            .then(data => {
                //console.log(data);
                props.setOutput(data);
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    return (
        <Box>
            <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
            >
                {language}
            </Button>

            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => { changeLang('python') }} disableRipple>
                    Python
                </MenuItem>
                <MenuItem onClick={() => changeLang('c')} disableRipple>
                    C
                </MenuItem>
            </StyledMenu>
            <div className="editor">
                <Editor
                    height="400px"
                    width="100%"
                    language={language}
                    onChange={handleEditorChange}
                    automaticLayout={true}
                    value={code}
                    theme="vs-dark"
                />
            </div>
            <Button
                variant="contained"
                color="success"
                size="small"
                endIcon={<ArrowUpwardIcon />}
                onClick={() => { submitCode(code, language) }}>Submit Code</Button>
        </Box >

    );
}

export default EditorView;