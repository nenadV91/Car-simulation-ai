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
  car.learn();

  if(car.isAuto) {
    car.auto()
  }

  if(keyIsDown(DOWN_ARROW)) {
    car.steer('down');
  }

  if(keyIsDown(UP_ARROW)) {
    car.steer('up');
  }

  if(keyIsDown(RIGHT_ARROW)) {
    car.steer('right');
  } else {
    car.resetSteer('right');
  }

  if(keyIsDown(LEFT_ARROW)) {
    car.steer('left');
  } else {
    car.resetSteer('left');
  }

  const offTrack = car.drive();
  if(offTrack) car.color = car.errorColor;
  else car.color = car.initialColor;
}

function keyPressed() {
  if(keyCode === 87) {
    car.shift('up');
  }

  if(keyCode === 83) {
    car.shift('down');
  }

  if(keyCode === 13) {
    saveJSON(car.data, 'data.json')
  }

  if(keyCode === 65) {
    car.toggleAuto();
  }
}

function mousePressed() {
  console.log(mouseX, mouseY)
}