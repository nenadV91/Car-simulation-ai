let canvas;
let width;
let height;
let track;
let stats;
let car;

function setup() {
  width = 600;
  height = 600;
  canvas = createCanvas(width, height);

  track = new Track(tracks[0]);
  car = new Car({ x: 80, y: 285 });
  stats = new Stats({ car, track });

  stats.add('Speed', 'speed');
  stats.add('Heading', 'heading');
  stats.add('Steer angle', 'steerAngle');
  stats.add('Reverse', null, car => car.speed >= 0 ? 'False' : 'True')
  stats.add('Gear', null, car => int(car.gear));
}

function draw() {
  background(config.bgcolor);
  track.show();
  stats.show();

  car.update();
  car.show();

  if(keyIsDown(DOWN_ARROW)) {
    car.steer('down')
  }

  if(keyIsDown(UP_ARROW)) {
    car.steer('up')
  }

  if(keyIsDown(RIGHT_ARROW)) {
    car.steer('right')
  } else {
    car.resetSteer('right');
  }

  if(keyIsDown(LEFT_ARROW)) {
    car.steer('left')
  } else {
    car.resetSteer('left');
  }

  const offTrack = car.drive(track);

  if(offTrack) {
    car.color = car.errorColor;
  } else {
    car.color = car.initialColor;
  }
}

function keyPressed() {
  if(keyCode === 87) {
    car.shift('up');
  }

  if(keyCode === 83) {
    car.shift('down');
  }
}

function mousePressed() {
  console.log(mouseX, mouseY)
}