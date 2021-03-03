
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";
import homepage from "./components/homepage.component";
import './App.css';
function App() {
  return (
    <Router>
     <div className="container" >
     
     <Route path="/shows" exact component={homepage} ></Route>

     </div>
    </Router>
  );
}

export default App;

