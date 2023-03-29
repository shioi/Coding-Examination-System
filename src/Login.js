import { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from "./LoginForm";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

const Login = (props) => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);


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

      }
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
