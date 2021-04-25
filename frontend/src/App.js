
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { Component, useState, useEffect  } from 'react';
import axios from "axios";
import Show from './components/show.component';
import { Form, Col, Row } from "react-bootstrap";
import Playlist from './components/playlist.component';
import Profile from './components/profile.component';
import Homepage from './components/homepage.component';


function App() {
  const [token, setToken] = useState(null);

  const [PrimaryList, setPrimaryList] = useState([]);
  const [PrimaryListTitle, setPrimaryListTitle] = useState(null);
  const [SecondaryList, setSecondaryList] = useState(null);
  const [Sidebar, setSideBar] = useState(null);

  const [all_platforms, setAllPlatforms]= useState([]);
  const [Shows, setShows] = useState([]);
  const [Playlists, setPlaylists] = useState([]); // [{name,picture, _id}] --> NEED ROUTE
  
  const [Friends, setFriends] = useState([]);

  // _id's of each current active element in each list.
  const [CurrentShow, setCurrentShow] = useState("");
  const [CurrentPlaylist, setCurrentPlaylist] = useState("");
  const [CurrentFriend, setCurrentFriend] = useState("");
  
  const [searchString, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(1);  //count of pages

  useEffect(() => {
    //TODO: Validate Token, then load user's data
    // setPlaylists(user's lists) 

    setPlaylists(
      //axios call to get multiple playlists
      //this is just an example of one
      <Playlist watchlist="first one"/>
    )
    //if clicked on user profile set sidebar
    // setSideBar(
    //   <Profile/>
    // )
    
    axios.get("http://localhost:3001/platforms").then(response=>{ 
    setAllPlatforms(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

  }, []);

  useEffect(()=>{
    console.log(all_platforms);
    setCurrentPage(1);
    if(all_platforms){
      axios.post("http://localhost:3001/shows",
      {
        search_str: searchString
      }).then(response=>{
        console.log(response.data)
        setCount(response.data.count);
        setShows(response.data.data.map(show=> (
          <Show show={show} currentShow={CurrentShow} all_platforms={all_platforms}/>
        )));
        // setPrimaryList(Shows);
      })
      .catch((error) => {
        console.log(error);
      })
      console.log(Shows);
    }
  }, [all_platforms, searchString])

  //setting the Primary list in 3 ways

  //1. by search results
  useEffect(() => {
    //take the newly updated shows and set primary list
    setPrimaryList(Shows)
    setPrimaryListTitle("Search Results")

  }, [Shows]);

  useEffect(() => {
    setPrimaryList(Playlist)
    setPrimaryListTitle(Playlist.title)
  }, [Playlist]);

  useEffect(() => {
    setPrimaryList(Friends)
  }, [Friends]);
  //2. by user selecting a playlist
  useEffect(() => {
    //take the search results and set primary list
    setPrimaryList(CurrentPlaylist);//AXIOS call for playlist by id
  }, [CurrentPlaylist]);

  //3. by selecting friends?

  //set secondary list
  useEffect(() => {
    //take the search results and set primary list
    setSecondaryList(
      <Playlist watchlist="secondary lists"/>
    );
  }, [Playlists]);

  const handleChange = (e) =>{
      e.preventDefault();
      setSearch(e.target.value);
      console.log(searchString);
  }
  const openSidebar = (e) =>{
    e.preventDefault();
    setSideBar(<Profile/>)
  }

return (
   <html>
     <header>
      <nav>
        <h1 class="navbar-brand" href="#">Otakuwu</h1>
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control" type="search" placeholder="Whatcha lookin' for?" aria-label="Search" onChange={handleChange} value={searchString} onKeyPress={(e)=> { e.key === 'Enter' && e.preventDefault(); }}/>
        </form>
        <div>
          <ul class="nav__links">
            <li>
              <a href="#">Shows</a>
            </li>
            <li>
              <a href="#">Lists</a>
            </li>
            <li class="wrapper">
              <img src={process.env.PUBLIC_URL +`/icons/gudetama.jpeg`} class="image--cover" onClick={openSidebar} value={!Sidebar}></img>
            </li>
          </ul>
        </div>
      </nav>
      </header>
      <body class="content">
        <div class="row">
        <div class={`col-${ Sidebar? '8': '12'}`}>
          <div class="row">
            <h2 class="title">
              {PrimaryListTitle}
            </h2>
          </div>
          <div class="row">
            <div class="primary_list">
              {PrimaryList}
            </div>
          </div>
          <div class="row">
            {SecondaryList}
          </div>
        </div>
        <div class="col-4">
          <div class="row">
            {Sidebar}
          </div>
        </div>
      </div>
      </body>
  


</html>
  );
}

export default App;

