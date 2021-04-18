import React from 'react';
import './profile.css'


// const newUser = new User({
//     username,
//     email,
//     password,
//     profilePic,
//     bio
// });
export default function ProfileComponent() {
    var username = "testuser";
    var profilePic = "gudetama.jpeg";
    var bio = " Hi, My name is Aina. I love dairy free ice cream and chocolate. I am a baby. My comfort character is Izuku Midoriya. I have so much to learn about anime. My favorite genres are romance, shonen, and fantasy. But I want to watch all the types. Follow me on instagram to look at my anime journal spreads! ig: aina.mov";
    return (   
        <div class="profile-nav col-md-3">
            <div class="panel">
                <div class="text-center">
                    <div class="user-heading round">
                        <img src={process.env.PUBLIC_URL +`/icons/${profilePic}`}  alt="gudetama"/>
                        <div class="profile-username">@{username}</div>
                        <div class="profile-description">{bio}</div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}
