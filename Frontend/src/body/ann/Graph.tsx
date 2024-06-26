import { useEffect, useRef, useState } from "react";
import { getContext } from "../../Context";
import "./Graph.css";
import {forward,backword} from "./model/annLogic.js";

function Graph()
{
    let modelData = getContext("modelData");
    let canvasRef = useRef(null);
    let selectRef = useRef(null); 
    let [circlesList,updateCirclesList]=useState(null);
    let [selectMode,updateSelectMode]=useState(0);
    let trainLossSum=getContext('trainLossSum');
    let testLossSum=getContext('testLossSum');
    let neuronRef=getContext('neuronRef');
    let {windowResize,updateWindowResize}=getContext('windowResize');

    function minMaxCalculate()
    {
        let max = 0, min=1e18;
        modelData.trainPoints.forEach(point => {
            max = Math.max(point.x1, point.x2, max)
            min = Math.min(point.x1, point.x2, min)
        });
        modelData.testPoints.forEach(point => {
            max = Math.max(point.x1, point.x2, max)
            min = Math.min(point.x1, point.x2, min)
        });
        let dif = max - min ;
        dif = 0.125*(dif);
        min = min - dif;
        max = max + dif;
        return {min,max};
    }
    useEffect(()=>{
        drawAxes();

        let dataPointsType = selectMode;
        let trainPoints = JSON.parse(JSON.stringify(modelData.trainPoints));
        let testPoints = JSON.parse(JSON.stringify(modelData.testPoints));
        if(!trainPoints || !testPoints)return;

        let {min,max} = minMaxCalculate();
        let windowWidth = window.innerWidth;
        let svg=document.getElementById('SVGLayer')
        let width=svg.width.baseVal.value;
        let height=svg.height.baseVal.value;
        trainPoints.forEach(point => {
            point.x1=((point.x1-min)/(max-min))*(height);
            point.x2=((point.x2-min)/(max-min))*(height);
        });
        testPoints.forEach(point => {
            point.x1=((point.x1-min)/(max-min))*(height);
            point.x2=((point.x2-min)/(max-min))*(height);
        });
        let colors = ['red','blue','black','green','brown'];

        let circles=[];
        let radius=3*height/299.31;

        if(dataPointsType!=1)
        {
            trainPoints.forEach(point => {
                circles.push(<circle cx={point.x2} cy={point.x1} key={point.x1+''+point.x2} r={radius} fill={colors[point.label]} stroke="white" strokeWidth="1" />);
            }); 
        }
        if(dataPointsType!=0)
        {
            testPoints.forEach(point => {
                circles.push(<circle cx={point.x2} cy={point.x1} key={point.x1+''+point.x2} r={radius} fill={colors[point.label]} stroke="black" strokeWidth="1" />);
            }); 
        }   
        updateCirclesList(circles);
    },[modelData.trainPoints,modelData.testPoints,selectMode,windowResize]);


    function showGraph() {
        if (!canvasRef.current || !selectRef || !modelData.trainPoints || !modelData.testPoints) return;
      
        let { min, max } = minMaxCalculate();
        let canvas = canvasRef.current;
        let canvasStyle = getComputedStyle(canvas);
        canvas.width = parseFloat(canvasStyle.width);
        canvas.height = parseFloat(canvasStyle.height);
        
        let height=canvas.height;
        let width=canvas.width;

        let ctx = canvas.getContext('2d');
        let numberOfLayers = modelData.layers.numberOfLayers;
        let rgbValues = [
          [255, 0, 0],    // Red
          [0, 0, 255],    // Blue
          [0, 0, 0],      // Black
          [0, 128, 0],    // Green
          [150, 75, 0]   // Orange
        ];
      
        const blockSize = 5;
        const neuronBlockSize=5;
        const alphaValue = 50;

        // console.log(neuronRef.current[0][0]);
      
        // Create an offscreen canvas
        const smallCanvas = document.createElement('canvas');
        const smallWidth = Math.ceil(width / blockSize);
        const smallHeight = Math.ceil(height / blockSize);
        smallCanvas.width = smallWidth;
        smallCanvas.height = smallHeight;
        const smallCtx = smallCanvas.getContext('2d');
        const smallImage = smallCtx.createImageData(smallWidth, smallHeight);
        const smallImageData = smallImage.data;


        let neuronCanvas=[];
        for(let i=0;i<modelData.layers.numberOfLayers;i++) {
            neuronCanvas[i]=[];
            for(let j=0;j<modelData.layers.layers[i].numberOfNeurons;j++) {
                let currentNeuronCanvas = document.createElement('canvas');
                const neuronSmallWidth = Math.ceil(width / neuronBlockSize);
                const neuronSmallHeight = Math.ceil(height / neuronBlockSize);
                currentNeuronCanvas.width = neuronSmallWidth;
                currentNeuronCanvas.height = neuronSmallHeight;
                let neuronCanvasCtx = currentNeuronCanvas.getContext('2d');
                let neuronImage = neuronCanvasCtx.createImageData(neuronSmallWidth, neuronSmallHeight);
                let neuronImageData = neuronImage.data;
                neuronCanvas[i][j]={
                    canvas:currentNeuronCanvas,
                    ctx:neuronCanvasCtx,
                    image:neuronImage,
                    data:neuronImageData
                }
            }
        }

      
        // Calculate colors for the smaller canvas blocks
        for (let i = 0; i < height; i += blockSize) {
          for (let j = 0; j < width; j += blockSize) {
            let x1 = (i * (max - min)) / height + min;
            let x2 = (j * (max - min)) / width + min;
            let points = [{ x1: x1, x2: x2, label: 0 }];
            let { activations } = forward(modelData.layers, modelData.weights, points);
            let numberOfNeurons = modelData.layers.layers[numberOfLayers - 1].numberOfNeurons;
            let activationSum = activations[numberOfLayers - 1][0].reduce((a, b) => a + b, 0);
            let probabilities = activations[numberOfLayers - 1][0].map(activation => activation / activationSum);
            probabilities.sort((a, b) => a - b);
            let diff = probabilities[numberOfNeurons - 1] - probabilities[numberOfNeurons - 2];
            let white = 1 - diff;
      
            let finalRgb = [0, 0, 0];
            for (let n = 0; n < numberOfNeurons; n++) {
              let finalActivation = activations[numberOfLayers - 1][0][n] / activationSum;
              finalRgb[0] += finalActivation * diff * rgbValues[n][0];
              finalRgb[1] += finalActivation * diff * rgbValues[n][1];
              finalRgb[2] += finalActivation * diff * rgbValues[n][2];
            }
            finalRgb[0] += white * 255;
            finalRgb[1] += white * 255;
            finalRgb[2] += white * 255;
      
            let si = Math.floor(i / blockSize);
            let sj = Math.floor(j / blockSize);
            let index = (si * smallWidth + sj) * 4;
            smallImageData[index] = finalRgb[0];
            smallImageData[index + 1] = finalRgb[1];
            smallImageData[index + 2] = finalRgb[2];
            smallImageData[index + 3] = alphaValue;
            

            for(let layerIndex=0;layerIndex<modelData.layers.numberOfLayers;layerIndex++) {
                for(let neuronIndex=0;neuronIndex<modelData.layers.layers[layerIndex].numberOfNeurons;neuronIndex++) {
                    let neuron=neuronCanvas[layerIndex][neuronIndex];
                    let value=activations[layerIndex][0][neuronIndex];
                    let activationType=modelData.layers.layers[layerIndex].activation;
                    if((activationType==0 || activationType==1) && layerIndex!=modelData.layers.numberOfLayers-1) {
                        value=Math.min(value,1);
                        value=Math.max(value,-1);
                        value=(value-(-1))/(2);
                    }
                    if(activationType==3 && layerIndex!=neuronCanvas.length-1) {
                        value=Math.min(value,1);
                    }
                    value=1-value;
                    let rValue=50;
                    let gValue=55;
                    let bValue=76;
                    let r = Math.round((255-rValue) * value + rValue);          
                    let g = Math.round((255-gValue) * value + gValue);     
                    let b = Math.round((255-bValue) * value + bValue); 
                    neuron.data[index] = r;
                    neuron.data[index + 1] = g;
                    neuron.data[index + 2] = b;
                    neuron.data[index + 3] = 150;
                }
            }
          }
        }
      
        smallCtx.putImageData(smallImage, 0, 0);
      
        // Draw the smaller canvas onto the main canvas, scaling it up
        ctx.clearRect(0, 0, width, height);
        // ctx.imageSmoothingEnabled = true; // Enable smoothing
        ctx.drawImage(smallCanvas, 0, 0, width, height);
      
        // Optionally apply additional blur filter if needed
        ctx.filter = 'blur(3px)';
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';

        for(let i=0;i<modelData.layers.numberOfLayers;i++) {
            for(let j=0;j<modelData.layers.layers[i].numberOfNeurons;j++) {
                let neuron=neuronCanvas[i][j];
                let actualCanvas=neuronRef.current[i][j].querySelector('canvas');
                let canvasStyle = getComputedStyle(actualCanvas);
                actualCanvas.width = parseFloat(canvasStyle.width);
                actualCanvas.height = parseFloat(canvasStyle.height);
                // console.log(actualCanvas,'ac');
                let actualCtx=actualCanvas.getContext('2d');
                neuron.ctx.putImageData(neuron.image, 0, 0);
                // Draw the smaller canvas onto the main canvas, scaling it up
                actualCtx.clearRect(0, 0, actualCanvas.width, actualCanvas.height);
                // ctx.imageSmoothingEnabled = true; // Enable smoothing
                actualCtx.drawImage(neuron.canvas, 0, 0, actualCanvas.width, actualCanvas.height);
            
                // Optionally apply additional blur filter if needed
                actualCtx.filter = 'blur(3px)';
                actualCtx.drawImage(actualCanvas, 0, 0);
                actualCtx.filter = 'none';
            }
        }
      }      

    function updateTestLoss() {
        testLossSum.current=0;
        forward(modelData.layers, modelData.weights, modelData.testPoints,testLossSum);
        if(trainLossSum.current==0)forward(modelData.layers, modelData.weights, modelData.trainPoints,trainLossSum);
    }

    function drawAxes() {
        let svgM=document.getElementById('SVGLayer');
        let svgMStyle = getComputedStyle(svgM);
        svgM.width.baseVal.value = parseFloat(svgMStyle.width);
        svgM.height.baseVal.value = parseFloat(svgMStyle.height);

        let svgS=document.getElementById('SVGAxes');
        let svgSStyle = getComputedStyle(svgS);
        svgS.width.baseVal.value = parseFloat(svgSStyle.width);
        svgS.height.baseVal.value = parseFloat(svgSStyle.height);


        let windowWidth = window.innerWidth;

        const width = svgM.clientWidth;
        const height = svgM.clientHeight;
        const margin = 40;
    
        // Create axes group
        const axesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
        // Draw x-axis labels
        for (let i = 0; i <= 10; i++) {
            const x = margin + i * (width) / 10;
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', height+35);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', "0.8em");
            label.textContent = (i-5)/2;
            if((i-5)%2==0)label.textContent=(i-5)/2+'.0';
            axesGroup.appendChild(label);
        }
    
        // Draw y-axis labels
        for (let i = 0; i <= 10; i++) {
            const y = height + 16 - i * (height) / 10;
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', margin - 8);
            label.setAttribute('y', y + 6);
            label.setAttribute('text-anchor', 'end');
            label.setAttribute('font-size', "0.8em");
            label.textContent = (i-5)/2;
            if((i-5)%2==0)label.textContent=(i-5)/2+'.0';
            axesGroup.appendChild(label);
        }
    
        while (svgS.firstChild) {
            svgS.removeChild(svgS.firstChild);
        }
        svgS.appendChild(axesGroup);
    }

    useEffect(()=>{
        showGraph();
        updateTestLoss();
    },[modelData.trainPoints,modelData.testPoints,modelData.epochCount,modelData.layers,windowResize]);

    function handleModeChange(event) {
        updateSelectMode(event.target.value);
    }

    let trainloss=0;
    if(modelData.trainPoints){
        trainloss=trainLossSum.current/modelData.trainPoints.length;
        trainloss=trainloss.toString().slice(0,5);
    }
    let testloss=0;
    if(modelData.testPoints){
        testloss=testLossSum.current/modelData.testPoints.length;
        testloss=testloss.toString().slice(0,5);
    }

    return (
        <div id='graph'>
            <div className="dataPointSelect">
                    <div className="showDatapoints">
                        <span className="label">Show Datapoints </span>
                        <div className="selectDiv">
                            <select value={selectMode} ref={selectRef} onChange={handleModeChange} aria-label="Default select example">
                                <option value={0}>Train</option>
                                <option value={1}>Test</option>
                                <option value={2}>Both</option>
                            </select>
                        </div>
                    </div>
                    <div className="lossBox">
                        <p>Train loss : {trainloss}</p>
                        <p>Test loss : {testloss}</p>
                    </div>
            </div>
            <div className="canvasContainer"> 
                <canvas  id="canvas" ref={canvasRef}  >
                </canvas>
                <svg  id='SVGLayer'>
                    {circlesList}
                </svg>
                <svg  id='SVGAxes'>
                </svg>
            </div>
        </div>
    )
}

export default Graph;
