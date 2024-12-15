let serialPort; // Declare the variable once at the top
let pot1Value = 0;
let pot2Value = 0;
let buttonState = 0;

let xSpeed = 2; // Speed of movement for circles
let ySpeed = 2; // Speed of movement for circles
let offsetX = 0; // Horizontal offset for movement
let offsetY = 0; // Vertical offset for movement
let pulseFactor = 1; // Factor for pulsating effect
let spacing = 30; // Define spacing here

let startTime = 0; // Variable to store the start time
let animationStarted = false; // Flag to track if the animation has started
let staticDuration = 10000; // Static display duration (in milliseconds)

let pressCount = 0; // Variable to count button presses
let lastButtonState = 0; // To track the previous button state and detect presses

function setup() {
  createCanvas(400, 500);
  serialPort = new p5.SerialPort();
  serialPort.open('COM12'); //port that i connected arduino
  serialPort.on('connected', serverConnected);
  serialPort.on('data', serialEvent);
  serialPort.on('error', serialError);
  
  startTime = millis(); // Store the start time
}

function draw() {
  // Detect button presses
  if (buttonState == 1 && lastButtonState == 0) {
    pressCount++; // Increase press count on button press
  }
  
  lastButtonState = buttonState; // Update last button state

  // If 8 seconds have passed and animation hasn't started, start the animation
  if (millis() - startTime >= staticDuration && !animationStarted && pressCount < 2) {
    animationStarted = true; // Set the flag to true after 8 seconds
  }

  // If 2 presses are detected, reset to static mode for 8 seconds
  if (pressCount >= 2) {
    animationStarted = false;
    startTime = millis(); // Reset the start time
    pressCount = 0; // Reset the press count
  }

  // If static mode is active, show static circles
  if (!animationStarted) {
    if (buttonState == 1) {
      background(random(255), random(255), random(255)); // Random background color when the button is pressed
    } else {
      background(255, 230, 0); // Yellow background by default
    }

    let largecircle = map(pot1Value, 0, 1023, 5, 50); // Map pot1 value to large circle size
    let smallcircle = map(pot2Value, 0, 1023, 2, 20); // Map pot2 value to small circle size

    // Draw larger circles in grid pattern
    for (let y = spacing; y < height; y += spacing * 2) {
      for (let x = spacing; x < width; x += spacing * 2) {
        fill(0);
        ellipse(x, y, largecircle, largecircle);
      }
    }

    // Translate and draw second set of larger circles shifted down and right
    push();
    translate(spacing, spacing);
    for (let y = spacing; y < height; y += spacing * 2) {
      for (let x = spacing; x < width; x += spacing * 2) {
        fill(0);
        ellipse(x, y, largecircle, largecircle);
      }
    }
    pop();

    // Draw smaller circles in between the larger circles
    for (let y = spacing; y < height; y += spacing) {
      for (let x = spacing; x < width; x += spacing) {
        if ((x + y) % (spacing * 2) !== 0) {
          fill(0);
          ellipse(x, y, smallcircle, smallcircle);
        }
      }
    }

    return; // Exit early to avoid drawing circles during the static period
  }

  // If the animation has started, clear the background and draw moving and pulsating circles
  if (buttonState == 1) {
    background(random(255), random(255), random(255)); // Change background color when the button is pressed
  } else {
    background(255, 230, 0); // Yellow background by default
  }

  let largecircle = map(pot1Value, 0, 1023, 5, 50); // Map pot1 value to large circle size
  let smallcircle = map(pot2Value, 0, 1023, 2, 20); // Map pot2 value to small circle size

  // Make circles move dynamically based on potentiometer values
  offsetX += map(pot1Value, 0, 1023, -5, 5); // Horizontal movement speed
  offsetY += map(pot2Value, 0, 1023, -5, 5); // Vertical movement speed

  // If circles move off the canvas, reset their positions
  if (offsetX > width || offsetX < 0) {
    offsetX = random(width);
  }
  if (offsetY > height || offsetY < 0) {
    offsetY = random(height);
  }

  // Add pulsating effect
  pulseFactor = map(sin(frameCount * 0.05), -1, 1, 0.5, 1); // Pulsating factor based on sine wave
  let dynamicCircleSize = largecircle * pulseFactor;

  // Draw larger circles in grid pattern
  for (let y = spacing; y < height; y += spacing * 2) {
    for (let x = spacing; x < width; x += spacing * 2) {
      fill(0);
      ellipse(x + offsetX, y + offsetY, dynamicCircleSize, dynamicCircleSize);
    }
  }

  // Translate and draw second set of larger circles shifted down and right
  push();
  translate(spacing, spacing);
  for (let y = spacing; y < height; y += spacing * 2) {
    for (let x = spacing; x < width; x += spacing * 2) {
      fill(0);
      ellipse(x + offsetX, y + offsetY, dynamicCircleSize, dynamicCircleSize);
    }
  }
  pop();

  // Draw smaller circles in between the larger circles
  for (let y = spacing; y < height; y += spacing) {
    for (let x = spacing; x < width; x += spacing) {
      if ((x + y) % (spacing * 2) !== 0) {
        fill(0);
        ellipse(x + offsetX, y + offsetY, smallcircle, smallcircle);
      }
    }
  }
}

function serverConnected() {
  console.log('Connected to WebSocket server');
}

function serialEvent() {
  let inString = serialPort.readLine();
  if (inString.length > 0) {
    let values = inString.trim().split(','); // Trim and split incoming data
    if (values.length == 3) {
      pot1Value = parseInt(values[0]);
      pot2Value = parseInt(values[1]);
      buttonState = parseInt(values[2]);
    }
  }
}

function serialError(err) {
  console.error('Serial port error: ' + err);
}
