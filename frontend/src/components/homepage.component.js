import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import otakuwu1 from'./otakuwu1.png'; 
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, FormGroup, FormControl, ControlLabel, Row } from "react-bootstrap";

export default class homepage extends Component {
    componentDidMount() {
        document.body.style.backgroundColor = "black"
    }
    render() {
        return (
        <div>
          
           <div class= "mt-5 col-md-12">                       {/* Title Image */}
           <img src={otakuwu1} alt="Title" />
           </div>


           <div class= "row justify-content-md-center">         {/* Search Bar and Button */}

            <div class="col"> 
      
           <Form>
           <Form.Control size="lg" type="text" placeholder="Search" id = "searchBar" 
           style={{backgroundColor: "black", color:"#FF69B4",borderColor:"#FF69B4"}}/>
           </Form>

           </div>

           <Button as="input" type="button" value="Search" style={{backgroundColor: "black", color:"#FF69B4",borderColor:"#FF69B4"}}
           />{' '}
         </div>

           <div class="jumbotron mt-5" style={{backgroundColor: "black"}}>      {/* Display Results */}


           <h1> Shows</h1>
        
       
           </div>

        </div>
        );

        }    

}
