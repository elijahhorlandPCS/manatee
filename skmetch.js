/*
Code adapted from Matt DesLauriers' p5 Demos page 
https://p5-demos.glitch.me/
https://www.mattdesl.com/

p5 canvas wrangling from https://github.com/processing/p5.js/wiki/Positioning-your-canvas
*/

let dragging = true;
let minFrequency = 0.5;
let maxFrequency = 20;
let minAmplitude = 0.05;
let maxAmplitude = 0.5;

let amplitude;
let frequency;


// Included in index.html
// This is an alternative to p5.js builtin 'noise' function,
// It provides 4D noise and returns a value between -1 and 1
const simplex = new SimplexNoise();

let img;
function preload() {
  img = loadImage('funny.jpg');
}


// Create a new canvas to the browser size
function setup () {
    image(img, 0, 0);
    var canvas = createCanvas(windowWidth, windowHeight);
 
    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');
  mouseX = width;
  mouseY = height ;
  //frameRate(23);
}

// On window resize, update the canvas size

function windowResized () {
  resizeCanvas(windowWidth);
}

// Render loop that draws shapes with p5
function draw (){
   background(0, 0, 0);



  const frequency = lerp(minFrequency, maxFrequency, mouseX / width);
  const amplitude = lerp(minAmplitude, maxAmplitude, mouseY / height);
  
  const dim = Math.min(width, height);
  
  // Draw the background
  noFill();
  stroke(255);
  strokeWeight(dim * 0.000075);
  
  const time = millis() / 1000;
  const rows = 20;

  
  // Draw each line
  for (let y = 0; y < rows; y++) {
    // Determine the Y position of the line
    const v = rows <= 1 ? 0.5 : y / (rows - 1);
    const py = v * height;
    drawNoiseLine({
      v,
      start: [ 0, py ],
      end: [ width, py ],
      amplitude: amplitude * height,
      frequency,
      time: time * 0.5,
      steps: 150
    });
  }
  
}

function drawNoiseLine (opt = {}) {
  const {
    v,
    start,
    end,
    steps = 10,
    frequency = 1,
    time = 0,
    amplitude = 1
  } = opt;
  
  const [ yStart, xStart ] = start;
  const [ yEnd, xEnd ] = end;

  // Create a line by walking N steps and interpolating
  // from start to end point at each interval
  beginShape();
  for (let i = 0; i < steps; i++) {
    // Get interpolation factor between 0..1
    const t = steps <= 1 ? 0.5 : i / (steps - 1);

    // Interpolate X position
    const x = lerp(xStart, xEnd, t);
    
    // Interpolate Y position
    let y = lerp(yStart, yEnd, t);
    
    // Offset Y position by noise
    y += (simplex.noise3D(t * frequency + time, v * frequency, time)) * amplitude;
    
    // Place vertex
    vertex(y, x);
  }
  endShape();
}

