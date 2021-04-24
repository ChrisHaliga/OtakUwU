
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";
import Homepage from "./components/homepage.component";
import './App.css';
function App() {
  return (
    <div  class= "container ">
      
      <Homepage  />
  
    </div>
  );
}

export default App;

