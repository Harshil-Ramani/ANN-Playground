const database=require('../database.js');
const fs=require('fs');

function defaultParameters()
{
    let parameters = {
        learningRate: 0.05,
        regularizationType: 0,
        regularizationRate: 0,
        splitRatio: 80,
        batchSize: 10
    };
    return parameters;
}

async function setDefault() {
    let defaults=fs.readFileSync('defaultDatasets.json','utf8');
    defaults=JSON.parse(defaults);
    let parameters=defaultParameters();
    let newUser ={
        datasets : defaults.datasets,
        lastStatus : await updateParameters(defaults.default , parameters)
    } 
   return newUser;
}

const shuffleArray = (array)=>{
    for(let i=array.length-1 ; i>=0 ; i--){
        let j=Math.floor(Math.random() * (i+1));
        [array[i] , array[j]] = [array[j] , array[i]];
    }
} 

async function updateParameters(datasetId, parameters, layers) {
    let datasetModel = database.dataset;
    let dataset = await datasetModel.findById(datasetId);

    let numberOfDataPoints = dataset.dataPoints.length;
    let splitRatio = parameters.splitRatio;
    trainTest=calculateTrainTest(splitRatio,numberOfDataPoints);

    shuffleArray(trainTest);

    let uniqueLabels = new Set();
    for(dataPoint of dataset.dataPoints){
        uniqueLabels.add(dataPoint.label);
    }

    let numberOfUniqueLabels = uniqueLabels.size;
    let numberOfLayers = 3;
    let newLayers = [
        {
           numberOfNeurons : 2,
           activation : 0
        },
        {
            numberOfNeurons : 3,
            activation : 0
        },
        {
            numberOfNeurons : numberOfUniqueLabels,
            activation : 0
        }
    ]

    if(layers){
        newLayers=[];
        for(let layer of layers.layers) {
            newLayers.push({numberOfNeurons:layer.numberOfNeurons,activation:layer.activation});
        }
        newLayers[layers.numberOfLayers-1].numberOfNeurons=numberOfUniqueLabels;
        numberOfLayers=layers.numberOfLayers;
    }

    let {weights,biases} = await assignWeights(numberOfLayers,newLayers);

    let lastStatus = {
        trainTest : trainTest,
        currentDataset : datasetId,
        numberOfLayers : numberOfLayers,
        layers : newLayers , 
        parameters : parameters,
        weights : weights,
        biases : biases,
        epochCount : 0
    }

    return lastStatus;
}

async function assignWeights(numberOfLayers,layers)
{
    let weights = [],biases = [];
    for(let i=0 ; i<numberOfLayers-1 ; i++) {
        let currentLayerNeurons = layers[i].numberOfNeurons;
        weights[i] = new Array(currentLayerNeurons);
        for(let j=0 ; j<currentLayerNeurons ; j++){

            let nextLayerNeurons = layers[i+1].numberOfNeurons;
            weights[i][j] = new Array(nextLayerNeurons);
            for(let k=0 ; k<nextLayerNeurons ; k++) {
                weights[i][j][k]= Math.random();
            }
        }
    }

    for(let i=1 ; i<numberOfLayers;i++)
    {
        let currentLayerNeurons = layers[i].numberOfNeurons;
        biases[i]=new Array(currentLayerNeurons);
        for(let j=0;j<currentLayerNeurons;j++)
        {
            biases[i][j]=Math.random();
        }
    }
    return {weights:weights,biases:biases};
}

function calculateTrainTest(splitRatio,numberOfDataPoints)
{
    let numberOfTrainDataPoints = Math.ceil(numberOfDataPoints*splitRatio/100);
    let trainTest = new Array(numberOfDataPoints).fill(0);
    trainTest = trainTest.map((x, ind)=>{
        let change = 0;
        if(ind < numberOfTrainDataPoints){
            change = 1;
        }
        return change;
    })

    shuffleArray(trainTest);
    return trainTest;
}

module.exports = {
    setDefault:setDefault,
    updateParameters:updateParameters,
    assignWeights:assignWeights,
    calculateTrainTest:calculateTrainTest,
    defaultParameters:defaultParameters
};