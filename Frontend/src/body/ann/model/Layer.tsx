import "./Layer.css";
import Neuron from "./Neuron.tsx";
import { getContext } from "../../../Context.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause,faStepForward, faRedo, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

function Layer({layer,biases})
{
    let type="hidden";
    if(layer.index==0)type="first";
    if(layer.index==layer.numberOfLayers-1)type="last";
    let handle=getContext('handle');

    let plus=<button className="plusMinus" onClick={()=>{handle.handlePlus(layer.index)}}>
               <FontAwesomeIcon  icon={faPlus} />
            </button>
    let minus=<button className="plusMinus" onClick={()=>{handle.handleMinus(layer.index)}} >
               <FontAwesomeIcon  icon={faMinus} />
            </button>

    function handleActivationChange(event){
        let activation=event.target.value;
        handle.handleActivationChange(layer.index,activation);
    }

    let activation=
    <div className="activation-select">
        <div className="select">
            <select value={layer.activation} className="" aria-label="Default select example" 
                    onChange={handleActivationChange}>
                <option value={0}>Linear</option>
                <option value={1}>Tanh</option>
                <option value={2}>Sigmoid</option>
                <option value={3}>ReLU</option>
            </select>
        </div>
    </div>
    if(type=='last') activation=
    <div className="activation-select">
        <div className="softMax">
            Softmax
        </div>
    </div>
    return (
        <div className={"layer "+ type}>
            <div className="layerTop">
                {type!="first" && activation}
                {type=='hidden' && plus}
                {type=='hidden' && minus}
            </div>
            {biases.map((bias,ind)=>{
                return <Neuron bias={bias} key={ind} neuronIndex = {ind} layerIndex = {layer.index} type={type} ></Neuron>
            })}
        </div>
    )
}

export default Layer;
