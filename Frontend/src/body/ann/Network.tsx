import "./Network.css";
import Layer from "./model/Layer";
import { getContext,ContextProvider } from "./../../Context.tsx";
import {forward,backword} from "./model/annLogic.js";
import { useState,useEffect,useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause,faStepForward, faRedo, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

function Network()
{
    let {userInfo,updateUserInfo}=getContext('userInfo');

    let modelData=getContext("modelData");
    let {currentDataset,updateCurrentDataset}=getContext('currentDatasetState');
    let {features,updateFeatures}=getContext('features');
    let {learningRate,updateLearningRate}=getContext('learningRate');
    let {splitRatio,updateSplitRatio}=getContext('splitRatio');
    let handle = getContext("handle");
    let stopStep=getContext('stopStep');
    let trainLossSum=getContext('trainLossSum');
    
    let {playStatus,updatePlayStatus}=getContext('playStatus');
    
    let neuronRef = getContext('neuronRef');

    neuronRef.current=[];
    for (let i=0 ;  i < modelData.layers.numberOfLayers ; i++)
    {
        neuronRef.current[i] = []; 
    }
    let [svgElement, updatesvgElement] = useState(null);
    
    let {windowResize,updateWindowResize}=getContext('windowResize');

    useEffect(()=>{

        let paths = (document.querySelectorAll('path'));
        // console.log(paths);
        if(!paths)
        {
            return;
        }
        let removePath = [];
        for(let path of paths)
        {
            let x1 = Number(path.getAttribute('x1'));
            let y1 = Number(path.getAttribute('y1'));
            let x2 = Number(path.getAttribute('x2'));
            let y2 = Number(path.getAttribute('y2'));
            let key = path.getAttribute('key');
            let weight = path.getAttribute('weight');
            if(!x1)
            {
               continue;
            }
            let mouseEnter =  ()=>{
                let ele = document.createElement('div');
                ele.classList.add("hoverCardWeights");
                ele.setAttribute('id', key);
                ele.innerHTML = 'Weight:&nbsp;'+ weight; 
                ele.style.top = ((y1+y2)/2 - 15) + 'px';
                ele.style.left = ((x1+x2)/2 - 20) + 'px';
                let network = document.getElementById('network');
                network.appendChild(ele);
            };
            let mouseLeave = ()=>{ 
                let ele = document.getElementById(key);
                let network = document.getElementById('network');
                network.removeChild(ele);
            }
            path.addEventListener('mouseenter' , mouseEnter);

            path.addEventListener('mouseleave' , mouseLeave);

            removePath.push([path,mouseEnter,mouseLeave]);
        }

        return ()=>{
            for(let ele of removePath)
            {
                ele[0].removeEventListener('mouseenter', ele[1]);
                ele[0].removeEventListener('mouseleave', ele[2]);
            }
        }
    },[modelData.layers,windowResize,modelData.weights,playStatus,svgElement]);

    useEffect(()=>{
        let paths = [];
        let hoverCard = [];
        let noOfLayers = modelData.layers.numberOfLayers;
        for(let i=0; i<noOfLayers-1; i++)
        {
           let cur = modelData.layers.layers[i].numberOfNeurons; 
           let next = modelData.layers.layers[i+1].numberOfNeurons;
           for(let k=0; k<next; k++)
           {
              for(let j=0; j<cur; j++)
              {
                let x1 = neuronRef.current[i][j].getBoundingClientRect().x + window.scrollX;
                let y1 = neuronRef.current[i][j].getBoundingClientRect().y + window.scrollY;
                let x2 = neuronRef.current[i+1][k].getBoundingClientRect().x + window.scrollX ;
                let y2 = neuronRef.current[i+1][k].getBoundingClientRect().y + window.scrollY;
                let height = neuronRef.current[i][j].getBoundingClientRect().height;
                let width  = neuronRef.current[i][j].getBoundingClientRect().width;
                
                let sourceX = x1 + width;
                let sourceY = y1 + height / 2;
                let sinkX = x2;
                let sinkY = y2 + height / (3*cur)*(j) + height/3;


                let controlPoint1X = (sinkX - sourceX)*40/100 + sourceX;
                let controlPoint1Y = (sinkY - sourceY)*0/100 + sourceY;
                let controlPoint2X = (sinkX - sourceX)*60/100 + sourceX;
                let controlPoint2Y = (sinkY - sourceY)*100/100 + sourceY;

                let weight=modelData.weights.weights[i][j][k];
                // let linkWidth=Math.min(Math.abs(weight*(1.5)),7.5);
                let linkWidth=Math.min(Math.abs(weight),5)*1.7+0.2;

                let color;
                if(weight<0) {
                    color=`rgba(220, 20, 60, ${linkWidth*0.6/6+0.4})`;
                }
                else {
                    color=`rgba(20, 52, 164, ${linkWidth*0.6/6+0.4})`;
                }

                let animation={};
                if(playStatus)animation={ animation: 'dash-animation 2.5s linear infinite' };
                 
               
                paths.push(
                    <path
                        d={`M ${sourceX} ${sourceY} C ${controlPoint1X} ${controlPoint1Y} ${controlPoint2X} ${controlPoint2Y} ${sinkX} ${sinkY}`}
                        stroke={color}
                        strokeWidth={linkWidth}
                        strokeDasharray="15,2.5"
                        style={animation}
                        fill="none"
                        key={`${i}${j}${k}0`}
                        className="orignalLink"
                    />
                );
                paths.push(
                    <path
                        d={`M ${sourceX} ${sourceY} C ${controlPoint1X} ${controlPoint1Y} ${controlPoint2X} ${controlPoint2Y} ${sinkX} ${sinkY}`}
                        x1 = {x1}
                        y1 = {y1}
                        x2 = {x2}
                        y2 = {y2}
                        weight = {modelData.weights.weights[i][j][k].toString().slice(0,5)}
                        stroke="blue"
                        strokeWidth="10"
                        fill="none"
                        key={`${i}${j}${k}1`}
                        className = "link"
                    />
                );
                // hoverCard.push(
                //     <div className="hoverCardWeights"
                //          key={`${i}${j}${k}2`} style={{top:y1 ,left:x1}}>
                //          {modelData.weights.weights[i][j][k].toString().slice(0,5)}
                //     </div>
                // );

                //  paths.push(<path d={`M ${x1 + width} ${y1 + (height / 2)} L ${x2 } ${y2 + (height / 2)}`} stroke="black" strokeWidth="1" key={""+i+j+k}/>);
              }
           }
        }
        let fullHeight=document.body.scrollHeight-2;
        let fullWidth=document.body.scrollWidth-2;
        updatesvgElement(
        <>
         <svg height={fullHeight} width={fullWidth} id="svg">
          {/* { <rect width="100%" height="100%" fill="none" stroke="blue" stroke-width="5"/>} */}
          {paths}
         </svg>
          {hoverCard}
        </>
        )
    },[modelData.layers,windowResize,modelData.weights,playStatus]);

    let epochCount=modelData.epochCount;
    let updateEpochCount=modelData.updateEpochCount;
    
    function handleStep()
    {
        if(epochCount==0)stopStep.current=false;
        if(stopStep.current)return;
        trainLossSum.current=0;
        let trainPoints=modelData.trainPoints;
        let layers=modelData.layers;
        let weights=modelData.weights;
        let updateWeights=modelData.updateWeights;
        let regularizationRate=features.regularizationRate;
        let regularizationType=features.regularizationType;
        let batchSize=features.batchSize;
        let tempWeights=JSON.parse(JSON.stringify(weights));
        for(let i=0;i<trainPoints.length;i+=batchSize)
        {
            let batchPoints=trainPoints.slice(i,Math.min(i+batchSize,trainPoints.length));
            tempWeights=backword(layers,tempWeights,batchPoints,learningRate,regularizationType,regularizationRate,trainLossSum);
        }
        // for(let i=0;i<trainPoints.length;i+=batchSize)
        // {
        //     let batchPoints=trainPoints.slice(i,Math.min(i+batchSize,trainPoints.length));
        //     let newWeights=backword(layers,weights,batchPoints,learningRate,regularizationType,regularizationRate);
        //     console.log('new',newWeights);
        //     await updateWeights(newWeights);
        // }
        // console.log("hello");

        let token = localStorage.getItem('token');
        let storedToken;
        if(token!=='undefined')storedToken={"Authorization":`Bearer ${token}`};
        if(!userInfo.isGuest)fetch('http://localhost:3000/update/weights',{
            method: "POST",
            headers: {
                "Content-Type":'application/json',
                ...storedToken
            },
            body: JSON.stringify({weights:tempWeights.weights,biases:tempWeights.biases,epochCount:epochCount})
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            if(data.error){
            }
            else {
                localStorage.setItem('token',data.token);
            }
        });
        updateWeights(tempWeights);
        updateEpochCount(epochCount+1);
    }
    useInterval(() => {
        handleStep();
    }, playStatus!=0 ? 150 : null);
    
    function handlePlayPause()
    {
        if(playStatus==0)
        {
            updatePlayStatus(1);
        }
        else
        {
            updatePlayStatus(0);
        }
    }
    function handleReset()
    {
        stopStep.current=true;
        let token = localStorage.getItem('token');
        let storedToken;
        if(token!=='undefined')storedToken={"Authorization":`Bearer ${token}`};
        fetch('http://localhost:3000/update/reset',{
            method: "POST",
            headers: {
                "Content-Type":'application/json',
                ...storedToken
            }
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            if(data.error){
                alert(data.error);
            }
            else {
                localStorage.setItem('token',data.token);
                let lastStatus=data.lastStatus;
                modelData.updateWeights({weights:lastStatus.weights,biases:lastStatus.biases});
                modelData.updateTrainTest(lastStatus.trainTest);
                modelData.updateLayers({numberOfLayers:lastStatus.numberOfLayers,layers:lastStatus.layers});
                updateCurrentDataset(lastStatus.currentDataset);
                updateSplitRatio(lastStatus.parameters.splitRatio);
                updateLearningRate(lastStatus.parameters.learningRate);
                let newFeatures={
                    regularizationType:lastStatus.parameters.regularizationType,
                    regularizationRate:lastStatus.parameters.regularizationRate,
                    batchSize:lastStatus.parameters.batchSize
                }
                updateEpochCount(0);
                updatePlayStatus(0);
                updateFeatures(newFeatures);
            }
        });
    }

    return (
        <div id='network'>
            <div id="top">
                <div id="playButtons">
                    <button onClick={handleReset} className="stepReset">
                        <FontAwesomeIcon  icon={faRedo} />
                    </button>
                    <button onClick={handlePlayPause} id="playPause">
                        <FontAwesomeIcon  icon={playStatus? faPause:faPlay } />
                    </button>
                    
                    <button onClick={handleStep} className="stepReset">
                        <FontAwesomeIcon  icon={faStepForward} />
                    </button>
                </div>

                <div id="epoch">
                 <p className="special">{epochCount}</p>
                </div>
                
                <div id="layerHandle">

                    <button className="plusMinus" onClick={handle.handleLayerPlus} >
                        <FontAwesomeIcon  icon={faPlus} />
                    </button>
                    <button className="plusMinus" onClick={handle.handleLayerMinus}>
                        <FontAwesomeIcon  icon={faMinus} />
                    </button>
                    <div id="hiddenLayers">
                        <p className="special">{modelData.layers.numberOfLayers-2}</p> 
                        <p className="text">HIDDEN LAYERS</p>
                    </div>
                </div>

            </div>

            <div id="layersContainer">
                {modelData.layers.layers.map((layer,ind)=>{
                    layer.numberOfLayers=modelData.layers.numberOfLayers;
                    layer.index=ind;
                    let biases=modelData.weights.biases[ind];
                    if(ind==0)biases=[0,0];
                    return <Layer layer={layer} biases={biases} key={ind}></Layer>;
                })}
            </div>
             
            {svgElement}
             
        </div>
    )
}


 
function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
 
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default Network;

