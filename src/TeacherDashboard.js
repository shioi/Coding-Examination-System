import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CreateExam from './createExam';
import { useAuthContext } from './useAuthContext';
import { useLogout } from './useLogout';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import useFetch from './useFetch';
import { ListItem } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const drawerWidth = 240;


const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const mdTheme = createTheme();

const commonStyles = {
    bgcolor: 'background.paper',
    borderColor: 'text.primary',
    m: 1,
    border: 3,
};





function DashboardContent() {
    const [open, setOpen] = React.useState(true);
    const [category, setCategory] = React.useState("ongoing");
    const { logout } = useLogout();
    const { user } = useAuthContext()
    const { data, isLoading, error } = useFetch('http://localhost:4000/getteacherexams', user);
    const [info, setInfo] = React.useState(null)
    const [errorInfo, setErrorInfo] = React.useState()

    console.log(data)
    const handleClick = () => {
        logout()
    }

    const toggleDrawer = () => {
        setOpen(!open);
    };


    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        return `${formattedDate} ${formattedTime}`;
    };

    const conductExamNow = (eid) => {
        const url = `http://localhost:4000/conductexamnow/${eid}`
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .catch(err => {
                setErrorInfo(true);

            })

    }



    const seeDetails = (eid) => {
        const url = `http://localhost:4000/getdetail/${eid}`
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw Error("Could not load data");
                }
                return res.json();
            })
            .then(data => {
                setInfo(data);
                setErrorInfo(false);
                if (data) {
                    setOpenDialog(true);
                }

            })
            .catch(err => {
                setErrorInfo(true);

            })



    }

    const columns = [
        { field: 'registerno', headerName: 'ID', width: 100 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'marks', headerName: 'Marks', width: 130 },];

    return (
        <ThemeProvider theme={mdTheme}>
            <Box className="dashboard" sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '60px', // keep right padding when drawer closed
                        }}
                    >

                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            UPCOMING EXAMS
                        </Typography>
                        <IconButton color="inherit">
                            <Badge color="secondary">
                                <LogoutIcon onClick={handleClick} />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />


                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <ul class="display-list">
                        <li>
                            <Link to='/createExam'>Conduct Exam</Link>
                        </li>
                        <li><Link to="#" onClick={() => setCategory("ongoing")}>Ongoing</Link></li>
                        <li><Link to="#" onClick={() => setCategory("upcoming")}>Upcoming</Link></li>
                        <li><Link to="#" onClick={() => setCategory("Done")}>Done</Link></li>
                    </ul>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={1}>

                            {data && data.filter((exam) => { return exam.examstatus === category }).map((question, index) => {
                                return (
                                    <Grid item xs={12} md={8} lg={9}>

                                        <Box key={question.id}
                                            sx={{
                                                backgroundColor: 'white',
                                                boxShadow: 1,
                                                m: 1,
                                                p: 3,
                                                '&:hover': {
                                                    boxShadow: 10,
                                                },
                                            }}
                                        >
                                            <ul >
                                                <li>
                                                    <h2>{question.name}</h2>
                                                    <p>Duration: {question.duration}</p>
                                                    <p>Total Marks: {question.totalMarks}</p>
                                                    <p>Status: {question.examstatus}</p>
                                                    <p>Date: {formatDateTime(question.Date)}</p>
                                                    {category === "ongoing" &&
                                                        <Link to={`/monitor/${question.id}`}>
                                                            <button>Check</button>
                                                        </Link>
                                                    }
                                                    {category === "Done" &&
                                                        <button onClick={() => seeDetails(question.id)}>Check</button>
                                                    }
                                                    {category === "upcoming" &&
                                                        <button onClick={() => conductExamNow(question.id)}>Start Now</button>
                                                    }
                                                </li>
                                            </ul>
                                        </Box>
                                    </Grid>
                                )
                            })}
                            {/* Recent Deposits */}
                        </Grid>
                    </Container>
                </Box>
            </Box>
            {info &&
                < Dialog
                    fullScreen
                    open={openDialog}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Marks
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={info}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                            getRowId={(row) => row.registerno}
                            slots={{ toolbar: GridToolbar }}
                            slotProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                    quickFilterProps: { debounceMs: 500 },
                                },
                            }}

                        />
                    </div>
                </Dialog >
            }
        </ThemeProvider >
    );
}

export default function TeacherDashboard() {
    return <DashboardContent />;
}
