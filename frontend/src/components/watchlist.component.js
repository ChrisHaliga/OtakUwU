import React, { useEffect, useState } from 'react';

export default function Watchlist({ watchlist, chooseWatchlist }) {

    let coverShow = watchlist.shows[0];
    return (
        <div class="card">
            <div class="watchlist_card">
                <img class="icon" src={coverShow ? coverShow.icon : ''} />
                <div class="watchlist_card_title">
                    <button onClick={() => chooseWatchlist(watchlist)}>
                        {watchlist.title}
                    </button>
                </div>
            </div>
        </div>
    )
}