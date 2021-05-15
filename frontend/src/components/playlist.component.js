import React, { useEffect, useState } from 'react';

export default function Playlist( {watchlist, chooseWatchlist} ) {


    return ( 
        <div class="card">
            <button onClick={() => chooseWatchlist(watchlist)}>
            {watchlist.title} 
            </button>
        </div>  

    )
}