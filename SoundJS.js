// MADE BY: EDWARD DEAVER, IV
// WEBSITE: edwarddeaver.me
// HACK UPSTATE 2019


// VARIABLES
mute = false;
multiple = 1024;
var osc2Freq = [];
var osc1Freq = [];
var osc3Freq = [];
var OSC1Vol = 0.1;
var OSC2Vol = 1;
var OSC3Vol = 1;
var osc;
var playing = false;

// SETUP 
function setup() {
  var mute = false;
  createCanvas(windowWidth, windowHeight);
  backgroundColor = color(0,0,0);
  textAlign(CENTER);
  osc1 = new p5.Oscillator();
  osc1.setType('sawtooth');
  osc1.amp(0);
  osc1.start();
  osc2 = new p5.Oscillator();
  osc2.setType('square');
  osc2.amp(0);
  osc2.start();
  osc3 = new p5.Oscillator();
  osc3.setType('sine');
  osc3.amp(0);
  osc3.start();
getFile("./ea599807-c591-4886-a929-53a0349e329f.json", function(size) {
            loadMaps(size.response);
        }, "vehicleLocations");
  // getFile("https://municipal.systems/v1/places/syc-ny/dataTypes/transit-route/data?key=f15a3868-3d82-47d3-9288-b4c41309904c&filters%5B0%5D%5Bdata%5D%5Boperators%5D%5B%24contains%5D%5B0%5D=Centro", function(size) {
  //          loadMaps(size.response);
  //      }, "vehicleLocations");
  fft = new p5.FFT();
  osc1.amp(OSC1Vol);
  osc2.amp(OSC2Vol);
  osc3.amp(OSC3Vol);
}


// DRAW LOOP
function draw() {
  fill('#222222');
  let waveform = fft.waveform(); // analyze the waveform
  beginShape();
  stroke(255,170,238);
  strokeWeight(5);
  // OSC 2
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], 1, -1, 1000, 0);
    vertex(i*1000 / 100, osc2Freq[i]);
  }
  endShape();

  // OSC 3
  beginShape();
  stroke(0,170,238);
  strokeWeight(5);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], 1, -1, 1000, 0);
    vertex(i*1000 / 100, osc3Freq[i]+500);
  }
  endShape();
  stroke(255,170,238);
  text('STAE Centro Data', width/2, height/5);
}

// Obtain file
function getFile(url, callback, target) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open("GET", url, true); // Notice "HEAD" instead of "GET",
  xhr.onreadystatechange = function() {
    if (this.readyState == this.DONE) {
      console.log(xhr.response);
      callback(xhr);
    }
  };
  xhr.send();
}

// Run through the maps to make sound
async function loadMaps(BusMaps){
  for (var i = 0; i < BusMaps.results.length; i++) {
    var realFixedCords = [];
    document.getElementById("nowplaying2").innerHTML = "Now Playing: "+BusMaps.results[i].data.name+" Run time: " + ((BusMaps.results[i].data.path.coordinates.length*3)/60) + " minutes" ;
    console.log(i);
    for (var z = 0; z < BusMaps.results[i].data.path.coordinates.length; z++) {
      osc1Frequency = ((parseInt(BusMaps.results[i].data.color, 16) - 60) / (600 - 60)/70);
      osc1.freq(osc1Frequency);
      osc1Freq.push(osc1Frequency*-1);
      //Uses Current Path Current point Latitude
      osc2Frequency = BusMaps.results[i].data.path.coordinates[z][1]* Math.random()*10;
      osc2Freq.push(osc2Frequency);
      osc2.freq(osc2Frequency, 1);
      osc3.freq(BusMaps.results[i].data.path.coordinates[z][0]* Math.random()*2);
      osc3Frequency = BusMaps.results[i].data.path.coordinates[z][0]* Math.random()*2;
      osc3Freq.push(osc3Frequency*-1);
      realFixedCords[z] = [BusMaps.results[i].data.path.coordinates[z][1], BusMaps.results[i].data.path.coordinates[z][0]];
      // Reset the line if it gets to the edge of the screen
      if((z / windowWidth) % 0.1 > 0.098){
        clear();
        osc1Freq=[];
        osc2Freq=[];
        osc3Freq=[];
      }
      await sleep(3000);
    }
    clear();
    osc1Freq=[];
    osc2Freq=[];
    osc3Freq=[];
  }
}
// Sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Make it so if you click you can hear the sound on  Chrome
function mousePressed() { 
      if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}
