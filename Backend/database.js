const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/ANN_Visualizer';
mongoose.connect(uri).then(()=>{
    console.log("database connected!");
});

const datasetSchema = mongoose.Schema({
    name: String,
    type: Number,
    dataPoints: [{
        x1: Number,
        x2: Number,
        label: Number
    }]
});

const userSchema = mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    datasets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "dataset"
    }],
    lastStatus : {
        trainTest : [Number],
        currentDataset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "dataset"
        },
        numberOfLayers: Number,
        layers : [{
            numberOfNeurons: Number,
            activation: Number
        }],
        parameters : {
            learningRate: Number,
            regularizationType: Number,
            regularizationRate: Number,
            splitRatio: Number,
            batchSize: Number
        },
        weights : [[[Number]]],
        biases : [[Number]],
        epochCount: Number
    }
});

const user= mongoose.model("user",userSchema);
const dataset= mongoose.model("dataset",datasetSchema);

module.exports={
    user: user,
    dataset: dataset,
};