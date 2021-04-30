import React from 'react'
import './show.css';
import { useEffect } from 'react';
import axios from "axios";
export default function Playlists( {list,show} ) {

    const addShow = () =>{
        console.log(list.title);
        console.log(show.title)
        axios.post("http://localhost:3001/watchlists/addShow",
        {
          show_title: show.title,
          watchlist_title: list.title
        }).then(response=>{
         console.log(response)
          
        }) 
        .catch((error) => {
          console.log(error);
        })

   
      } 

    return (
        
        <div class ="playlists">

               <div class="row">
                    <div class=" mt-2 ml-4">
                    <div>
                    <button class="button" onClick={addShow} ></button>
                </div>
                
                 </div>

                <div class = "mt-3 ml-4">
                    <h6 class = "listname" >{list.title}</h6>
                    </div>
                </div>

    </div>
    )
}