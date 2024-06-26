function matrixmultiplication( mat1, mat2 )
{
    let temp = [];
    for(let i=0 ; i<mat1.length ; i++)
    {
       temp[i] = [];
       for(let j=0 ; j < mat2[0].length ; j++)
       {
         temp[i][j] = 0;
         for(let k=0 ; k <mat1[0].length ; k++)
         {
            temp[i][j]+=mat1[i][k] * mat2[k][j];
         }
       }
    }
    
    return temp;
}

function activation(value, activationType) {
    if (activationType === 0) {
        return value;
    } else if (activationType === 1) {
        return Math.tanh(value);
    } else if (activationType === 2) {
        return 1 / (1 + Math.exp(-value));
    } else if (activationType === 3) {
        return Math.max(0, value);
    }
}

// function forward(layers, weights, datapoints){
//     if(datapoints==null)
//     {
//         return;
//     }
//     // console.log("weights" , weights);
//     // console.log("inside forwrd" , datapoints);
    
//     let layeroutput = [],activations=[[]],net=[[]];
//     let weightmat = JSON.parse(JSON.stringify(weights.weights));
//     let biaseslist = JSON.parse(JSON.stringify(weights.biases));
//     let n = layers.numberOfLayers;
//     for (let datapoint of datapoints){
//          layeroutput.push([datapoint.x1, datapoint.x2, 1]);
//          activations[0].push([datapoint.x1, datapoint.x2]);
//     }
//     for(let layernumber=1 ; layernumber<=n-1 ; layernumber++)
//     {
//         let weight =JSON.parse(JSON.stringify(weightmat[layernumber-1]));
//         let bias  = JSON.parse(JSON.stringify(biaseslist[layernumber]));
//         weight.push(bias);
//         let mat = matrixmultiplication(layeroutput, weight );
//         let activationType = layers.layers[layernumber].activation; 
//         net.push(mat);
//         // console.log("net",net);
//         let mat1=mat.map((row)=>{
//             // console.log("rowbefire" , row);
//             let newRow=row.map((value)=>{
//             // let va = value ;
//             // let ac = activationType;
//             // let ans = activation(va , ac);
//             // console.log("check" , va , ac , ans);
//            return activation(value , activationType); 
//           });
//         //   console.log("rowagfter" , row);
//           return newRow;
//         });
//         // console.log("matafter" , mat1,mat);
        
//         activations.push(mat1);
//          let mat2 =mat1.map((row)=>{
//             // console.log("anothe" , row);
//             // row.push(1);
//             // return row;
//             let newRow = [...row];
//             newRow.push(1);
//             return newRow;
//         })
//         layeroutput = mat2;
//     }

//     // console.log("actiactions " , activations);
//     // console.log("net" , net);
//     return {activations,net};
// }


function forward(layers, weights, datapoints,lossSum){
    if(datapoints==null)
    {
        return;
    }
    
    let layeroutput = [],activations=[[]],net=[[]];
    let weightmat = JSON.parse(JSON.stringify(weights.weights));
    let biaseslist = JSON.parse(JSON.stringify(weights.biases));
    let n = layers.numberOfLayers;
    for (let datapoint of datapoints){
         layeroutput.push([datapoint.x1, datapoint.x2, 1]);
         activations[0].push([datapoint.x1, datapoint.x2]);
    }
    for(let layernumber=1 ; layernumber<=n-1 ; layernumber++)
    {
        let weight =JSON.parse(JSON.stringify(weightmat[layernumber-1]));
        let bias  = JSON.parse(JSON.stringify(biaseslist[layernumber]));
        weight.push(bias);
        let mat = matrixmultiplication(layeroutput, weight );
        let activationType = layers.layers[layernumber].activation; 
        net.push(mat);
        let mat1=mat.map((row)=>{
            let sum=0;
            if(layernumber==n-1)for(let value of row)sum+=Math.exp(value);

            let newRow=row.map((value)=>{
                if(layernumber==n-1) {
                    if(Math.exp(value)==0 && sum==0)return 0;
                    return Math.exp(value)/sum;
                }
                return activation(value , activationType); 
          });
          return newRow;
        });
        
        activations.push(mat1);
         let mat2 =mat1.map((row)=>{
            let newRow = [...row];
            newRow.push(1);
            return newRow;
        })
        layeroutput = mat2;
    }

    if(lossSum) for(let i=0;i<datapoints.length;i++) {
        let labelIndex=datapoints[i].label;
        lossSum.current+=-Math.log(activations[n-1][i][labelIndex]);
    }
    return {activations,net};
}

function derivationOfActivation(value, activationType) {
    if (activationType === 0) {
        return 1;
    } else if (activationType === 1) {
        return 1-(Math.tanh(value))*(Math.tanh(value));
    } else if (activationType === 2) {
        return activation(value,activationType)*(1-activation(value,activationType));
    } else if (activationType === 3) {
       if(value > 0 ) return 1 ;
       else if(value===0) return 0.5;
       else return 0; 
       
    }
}


