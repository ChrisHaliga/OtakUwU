import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router,   Switch,  Route} from "react-router-dom";
import Homepage from "./components/homepage.component";
import ProfileComponent from "./components/profile.component";
import './App.css';

function App() {

  return (
        <Router>
          <Switch>
            <Route path ="/profile">
              <ProfileComponent/>
            </Route>
            <Route path ="/">
              <Homepage/>
            </Route>
          </Switch>
      </Router>
  );
}



export default App;

