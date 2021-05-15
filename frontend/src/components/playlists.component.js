import React from 'react'
import './show.css';
import { useEffect } from 'react';
import axios from "axios";
// import { useReducer } from 'react';
export default function Playlists( {list,show,token} ) {
console.log(list);
    const addShow = () =>{
        console.log(show.title);
        console.log(show);
        console.log(list.id);
        console.log(list.shows);
        axios.post("http://localhost:3001/watchlists/addShow",
        {
          title: show.title,
          id: list._id
        }).then(response=>{
         console.log(response)
          
        }) 
        .catch((error) => {
          console.log(error);
        })

   
      } 


      const deleteShow = () =>{
        console.log(show.title);
        console.log(show);
        console.log(list.id);
        axios.post("http://localhost:3001/watchlists/removeShow",
        {
          title: show.title,
          watchlist: list,
          token:token
        }).then(response=>{
         console.log(response)
          
        }) 
        .catch((error) => {
          console.log(error);
        })

   
      } 
     
    if(!(list.shows.includes(show._id)))
     {
    return (
        
        <div class ="playlists">

               <div class="row">
                    <div class=" mt-2 ml-4">
                    <div>
                    <button class="button" onClick={addShow} ><h4>+</h4></button>
                </div>
                
                 </div>

                <div class = "mt-3 ml-4">
                    <h6 class = "listname" >{list.title}</h6>
                    </div>
                </div>

    </div>
    )

}
else
{
  return (
        
    <div class ="playlists">

           <div class="row">
                <div class=" mt-2 ml-4">
                <div>
                <button class="remove-button" onClick={deleteShow} ><h4>-</h4></button>
            </div>
            
             </div>

            <div class = "mt-3 ml-4">
                <h6 class = "listname" >{list.title}</h6>
                </div>
            </div>

</div>
)
}


}