import React, { useState } from 'react'
import { useLocation } from "react-router-dom"
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isProfessor, setIsProfessor] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");

  const location = useLocation()
  const role = location.state?.role
  console.log(role)

  const register = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/api/post/signup", {
      username: username,
      password: password,
      isProfessor: role,
    }).then((response) => {
      setRegisterStatus(response);
      console.log(response);
      if (response.data.message) {
        setRegisterStatus(response.data.message);
      } else {
        setRegisterStatus("ACCOUNT CREATED SUCCESSFULLY");
      }
    })
  }

  return (
    <div>
      <form>
        <h4>Register Here</h4>
        <label htmlFor="username">Username</label>
        <input className="textInput" type="email" name="username" onChange={(e) => { setUsername(e.target.value) }} placeholder="Enter your Username" required />
        <label htmlFor="password">Password</label>
        <input className="textInput" type="password" name="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Enter your Password" required />
        <input className="button" type="submit" onClick={register} value="Create an account" />
      </form>
    </div>
  )
}

export default Signup

