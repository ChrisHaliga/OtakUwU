import React from 'react';

export default function Playlist( {watchlist, chooseWatchlist} ) {


    return (   
        <button onClick={() => chooseWatchlist(watchlist)}>
           {watchlist.title} 
        </button>
    )
}