import { useParams } from "react-router-dom";
import { getContext } from "./../Context.tsx";
import "./Features.css";

function Features()
{
    let {features,updateFeatures} = getContext('features');
    let {learningRate,updateLearningRate} = getContext('learningRate');
    let {splitRatio,updateSplitRatio} = getContext('splitRatio');
    let {userInfo,updateUserInfo} = getContext('userInfo');

    let modelData=getContext('modelData');
    let {playStatus,updatePlayStatus} = getContext('playStatus');

    let {currentDataset,updateCurrentDataset}=getContext('currentDatasetState');

    let stopStep=getContext('stopStep');

    let selectSameDataset=(datasetId) =>{
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
            body: JSON.stringify({datasetId:datasetId,layers:modelData.layers,parameters:parameters})
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            let token = data.token;
            localStorage.setItem('token',token);
            let lastStatus=data.lastStatus;
            modelData.updateLayers({numberOfLayers:lastStatus.numberOfLayers,layers:lastStatus.layers});
            modelData.updateTrainTest(lastStatus.trainTest);
            modelData.updateWeights({weights:lastStatus.weights,biases:lastStatus.biases});
            modelData.updateEpochCount(lastStatus.epochCount);
            updatePlayStatus(0);
        });
    };

    function updateParameters(parameters){
        let token = localStorage.getItem('token');
        let storedToken;
        if(token!=='undefined'){
        storedToken={"Authorization":`Bearer ${token}`}
        };
        fetch('http://localhost:3000/update/params',{
            method: "POST",
            headers: {
                "Content-Type":'application/json',
                ...storedToken
            },
            body: JSON.stringify({parameters:parameters,currentDataset:currentDataset})
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            let newParams=data.parameters;
            if(newParams.trainTest)modelData.updateTrainTest(newParams.trainTest);
            let token=data.token;
            localStorage.setItem('token',token);
        });
    }

    function handleBatchsize(event)
    {
        stopStep.current=true;
        let newFeatures={
            ...features
        };
        newFeatures.batchSize=Number(event.target.value);
        updateFeatures(newFeatures);
        selectSameDataset(currentDataset);
        let parameters={
            ...newFeatures,
            learningRate:learningRate,
            splitRatio:splitRatio
        }
        updateParameters(parameters);
    }
    function handleRegularizationType(event)
    {
        stopStep.current=true;
        let newFeatures={
            ...features
        };
        newFeatures.regularizationType=event.target.value;
        updateFeatures(newFeatures);
        selectSameDataset(currentDataset);
        let parameters={
            ...newFeatures,
            learningRate:learningRate,
            splitRatio:splitRatio
        }
        updateParameters(parameters);
    }
    function handleRegularizationRate(event)
    {
        stopStep.current=true;
        let newFeatures={
            ...features
        };
        newFeatures.regularizationRate=Number(event.target.value);
        updateFeatures(newFeatures);
        selectSameDataset(currentDataset);
        let parameters={
            ...newFeatures,
            learningRate:learningRate,
            splitRatio:splitRatio
        }
        updateParameters(parameters);
    }
    function handleLearningRate(event)
    {
        let newLearningRate=Number(event.target.value);
        updateLearningRate(newLearningRate);
        let parameters={
            ...features,
            learningRate:newLearningRate,
            splitRatio:splitRatio
        }
        if(userInfo.isGuest==false)updateParameters(parameters);
    }
    function handleSplitRatio(event)
    {
        stopStep.current=true;
        let newSplitRatio=Number(event.target.value);
        updateSplitRatio(newSplitRatio);
        selectSameDataset(currentDataset);
        let parameters={
            ...features,
            learningRate:learningRate,
            splitRatio:newSplitRatio
        }
        updateParameters(parameters);
    }

    let batchSize=features.batchSize;
    let regularizationRate=features.regularizationRate;
    let regularizationType=features.regularizationType;

    return (
        <div className="features">
            <div className="d-flex mainBox" >

                <div className="custom-input">
                    <span className="label">Batch Size</span>
                    <input onChange={handleBatchsize} type="number" className="form-control" value={batchSize} aria-describedby="basic-addon1"></input>
                </div>
                
                <div className="custom-select">
                    <span className="label">Learning Rate</span>
                    <div className="sel">
                        <select value={learningRate} onChange={handleLearningRate}className= "selectBox" aria-label="Default select example">
                            <option value={0.01}>0.01</option>
                            <option value={0.05}>0.05</option>
                            <option value={0.1}>0.1</option>
                            <option value={0.5}>0.5</option>
                            <option value={0.8}>0.8</option>
                            <option value={1}>1</option>
                        </select>
                    </div>
                </div>

                <div className="custom-select">
                    <span className="label">Regularization Type</span>
                    <div className="sel">
                        <select value={regularizationType} onChange={handleRegularizationType}className= "selectBox" aria-label="Default select example">
                            <option value="0">No regularization</option>
                            <option value="1">L1</option>
                            <option value="2">L2</option>
                        </select>
                    </div>
                </div>

                <div className="custom-select">
                    <span className="label">Regularization Rate</span>
                    <div className="sel">
                        <select value={regularizationRate} onChange={handleRegularizationRate}className= "selectBox" aria-label="Default select example">
                            <option value="0.01">0.01</option>
                            <option value="0.05">0.05</option>
                            <option value="0.1">0.1</option>
                            <option value="0.5">0.5</option>
                            <option value="0.8">0.8</option>
                            <option value="1">1</option>
                        </select>
                    </div>
                </div>

                <div className="custom-select">
                    <span className="label">Split Ratio</span>
                    <input onChange={handleSplitRatio} value={splitRatio} type="range" className="slide" min="1" max="99" id="range"></input>
                </div>
            
            </div>
        </div>
    )
}

export default Features;
