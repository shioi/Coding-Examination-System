import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from "./LoginForm";
import axios from "axios";

const Login = (props) => {
  const [loginDetailsList, setLoginList] = useState([]);

  const loadData1 = async () => {
    const response = await axios.get('http://localhost:3001/api/get/login');
    setLoginList(response.data);
  }

  useEffect(() => {
    axios.get('http://localhost:3001/api/get/login').then((response) => {
      setLoginList(response.data);
    });
    loadData1();

  }, []);

  const [user, setUser] = useState({ username: "", password: "", isProfessor: -1 });
  const [initial, setInitial] = useState(user.username ? true : false);

  const notify1 = () => toast.success("Login Successful!");
  const notify2 = () => toast.error("Invalid Credentials");

  const Login = details => {
    console.log(details);
    if (!details.username || !details.password) {
      toast.error("Please provide the inputs required");
    }
    else {
      let admit = false;
      for (var i = 0; i < loginDetailsList.length; i++) {
        if (loginDetailsList[i].username == details.username && loginDetailsList[i].password == details.password) {
          console.log("Logged In");
          setUser({
            username: details.username,
            password: details.password,
            isProfessor: loginDetailsList[i].isProfessor,
          });
          admit = true;
          break;
        } else {
          console.log("Details do not match");
        }
      }
      console.log(admit);
      if (admit) {
        return notify1();
      }
      else {
        return notify2();
      }
    }
  }

  const location = useLocation();
  console.log(props, " props");
  console.log(location, " useLocation Hook");
  const loginInitial = location.state?.loginInitial;
  console.log(loginInitial);
  console.log(initial);
  if (initial == false && loginInitial == true) {
    const fromtoLogin = location.state?.fromtoLogin;
    setUser({
      username: fromtoLogin.loginUsername,
      password: fromtoLogin.loginPassword,
    });
    setInitial(true);
  }

  console.log("Verify:" + user.isProfessor)

  return (
    <div className="Login">
      {(user.username != "") ? (
        <div>
          {(user.isProfessor == 0) ? (<h2>Student Welcome</h2>) : (<h2>Professor Welcome</h2>)}
        </div>
      ) : (<LoginForm Login={Login} />)}
    </div>
  )
}

export default Login
