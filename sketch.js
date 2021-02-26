// This sketch demonstrates how to send and receive data over WebUSB's serial.
//
// This p5.js sketch is intended to run with the following Circuit
// Playground Express program. Your CPX must be connected and running
// this Arduino code to work with this website:
// https://github.com/makeabilitylab/p5js/tree/master/WebSerial/ColorIO/AdafruitCpx/CpxColorIO
//
// By Jon E. Froehlich
// http://makeabilitylab.io/

let sliderInFromSerial;
let sliderOutToSerial;

let serial;
let pHtmlMsg;
let button;

let serialInputRgb;

function setup() {
  createCanvas(400, 400);

  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

  // Hide this p5 Canvas until we connect
  let canvas = document.getElementsByClassName('p5Canvas')[0];
  canvas.style.display = "none";

  // https://p5js.org/reference/#/p5/createButton
  button = createButton('Connect to Serial Device');
  button.position(10, 10);
  button.id("serial-connect-button");
  button.mousePressed(onButtonConnectToSerialDevice);

  pHtmlMsg = createP('');
  pHtmlMsg.id("html-output");
  pHtmlMsg.position(10, 20);
}

async function onButtonConnectToSerialDevice(){
  if (!serial.isOpen()) {
    await serial.connectAndOpen();
  }
}

function onSerialErrorOccurred(eventSender, error) {
  console.log("onSerialErrorOccurred", error);
  pHtmlMsg.html(error);
}

function onSerialConnectionOpened(eventSender) {
  console.log("onSerialConnectionOpened");
  pHtmlMsg.html("Serial connection opened successfully");
  button.style('visibility', 'hidden');
}

function onSerialConnectionClosed(eventSender) {
  console.log("onSerialConnectionClosed");
  pHtmlMsg.html("onSerialConnectionClosed");
}

function onSerialDataReceived(eventSender, newData) {
  console.log("onSerialDataReceived", newData);
  pHtmlMsg.html(newData);
}

/**
 * Called automatically when the slider value changes
 * Sends data out on serial
 */
function onSliderOutToSerialValueChanged() {
  console.log("Slider:", sliderOutToSerial.value());

  if (serial.isOpen()) {
    serial.writeLine(sliderOutToSerial.value());
  }
}
