import Navbar from "./navbar/Navbar.tsx";
import Body from "./body/Body.tsx";
import { ContextProvider } from "./Context.tsx";
import { useState, useEffect ,useRef } from "react";

function App() {
  let [userInfo,updateUserInfo]=useState(null);
  let [isLoding,updateIsLoding]=useState(true);
  let parameters=useRef(null);
  let datasets=useRef(null);
  let currentDataset=useRef(null);
  let lastStatus=useRef(null);

  let [windowResize, updateWindowResize]=useState({ height: window.innerHeight, width: window.innerWidth });
  function handleWindowSize() {
      updateWindowResize({ height: window.innerHeight, width: window.innerWidth});
      let fontSize=window.innerWidth/105.5;
      document.documentElement.style.fontSize = `${fontSize}px`;
  }
  useEffect(()=>{
      let fontSize=window.innerWidth/105.5;
      document.documentElement.style.fontSize = `${fontSize}px`;
      window.addEventListener('resize', handleWindowSize);
  },[]);

  useEffect(()=>{
    if(isLoding===false){
      return;
    }
    let token = localStorage.getItem('token');
    let storedToken;
    if(token!=='undefined'){
      storedToken={"Authorization":`Bearer ${token}`}
    };
    fetch('http://localhost:3000/fetch/user',{
        method: "GET",
        headers: {
            "Content-Type":'application/json',
            ...storedToken
        },
    }).then((res)=>{
        return res.json();
    }).then((data)=>{

        let user=data.user;
        let token=data.token;
        localStorage.setItem('token',token);

        let newUserInfo={userName:user.userName,isGuest:user.isGuest};
        parameters.current=user.lastStatus.parameters;
        datasets.current=user.datasets;
        currentDataset.current=user.lastStatus.currentDataset;
        lastStatus.current=user.lastStatus;

        updateUserInfo(newUserInfo);
        updateIsLoding(false);
    });
  },[isLoding]);

  if(isLoding){
    return(
      <>
        <h1>Loding</h1>
      </>
    )
  }
  
  return (
      <>
        <ContextProvider value={{windowResize,updateWindowResize}} name="windowResize">
          <ContextProvider value={{isLoding,updateIsLoding}} name="isLoding">
            <ContextProvider value={{userInfo,updateUserInfo}} name="userInfo">

              <Navbar></Navbar>

              <ContextProvider value={datasets.current} name="datasets">
              <ContextProvider value={currentDataset.current} name="currentDataset">
              <ContextProvider value={lastStatus.current} name="lastStatus">
                  <Body parameters={parameters.current}> </Body>
              </ContextProvider>
              </ContextProvider>
              </ContextProvider>

            </ContextProvider>
          </ContextProvider>
        </ContextProvider>
      </>
  );
}

export default App;
