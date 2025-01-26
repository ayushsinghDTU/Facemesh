
// 1. install dependencies  : npm install @tensorflow/tfjs @tensorflow-models/facemesh react-webcam
// 2. import dependices 
// 3. setup webcam and canvas  
//  load facemesh
import React,{useRef} from 'react'; // {useRef} allow us how to ref canvas component 
// import logo from './logo.svg';
import './App.css';
import * as tf from "@tensorflow/tfjs"; 
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() {
  //  step 3. setup  reference 
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  // step 4 load facemesh
  const  runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution:{width:640,height:480},scale:0.8
    });
    setInterval(()=>{
      detect(net)
    }, 100)
  };
  //    detect functiion
  const detect = async(net) => {
    if(
       typeof webcamRef.current !=="undefined" && 
       webcamRef.current !== null &&
       webcamRef.current.video.readyState === 4 // check reveing data 
      ) {
        // set video properties 
         const video = webcamRef.current.video;
         const videoWidth = webcamRef.current.video.videoWidth;
         const videoHeight = webcamRef.current.video.videoHeight;
        
        //  set video width
        webcamRef.current.video.width =  videoWidth;
        webcamRef.current.video.height= videoHeight;
        //  set canvas width 
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        //  make detection
        const face = await net.estimateFaces(video);
        console.log(face);
        //  get canvas context for drawing
          const ctx = canvasRef.current.getContext("2d");
          drawMesh(face,ctx)
       }
      
    };
  
    runFacemesh();
  return (
    <div className="App">
    <header className="App-header">
     <Webcam
      ref={webcamRef}
      style = {{
         position : "absolute",
         marginLeft : "auto",
         marginRight: "auto",
         left : 0,
         right: 0,
         textAlign: "centr",
         zIndex : 9,
         width:640,
         height: 480,
      }}
      />
      <canvas 
      ref = {canvasRef}
      style = {{
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right:0,
        textAlign: "centr",
        zIndex: 9,
        width:640,
        height:480,
      }}
      />
      </header>
    </div>
  );
}

export default App;
