import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import useFetch from './useFetch';
import { useAuthContext } from './useAuthContext';
import { Button, Box, MenuItem, Menu, Typography } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled, alpha } from '@mui/material/styles';

const Question = (props) => {
    const { qid } = useParams();
    const { user } = useAuthContext()
    const { data, isLoading, error } = useFetch(`http://localhost:4000/question/${qid}`, user);
    const [question, setQuestion] = useState(null);
    const [numOfQuestion, setNumOfQuestion] = useState(null);
    const [qusNo, setQusNo] = useState(null);
    useEffect(() => {
        if (data) {
            setNumOfQuestion(Object.keys(data).length);
            setQuestion(data[0]);
            setQusNo(1);
            props.setQueId(data[0].id);
            props.setOutput(null);
        }
    }, [data])

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

    return (
        <Box className="question"
            sx={{
                width: "100%",
                height: "570px",
                backgroundColor: 'black',
            }}
        >
            <div className="dropdown">
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
                    Choose Question
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
                    {data && numOfQuestion &&
                        [...Array(numOfQuestion).keys()].map(el => <MenuItem key={el} onClick={() => {
                            setQuestion(data[el]);
                            setQusNo(el + 1);
                            props.setQueId(data[el].id);
                            props.setOutput(null)
                        }}> {el + 1} </MenuItem>)
                    }

                </StyledMenu>
            </div>
            <Typography variant="h5" color="white">
                Question: {question && qusNo}
            </Typography>
            <Typography variant="p" color="white">
                {question && question.Question}
            </Typography>
        </Box >
    );
}

export default Question;