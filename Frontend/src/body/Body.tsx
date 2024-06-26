import Features from './Features.tsx';
import Dataset from './Dataset.tsx';
import Ann from './ann/Ann.tsx';
import { useEffect, useState, useRef } from "react";
import { ContextProvider,getContext } from "./../Context.tsx";
import "./Body.css";

function Body(props)
{
    let newFeatures = {
        batchSize: props.parameters.batchSize,
        regularizationType: props.parameters.regularizationType,
        regularizationRate: props.parameters.regularizationRate,
    };
    let [features,updateFeatures] = useState(newFeatures);
    let [learningRate,updateLearningRate] = useState(props.parameters.learningRate);
    let [splitRatio,updateSplitRatio] = useState(props.parameters.splitRatio);

    let currentDatasetContext=getContext('currentDataset');
    let [currentDataset,updateCurrentDataset] = useState(currentDatasetContext);

    let lastStatus=getContext('lastStatus');
    let [weights,updateWeights]=useState({weights:lastStatus.weights,biases:lastStatus.biases});
    let [trainTest,updateTrainTest]=useState(lastStatus.trainTest);
    let [layers,updateLayers]=useState({numberOfLayers:lastStatus.numberOfLayers,layers:lastStatus.layers});
    let [trainPoints,updateTrainPoints]=useState(null);
    let [testPoints,updateTestPoints]=useState(null);
    let [epochCount,updateEpochCount]=useState(lastStatus.epochCount);

    let [playStatus,updatePlayStatus] = useState(0);

    let stopStep=useRef(false);

    return (
        <>  <ContextProvider value={{weights:weights,
                updateWeights:updateWeights,
                trainTest:trainTest,
                updateTrainTest:updateTrainTest,
                layers:layers,
                updateLayers:updateLayers,
                trainPoints:trainPoints,
                updateTrainPoints:updateTrainPoints,
                testPoints:testPoints,
                updateTestPoints:updateTestPoints,
                epochCount:epochCount,
                updateEpochCount:updateEpochCount
            }} name="modelData">
            <ContextProvider value={{playStatus,updatePlayStatus}} name="playStatus">
            <ContextProvider value={{currentDataset,updateCurrentDataset}} name="currentDatasetState">
            <ContextProvider value={{features,updateFeatures}} name="features">
            <ContextProvider value={{learningRate,updateLearningRate}} name="learningRate">
            <ContextProvider value={{splitRatio,updateSplitRatio}} name="splitRatio">
            <ContextProvider value={stopStep} name="stopStep">
                <Features></Features>
                <div id="body">
                    <Dataset></Dataset>
                    <Ann></Ann>
                </div>
            </ContextProvider>
            </ContextProvider>
            </ContextProvider>
            </ContextProvider>
            </ContextProvider>
            </ContextProvider>
            </ContextProvider>
        </>
    )
}

export default Body;
