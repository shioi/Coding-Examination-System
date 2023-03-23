import React, { useState } from 'react'
import { Link } from "react-router-dom";
import Signup from './Signup';

const Register = () => {

  return (
    <article className="rolecard">
      <section className="d-flex align-items justify-content-around">
        <div className="roleCard">
          <Link to="/signup" state={{ role: 0 }}>
            <div className="studrole">
              <img className="roleimg" src={require('./img/student.png')} />
              <button>I'm a Student</button>
            </div>
          </Link>
        </div>
        <div className="roleCard">
          <Link to="/signup" state={{ role: 1 }}>
            <div className="techrole">
              <img className="roleimg" src={require('./img/teacher.png')} />
              <button>I'm a Teacher</button>
            </div>
          </Link>
        </div>

      </section>
    </article>
  )
}

export default Register
