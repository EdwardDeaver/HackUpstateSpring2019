
// Make it so if you click you can hear the sound on  Chrome
function mousePressed() { getAudioContext().resume() }

  // Set the position and zoom level of the map
  // Initialize the base layer
  var osc2Freq = [];
  var osc1Freq = [];

  var osc;
  var playing = false;

  function setup() {
  createCanvas(1500, 1500);
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
  getFile("https://municipal.systems/v1/places/syc-ny/dataTypes/transit-route/data?key=f15a3868-3d82-47d3-9288-b4c41309904c&filters%5B0%5D%5Bdata%5D%5Boperators%5D%5B%24contains%5D%5B0%5D=Centro", function(size) {
            loadMaps(size.response);
        }, "vehicleLocations");
  fft = new p5.FFT();

  }

function draw() {
  fill('#222222');
  let waveform = fft.waveform(); // analyze the waveform
  beginShape();
  stroke(255,170,238);
  strokeWeight(5);
  for (let i = 0; i < waveform.length; i++) {
   let x = map(i, 0, waveform.length, 0, width);
   let y = map(waveform[i], 1, -1, 1000, 0);
  // console.log(osc2Freq[i]);
   vertex(i*1000 / 100, osc2Freq[i]);
  }
  endShape();

  text('STAE Centro Data', width/2, height/5);

  }


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

async function loadMaps(BusMaps){
    for (var i = 0; i < BusMaps.results.length; i++) {
      var realFixedCords = [];
      osc1.amp(0.2);
      document.getElementById("nowplaying").innerHTML = "Now Playing: "+BusMaps.results[i].data.name+" Run time: " + ((BusMaps.results[i].data.path.coordinates.length*3)/60) + " minutes" + "<br>" + " On Chrome click anywhere to hear the audio";

      //Uses Path Color to create sound
      osc1Frequency = ((parseInt(BusMaps.results[i].data.color, 16) - 60) / (600 - 60)/70);
      osc1.freq(osc1Frequency);
      osc1Freq.push(osc1Frequency);
      await sleep(1000);
      for (var z = 0; z < BusMaps.results[i].data.path.coordinates.length; z++) {
        osc2.amp(1);
        osc3.amp(1);
        //Uses Current Path Current point Latitude
        osc2Frequency = BusMaps.results[i].data.path.coordinates[z][1]* Math.random()*10;
        osc2Freq.push(osc2Frequency);
        osc2.freq(osc2Frequency, 1);
        osc2Freq.push();
        osc3.freq((BusMaps.results[i].data.path.coordinates[z][0]*-10)/ (600 - 60* Math.random()));
        realFixedCords[z] = [BusMaps.results[i].data.path.coordinates[z][1], BusMaps.results[i].data.path.coordinates[z][0]];
        await sleep(3000);
        }
      }
  }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
