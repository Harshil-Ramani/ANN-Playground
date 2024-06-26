import { BrowserRouter as Router, Routes, Route, Link,useNavigate} from "react-router-dom";
import { getContext } from "../Context.tsx";
import './login.css';

function Login()
{
    let {userInfo,updateUserInfo} = getContext("userInfo");
    let {isLoding,updateIsLoding} = getContext("isLoding");
    let navigate=useNavigate();

    async function loginHandle(event)
    {
        event.preventDefault();
        let token = localStorage.getItem('token');
        let storedToken;
        if(token!=='undefined')storedToken={"Authorization":`Bearer ${token}`};
        let formData=new FormData(event.target);
        let userData={
            userNameOrEmail:formData.get('userNameOrEmail'),
            password:formData.get('password')
        }
        fetch('http://localhost:3000/user/login',{
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
                updateIsLoding(true);
                navigate('/');
            }
        });
    }

    return (
        <>
            <div className="overLay"></div>
            <div id='login'>
                <form onSubmit={loginHandle}>
                    <p className="text">Username/Email:</p><input type="text" name="userNameOrEmail" />
                    <p className="text">Password:</p><input type="password" name="password"/>
                    <button type="submit" className="button userButton">Login</button>
                </form>
                <Link to="/">
                    <button type="button" className="close"><span>&times;</span></button>
                </Link>
            </div>
        </>
    )
}

export default Login;