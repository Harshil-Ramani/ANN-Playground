import "./Neuron.css";
import { useState,useEffect,useRef } from "react";
import { getContext,ContextProvider } from "./../../../Context.tsx";

function Neuron({bias,layerIndex,neuronIndex,type})
{
    let biasValue=bias.toString();
    biasValue=biasValue.slice(0,5);
    let neuronRef = getContext("neuronRef");
    let arrow="";
    if(type!="last")arrow="arrow";

    useEffect(() => {
        return () => {
          if (neuronRef.current[layerIndex]) {
            neuronRef.current[layerIndex][neuronIndex] = null;
          }
        };
    },[]);

    let inputLabel;
    if(layerIndex==0) {
        let content=(neuronIndex+1)+"";
        inputLabel=<div className="inputLabel">X<sub>{content}</sub></div>
    }

    return (
        <div className="neuronContainer">
            {inputLabel}
            <div className="neuron" ref={(ele)=>{
                if(neuronRef.current[layerIndex])neuronRef.current[layerIndex][neuronIndex] = ele;
            }}>
                <canvas className="neuronCanvas"></canvas>
            </div>
            <div className={arrow}></div>
            <div className= {layerIndex>0?"bias":""}>
                <div className="hoverCard">
                    Bias:&nbsp;{biasValue}
                </div>
            </div>
        </div>
    )
}

export default Neuron;
