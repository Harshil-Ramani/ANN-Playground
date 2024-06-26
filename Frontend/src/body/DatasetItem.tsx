import { useEffect, useState , useRef } from "react";
import "./DatasetItem.css";
import React from "react";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";

function DatasetItem(props)
{
    let [isDatasetLoding , updateIsDatasetLoding] = useState(true);
    let dataset=useRef(null);
    let datasetId = props.datasetId;
    let [deleteDatasetButton,updateDeleteDatasetButton]=useState(false);
    let canvasRef = useRef(null);
    useEffect(() => {
        let canvas = canvasRef.current;
        if(!canvas || !dataset.current ) return;
        let ctx = canvas.getContext('2d');
        let canvasStyle = getComputedStyle(canvas);
        canvas.width = parseFloat(canvasStyle.width);
        canvas.height = parseFloat(canvasStyle.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let points = JSON.parse(JSON.stringify(dataset.current.dataPoints));
        let max = 0, min=1e18;
        let colors = ['red','blue','black','green','yellow'];
        points.forEach(point => {
             max = Math.max(point.x1, point.x2, max)
             min = Math.min(point.x1, point.x2, min)
        });
        let dif = max - min ;
        dif = 0.2*(dif);
        min = min - dif;
        max = max + dif;
        points.forEach(point => {
           point.x1=((point.x1-min)/(max-min))*(canvas.height);
           point.x2=((point.x2-min)/(max-min))*(canvas.height);
        });
        let radius=canvas.height*0.7/56;
        points.forEach(point => {
          ctx.fillStyle = colors[point.label];
          ctx.beginPath();
          ctx.arc(point.x1, point.x2, radius, 0, Math.PI*2 );
          ctx.fill();
        });
    });

    useEffect(()=>{
        let token = localStorage.getItem('token');
        let storedToken;
        if(token!=='undefined'){
        storedToken={"Authorization":`Bearer ${token}`}
        };
        fetch(`http://localhost:3000/fetch/dataset?datasetId=${datasetId}`,{
            method: "GET",
            headers: {
                "Content-Type":'application/json',
                ...storedToken
            }
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            let token = data.token;
            localStorage.setItem('token',token);
            dataset.current = data.dataset;
            // console.log(dataset.current.dataPoints);
            updateIsDatasetLoding(false);
        });
    }, []); 

    function handleDeleteClick(event)
    {
        event.stopPropagation();
        props.handleDeleteClick(datasetId);
    }
   
    if(isDatasetLoding){
        return (
            <div>
                Loding...
            </div>
        )
    }

    let datasetType = dataset.current.type===0 ? ' userDataset ' : ' defaultDataset ';
    let isCurrentDataset = props.isCurrentDataset ? ' current ' : ' ';




    return (
        <div className={"datasetItem"}
                onClick={()=>{props.handleDatasetSelect(datasetId)}} 
                onMouseEnter={()=>{updateDeleteDatasetButton(true)}}
                onMouseLeave={()=>{updateDeleteDatasetButton(false)}} >
            {dataset.current.type===0 && deleteDatasetButton && (<button className="deleteButton" onClick={handleDeleteClick}><span>&times;</span></button>)}
            <div className={"icon"+ (isCurrentDataset)+(datasetType)}> 
                <canvas ref={canvasRef} id="canvasBox"/>
            </div>
            <div className="datasetName">{dataset.current.name} </div>
        </div>
    )
}

export default DatasetItem;
