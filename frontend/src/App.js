import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import Show from './components/show.component';
import Watchlist from './components/watchlist.component';
import Profile from './components/profile.component';
import Homepage from './components/homepage.component';
import Login from './components/login.component';

const LS_KEY = 'data.ls';

function App() {

  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});

  const [timer, setTimer] = useState(Date.now());

  const [List_init, setList_init] = useState(false);
  const [PrimaryList, setPrimaryList] = useState({ id: "primarylist", listIndex: 0, displayType: "Cards3D" }); //{id:"primaryList", title:'shows', componentType, data:[], html:[], listIndex}
  const [SecondaryList, setSecondaryList] = useState({ id: "secondarylist", listIndex: 3, displayType: "Cards3D" });
  const [Sidebar, setSideBar] = useState(null);
  const [hoveredShow, setHoveredShow] = useState({});
  const [watchlistChanged, changeWatchlist] = useState(false);



  const [all_platforms, setAllPlatforms] = useState([]);
  const [Shows, setShows] = useState([]);
  const [Playlists, setPlaylists] = useState([]); // [{name,picture, _id}] --> NEED ROUTE

  const [Friends, setFriends] = useState([]);

  // _id's of each current active element in each list.
  const [CurrentShow, setCurrentShow] = useState("");
  const [CurrentPlaylist, setCurrentPlaylist] = useState("");
  const [CurrentFriend, setCurrentFriend] = useState("");

  const [searchString, setSearch] = useState("");

  function listType(title) {
    if (title.includes("Results for") || title == "Recently Added" || title.includes("Shows in") || title.includes("Top Anime")) return "Shows"
    return (title);
  }
  function generateHTML(setList, List, index = 3, title = null, data = null, displayType = null) {
    if (!PrimaryList || !SecondaryList) return;
    if (!data) data = List.data;
    if (!title) title = List.title;
    if (!displayType) displayType = List.displayType

    if (!data || !title) {
      console.log("ERROR: Misuse of generateHTML - Missing data or type/title.")
      return null;
    }
    let type = listType(title);
    let direction = index - List.listIndex > 0 ? "Right" : (index - List.listIndex < 0 ? "Left" : "")

    let numCards = Math.min(7, data.length - (1 - data.length % 2));
    let middle = (numCards - 1) / 2;
    if (displayType == 'Cards3D') {
      let i = 0
      for (i = 0; i < middle - index; i++) {
        data = [data[data.length - 1]].concat(data.slice(0, -1));
      }
      index += i;
      for (i = 0; i < index + middle - (data.length - 1); i++) {
        data = data.concat([data[0]]).slice(1);
      }
      index -= i;
    }


    setList({
      id: List.id, title: title, data: data, listIndex: index, displayType: displayType, html: data.map((entry, i) => {
        if (type == "Shows") {
          return (
            <div>
              <Show myClass={`${List.id} ${List.displayType} card_${Math.abs(i - index) > middle ? "x" : (i - index)} ${direction}`} parentID={List.id} hoverShow={hoverShow} listIndex={index} token={token} list={Playlists} show={entry} index={i} all_platforms={all_platforms} changeWatchlist={changeWatchlist}/>
            </div>
          )
        } else if (type == "Watchlist") {
          return (
            <div>
              <Watchlist chooseWatchlist={chooseWatchlist} watchlist={entry} />
            </div>
          )
        }
      })
    })
  }

  function getRecentlyAdded(callback) {
    axios.post("http://localhost:3001/shows/recentlyadded")
      .then(response => {
        callback(response.data, "Recently Added");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function putIn(setList, List, content, content_params = null) {
    content((data, title) => {
      generateHTML(setList, List, 0, title, data);
    }, content_params)
  }

  useEffect(() => {

    axios.get("http://localhost:3001/platforms").then(response => {
      setAllPlatforms(response.data);
    })
      .catch((error) => {
        console.log(error);
      });

    const ls = JSON.parse(localStorage.getItem(LS_KEY))
    if (ls) { //signed in
      signin(ls.token, ls.username)

    } else { //not signed in
      putIn(setSecondaryList, SecondaryList, getRecentlyAdded);
    }
  }, [List_init]);

  useEffect(() => {
    //setCurrentPage(1);
    if (all_platforms) {
      axios.post("http://localhost:3001/shows",
        {
          search_str: searchString
        }).then(response => {
          generateHTML(setPrimaryList, PrimaryList, 0, (searchString == '') ? 'Top Anime' : `Results for '${searchString}'`, response.data.data);
        })
        .catch((error) => {
          console.log(error);
        })
      console.log(Shows);
    }
  }, [List_init, all_platforms, searchString])

  useEffect(() => {
    if (List_init === false && PrimaryList && SecondaryList) setList_init(true);
  }, [PrimaryList, SecondaryList])

  //setting the Primary list in 3 ways

  //1. by search results
  useEffect(() => {
    let pi = PrimaryList.listIndex;
    let si = SecondaryList.listIndex

    if (PrimaryList.id == hoveredShow.listID) pi = hoveredShow.index;
    else if (SecondaryList.id == hoveredShow.listID) si = hoveredShow.index;

    //take the newly updated shows and set primary list
    if (PrimaryList.title && listType(PrimaryList.title) == "Shows")
      generateHTML(setPrimaryList, PrimaryList, pi);

    if (SecondaryList.title && listType(SecondaryList.title) == "Shows")
      generateHTML(setSecondaryList, SecondaryList, si);

  }, [Shows, hoveredShow,token]);

  useEffect(() => {
    //setPrimaryList(title:`${watchlist.name}`, data:Playlist)?
  }, [Watchlist]);

  useEffect(() => {
    //setPrimaryList(Friends)
  }, [Friends]);
  //2. by user selecting a playlist


  useEffect(() => {
    if (CurrentPlaylist) {
      generateHTML(setPrimaryList, PrimaryList, 0, `Shows in ${CurrentPlaylist.title}`, CurrentPlaylist.shows);
    }

  }, [CurrentPlaylist]);

  //3. by selecting friends?

  //set secondary list
  useEffect(() => {
    //take the search results and set primary list
    if (token) {
      generateHTML(setSecondaryList, SecondaryList, 0, "Watchlist", Playlists)
    }

  }, [Playlists]);

  useEffect(() => {
    axios.get(`http://localhost:3001/watchlists/${user.username}`).then(response => {
      setPlaylists(response.data);
      console.log(Playlists);
    })
      .catch((error) => {
        console.log(error);
      });
  }, [user, watchlistChanged]);
  const signin = (token, username) => {
    setToken(token);
    setUser({ ...user, username: username });
    setSideBar(null);
    localStorage.setItem(LS_KEY, JSON.stringify({ token: token, username: username }));
  }

  const signout = () => {
    setToken(null);
    setUser({});
    setSideBar(null);
    localStorage.setItem(LS_KEY, null);
    putIn(setSecondaryList, SecondaryList, getRecentlyAdded);
  }

  const handleChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
    console.log(searchString);
  }
  const openSidebar = (e) => {
    e.preventDefault();
    if (Sidebar)
      setSideBar(null);
    else
      user.username ? setSideBar(<Profile signout={signout} user={user} />) : setSideBar(<Login signin={signin} />)
  }

  const hoverShow = (show, listID, index) => {
    if (timer && Date.now() - timer > 500) {
      let List = PrimaryList;
      if (SecondaryList.id == listID) List = SecondaryList;

      if (List == undefined || List.data == undefined) return;

      setTimer(Date.now());
      setHoveredShow({ title: show.title, index: index, listID: listID });
    }
    else
      setHoveredShow({ title: show.title });
  }

  const chooseWatchlist = (watchlist) => {
    console.log(watchlist.title + " watchlist chosen");
    setCurrentPlaylist(watchlist);
  }

  return (
    <html>
      <header>
        <nav>
          <h1 class="navbar-brand">
            <a href="/">Otakuwu</a>
          </h1>
          <form class="form-inline my-2 my-lg-0">
            <input class="form-control" type="search" placeholder="Whatcha lookin' for?" aria-label="Search" onChange={handleChange} value={searchString} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} />
          </form>
          <div>
            <ul class="nav__links">
              <li>
                <a href="/">Shows</a>
              </li>
              <li>
                <a href="#">Lists</a>
              </li>
              <li class="wrapper">
                <img src={process.env.PUBLIC_URL + `/icons/gudetama.jpeg`} class="image--cover" onClick={openSidebar} value={!Sidebar}></img>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <body class="content">
        <div class="row">
          <div class={`col-${Sidebar ? '8' : '12'}`}>
            <div class="row">
              <h2 class="primary list_title">
                {PrimaryList.title}
              </h2>
            </div>
            <div class="row primary_list list justify-content-md-center">
              {PrimaryList.html}
            </div>
            <div class="row">
              <h2 class="secondary list_title">
                {SecondaryList.title}
              </h2>
            </div>
            <div class="row secondary_list list justify-content-md-center">
              {SecondaryList.html}
            </div>

            <div class="col-4">
              <div class="row">
                {Sidebar}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

export default App;

