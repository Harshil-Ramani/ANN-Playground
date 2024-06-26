import Graph from './Graph.tsx';
import Network from './Network.tsx';
import './Ann.css';
import { getContext,ContextProvider } from '../../Context.tsx';
import { useState, useRef ,useCallback, useEffect } from 'react';
import {handlePlus,handleMinus,handleLayerPlus,handleLayerMinus,handleActivationChange} from "./modelApi.js";
import { shuffle } from 'lodash';

function Ann()
{
    let lastStatus=getContext('lastStatus');
    let modelData=getContext('modelData');
    let weights=modelData.weights;
    let updateWeights=modelData.updateWeights;
    let trainTest=modelData.trainTest;
    let updateTrainTest=modelData.updateTrainTest;
    let layers=modelData.layers;
    let updateLayers=modelData.updateLayers;
    let trainPoints=modelData.trainPoints;
    let updateTrainPoints=modelData.updateTrainPoints;
    let testPoints=modelData.layers;
    let updateTestPoints=modelData.updateTestPoints;
    let epochCount=modelData.epochCount;
    let updateEpochCount=modelData.updateEpochCount;

    let trainLossSum=useRef(0);
    let testLossSum=useRef(0);

    let neuronRef = useRef([]);

    let {currentDataset,updateCurrentDataset}=getContext('currentDatasetState');

    let {playStatus,updatePlayStatus}=getContext('playStatus');

    let stopStep=getContext('stopStep');

    useEffect(()=>{
        let token = localStorage.getItem('token');
        let storedToken;
        if(token!=='undefined'){
            storedToken={"Authorization":`Bearer ${token}`}
        };
        fetch(`http://localhost:3000/fetch/dataset?datasetId=${currentDataset}`,{
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
            let dataPoints=data.dataset.dataPoints;
            let trainPointsTemp=[];
            let testPointsTemp=[];
            // console.log("trainytest",trainTest);
            for(let i=0;i<dataPoints.length;i++)
            {
                if(trainTest[i]==1){trainPointsTemp.push(dataPoints[i])
                    // console.log("traintest",i);
                }
                else testPointsTemp.push(dataPoints[i]);
            }
            trainPointsTemp = shuffle(trainPointsTemp);
            // console.log(trainPointsTemp);

            updateTestPoints(testPointsTemp);
            updateTrainPoints(trainPointsTemp);
            // console.log(trainPointsTemp);
        });
    },[currentDataset,trainTest]);

    let handlePlusCB=useCallback((layerIndex)=>{
        if(layers.layers[layerIndex].numberOfNeurons==8)return;
        handlePlus(layerIndex,layers.layers,layers.numberOfLayers).then((updates)=>{
            stopStep.current=true;
            updatePlayStatus(0);
            updateWeights({weights:updates.weights,biases:updates.biases});
            updateLayers({numberOfLayers:layers.numberOfLayers,layers:updates.layers});
            updateEpochCount(updates.epochCount);
        });
    },[updateWeights,updateLayers,updateEpochCount,updatePlayStatus,layers,stopStep]);

    let handleMinusCB=useCallback((layerIndex)=>{
        handleMinus(layerIndex,layers.layers,layers.numberOfLayers).then((updates)=>{
            stopStep.current=true;
            updateWeights({weights:updates.weights,biases:updates.biases});
            updateLayers({numberOfLayers:layers.numberOfLayers,layers:updates.layers});
            updateEpochCount(updates.epochCount);
            updatePlayStatus(0);
        });
    },[updateWeights,updateLayers,updateEpochCount,updatePlayStatus,layers]);

    let handleLayerMinusCB=useCallback(()=>{
        handleLayerMinus(layers.layers,layers.numberOfLayers).then((updates)=>{
            stopStep.current=true;
            updateWeights({weights:updates.weights,biases:updates.biases});
            updateLayers({numberOfLayers:updates.numberOfLayers,layers:updates.layers});
            updateEpochCount(updates.epochCount);
            updatePlayStatus(0);
        });
    },[updateWeights,updateLayers,updateEpochCount,updatePlayStatus,layers]);

    let handleLayerPlusCB=useCallback(()=>{
        if(layers.numberOfLayers-2==8)return;
        handleLayerPlus(layers.layers,layers.numberOfLayers).then((updates)=>{
            stopStep.current=true;
            updateWeights({weights:updates.weights,biases:updates.biases});
            updateLayers({numberOfLayers:updates.numberOfLayers,layers:updates.layers});
            updateEpochCount(updates.epochCount);
            updatePlayStatus(0);
        });
    },[updateWeights,updateLayers,updateEpochCount,updatePlayStatus,layers]);

    let handleActivationChangeCB=useCallback((layerIndex,activation)=>{
        handleActivationChange(layers.layers,layers.numberOfLayers,layerIndex,activation).then((lastStatus)=>{
            stopStep.current=true;
            updateWeights({weights:lastStatus.weights,biases:lastStatus.biases});
            updateLayers({numberOfLayers:layers.numberOfLayers,layers:lastStatus.layers});
            updateEpochCount(lastStatus.epochCount);
            updatePlayStatus(0);
        });
    },[updateWeights,updateLayers,updateEpochCount,updatePlayStatus,layers]);
   
    return (
        <>
            <div id='ann'>
                    <ContextProvider value={neuronRef} name="neuronRef">
                    <ContextProvider value={trainLossSum} name="trainLossSum">
                    <ContextProvider value={testLossSum} name="testLossSum">
                    <ContextProvider value={{
                        handlePlus:handlePlusCB,
                        handleMinus:handleMinusCB,
                        handleLayerPlus:handleLayerPlusCB,
                        handleLayerMinus:handleLayerMinusCB,
                        handleActivationChange:handleActivationChangeCB
                    }} name="handle">
                    <ContextProvider value={stopStep} name="stopStep">
                        <Network></Network>
                    </ContextProvider>
                    </ContextProvider>
                    <Graph></Graph>
                    </ContextProvider>
                    </ContextProvider>
                    </ContextProvider>
            </div>
        </>
    )
}

export default Ann;
