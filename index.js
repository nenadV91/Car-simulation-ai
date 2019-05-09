let canvas;
let data;
let width;
let height;
let track;
let stats;
let car;

function setup() {
  data = tracks[0];
  width = data.width || 800;
  height = data.height || 650;
  canvas = createCanvas(width, height);

  track = new Track(data);
  car = new Car({ track });
  stats = new Stats({ car, track });

  car.train(train_data)

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
  car.auto();

  if(keyIsDown(DOWN_ARROW)) {
    car.steer('down');
    car.controls.down = 1;
  } else {
    car.controls.down = 0;
  }

  if(keyIsDown(UP_ARROW)) {
    car.steer('up');
    car.controls.up = 1;
  } else {
    car.controls.up = 0;
  }

  if(keyIsDown(RIGHT_ARROW)) {
    car.steer('right');
    car.controls.right = 1;
  } else {
    car.resetSteer('right');
    car.controls.right = 0;
  }

  if(keyIsDown(LEFT_ARROW)) {
    car.steer('left');
    car.controls.left = 1;
  } else {
    car.resetSteer('left');
    car.controls.left = 0;
  }

  const offTrack = car.drive();
  if(offTrack) car.color = car.errorColor;
  else car.color = car.initialColor;
}

function keyPressed() {
  if(keyCode === 87) {
    car.shift('up');
    car.controls.shiftUp = 1;
  }

  if(keyCode === 83) {
    car.shift('down');
    car.controls.shiftDown = 1;
  }

  if(keyCode === 13) {
    saveJSON(car.data, 'data.json')
  }
}

function mousePressed() {
  console.log(mouseX, mouseY)
}