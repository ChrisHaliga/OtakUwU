import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios';


export default function Login({signin}) {

    const [login, setLogin] = useState(true);
    const [user, setUser] = useState();
    const [error, setError] = useState('');

    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()

    useEffect(()=>{
        submit();
    }, [user])

    function onLogin(e){
        e.preventDefault();
        if(!usernameRef.current.value){setError("Username is required"); return}
        if(!passwordRef.current.value){setError("Password is required"); return}
        setUser({username: usernameRef.current.value, password:passwordRef.current.value, submit:'signin'})
        
    }
    function onRegister(e){
        if(!usernameRef.current.value){setError("Username is required"); return}
        if(!passwordRef.current.value){setError("Password is required"); return}
        if(!emailRef.current.value){setError("Email is required"); return}
        e.preventDefault();
        setUser({username: usernameRef.current.value, email:emailRef.current.value, password:passwordRef.current.value, submit:'signup'})
    }

    function submit(){
        if(!(user && user.username && user.password) || user.username.length < 1 || user.password.length < 1) return;
        axios.post(`http://localhost:3001/users/${user.submit}`, {
            username:user.username, 
            password:user.password,
            email:user.email
        })
        .then(res => {
            if(res.data.token)
                signin(res.data.token, user.username);
            else
                setError("Invalid username or password")
            
        })
        .catch(err => {
            if (user.submit == 'signin'){
                setError("Invalid username or password")
            }
            else {
                 setError("Username or email taken")
            }
            
        });
    }

    return (
        <>
            <div class="login_bck">
            <h3>{login? "Log in": "Register"}</h3>
            <h2 className="error">{error}</h2>
            <form onSubmit={login ? onLogin : onRegister}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" placeholder="Enter a username" ref ={usernameRef} id="username" required/>

                    {login?"":
                        <><label htmlFor="email">Email:</label>
                        <input type="text" placeholder="Enter a valid email address" ref={emailRef} id="email" required/></>
                    }

                    <label htmlFor="password">Password:</label>
                    <input type="password" placeholder="Enter a password" ref={passwordRef} id="password" required/>
                    <label>{error? error: ""}</label>
                    <button type="submit">{login?"Log in":"Register"}</button>
                </div>
            </form>
            <a  onClick={() => setLogin(!login)}>{login?"Register": "Login"}</a>
            </div>
        </>
    );
}
