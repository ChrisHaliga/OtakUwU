
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";
import Homepage from "./components/homepage.component";
import Col from 'react-bootstrap/Col';
import './App.css';
function App() {
  return (
    <div  class= "mt-5 col-md-12 ">
      
      <Homepage  />
  
    </div>
  );
}

export default App;
