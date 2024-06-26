import { useEffect, useState , useCallback, useRef } from "react";
import { getContext } from "./../Context.tsx";
import DatasetItem from "./DatasetItem.tsx";
import "./Dataset.css";

function Dataset()
{
    let datasetsContext = getContext('datasets');
    let [datasets,updateDatasets] = useState(datasetsContext);

    let {currentDataset,updateCurrentDataset} = getContext('currentDatasetState');

    let modelData=getContext('modelData');
    let updateWeights=modelData.updateWeights;
    let updateTrainTest=modelData.updateTrainTest;
    let layers=modelData.layers;
    let updateLayers=modelData.updateLayers;
    let updateEpochCount=modelData.updateEpochCount;

    let {playStatus,updatePlayStatus} = getContext('playStatus');

    let {features,updateFeatures}=getContext('features');
    let {splitRatio,updateSplitRatio}=getContext('splitRatio');
    let {learningRate,updateLearningRate}=getContext('learningRate');

    let stopStep=getContext('stopStep');

    let handleDatasetSelect = useCallback((datasetId) =>{
        stopStep.current=true;
        let parameters={...features,splitRatio,learningRate};
        let token = localStorage.getItem('token');
        let storedToken;
        if(token!=='undefined'){
            storedToken={"Authorization":`Bearer ${token}`}
        };
        fetch(`http://localhost:3000/dataset/change`,{
            method: "POST",
            headers: {
                "Content-Type":'application/json',
                ...storedToken
            },
            body: JSON.stringify({datasetId:datasetId,layers:layers,parameters:parameters})
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            let token = data.token;
            localStorage.setItem('token',token);
            let lastStatus=data.lastStatus;
            updateLayers({numberOfLayers:lastStatus.numberOfLayers,layers:lastStatus.layers});
            updateTrainTest(lastStatus.trainTest);
            updateWeights({weights:lastStatus.weights,biases:lastStatus.biases});
            updateEpochCount(lastStatus.epochCount);
            updatePlayStatus(0);
        });
        updateCurrentDataset(datasetId);
    },[updateCurrentDataset,updateLayers,updateTrainTest,updateWeights,updateEpochCount,updatePlayStatus,layers,stopStep]);

    let handleDeleteClick = useCallback((datasetId)=>{
        stopStep.current=true;
        let token = localStorage.getItem('token');
        let storedToken;
        if(token!=='undefined')storedToken={"Authorization":`Bearer ${token}`};
    
        fetch('http://localhost:3000/dataset/delete',{
            method: "DELETE",
            headers: {
                "Content-Type":'application/json',
                ...storedToken
            },
            body: JSON.stringify({datasetId:datasetId,isCurrentDataset:datasetId===currentDataset})
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            if(data.error){
                alert(data.error);
            }
            else {
                localStorage.setItem('token',data.token);
                updateDatasets(data.datasets);
                if(data.currentDataset!=undefined)handleDatasetSelect(data.currentDataset);
            }
        });
    },[updateDatasets,handleDatasetSelect,currentDataset,stopStep]);

    function storeDatasetApi(dataset)
    {
        let token = localStorage.getItem('token');
        let storedToken;
        if(token!=='undefined')storedToken={"Authorization":`Bearer ${token}`};

        fetch('http://localhost:3000/dataset/upload',{
            method: "POST",
            headers: {
                "Content-Type":'application/json',
                ...storedToken
            },
            body: JSON.stringify({dataset})
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            if(data.error!=undefined)
            {
                alert(data.error);
                return;
            }
            let token=data.token;
            localStorage.setItem('token',data.token);

            let newDatasets=data.datasets;
            let newCurrentDatasetId=data.currentDatasetId;
            updateDatasets(newDatasets);
            updateCurrentDataset(newCurrentDatasetId);
            handleDatasetSelect(newCurrentDatasetId);
        });
    }

    function storeDataset(fileName,fileData)
    {
        let rows = fileData.trim().split('\n').map(row => row.trim().replace(/\r$/, ''));
        let headers = rows[0].split(',').map(header => header.trim());

        let data = rows.slice(1).map(row => {
            let values = row.split(',');
            let obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index];
            });
            return obj;
        });
        let minimum=1e10;
        let maximum=-1e10;
        for(let dataPoint of data) {
            minimum=Math.min(minimum,dataPoint.x1,dataPoint.x2);
            maximum=Math.max(maximum,dataPoint.x1,dataPoint.x2);
        }
        for(let dataPoint of data) {
            dataPoint.x1=(dataPoint.x1-minimum)/(maximum-minimum)*(4)+(-2);
            dataPoint.x2=(dataPoint.x2-minimum)/(maximum-minimum)*(4)+(-2);
        }
        let dataset={
            name:fileName,
            type:0,
            dataPoints:data
        };
        storeDatasetApi(dataset);
    }

    function handleUpload()
    {
        let inputFileElement=document.getElementById("upload");
        let file=inputFileElement.files[0];
        if(file===undefined)
        {
            return;
        }
        let fileName= file.name.replace(/\.csv$/,'');

        let reader= new FileReader();
        reader.onload=(event)=>{
            let fileData=event.target.result;
            storeDataset(fileName,fileData);
            inputFileElement.value = "";
        }
        reader.readAsText(file);    
    }

    function handleSelectFile(){
        stopStep.current=true;
        let inputFileElement=document.getElementById("upload");
        inputFileElement.click();
    }

    return (
        <div className="datasets">
            <div className="uploadBox">
                <input id="upload" type="file" accept=".csv" onChange={handleUpload} />
                <button className="uploadButton button" onClick={handleSelectFile}>Upload Dataset</button>
            </div>
            <div className="datasetBox">
                {datasets.map((datasetId)=>{
                    return <DatasetItem key={datasetId} 
                        datasetId={datasetId} 
                        isCurrentDataset={currentDataset === datasetId} 
                        handleDatasetSelect = {handleDatasetSelect}
                        handleDeleteClick = {handleDeleteClick} ></DatasetItem>
                })}
            </div>
        </div>
    )
}

export default Dataset;
