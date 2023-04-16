import Navigation from "./nav";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useAuthContext } from "./useAuthContext";
import Question from "./question";
import EditorView from "./editorView";
import Output from "./Output";
import { useState } from "react";
import Exam from "./Exam";
import Login from "./Login";
import Register from "./Register";
import Signup from "./Signup";
import CreateExam from "./createExam";
import Box from '@mui/material/Box';
import "react-toastify/dist/ReactToastify.css";
import Conductexam from "./conductexam";
import ExamTimer from "./ExamTimer";
import PastExams from "./pastexam";
import OngoingExam from "./ongoing";
import TeacherDashboard from "./TeacherDashboard";
import MonitorExam from "./MonitorExam";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";



function App() {
  const { user } = useAuthContext()
  const sendOutput = (data) => {
    //console.log(data)
    setOutput(data);
  }

  const setQueId = (data) => {
    console.log(data)
    setQId(data);
  }

  const setUser = (data) => {
    setRole(data);
  }

  const setExam = (data) => {
    console.log(data)
    setExamId(data);
  }

  const commonStyles = {
    bgcolor: 'background.paper',
    borderColor: 'text.primary',
    m: 1,
    border: 1,
  };


  const [output, setOutput] = useState(null);
  const [qId, setQId] = useState(null);
  const [examid, setExamId] = useState(null);
  const [role, setRole] = useState(null);
  return (
    <Router>
      <div className="App">
        {user && <Navigation />}
        <div className='content'>
          <Switch>
            <Route exact path="/question/:qid">
              <SplitterLayout>
                <Box className="my-pane">
                  <div className="pane-content">
                    {!user && <Redirect to="/login" />}
                    <ExamTimer
                      id={examid}
                    />
                    <Question setQueId={setQueId} setOutput={sendOutput} />
                    <Output out={output} />
                  </div>
                </Box>
                <Box className="my-pane">
                  <div className="pane-content"  >
                    <EditorView setOutput={sendOutput} qId={qId} />
                  </div>
                </Box>

              </SplitterLayout>
            </Route>
            <Route exact path="/createExam">
              {user && user.isProf === 1 ? <Conductexam /> : <Redirect to='/login' />}
            </Route>
            <Route exact path="/login">
              {user ? <Redirect to='/' /> : <Login />}
            </Route>
            <Route exact path="/register" >
              <Register setRole={setUser} />
            </Route>
            <Route exact path="/signup">
              <Signup role={role} />
            </Route>
            <Route exact path="/">
              {(user && user.isProf === 1 && <TeacherDashboard />) || (user ? <Exam setExamId={setExam} /> : <Redirect to='/login' />)}
            </Route>
            <Route exact path='/ongoingexam'>
              <OngoingExam setExamId={setExam} />
            </Route>
            <Route exact path='/pastexam'>
              <PastExams setExamId={setExam} />
            </Route>
            <Route exact path="/monitor/:eid">
              <MonitorExam />
            </Route>
          </Switch>
        </div>

      </div>
    </Router >
  );
}

export default App;
