import { Link, useLocation } from 'react-router-dom';
import { useLogout } from './useLogout';
import { useAuthContext } from './useAuthContext';
import { AppBar, Toolbar, IconButton, Typography, Stack, Button, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';

const Navigation = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const { pathname } = useLocation(); // Get the current location
    const handleClick = () => {
        logout();
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClickDrawer = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAddAnother = () => {
        logout();
    };

    return (
        <AppBar position="static" style={{ background: " #1c1b1b " }}>
            {user.isProf === 0 &&
                <Toolbar>
                    <IconButton size="large" edge='start'>
                        <img src="/Images/Logo.jpg" alt="logo"></img>
                    </IconButton>
                    <Typography sx={{ flexGrow: 1 }}></Typography>
                    <Stack
                        direction='row'
                        spacing={2}
                        justifyContent="flex-end"
                        alignItems="baseline"
                    >
                        <Button color='inherit' component={Link} to='/' className={pathname === '/' ? 'active' : ''}>
                            Upcoming Exam
                        </Button>
                        <Button color='inherit' component={Link} to='/ongoingexam' className={pathname === '/ongoingexam' ? 'active' : ''}>
                            Ongoing Exam
                        </Button>
                        <Button color='inherit' component={Link} to='/pastexam' className={pathname === '/pastexam' ? 'active' : ''}>
                            Past Exam
                        </Button>
                        <Button color='inherit' onClick={handleClickDrawer}>
                            <AccountCircleIcon />
                        </Button>
                    </Stack>
                </Toolbar>
            }
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            mt: '-5px',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem component={Link} to='/profile'>
                    <ListItemIcon>
                        <Avatar />
                    </ListItemIcon>
                    <Typography variant="inherit">Profile</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleAddAnother}>
                    <ListItemIcon>
                        <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Add Another Account</Typography>
                </MenuItem>
                <MenuItem onClick={handleClick}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Logout</Typography>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Settings</Typography>
                </MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Navigation;
