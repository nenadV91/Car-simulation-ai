class Car {
  constructor(opts = {}) {
    this.opts = opts;
    this.width = 14;
    this.height = 25;
    this.track = opts.track;
    this.x = this.track.start.x;
    this.y = this.track.start.y;

    this.steerAngle = 0;
    this.maxSteerAngle = PI / 4;
    this.speed = 0;
    this.maxSpeed = 2;
    this.heading = radians(this.track.heading || 180);
    this.frictionRate = 0.025;
    this.acceleration = 0.2;
    this.deceleration = 0.05;
    this.wheelSize = 5;

    this.lineLength = config.lineLength;
    this.lineNumber = config.lineNumber;
    this.mutationRate = config.mutationRate;

    this.initialColor = color(config.carColor);
    this.errorColor = color(config.red);
    this.lineColor = color(config.carLineColor);
    this.pointColor = color(config.carPointColor);
    this.color = this.initialColor;

    this.wheelBase = this.height;
    this.front = createVector(0, 0);
    this.back = createVector(0, 0);

    this.gear = 1;
    this.gears = {
      1: 2,
      2: 3,
      3: 4,
      4: 5
    }

    this.position = createVector(this.x, this.y);
    this.velocity = createVector(0, 0);

    this.edgePoints = [];
    this.visionLines = [];
    this.visionPoints = [];

    this.isAuto = false;
    this.checkpoint = 0;
    this.data = [];
    this.health = 100;
    this.score = 0;

    if(opts.brain instanceof NeuralNetwork) {
      this.brain = opts.brain.clone();
      this.brain.mutate(this.mutationRate);
    } else {
      this.brain = this.initBrain();
    }
  }

  drive() {
    const inputs = this.inputs();
    const output = this.brain.query(Matrix.fromArray(inputs));
    const [up, down, left, right] = output;

    if(up > 0.5) {
      this.steer('up')
    }

    if(down > 0.5) {
      this.steer('down')
    }

    if(left > 0.5) {
      this.steer('left')
    }

    if(right > 0.5) {
      this.steer('right')
    }
  }

  initBrain() {
    const brain = new NeuralNetwork();
    const inodes = this.lineNumber + 3;
    brain.add(new Layer({ inodes, onodes: 9, lr: 0.01 }));
    brain.add(new Layer({ onodes: 6, lr: 0.01 }))
    brain.add(new Layer({ onodes: 4 }))
    return brain;
  }

  stateInputs() {
    return [
      map(this.speed, -2, 5, 0, 1),
      map(this.heading, -PI, PI, 0, 1),
      map(this.steerAngle, -this.maxSteerAngle, this.maxSteerAngle, 0, 1)
    ]
  }

  sensoryInputs() {
    const inputs = [];

    for(let i = 0; i < this.visionPoints.length; i++) {
      const point = this.visionPoints[i];

      if(point) {
        const dist = this.position.dist(point);
        const value = map(dist, 0, 150, 0, 1);
        inputs.push(value)
      } else {
        inputs.push(1);
      }
    }

    return inputs;
  }

  inputs() {
    const state = this.stateInputs();
    const sensory = this.sensoryInputs();
    return [...state, ...sensory];
  }

  toggleAuto() {
    this.isAuto = !this.isAuto;
  }

  update() {
    this.getEdgePoints();
    this.getVisionLines();
    this.getVisionPoints();
    this.crossCheckpoint();

    this.constrain();
    this.friction();
    this.move();

    if(this.speed > 0.25) {
      this.points += 0.5;
    }

    this.health -= 0.75;
  }

  constrain() {
    if(this.position.x < 0) this.position.x = 0;
    if(this.position.x > width) this.position.x = width;
    if(this.position.y < 0) this.position.y = 0;
    if(this.position.y > height) this.position.y = height;
  }

  friction() {
    if(this.speed > 0) this.speed -= this.frictionRate;
    if(this.speed < 0) this.speed += this.frictionRate
  }

  shift(dir) {
    if(dir === 'up' && this.gear < 4) this.gear += 1;
    if(dir === 'down' && this.gear > 1) this.gear -= 1;
  }

  steer(dir) {
    if(dir == 'up') {
      if(this.speed < this.gears[this.gear]) this.speed += this.acceleration;
    }

    if(dir == 'down') {
      if(this.speed > 0) this.speed -= this.deceleration;
      else if(abs(this.speed) < this.gears[this.gear]) this.speed -= this.acceleration;
    }

    if(dir == 'left') {
      if(this.steerAngle < this.maxSteerAngle) this.steerAngle += 0.08;
      if(this.steerAngle > this.maxSteerAngle) this.steerAngle = this.maxSteerAngle;
    }

    if(dir == 'right') {
      if(this.steerAngle > -this.maxSteerAngle) this.steerAngle -= 0.08;
      if(this.steerAngle < -this.maxSteerAngle) this.steerAngle = -this.maxSteerAngle;
    }

    if(this.speed < -2) this.speed = -2;
    if(this.speed > 5) this.speed = 5;
  }

  move() {
    const { x, y } = this.position;
    const { heading, wheelBase, steerAngle, speed } = this;
    const front = createVector(x + (wheelBase / 2) * sin(heading), y + (wheelBase / 2) * cos(heading));
    const back = createVector(x - (wheelBase / 2) * sin(heading), y - (wheelBase / 2) * cos(heading));

    front.add(speed * sin(heading + steerAngle), speed * cos(heading + steerAngle))
    back.add(speed * sin(heading), speed * cos(heading))
    this.front = front;
    this.back = back;

    this.position.set(front.x + back.x, front.y + back.y);
    this.position.div(2);
    this.heading = atan2(front.x - back.x, front.y - back.y)
  }

  resetSteer(dir) {
    if(dir == 'right' && this.steerAngle < 0) {
      if(this.steerAngle < -0.1) this.steerAngle += 0.08
      this.steerAngle += 0.01
    }

    if(dir == 'left' && this.steerAngle > 0) {
      if(this.steerAngle > 0.1) this.steerAngle -= 0.08
      this.steerAngle -= 0.01
    }
  }

  isColliding(p1, p2, t1, t2, obj = false) {
    return collideLineLine(p1.x, p1.y, p2.x, p2.y, t1.x, t1.y, t2.x, t2.y, obj);
  }

  rotatePoint({ point, origin, angle }) {
    const x = cos(angle) * (point.x - origin.x) - sin(angle) * (point.y - origin.y) + origin.x
    const y = sin(angle) * (point.x - origin.x) + cos(angle) * (point.y - origin.y) + origin.y
    return createVector(x, y);
  }

  getEdgePoints() {
    const h = this.height / 2;
    const w = this.width / 2;
    const pos = this.position;

    this.edgePoints = [
      createVector(pos.x - w, pos.y - h),
      createVector(pos.x + w, pos.y - h),
      createVector(pos.x - w, pos.y + h),
      createVector(pos.x + w, pos.y + h)
    ].map(point => this.rotatePoint({
      point,
      origin: this.position,
      angle: -this.heading
    }))
  }

  visionLine(angle, length) {
    const start = this.position.copy();
    const end = this.position.copy();
    const delta = createVector(0, end.y);
    delta.rotate(-this.heading + radians(angle)).normalize().mult(length);
    end.add(delta);
    return { start, end }
  }

  getVisionLines() {
    this.visionLines = [
      this.visionLine(0, this.lineLength),
      this.visionLine(30, this.lineLength * 0.7),
      this.visionLine(-30, this.lineLength * 0.7)
    ]

    if(this.lineNumber == 5) {
      this.visionLines.push(
        this.visionLine(65, this.lineLength * 0.5),
        this.visionLine(-65, this.lineLength * 0.5)
      )
    }
  }

  offTrack() {
    let inner = this.track.inner;
    let outer = this.track.outer;
    let offTrack = false;

    for(let i = 0; i < this.edgePoints.length; i++) {
      const point = this.edgePoints[i];
      const next = this.edgePoints[i + 1] || this.edgePoints[0];

      for(let j = 0; j < inner.length; j++) {
        const pointI = inner[j];
        const pointO = outer[j];
        const nextI = inner[j + 1] || inner[0];
        const nextO = outer[j + 1] || outer[0];

        const checkI = this.isColliding(point, next, pointI, nextI);
        if(checkI) {
          offTrack = true;
          break;
        }

        const checkO = this.isColliding(point, next, pointO, nextO);
        if(checkO) {
          offTrack = true;
          break;
        }
      }
    }

    return offTrack;
  }

  getVisionPoints() {
    let inner = this.track.inner;
    let outer = this.track.outer;

    for(let i = 0; i < this.visionLines.length; i++) {
      const { start, end } = this.visionLines[i];

      for(let j = 0; j < inner.length; j++) {
        const pointI = inner[j];
        const pointO = outer[j];
        const nextI = inner[j + 1] || inner[0];
        const nextO = outer[j + 1] || outer[0];

        const checkI = this.isColliding(start, end, pointI, nextI, true);
        const checkO = this.isColliding(start, end, pointO, nextO, true);

        if(checkI.x || checkI.y) {
          const point = createVector(checkI.x, checkI.y);
          this.visionPoints[i] = point;
          break;
        }

        if(checkO.x || checkO.y) {
          const point = createVector(checkO.x, checkO.y);
          this.visionPoints[i] = point;
          break;
        }

        this.visionPoints[i] = null;
      }
    }
  }

  crossCheckpoint() {
    const checkpoints = this.track.checkpoints;
    const checkpoint = checkpoints[this.checkpoint];

    if(checkpoint !== undefined) {
      const [start, end] = checkpoint;

      for(let i = 0; i < this.edgePoints.length; i++) {
        const point = this.edgePoints[i];
        const next = this.edgePoints[i + 1] || this.edgePoints[0];

        const crossed = this.isColliding(point, next, start, end);

        if(crossed) {
          this.checkpoint++;
          this.score += 50;
          this.health += 50;

          if(this.checkpoint >= checkpoints.length) {
            this.checkpoint = 0;
            this.score += 100;
            this.health += 50;
          }

          break;
        }
      }
    }
  }

  windshield() {
    noStroke();
    fill(color(255, 255, 255, 200));
    rect(0, 3, this.width - 2, 4);
  }

  lights() {
    noStroke();
    fill(color(255));
    circle(-5, this.height / 2, 3, 3);
    circle(5, this.height / 2, 3, 3);
  }

  body() {
    noStroke();
    const alpha = map(this.health, 0, 200, 50, 200);
    this.color.setAlpha(alpha);
    fill(this.color);
    rect(0, 0, this.width, this.height);
  }

  showEdgePoints() {
    this.edgePoints.forEach(point => {
      noStroke();
      fill(this.pointColor);
      circle(point.x, point.y, 3);
    })
  }

  showVisionLines() {
    this.visionLines.forEach(({ start, end }) => {
      stroke(this.lineColor);
      line(start.x, start.y, end.x, end.y);
    })
  }

  showVisionPoints() {
    this.visionPoints.forEach((point) => {
      if(point !== null) {
        fill(this.pointColor);
        circle(point.x, point.y, 5);
      }
    })
  }

  showCheckpoint() {
    const checkpoints = this.track.checkpoints;
    const checkpoint = checkpoints[this.checkpoint];

    if(checkpoint) {
      const [start, end] = checkpoint;
      strokeWeight(2);
      stroke(config.green);
      line(start.x, start.y, end.x, end.y)
      strokeWeight(1)
    }
  }

  show() {
    if(config.edgePoints) {
      this.showEdgePoints();
    }

    if(config.visionLines) {
      this.showVisionLines();
    }

    if(config.visionPoints) {
      this.showVisionPoints();
    }

    if(config.currentCheckpoint) {
      this.showCheckpoint();
    }

    push();
    rectMode(CENTER)
    translate(this.position.x, this.position.y);
    rotate(-this.heading);
    this.body();
    this.lights();
    this.windshield();
    pop();
  }

  getData() {
    return this.brain.layers.reduce((r, e, i) => {
      const layer = {}
      layer.weights = e.weights;
      layer.bias = e.bias;
      r.push(layer)
      return r;
    }, [])
  }

  loadData(data) {
    for(let i = 0; i < this.brain.layers.length; i++) {
      const layer = this.brain.layers[i];
      Object.assign(layer.weights, data[i].weights);
      Object.assign(layer.bias, data[i].bias);
    }
  }
}