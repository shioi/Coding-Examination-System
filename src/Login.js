import { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from "./LoginForm";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { useAuthContext } from './useAuthContext';
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

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
    <div>
      <LoginForm Login={logging} />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>{message}</Alert>
      </Snackbar>
    </div>
  )
}

export default Login
