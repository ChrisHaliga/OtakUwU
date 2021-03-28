import React, { Component,useState, useRef, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import otakuwu1 from'./otakuwu1.png'; 
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Form, Button, FormGroup, FormControl, ControlLabel, Row } from "react-bootstrap";
import Col from 'react-bootstrap/Col';

import Show from './show.component';


   export default function Homepage() {
  
    document.body.style.backgroundColor = "black"
    const [all_platforms, setAllPlatforms]= useState([]);
    let [Shows,setShows] = useState([])
    const [search,setSearch] = useState("");
 
    useEffect(() => {
      
      axios.get("http://localhost:3001/platforms").then(response=>{ 
      setAllPlatforms(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    }, []);

    useEffect(()=>{
      console.log(all_platforms);
      if(all_platforms){
        axios.get("http://localhost:3001/shows").then(response=>{
          console.log(response.data)
          setShows(response.data.map(show=> (
            <Show show={show} all_platforms={all_platforms}/>
          )));
        })
        .catch((error) => {
          console.log(error);
        })
      }
    }, [all_platforms])


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
          style={{backgroundColor: "black", color:"#FF69B4",borderColor:"#FF69B4", marginBottom:"50px"}}/>

          </Form>

          </Col>


          </div>
          {Shows}

    </div>
    );
  }
