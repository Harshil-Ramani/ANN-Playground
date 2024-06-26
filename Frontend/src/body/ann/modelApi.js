import { useCallback } from 'react';

let handlePlus=async (layerIndex, layers, numberOfLayers)=>{
    let token = localStorage.getItem('token');
    let storedToken;
    if(token!=='undefined')storedToken={"Authorization":`Bearer ${token}`};
    let res=await fetch('http://localhost:3000/update/incrementNeuron',{
        method: "POST",
        headers: {
            "Content-Type":'application/json',
            ...storedToken
        },
        body: JSON.stringify({layerIndex,layers,numberOfLayers})
    });
    let data=await res.json();
    if(data.error){
        alert(data.error);
    }
    else {
        localStorage.setItem('token',data.token);
        return data.updates;
    }
};

let handleMinus=async (layerIndex,layers,numberOfLayers)=>{
    let token = localStorage.getItem('token');
    let storedToken;
    if(token!=='undefined')storedToken={"Authorization":`Bearer ${token}`};
    let res=await fetch('http://localhost:3000/update/decrementNeuron',{
        method: "POST",
        headers: {
            "Content-Type":'application/json',
            ...storedToken
        },
        body: JSON.stringify({layerIndex,layers,numberOfLayers})
    });
    let data=await res.json();
    if(data.error){
        alert(data.error);
    }
    else {
        localStorage.setItem('token',data.token);
        return data.updates;
    }
}

let handleLayerMinus=async(layers,numberOfLayers)=>{
    let token = localStorage.getItem('token');
    let storedToken;
    if(token!=='undefined')storedToken={"Authorization":`Bearer ${token}`};
    let res=await fetch('http://localhost:3000/update/decrementLayer',{
        method: "POST",
        headers: {
            "Content-Type":'application/json',
            ...storedToken
        },
        body: JSON.stringify({layers,numberOfLayers})
    });
    let data=await res.json();
    if(data.error){
        alert(data.error);
    }
    else {
        localStorage.setItem('token',data.token);
        return data.updates;
    }
}

let handleLayerPlus=async (layers,numberOfLayers)=>{
    let token = localStorage.getItem('token');
    let storedToken;
    if(token!=='undefined')storedToken={"Authorization":`Bearer ${token}`};
    let res=await fetch('http://localhost:3000/update/incrementLayer',{
        method: "POST",
        headers: {
            "Content-Type":'application/json',
            ...storedToken
        },
        body: JSON.stringify({layers,numberOfLayers})
    });
    let data=await res.json();
    if(data.error){
        alert(data.error);
    }
    else {
        localStorage.setItem('token',data.token);
        return data.updates;
    }
}

let handleActivationChange=async (layers,numberOfLayers,layerIndex,activation)=>{
    let token = localStorage.getItem('token');
    let storedToken;
    if(token!=='undefined')storedToken={"Authorization":`Bearer ${token}`};
    let res=await fetch('http://localhost:3000/update/activationChange',{
        method: "POST",
        headers: {
            "Content-Type":'application/json',
            ...storedToken
        },
        body: JSON.stringify({layers,numberOfLayers,layerIndex,activation})
    });
    let data=await res.json();
    if(data.error){
        alert(data.error);
    }
    else {
        localStorage.setItem('token',data.token);
        return data.lastStatus;
    }
}



export { handlePlus, handleMinus, handleLayerMinus, handleLayerPlus, handleActivationChange};