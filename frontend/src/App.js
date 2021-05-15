import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { Component, useState, useEffect  } from 'react';
import axios from "axios";
import Show from './components/show.component';
import { Form, Col, Row } from "react-bootstrap";
import Watchlist from './components/watchlist.component';
import Profile from './components/profile.component';
import Homepage from './components/homepage.component';
import Login from './components/login.component';

const LS_KEY = 'data.ls';

function App() {
  
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});

  const [PrimaryList, setPrimaryList] = useState({}); //{title:'shows', componentType, data:[], html:[]}
  const [SecondaryList, setSecondaryList] = useState({});
  const [Sidebar, setSideBar] = useState(null);
  const [MiddleShow, setMiddleShow] = useState("");

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

  function listType(title){
    if(title.includes("Results for") || title == "Recently Added" || title.includes("Shows in") || title.includes("Top Anime")) return "Shows"
    return(title);
  }
  function generateHTML(setList, List, title = null, data = null){
    if(!data) data = List.data;
    if(!title) title = List.title;
    if(!data || !title){
      console.log("ERROR: Misuse of generateHTML - Missing data or type/title.")
      return null;
    }
    let type = listType(title);
    setList({title:title, data:data, html:data.map(entry => {
      if(type == "Shows"){
          return(
            <div>
              <Show chooseShow={chooseShow} key={entry} token={token} list={Playlists} show={entry} isMiddle={MiddleShow} all_platforms={all_platforms}/>
            </div>
          )
      } else if(type == "Watchlist"){
        return(
          <div>
            <Watchlist chooseWatchlist={chooseWatchlist} watchlist={entry}/>
          </div>
        )
      } 
    })})
  }

  useEffect(() => {

    axios.get("http://localhost:3001/platforms").then(response=>{ 
      setAllPlatforms(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

    const ls = JSON.parse(localStorage.getItem(LS_KEY))
    if(ls) { //signed in
      signin(ls.token, ls.username)
      
    }else{ //not signed in
      axios.post("http://localhost:3001/shows/recentlyadded").then(response=>{
        generateHTML(setSecondaryList, SecondaryList, "Recently Added", response.data)
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, []);

  useEffect(()=>{
    //setCurrentPage(1);
    if(all_platforms){
      axios.post("http://localhost:3001/shows",
      {
        search_str: searchString
      }).then(response=>{
        generateHTML(setPrimaryList, PrimaryList, (searchString == '') ? 'Top Anime' : `Results for '${searchString}'` , response.data.data);
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
    if(PrimaryList.title && listType(PrimaryList.title) == "Shows")
      generateHTML(setPrimaryList, PrimaryList);
    
    if(SecondaryList.title && listType(SecondaryList.title) == "Shows")
      generateHTML(setSecondaryList, SecondaryList);

  }, [Shows, MiddleShow]);

  useEffect(() => {
    //setPrimaryList(title:`${watchlist.name}`, data:Playlist)?
  }, [Watchlist]);

  useEffect(() => {
    setPrimaryList(Friends)
  }, [Friends]);
  //2. by user selecting a playlist


  useEffect(() => {
    if (CurrentPlaylist) {
      generateHTML(setPrimaryList, PrimaryList, `Shows in '${CurrentPlaylist.title}'`, CurrentPlaylist.shows);
    }
  
  }, [CurrentPlaylist]);

  //3. by selecting friends?

  //set secondary list
  useEffect(() => {
    //take the search results and set primary list
    if(token){
      generateHTML(setSecondaryList, SecondaryList, "Watchlist", Playlists)
    }
    
  }, [Playlists]);

  useEffect(() => {
    //take the search results and set primary list
    axios.get(`http://localhost:3001/watchlists/${user.username}`).then(response => {
      setPlaylists(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
    
  }, [user]);



  const signin = (token, username) => {
    setToken(token);
    setUser({... user, username:username});
    setSideBar(null);
    localStorage.setItem(LS_KEY, JSON.stringify({token:token, username:username}));
  }

  const signout = () => {
    setToken(null);
    setUser({});
    setSideBar(null);
    localStorage.setItem(LS_KEY, null);
  }
  
  const handleChange = (e) =>{
      e.preventDefault();
      setSearch(e.target.value);
      console.log(searchString);
  }
  const openSidebar = (e) => {
    e.preventDefault();
    if(Sidebar) 
      setSideBar(null);
    else
      user.username?setSideBar(<Profile signout = {signout} user={user}/>):setSideBar(<Login signin = {signin}/>)
  }
  const chooseShow = (show) => {
    console.log(show.title + " show chosen");
    setMiddleShow(show.title);
  }

  const chooseWatchlist = (watchlist) => {
    console.log(watchlist.title + " watchlist chosen");
    setCurrentPlaylist(watchlist);
  }

  
  
//   this.setState(prevState => ({
//     isMiddle: !prevState.isMiddle
// }));


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
            <h2 class="primary_list_title">
              {PrimaryList.title}
            </h2>
          </div>
          <div class="row primary_list">
            
              {PrimaryList.html}
            
          </div>
          <div class="row">
            <h2 class="primary_list_title">
              {SecondaryList.title}
            </h2>
          </div>
          <div class="row">
            {SecondaryList.html}
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

