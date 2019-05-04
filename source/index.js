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

  stats = new Stats();
  track = new Track(tracks[0]);
  car = new Car({ track, x: 515, y: 225 });
}

function draw() {
  background(config.bgcolor);
  track.show();

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
}

function keyPressed() {

}

function mousePressed() {
  console.log(mouseX, mouseY)
}