import React, { Component,useState, useRef, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import otakuwu1 from'./otakuwu1.png'; 
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Form, Button, FormGroup, FormControl, ControlLabel, Row } from "react-bootstrap";
import Col from 'react-bootstrap/Col';

   export default function Homepage() {
  
   document.body.style.backgroundColor = "black"
  let [Shows,setShows] = useState([])
  const [search,setSearch] = useState("");
 
    useEffect(() => {
    axios.get("http://localhost:3001/shows").then(response=>{
      console.log(response.data)
    setShows(response.data);
     console.log(Shows)
        })
        .catch((error) => {
         console.log(error);
      })
  }, []);
   const handleChange = (e) =>{
     e.preventDefault();
     setSearch(e.target.value);
   } 
 
   if(search.length > 0)
   {
      Shows = Shows.filter((i)=>{
        return i.title.toUpperCase().match(search.toUpperCase())
      })
   }
    return (
     <div >
        <div style= {{paddingBottom:"2%"}}>

        </div>
          <Row className="justify-content-md-center"> {/* Title Image */}
              <Col xs={12} sm={4} md={4}>
              <img src={otakuwu1} alt="Title" />
             </Col>
          </Row>`

            
           <div class= "row justify-content-md-center">         {/* Search Bar and Button */}

           <Col xs={7}>

          <Form onChange = {handleChange} value = {search}>
          <Form.Control size="lg" type="text" placeholder="Search" id = "searchBar"  onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
          style={{backgroundColor: "black", color:"#FF69B4",borderColor:"#FF69B4"}}/>

          </Form>

          </Col>


          </div>
    
          <div >
           {Shows.map(item=>{

              return <div class="jumbotron mt-3 container h-100 d-flex"style={{backgroundColor: "#FF69B4" ,width:"70%"}}>
              
               <Row>

              <Col><img src={item.icon} alt="Title" /></Col>
              <Col md="auto">
              <h2>{item.title}</h2>
              <h4>Available On ...</h4>
              <h4 style = {{color:"black"}}> {item.links.map(i=> 
              <a href={i}>
              <span>Platform</span>
            </a>
              
              )} </h4>
              </Col>
             
               </Row> 
             </div>

            })}


          </div>
    </div>
    );
  }
