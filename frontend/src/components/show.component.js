import React, { useEffect,useState} from 'react'
import Platform from './platform.component';
import Playlist from './playlists.component';
import "bootstrap/dist/css/bootstrap.min.css";
import './show.css';
import axios from "axios";
import { Form, Button, FormGroup, FormControl, ControlLabel, Row,Popover ,OverlayTrigger} from "react-bootstrap";
import Col from 'react-bootstrap/Col';

import plus from './plus.png'; 
export default function Show( {show, all_platforms,isMiddle} ) {
  const [lists, setLists]= useState([]);
  const [name, setName]= useState(" ");
    // get all watchlists
    useEffect(() => {
      
      axios.get("http://localhost:3001/watchlists").then(response=>{ 
      setLists(response.data);
      setLists(response.data.map(list=> (
        <Playlist list ={list} show={show}/>
      )));
      })
      .catch((error) => {
        console.log(error);
      });

    },[]);

    const handleChange = (event) =>{
      console.log("a");
      if(event.key === 'Enter'){
      event.preventDefault();
      console.log(event.target.value);
      setName(event.target.value);
      }
 
    };
  
     //Watchlist Popover
    const popover = (
        <Popover >
          
        <div class="card watch-card scroll" >

          <div  class = "watch-top">
              <div class = "watch-component-title mt-3">
                <h5>WatchLists</h5>
              </div>
          </div>

          <div class= "watch-showname mt-2">
           <h6 class= "show-title">Add "{show.title}" to ...</h6>

          </div>
          <div class ="row">
          <input class="watch-form form-control mb-3 mr-2" type="text" placeholder="New List" onChange = {(e)=>{handleChange(e)}} ></input>  
          {/* <Form onChange = {handleChange} class = "watch-form">
          <Form.Control size="md" type="text" placeholder="New"   onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
          style={{ marginBottom:"3"}}/>
          </Form> */}
          <button class="form-button" ><h6>Add</h6></button>
          </div>
          {lists}
        </div> 
        
        </Popover>
      );
      
      const AddButton = () => (
        <OverlayTrigger trigger="click" placement="right" overlay={popover} >
          <Button variant="success" style = {{backgroundColor:"black",borderColor:"black"}}><img src={plus}  style = {{ width:"2rem",height:"2rem"}} /></Button>
        </OverlayTrigger>
      );


      //Show card 
      if(isMiddle!="true")
      {
    return (   
      <div class=" main card container mt-3 mb-3 " > 

      <div class="row ">

                <div class="col-4 image ">

                <img class = "icon " src={(!show.icon || show.icon == "default" || !show.icon.includes("http"))? process.env.PUBLIC_URL +"/imgs/not_found.gif":show.icon} 
                    alt={`Cover art for ${show.title}`}  />
                </div>  
                
                      <div class="col-8 ">
                    
                            <div class="card-body info">
                                 <h5 class="card-title title" >{show.title}</h5> 
                                  <p class="card-text text" > This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                               
                                  <div class="row bottomElements ">  

                                    <div class = "platforms col-9">
                                          {
                                                  all_platforms.filter(platform => 
                                                      show.links.includes(platform._id)
                                                  ).map(platform => <Platform platform={platform}/>)
                                          }
                                      
                                    </div>
                                    <div class = "add col-3" >
                                    <AddButton/> 
                                    </div>

                                    </div> 

                          </div>

                     

                   </div> 

            

      </div> 
     
    
    </div>        
    )
}
else
{
  return(
    <div class = "container mb-3">
    <div class="card "  style = {{width:"17.5rem",height:"23rem",backgroundColor:"black"}}>
   
    <img src= {(!show.icon || show.icon == "default" || !show.icon.includes("http"))? process.env.PUBLIC_URL +"/imgs/not_found.gif":show.icon} 
     style = {{width:"100%" ,height:"100%"}}/> 
      
    </div> 
    </div>  
     )
}
}


//onChange = {handleChange}   //onKeyPress={(e) => { handleChange(e) }} 