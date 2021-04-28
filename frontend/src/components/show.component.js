import React, {useState} from 'react'
import Platform from './platform.component';
import "bootstrap/dist/css/bootstrap.min.css";
import './show.css';
import {Button, Popover ,OverlayTrigger} from "react-bootstrap";

import plus from './plus.png';

//react functional components are stateless so they don't re render
//unless a stateful parent component passes a prop to them

export default function Show( {chooseShow, show, all_platforms, isMiddle} ) {
  // var chooseThisShow = () =>{
  //   console.log("chose " + show.title);
  //   //changing this value does not change how the show looks even though this show is marked as middle
  // };

  if(isMiddle == show.title)
  {
  return (
  <div class=" main card container mt-3 mb-3 ">
    <div class="row ">
      <div class="col-4 image ">
        <img class="icon " src={(!show.icon || show.icon=="default" || !show.icon.includes("http"))? process.env.PUBLIC_URL +"/imgs/not_found.gif":show.icon} alt={`Cover art for ${show.title}`} />
      </div>

      <div class="col-8 ">

        <div class="card-body info">
          <h5 class="card-title title">{show.title}</h5>
          <p class="card-text text"> This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>

          <div class="row bottomElements ">

            <div class="platforms col-9">
              {
              all_platforms.filter(platform =>
              show.links.includes(platform._id)
              ).map(platform =>
              <Platform platform={platform} />)
              }

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
  <div class="container mb-3">
    {/* onMouseOver={() => this.setState({ isMiddle: true })} onMouseOut={() => this.setState({ isMiddle: false })} */}
    <div class="col-4 image " >
        <img class="icon " src={(!show.icon || show.icon=="default" || !show.icon.includes("http"))? process.env.PUBLIC_URL +"/imgs/not_found.gif":show.icon} alt={`Cover art for ${show.title}`} 
          onMouseOver={()=> chooseShow(show)} 
        />
      </div>
  </div>
  )
}
}



// backgroundColor:"black"
//style={{width:"35rem",height:"17rem",backgroundColor:"black",paddingLeft:"0px"}}

