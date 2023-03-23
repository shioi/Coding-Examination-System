import React, { useState } from 'react'
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

const LoginForm = ({ Login }) => {
  const [details, setDetails] = useState({ username: "", password: "" });
  const submitHandler = e => {
    e.preventDefault();
    Login(details);
  }
  return (
    <article className="wrapper bg-dark d-flex align-items justify-content-center w-100">
      {/* <img className="bgimg" src={require('./img/bg1.jpg')} /> */}
      <section className="login rounded">
        {/* <img className="icon1" src={require('./img/icon1.png')} /> */}
        <form onSubmit={submitHandler}>
          <div className='form-group mb-2'>
            <input type="text" className="from-control w-100" name="username" id="username" placeholder="Username" autoComplete="off" onChange={e => setDetails({ ...details, username: e.target.value })} value={details.username} /><br />
          </div>
          <div className='form-group mb-2'>
            <input type="password" className="from-control w-100" name="password" id="password" placeholder="Password" autoComplete="off" onChange={e => setDetails({ ...details, password: e.target.value })} value={details.password} /><br />
          </div>
          <div className='form-group mb-2'>
            <button type='submit' className='btn btn-success w-100 mt-2'>SIGN IN</button>
          </div>
          <div className='form-group  from-check mb-2'>
            <input type="checkbox" className='form-check-input'></input>
            <label className='form-check-label'>Remember Me</label>
          </div>
        </form>
        <div>
          <Link to="/register">
            <centre><p className="reg">Sign Up</p></centre>
          </Link>
        </div>
      </section>
    </article>
  )
}
export default LoginForm;
