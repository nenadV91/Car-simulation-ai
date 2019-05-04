class Car {
  constructor(opts = {}) {
    this.opts = opts;
    this.x = opts.x;
    this.y = opts.y;
    this.width = 15;
    this.height = 25;

    this.steerAngle = 0;
    this.maxSteerAngle = PI / 4;
    this.speed = 0;
    this.maxSpeed = 2;
    this.heading = PI;
    this.frictionRate = 0.025;
    this.acceleration = 0.2;
    this.deceleration = 0.05;
    this.wheelSize = 5;

    this.initialColor = color(70, 70, 70);
    this.errorColor = color(255, 0, 0);
    this.color = this.initialColor;

    this.wheelBase = this.height;
    this.front = createVector(0, 0);
    this.back = createVector(0, 0);

    this.gear = 1;
    this.gears = {
      1: 2,
      2: 2.5,
      3: 3,
      4: 3.5
    }

    this.position = createVector(this.x, this.y);
    this.velocity = createVector(0, 0);

    this.edgePoints = [];
    this.visionLines = [];
    this.visionPoints = [];
  }

  update() {
    this.constrain();
    this.friction();
    this.move();
    this.getEdgePoints();
  }

  constrain() {
    if(this.position.x < 0) this.position.x = width;
    if(this.position.x > width) this.position.x = 0;
    if(this.position.y < 0) this.position.y = height;
    if(this.position.y > height) this.position.y = 0;
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

  drive(track) {
    let inner = track.inner;
    let outer = track.outer;
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

  windshield() {
    noStroke();
    fill(color(255, 255, 255, 200));
    rect(0, 5, this.width - 2, 5);
  }

  lights() {
    noStroke();
    fill(color(255));
    circle(-5, this.height / 2, 3, 3);
    circle(5, this.height / 2, 3, 3);
  }

  body() {
    noStroke();
    fill(this.color);
    rect(0, 0, this.width, this.height);
  }

  points() {
    this.edgePoints.forEach(point => {
      noStroke();
      fill(this.errorColor);
      circle(point.x, point.y, 3);
    })
  }

  show() {
    push();
    rectMode(CENTER)
    translate(this.position.x, this.position.y);
    rotate(-this.heading);
    this.body();
    this.lights();
    this.windshield();
    pop();

    this.points();
  }
}