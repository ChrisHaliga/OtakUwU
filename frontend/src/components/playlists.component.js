import React from 'react'
import './show.css';
import axios from "axios";
export default function Playlists({ list, show, token, updateWatchlists}) {
  
  const addShow = () => {
    axios.post("http://localhost:3001/watchlists/addShow",
      {
        show_title: show.title,
        id: list.id,
        token: token
      }).then(response => {
        console.log(response);
        updateWatchlists();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  
  const deleteShow = () => {
    axios.post("http://localhost:3001/watchlists/removeShow",
      {
        show_title: show.title,
        id: list.id,
        token: token
      }).then(response => {
        console.log(response);
        updateWatchlists();
      })
      .catch((error) => {
        console.log(error);
      })

  }

  if (!(list.shows.includes(show))) {
    return (

      <div class="playlists">

        <div class="row">
          <div class=" mt-2 ml-4">
            <div>
              <button class="button" onClick={addShow} ><h4>+</h4></button>
            </div>

          </div>

          <div class="mt-3 ml-4">
            <h6 class="listname" >{list.title}</h6>
          </div>
        </div>

      </div>
    )

  }
  else {
    return (

      <div class="playlists">

        <div class="row">
          <div class=" mt-2 ml-4">
            <div>
              <button class="button remove-button" onClick={deleteShow} ><h4>-</h4></button>
            </div>

          </div>

          <div class="mt-3 ml-4">
            <h6 class="listname" >{list.title}</h6>
          </div>
        </div>

      </div>
    )
  }


}