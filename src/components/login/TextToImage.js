import React, { Component } from "react";

export default class TextToImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img: ""
    };
  }

  componentDidMount() {
    let canvasTxt = document.getElementById("canvasComponent").getContext("2d");
    const canvasWinth=150;
    const canvasHeight=30;

    canvasTxt.canvas.width = canvasWinth;
    canvasTxt.canvas.height = canvasHeight;
    canvasTxt.font = "bold 20px Open Sans";
    canvasTxt.canvas.bottom = "0px";
    canvasTxt.canvas.position = "absolute";
    const textcolors = ['rgb(128,128,128)','rgb(0,0,0)','rgb(255,22,22)'];
    for (let i = 0; i < 6; i++) {
      let sDeg = (Math.random()*30*Math.PI) / 180;
      let cTxt = this.props.name[i];
      let x = 10 + i*20;
      let y = 17 + Math.random()*8;
      canvasTxt.font = 'bold 23px 微软雅黑';
      canvasTxt.translate(x, y);
      canvasTxt.rotate(sDeg);
  
      canvasTxt.fillStyle = textcolors[Math.floor(Math.random() * textcolors.length)];
      canvasTxt.fillText(cTxt, 0, 0);
  
      canvasTxt.rotate(-sDeg);
      canvasTxt.translate(-x, -y);
    }
    for (let i = 0; i <= 5; i++) {
      canvasTxt.strokeStyle = randomColor();
      canvasTxt.beginPath();
      canvasTxt.moveTo(
        Math.random() * canvasWinth,
        Math.random() * canvasHeight
      );
      canvasTxt.lineTo(
        Math.random() * canvasWinth,
        Math.random() * canvasHeight
      );
      canvasTxt.stroke();
    }
    for (let i = 0; i < 30; i++) {
      canvasTxt.strokeStyle = randomColor();
      canvasTxt.beginPath();
      let x = Math.random() * canvasWinth;
      let y = Math.random() * canvasHeight;
      canvasTxt.moveTo(x,y);
      canvasTxt.lineTo(x+1, y+1);
      canvasTxt.lineWidth=3;
      canvasTxt.stroke();
    }
  
    this.setState({
      img: canvasTxt.canvas.toDataURL()
    });
  }

  render() {
    return (
      <span className="captcha-span-padding captcha-span-text">
        <canvas id="canvasComponent"  style={{display:"none"}} />
        {this.state.img.length > 0 ? (
          <img id="imageComponent" src={this.state.img} />
        ) : null}
      </span>
    );
  }
}

function randomColor () {
  let r = Math.floor(Math.random()*256);
  let g = Math.floor(Math.random()*256);
  let b = Math.floor(Math.random()*256);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}