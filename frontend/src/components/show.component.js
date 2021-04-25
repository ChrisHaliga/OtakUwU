import React from 'react'
import Platform from './platform.component';
import "bootstrap/dist/css/bootstrap.min.css";
import './show.css';
import {Button, Popover ,OverlayTrigger} from "react-bootstrap";

import plus from './plus.png'; 

export default function show( {show, all_platforms,isMiddle} ) {
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

          <input class="watch-form form-control mb-3" type="text" placeholder="New List"></input>

          <div class ="playlists">
              <div class="row">
                 <div class="col-3">
                      <div>
                      <button class="button" ></button>
                      </div>
                      
                    

                 </div>
                 <div class = "col-9 mt-3">
                <h6 class = "listname">PlayList1</h6>
                 </div>

              </div>
        
     
          </div>
        </div> 
        
        </Popover>
      );
      
      const Example = () => (
        <OverlayTrigger trigger="click" placement="right" overlay={popover} >

          <Button variant="success" style = {{backgroundColor:"black",borderColor:"black"}}><img src={plus}  style = {{ width:"2rem",height:"2rem"}} /></Button>
        </OverlayTrigger>
      );
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
                                    <Example /> 
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

  
   
// backgroundColor:"black"
//style={{width:"35rem",height:"17rem",backgroundColor:"black",paddingLeft:"0px"}}

