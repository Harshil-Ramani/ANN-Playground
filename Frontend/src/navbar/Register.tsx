import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom";
import { getContext } from "../Context.tsx";
import "./register.css";

function Register()
{
    let {userInfo,updateUserInfo} = getContext("userInfo");
    let navigate=useNavigate();

    async function registerHandle(event)
    {
        event.preventDefault();
        let token = localStorage.getItem('token');
        let storedToken;
        if(token!=='undefined')storedToken={"Authorization":`Bearer ${token}`};
        let formData=new FormData(event.target);
        let userData={
            userName:formData.get('userName'),
            email:formData.get('email'),
            password:formData.get('password')
        }
        fetch('http://localhost:3000/user/register',{
            method: "POST",
            headers: {
                "Content-Type":'application/json',
                ...storedToken
            },
            body: JSON.stringify(userData)
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            if(data.error){
                alert(data.error);
            }
            else {
                localStorage.setItem('token',data.token);
                updateUserInfo(data.userInfo);
                navigate('/');
            }
        });
    }

    return (
        <>
            <div className="overLay"></div>
            <div id='register'>
                <form onSubmit={registerHandle}>
                    <p className="text">Username:</p> <input type="text" name="userName"/>
                    <p className="text">Email:</p> <input type="email" name="email"/>
                    <p className="text">Password:</p> <input type="password" name="password"/>
                    <button type="submit" className="button userButton" >Register</button>
                </form>
                <Link to="/"> <button type="button" className="close"><span>&times;</span></button></Link>
            </div>
        </>
    )
}

export default Register;