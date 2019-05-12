class Track {
  constructor({ tracks, selected }) {
    this.tracks = tracks;
    this.selected = selected || 0;

    this.data = this.tracks[this.selected];
    this.checkpointColor = color(config.trackCheckpointColor);
    this.stroke = color(config.trackStroke);
    this.fill = color(config.trackFill);
    this.init();
  }

  init() {
    if(typeof this.data !== 'object') {
      throw new Error('data param must be and object.')
    }

    if(!this.data.inner || !this.data.outer) {
      throw new Error("data must have inner and outer lines.")
    }

    if(typeof this.data.inner !== 'string' || typeof this.data.outer !== 'string') {
      throw new Error("Inner and outer lines must be strings.")
    }

    this.inner = this.toArray(this.data.inner);
    this.outer = this.toArray(this.data.outer).reverse();
    this.checkpoints = this.data.checkpoints || [];
    this.start = this.data.start || { x: 50, y: 50 }
    this.heading = this.data.heading || 180;
  }

  reverse() {
    this.checkpoints.reverse();
    this.heading = this.data.reverseHeading;
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

  change(selected) {
    this.selected = selected;
    this.data = this.tracks[this.selected];
    this.init();
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