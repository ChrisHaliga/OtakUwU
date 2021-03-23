import React from 'react'

export default function Platform( {platform} ) {

    return (
        <a href={platform.link}>{platform.websiteName}</a>
    )
}
