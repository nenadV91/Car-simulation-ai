let canvas;
let data;
let width;
let height;
let track;
let stats;
let timer;
let population;

let trackNumber = 0;
let totalUnits = 100;
let mutationRate = 0.25;
let time = 0;

function setup() {
  data = tracks[trackNumber];
  width = data.width || 800;
  height = data.height || 650;
  canvas = createCanvas(width, height);
  canvas.parent('canvas');

  track = new Track(data);
  population = new Population(Car, totalUnits, { mutationRate, track });
  stats = new Stats({ population })

  stats.add('Generation', 'generation');
  stats.add('Active units', null, population => population.active.length);
  stats.add('Time', null, () => toTime(time));

  timer = setInterval(() => time++, 1000)
}

function draw() {
  clear();
  track.show();
  stats.show();

  if(population.isEmpty) {
    population.reset();
  }

  for(let i = population.active.length - 1; i >= 0; i--) {
    const unit = population.active[i];

    unit.update();
    unit.drive();
    unit.show();

    if(unit.health <= 0) {
      population.remove(i)
    }

    if(unit.offTrack()) {
      population.remove(i)
    }
  }
}

function keyPressed() {
  if(keyCode === 13) {
    saveJSON(car.data, 'data.json')
  }
}

function mousePressed() {
  console.log(mouseX, mouseY)
}