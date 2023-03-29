import Navigation from "./nav";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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


function App() {
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

  const commonStyles = {
    bgcolor: 'background.paper',
    borderColor: 'text.primary',
    m: 1,
    border: 1,
  };


  const [output, setOutput] = useState(null);
  const [qId, setQId] = useState(null);
  const [role, setRole] = useState(null);
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className='content'>
          <Switch>
            <Route exact path="/question/:qid">
              <Box className="main" >
                <Box className="main-side" sx={{ display: 'flex', ...commonStyles, width: 800 }}>
                  <Question setQueId={setQueId} setOutput={sendOutput} />
                  <Output out={output} />
                </Box>
                <Box className="editor" sx={{ display: 'flex', ...commonStyles, width: 800 }}>
                  <EditorView setOutput={sendOutput} qId={qId} />
                </Box>
              </Box>
            </Route>
            <Route exact path="/createExam">
              <CreateExam />
            </Route>
            <Route exact path="/exam">
              <Exam />
            </Route>
            <Route exact path="/register" >
              <Register setRole={setUser} />
            </Route>
            <Route exact path="/signup">
              <Signup role={role} />
            </Route>
            <Route exact path="/">
              <Login />
            </Route>

          </Switch>
        </div>

      </div>
    </Router >
  );
}

export default App;
