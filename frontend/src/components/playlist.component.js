import React, { useEffect, useState } from 'react';

export default function Playlist({ watchlist }) {

    const shows = watchlist.shows;
    const [CoverImage, setCoverImage] = useState(false);

    const listItems = shows.map((show) => 
    <li>{show.title}</li>
    );

    useEffect(() => {
        console.log(watchlist.shows)
        // setCoverImage(watchlist.shows[0].icon)
    }, [])
    return (
        <div class="card-body watchlist-card">
            <div class="image">
                {/* <img src={CoverImage}></img> */}
                {listItems}
                {watchlist.title}
            </div>
        </div>
    )
}