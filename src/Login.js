import React, { useState } from "react";
import LoginForm from "./LoginForm";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { useAuthContext } from './useAuthContext';
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

import backgroundImage from './img/login.jpg'; // import your background image here

const Login = (props) => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const { dispatch } = useAuthContext();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  const logging = (details) => {
    axios.post("http://localhost:4000/api/post/login", {
      registerNo: details.registerNo,
      password: details.password
    }).then((response) => {
      if (response.data.error) {
        setMessage(response.data.message);
        setOpen(true);
      } else {
        //save the user to local storage
        dispatch({ type: 'LOGIN', payload: response })
        localStorage.setItem('user', JSON.stringify(response.data))
        //update the auth context
        //console.log("dispatced")
        window.location.reload(false);
      }
    })
      .catch((err) => {
        setMessage("Wrong password");
        setOpen(true);

      })
  }

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`, // set background image
      backgroundSize: 'cover', // make sure the image covers the entire background
      backgroundPosition: 'center', // center the image
      minHeight: '100vh', // set minimum height to 100vh to make sure the content is visible
      display: 'flex', // use flexbox for layout
      justifyContent: 'center', // center the content horizontally
      alignItems: 'center' // center the content vertically
    }}>
      <div style={{
        maxWidth: '400px', // set maximum width for the login form
        padding: '32px', // add padding for spacing
        backgroundColor: '#fff', // set background color for the login form
        borderRadius: '4px', // add border radius for rounded corners
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' // add box shadow for a subtle effect
      }}>

        <LoginForm Login={logging} />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>{message}</Alert>
        </Snackbar>
      </div>
    </div>
  )
}

export default Login;

