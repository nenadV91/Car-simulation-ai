class Track {
  constructor(data) {
    this.data = data;
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

  show() {
    fill(this.fill);
    stroke(this.stroke);

    beginShape();
    this.showLine(this.outer);
    beginContour()
    this.showLine(this.inner);
    endContour()
    endShape(CLOSE);
  }
}