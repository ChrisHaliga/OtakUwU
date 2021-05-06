import React, { useEffect, useState } from 'react';
import Platform from './platform.component';
import Playlist from './playlists.component';
import "bootstrap/dist/css/bootstrap.min.css";
import './show.css';
import axios from "axios";
import { Button, Popover, OverlayTrigger } from "react-bootstrap";
import plus from './plus.png';

//react functional components are stateless so they don't re render
//unless a stateful parent component passes a prop to them

export default function Show({ chooseShow, token, user, show, all_platforms, isMiddle }) {
  // var chooseThisShow = () =>{
  //   console.log("chose " + show.title);
  //   //changing this value does not change how the show looks even though this show is marked as middle
  // };
  const [active, setActive] = useState(false);
  useEffect(() => {
    //take the search results and set primary list
    setActive(isMiddle == show.title);
    console.log("middle set" + isMiddle);
  }, [isMiddle]);

  const [lists, setLists] = useState([]);
  const [name, setName] = useState(" ");
  // get all watchlists

  useEffect(() => {

    axios.get("http://localhost:3001/watchlists").then(response => {
        setLists(response.data);
       setLists(response.data.map(list => (
         <Playlist list={list} show={show} user = {user} />
       )));
     })
       .catch((error) => {
         console.log(error);
    });
    //method to get watchlists for specific user - still some bugs so commented out
      /*axios.get(`http://localhost:3001/watchlists/${user.username}`).then(response => {
          console.log(response.data);
      setLists(response.data);
      setLists(response.data.map(list => (
        <Playlist list={list} show={show} />
      )));
    })
      .catch((error) => {
        console.log(error);
      });*/

  }, []);

  const handleKeyPress= (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log(event.target.value);
      var str = event.target.value;
      axios.post("http://localhost:3001/watchlists/add",
        {
          title: str,
        }).then(response=>{
         console.log(response)
          
        }) 
        .catch((error) => {
          console.log(error);
        })

      // setName(event.target.value);
      //
    }

  };

  //Watchlist Popover
  const popover = (
    <Popover >

      <div class="card watch-card scroll" >

        <div class="watch-top">
          <div class="watch-component-title mt-3">
            <h5>WatchLists</h5>
          </div>
        </div>

        <div class="watch-showname mt-2">
          <h6 class="show-title">Add "{show.title}" to ...</h6>

        </div>
        <div class="row">
          <input class="watch-form form-control mb-3 mr-2" type="text" placeholder="New List" onKeyPress={ handleKeyPress} ></input>
          {/* <Form onChange = {handleChange} class = "watch-form">
      <Form.Control size="md" type="text" placeholder="New"   onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
      style={{ marginBottom:"3"}}/>
      </Form> */}
          <button class="form-button" ><h6></h6></button>
        </div>
        {lists}
      </div>

    </Popover>
  );

    const popover2 = (
    <Popover >
      <div>
        <h3>Login to add shows to your watchlists!</h3>
      </div>
    </Popover>
  );

  const AddButton = () => (
    <OverlayTrigger trigger="click" placement="right" overlay={token ? popover:popover2} >
      <Button variant="success" style={{ backgroundColor: "black", borderColor: "black" }}><img src={plus} style={{ width: "2rem", height: "2rem" }} /></Button>
    </OverlayTrigger>
  );

  if (isMiddle == show.title) {
    return (
      <div class=" main card container mt-3 mb-3 " >

        <div class="row ">

          <div class="col-4 image ">

            <img class="icon " src={(!show.icon || show.icon == "default" || !show.icon.includes("http")) ? process.env.PUBLIC_URL + "/imgs/not_found.gif" : show.icon}
              alt={`Cover art for ${show.title}`} />
          </div>

          <div class="col-8 ">

            <div class="card-body info">
              <h5 class="card-title title" >{show.title}</h5>
              <p class="card-text text" >{show.description?show.description:"No Description"}</p>

              <div class="row bottomElements ">

                <div class="platforms col-9">
                  {
                    all_platforms.filter(platform =>
                      show.links.includes(platform._id)
                    ).map(platform => <Platform platform={platform} />)
                  }

                </div>
                <div class="add col-3" >
                  <AddButton />
                </div>

              </div>

            </div>



          </div>



        </div>


      </div>
    )
  }
  else {

    return (
      <div class="container mb-3">
        <div class="col-4 image " >
          <img class="icon " src={(!show.icon || show.icon == "default" || !show.icon.includes("http")) ? process.env.PUBLIC_URL + "/imgs/not_found.gif" : show.icon} alt={`Cover art for ${show.title}`}
            onMouseOver={() => chooseShow(show)}
          />
        </div>
      </div>
    )




  }
}