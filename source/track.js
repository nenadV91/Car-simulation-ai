class Track {
  constructor(data) {
    this.data = data;
    this.checkpointColor = color(134, 200, 248)
    this.stroke = color(44, 60, 80);
    this.fill = color(255);

    if(typeof data !== 'object') {
      throw new Error('data param must be and object.')
    }

    if(!data.inner || !data.outer) {
      throw new Error("data must have inner and outer lines.")
    }

    if(typeof data.inner !== 'string' || typeof data.outer !== 'string') {
      throw new Error("Inner and outer lines must be strings.")
    }

    this.inner = this.toArray(data.inner);
    this.outer = this.toArray(data.outer).reverse();
    this.checkpoints = data.checkpoints || [];
    this.start = data.start || { x: 50, y: 50 }
    this.heading = data.heading || 180;
  }


  toArray(line) {
    return line.split(' ').map(e => {
      const [x, y] = e.split(',');
      return createVector(x, y);
    })
  }

  showLine(line) {
    line.forEach(({ x, y }) => vertex(+x, +y))
  }

  showCheckpoints() {
    this.checkpoints.forEach(([start, end]) => {
      noFill();
      stroke(this.checkpointColor)
      line(start.x, start.y, end.x, end.y);
    })
  }

  show() {
    fill(this.fill);
    stroke(this.stroke);

    beginShape();
    this.showLine(this.outer);
    beginContour()
    this.showLine(this.inner);
    endContour()
    endShape(CLOSE);

    if(config.checkpoints) {
      this.showCheckpoints();
    }
  }
}