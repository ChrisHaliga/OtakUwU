import React from 'react';
import './App.css';
import React, { Component, useState, useEffect  } from 'react';
import axios from "axios";
import Show from './show.component';

export default function Main() {
  const [token, setToken] = useState(null);

  const [PrimaryList, setPrimaryList] = useState({});
  const [SecondaryList, setSecondaryList] = useState({});
  const [Sidebar, setSideBar] = useState({});

  const [all_platforms, setAllPlatforms]= useState([]);
  const [Shows, setShows] = useState([]);
  const [Playlists, setPlaylists] = useState([]); // [{name,picture, _id}] --> NEED ROUTE
  const [Friends, setFriends] = useState([]);

  // _id's of each current active element in each list.
  const [CurrentShow, setCurrentShow] = useState("");
  const [CurrentPlaylist, setCurrentPlaylist] = useState("");
  const [CurrentFriend, setCurrentFriend] = useState("");
  
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(1);  //count of pages

  useEffect(() => {
    //TODO: Validate Token, then load user's data
    // setPlaylists(user's lists) 

    axios.get("http://localhost:3001/platforms").then(response=>{ 
    setAllPlatforms(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

  }, []);

  useEffect(()=>{
    if(all_platforms){
      
      axios.post("http://localhost:3001/shows?page=1&limit=20",
      {
        search_str: search
      }).then(response=>{
        setCount(response.data.count);
        setShows(response.data.data.map(show=> (
          <Show show={show} currentShow={CurrentShow} all_platforms={all_platforms}/>
        )));
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }, [all_platforms, search])

  //setting the Primary list in 3 ways
  //1. by search results
  useEffect(() => {
    //take the newly updated shows and set primary list
    setPrimaryList(Shows); //Might have to format with HTML
  }, [Shows]);

  //2. by user selecting a playlist
  useEffect(() => {
    //take the search results and set primary list
    setPrimaryList(CurrentPlaylist);//AXIOS call for playlist by id
  }, [CurrentPlaylist]);

  //3. by selecting friends?

  useEffect(() => {
    //take the search results and set primary list
    setSecondaryList(Playlists);
  }, [Playlists]);

  const handleChange = (e) =>{
      e.preventDefault();
      setSearch(e.target.value);
  }

return (
  <> 
  <div class="row">
    <Navbar/>
    // use search bar
  </div>
  <div class="row">
    {/* Playlists */}
    <div class="col">
      <div class="row">
        {PrimaryList}
      </div>
      <div class="row">
        {SecondaryList}
      </div>
    </div>
    <div class="col">
      <div class="row">
        {Sidebar}
      </div>
    </div>
  </div>
  </>
  );

}


export default App;

