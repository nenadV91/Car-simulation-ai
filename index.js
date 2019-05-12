let canvas;
let width;
let height;
let track;
let stats;
let timer;
let controls;
let population;

let time = 0;

function setup() {
  track = new Track({ tracks });

  width = track.width || 800;
  height = track.height || 650;
  canvas = createCanvas(width, height);
  canvas.parent('canvas');

  population = new Population(Car, { track });
  controls = new Controls({ track, population });
  stats = new Stats({ population })

  stats.add('Time', null, () => toTime(time));
  stats.add('Generation', 'generation');
  stats.add('Active', null, population => population.active.length);

  timer = setInterval(() => time++, 1000)
}

function draw() {
  background(255);
  track.show();
  stats.show();

  if(population.isEmpty) {
    population.update();
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