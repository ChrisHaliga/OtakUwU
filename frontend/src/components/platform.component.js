import React from 'react'

export default function Platform( {platform} ) {

    return (
        <a href={platform.link}><img src={process.env.PUBLIC_URL +`/icons/${platform.websiteName.split(" ").join("-")}.png`} 
        alt={`Icon for ${platform.websiteName}`} width="50px" height ="auto" style={{marginRight:"10px"}}/></a>
    )
}
