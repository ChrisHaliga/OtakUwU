import React from 'react';
import './watchlist.css';
export default function Watchlist({ watchlist, chooseWatchlist }) {

    let coverShow = watchlist.shows[0];
    return (

        <div class="watchlist_card">
            <div class="watchlist_card_image_holder">
                <div class="watchlist_card_image_overlay">
                    <img class="watchlist_card_image" src={coverShow ? coverShow.icon : ''}
                        onClick={() => chooseWatchlist(watchlist)} />
                    <h5 class="watchlist_card_title">
                        {watchlist.title}
                    </h5>
                </div>
            </div>
        </div>
    )
}