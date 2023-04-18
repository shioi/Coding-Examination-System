import React, { useEffect, useState } from 'react'
import axios from "axios";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import { InputLabel, Select, MenuItem } from '@mui/material';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { useAuthContext } from './useAuthContext';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import backgroundImg from './img/login.jpg'


const Signup = (props) => {
  const [isProfessor, setIsProfessor] = useState("");
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [clas, setClas] = useState('');
  const { dispatch } = useAuthContext();
  useEffect(() => {
    setIsProfessor(props.role)

  }, [props])

  function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
  };

  const [errors, setErrors] = useState([{ 'firstname': '', 'lastname': '', 'email': '', 'RegisterNumber': '', Password: '' }])

  const handleChangeError = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'firstname':
        errors.firstname =
          value.length < 5
            ? 'Full Name must be at least 5 characters long!'
            : '';
        break;
      case 'email':
        errors.email =
          validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!';
        break;
      case 'lastname':
        errors.lastname =
          value.length < 8
            ? 'Password must be at least 8 characters long!'
            : '';
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  }


  const theme = createTheme({
    overrides: {
      MuiTextField: {
        root: {
          backgroundColor: '#fff', // Set white background for TextField
        },
      },
    },
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }



  const handleChange = (event) => {
    setClas(event.target.value);
  };



  //TODO: making Register.js and Signup.js in same page 
  const register = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data)
    console.log(isProfessor)
    axios.post("http://localhost:4000/api/post/signup", {
      firstname: data.get("firstName"),
      lastname: data.get("lastName"),
      registerNo: data.get("Register Number"),
      email: data.get("email"),
      password: data.get("password"),
      clas: clas,
      isProfessor: isProfessor,
    }).then((response) => {
      setIsError(false);
      setMessage("Account created successfully");
      setOpen(true);
      //save the user to local storage
      localStorage.setItem('user', JSON.stringify(response.data))
      //update the auth context
      dispatch({ type: 'LOGIN', payload: response })
      return <Redirect to='/' />
    })
      .catch((err) => {
        console.log("here")
        setIsError(true);
        setMessage("User already exists");
        setOpen(true);

      })
  }


  return (
    <div className="main">
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={register} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="RegisterNo"
                    label="Register Number"
                    name="Register Number"
                    autoComplete="Register Number"
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <InputLabel style={{ fontSize: "14px" }} id="demo-simple-select-label">Class</InputLabel>
                  <Select
                    style={{
                      width: "190px",
                      height: "35px"
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={clas}
                    label="Class"
                    name="Class"
                    onChange={handleChange}
                  >
                    <MenuItem value={"MCA-A"}>MCA-A</MenuItem>
                    <MenuItem value={"MCA-B"}>MCA-B</MenuItem>
                    <MenuItem value={"BCA-A"}>BCA-A</MenuItem>
                    <MenuItem value={"BCA-B"}>BCA-B</MenuItem>
                    <MenuItem value={"BCA-B"}>CMS</MenuItem>
                    <MenuItem value={"BCA-B"}>CME</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
      {isError &&
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>{message}</Alert>
        </Snackbar>
      }
      {!isError &&
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert severity="success" onClose={handleClose} sx={{ width: '100%' }}>{message}</Alert>
        </Snackbar>
      }

    </div>
  );
}
export default Signup

