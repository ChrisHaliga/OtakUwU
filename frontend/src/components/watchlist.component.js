import React from 'react';
import './watchlist.css';
import axios from "axios";
import { FaTrash } from 'react-icons/fa';
export default function Watchlist({ watchlist, chooseWatchlist, token, updateWatchlists }) {

    let coverShow = watchlist.shows[0];
    
    const removeWatchlist = () => {
        console.log(token);
        axios.post(`http://localhost:3001/watchlists/${watchlist.id}`,
        {
          token:token
        }).then(response=>{
         console.log(response)
         updateWatchlists();
        }) 
        .catch((error) => {
          console.log(error);
        })
    }
    return (
        <div class="watchlist_card">
            <div class="watchlist_card_image_holder">
                <div class="watchlist_card_image_overlay">
                    <img class="watchlist_card_image" src={coverShow ? coverShow.icon : ''}
                        onClick={() => chooseWatchlist(watchlist)} />
                    <h5 class="watchlist_card_title">
                        {watchlist.title}
                    </h5>
                     
                   <FaTrash  size="25px" class="delete-button" onClick={removeWatchlist}/>
                  
                </div>
            </div>
        </div>
    )
}