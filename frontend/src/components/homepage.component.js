import React, { Component,useState, useRef, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import otakuwu1 from'./otakuwu1.png'; 
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Form, Col, Row } from "react-bootstrap";

import Show from './show.component';

import Pagination from './paginate';
import './homepage.css';

   export default function Homepage() {
  
    document.body.style.backgroundColor = "pink"
    const [all_platforms, setAllPlatforms]= useState([]);
    let [Shows,setShows] = useState([])
    const [search,setSearch] = useState("");

    let [currentPage, setCurrentPage] = useState(1);

    const [isMiddle,setMiddle] = useState("false");
    const [count,setCount] = useState(1);       //count of pages
 
    const [lists, setLists]= useState([""]);
    useEffect(() => {
      
      axios.get("http://localhost:3001/watchlists").then(response=>{ 
      setLists(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    }, []);




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
        
        axios.post("http://localhost:3001/shows",
        {
          search_str: search
        }).then(response=>{
          console.log(response.data)
          setCount(response.data.count);
          setShows(response.data.data.map(show=> (
            <Show show={show} all_platforms={all_platforms} isMiddle = {isMiddle} />
          )));
        })
        .catch((error) => {
          console.log(error);
        })
        console.log(Shows);
      }
    }, [all_platforms, search,isMiddle])


   const handleChange = (e) =>{
     e.preventDefault();
     setSearch(e.target.value);
     console.log(search)

   } 
 
    

      const paginate = pageNumber => 
      {
      setSearch("");
      setCurrentPage(pageNumber);
      axios.post("http://localhost:3001/shows?page="+pageNumber+"&limit=10",
          {
            search_str: search
          }).then(response=>{
            console.log(response.data)
            console.log(isMiddle)
            setShows(response.data.data.map(show=> (
              <Show show={show} all_platforms={all_platforms} isMiddle  />
            )));
          })
          .catch((error) => {
            console.log(error);
          })
          console.log(Shows);
      
      };
 
    return (
     <div class = "container">
        <div style= {{paddingBottom:"2%"}}>

        </div>
          <Row className="justify-content-md-center"> {/* Title Image */}
              <Col xs={12} sm={4} md={4}>
              <img src={otakuwu1} alt="Title" />
             </Col>
          </Row>

            
           <div class= "row justify-content-md-center">         {/* Search Bar and Button */}

           <Col xs={7}>

          <Form onChange = {handleChange} value = {search}>
          <Form.Control size="lg" type="text" placeholder="Search" id = "searchBar"  onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
          style={{backgroundColor: "black", color:"#FF69B4",borderColor:"#FF69B4", marginBottom:"50px"}}/>

          </Form>

          </Col>


          </div>
          {Shows}
       <div > 
          <Row>
            <Col></Col>
             <Col><Pagination  paginate={paginate} number ={currentPage}  count = {count} />  </Col>
             <Col></Col>
         </Row>

         <Row>
            <Col></Col>
             {/* <Col xs={12} sm={4} md={2} ><h1 class = "Page">Page {currentPage}</h1>  </Col> */}
             <Col></Col>
         </Row>
         
        
        


         
     
      </div>  
    </div>
    );
  }
