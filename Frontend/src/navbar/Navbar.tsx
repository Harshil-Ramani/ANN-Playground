import { getContext } from "../Context.tsx";
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Login from './Login.tsx';
import Register from "./Register.tsx";
import "./Navbar.css";

function Navbar()
{
    let {userInfo,updateUserInfo} = getContext("userInfo");
    let {isLoding,updateIsLoding} = getContext("isLoding");

    let login=null,register=null,logout=null,userName=null;

    if(userInfo.isGuest)
    {
        login=<Link to="/login"><button className="btn btn-outline-success navItem userButton">Login</button></Link>
        register=<Link to="/register"><button className="btn btn-outline-success navItem userButton">Register</button></Link>
    }
    if(!userInfo.isGuest)
    {
        userName= <p className="navItem profile">{userInfo.userName}</p>
        logout=<button className="button userButton" onClick={logoutHandle}>Logout</button>
    }

    async function logoutHandle()
    {
        let token = localStorage.getItem('token');
        let storedToken;
        if(token!=='undefined')storedToken={"Authorization":`Bearer ${token}`};
        fetch('http://localhost:3000/user/logout',{
            method: "GET",
            headers: {
                "Content-Type":'application/json',
                ...storedToken
            },
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
                localStorage.setItem('token',data.token);
                updateIsLoding(true);
        });
    }

    return (
        <>
            <nav className="navbar">
            <div className="container-fluid">
                <div id="title">ANN Playground</div>
                <div id="quote">Dive In and Explore. Neural Networks at Your Fingertips!</div>
                <div className="flexBox">
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login/>}></Route>
                            <Route path="/register" element={<Register/>}></Route>
                            <Route path="/" element={null}></Route>
                        </Routes>
                        {userName}
                        {login}
                        {register}
                        {logout}
                    </Router>
                </div>
            </div>
            </nav>
        </>
    )
}

export default Navbar;