function backword(layers, weights, datapoints, learningRate, regularizationType , regularizationRate, lossSum )
{
    // console.log("inside bakc " , weights);    
    let {activations,net} = forward(layers, weights, datapoints,lossSum);
    // console.log("old weight" ,weights );
    // console.log("data",datapoints);
    // console.log("activatioons " , activations);
    // console.log("net " , net );
    let weightChanges=[], biasChanges=[];
    let n = layers.numberOfLayers , m=datapoints.length;

    for(let datapointIndex=0 ; datapointIndex < m ; datapointIndex++)
    {
        let delta=[];
        for(let layerIndex=n-1 ; layerIndex>=1 ; layerIndex--)
        {
            let noOfNeurons = layers.layers[layerIndex].numberOfNeurons;
            if(layerIndex===n-1)
            {
                delta[layerIndex]=[];
                for(let neuronIndex=0; neuronIndex<noOfNeurons; neuronIndex++)
                {
                  let target = 0;
                  if(neuronIndex==datapoints[datapointIndex].label)target = 1;
                  let actual = activations[layerIndex][datapointIndex][neuronIndex];
                //   delta[layerIndex][neuronIndex] = (actual - target)*derivationOfActivation(net[layerIndex][datapointIndex][neuronIndex], layers.layers[layerIndex].activation );
                  delta[layerIndex][neuronIndex]=activations[layerIndex][datapointIndex][neuronIndex]-target;
                }
            }
            else
            {
                let deltaMatrix = delta[layerIndex+1].map((value)=>[value]);
                delta[layerIndex] = matrixmultiplication(weights.weights[layerIndex] , deltaMatrix);
                delta[layerIndex]=delta[layerIndex].map((value,neuronIndex)=>value[0]*derivationOfActivation(net[layerIndex][datapointIndex][neuronIndex], layers.layers[layerIndex].activation));
            }
        }

        // console.log("delta" , delta);
        for(let i=0; i<n-1; i++)
        {
            if(datapointIndex==0)weightChanges[i] = [];
            for(let j=0; j<layers.layers[i].numberOfNeurons; j++)
            {
                if(datapointIndex==0)weightChanges[i][j] = [];
                for(let k=0 ; k<layers.layers[i+1].numberOfNeurons; k++)
                {
                    if(weightChanges[i][j][k]===undefined)weightChanges[i][j][k]=0;
                    weightChanges[i][j][k]+=activations[i][datapointIndex][j]*delta[i+1][k];
                    // console.log("weighttschanges" , weightChanges[i][j][k]);

                }
            }   
        }
        // console.log("weisdghas" , weightChanges);
        for(let layerIndex=n-1 ; layerIndex>=1 ; layerIndex--)
        {
            if(datapointIndex==0)biasChanges[layerIndex] = [];
            let noOfNeurons = layers.layers[layerIndex].numberOfNeurons;
            for(let neuronIndex=0; neuronIndex<noOfNeurons; neuronIndex++)
            {
                if(biasChanges[layerIndex][neuronIndex]==undefined)biasChanges[layerIndex][neuronIndex]=0;
                biasChanges[layerIndex][neuronIndex]+=delta[layerIndex][neuronIndex];
            }
        }
    }

    // console.log("weisdghas" , weightChanges);

    let  newWeights = JSON.parse(JSON.stringify(weights));
    for(let i=0; i<n-1; i++)
    {
        for(let j=0; j<layers.layers[i].numberOfNeurons; j++)
        {
            for(let k=0 ; k<layers.layers[i+1].numberOfNeurons; k++)
            {
                let l1=1;
                // console.log("type" , regularizationType);
                if(regularizationType==2){
                    l1=(1-learningRate*regularizationRate/m);
                }
                newWeights.weights[i][j][k] = newWeights.weights[i][j][k]*l1- weightChanges[i][j][k]*learningRate/m;
                if(regularizationType==1)newWeights.weights[i][j][k]-=learningRate*Math.sign(weights.weights[i][j][k])*regularizationRate/(2*m);
                if(Math.abs(newWeights.weights[i][j][k])>1000)newWeights.weights[i][j][k]=1000*Math.sign(newWeights.weights[i][j][k]);
                // if(isNaN(newWeights.weights[i][j][k]))newWeights.weights[i][j][k]=0;
            }
        }   
    }
    for(let layerIndex=n-1 ; layerIndex>=1 ; layerIndex--)
    {
        let noOfNeurons = layers.layers[layerIndex].numberOfNeurons;
        for(let neuronIndex=0; neuronIndex<noOfNeurons; neuronIndex++)
        {
            newWeights.biases[layerIndex][neuronIndex] = newWeights.biases[layerIndex][neuronIndex]- biasChanges[layerIndex][neuronIndex]*learningRate/m;
            if(Math.abs(newWeights.biases[layerIndex][neuronIndex])>1000)newWeights.biases[layerIndex][neuronIndex]=1000*Math.sign(newWeights.biases[layerIndex][neuronIndex]);
            // if(isNaN(newWeights.biases[layerIndex][neuronIndex]))newWeights.biases[layerIndex][neuronIndex]=0;
        }
    }
    // console.log("new weight" ,newWeights );

    return newWeights;
    
    
}



export {forward,backword};