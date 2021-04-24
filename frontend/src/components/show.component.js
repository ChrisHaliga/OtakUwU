import React from 'react'
import Platform from './platform.component';
import "bootstrap/dist/css/bootstrap.min.css";

import { Form, Button, FormGroup, FormControl, ControlLabel, Row,Popover ,OverlayTrigger} from "react-bootstrap";
import Col from 'react-bootstrap/Col';

import plus from './plus.png'; 
import heart from './whiteheart.jpeg'; 
export default function show( {show, all_platforms} ) {
    const popover = (
        <Popover >
          <Popover.Title as="h3">WatchList</Popover.Title>
          <Popover.Content>
            And here's some <strong>amazing</strong> content. It's very engaging.
            right?
          </Popover.Content>
        </Popover>
      );
      
      const Example = () => (
        <OverlayTrigger trigger="click" placement="right" overlay={popover} >
          <Button variant="success" style = {{backgroundColor:"black",borderColor:"black"}}><img src={plus} alt="my image" style = {{ width:"2rem",height:"2rem"}} /></Button>
        </OverlayTrigger>
      );
    return (   
        <div id = "d1" class="card mb-3  mt-3 container" style={{width:"35rem",height:"17rem",backgroundColor:"black",paddingLeft:"0px"}}> 
        <div class="row no-gutters">
            <div class="col-4 ">
            <img class = "ml-0" src={(!show.icon || show.icon == "default" || !show.icon.includes("http"))? process.env.PUBLIC_URL +"/imgs/not_found.gif":show.icon} 
                alt={`Cover art for ${show.title}`}  style = {{ width:"13rem",height:"16.9rem",marginLeft:"0px"}} />
            </div>
              <div class="col-md-8">
                <div class="card-body">
              <h5 class="card-title" style={{color:"white",textAlign:'center'}}>{show.title}</h5> 
                  <p class="card-text" style={{color:"white",textAlign:'center'}}> This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  <div class = "ml-3" style = {{position: "absolute", bottom: "10px"}}>
                    {
                            all_platforms.filter(platform => 
                                show.links.includes(platform._id)
                            ).map(platform => <Platform platform={platform}/>)
                    }
                     
                 </div>
                 <div class = "ml-3" style = {{position: "absolute", bottom: "10px",right:"40px"}}>
                 <Example /> 
                 </div>
                </div>
              </div>
         </div>
        
        </div> 
    )
}
