import React from 'react';
import "./profile.css";

export default function Profile( {signout, user} ) {
    var username = user.username;
    var profilePic = "gudetama.jpeg";
    var bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    return (   
        <div class="profile-nav col-md-3">
            <div class="panel">
                <div class="text-center">
                    <div class="user-heading round container">
                        <img src={process.env.PUBLIC_URL +`/icons/${profilePic}`}  alt="gudetama"/>
                        <div class="profile-username">@{username}</div>
                        <div class="profile-description">{bio}</div>
                        <button onClick={() => signout()}>Log out</button>
                    </div>
                </div>
            </div>
        </div>
        
    )
}
