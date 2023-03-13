import Navigation from "./nav";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Question from "./question";
import EditorView from "./editorView";
import Output from "./Output";
import { useState } from "react";
import Exam from "./Exam";
import CreateExam from "./createExam";

function App() {
  const sendOutput = (data) => {
    //console.log(data)
    setOutput(data);
  }

  const setQueId = (data) => {
    console.log(data)
    setQId(data);
  }

  const [output, setOutput] = useState(null);
  const [qId, setQId] = useState(null);
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className='content'>
          <Switch>
            <Route exact path="/question/:qid">
              <div className="main">
                <div className="main-side">
                  <Question setQueId={setQueId} setOutput={sendOutput} />
                  <Output out={output} />
                </div>
                <EditorView setOutput={sendOutput} qId={qId} />
              </div>
            </Route>
            <Route exact path="/createExam">
              <CreateExam />
            </Route>
            <Route exact path="/">
              <Exam />
            </Route>
          </Switch>
        </div>

      </div>
    </Router>
  );
}

export default App;
