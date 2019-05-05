class Matrix {
  constructor(rows = 2, cols = 2, value = 1) {
    this.rows = rows;
    this.cols = cols;
    this.data = this.create(value);
  }

  get size() {
    return `${this.rows}x${this.cols}`
  }

  create(value) {
    return Array.from(Array(this.rows), () => {
      return Array(this.cols).fill(value)
    })
  }

  forEach(callback) {
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        const el = this.data[i][j];
        this.data[i][j] = callback(el, i, j);
      }
    }
  }

  map(callback) {
    let clone = this.clone();
    clone.forEach((e, r, c) => callback(e, r, c));
    return clone;
  }

  clone() {
    const clone = new Matrix(this.rows, this.cols);
    clone.forEach((el, r, c) => this.data[r][c]);
    return clone;
  }

  rand(min = -1, max = 1) {
    return Math.random() * (max - min) + min;
  }

  randomize(min, max) {
    this.forEach(el => {
      const result = this.rand(min, max);
      return Math.round(result * 1000) / 1000;
    })
  }

  add(value) {
    if(value instanceof Matrix) {
      this.equalCheck(this, value);
      this.forEach((el, row, col) => {
        return el + value.data[row][col]
      })
    } else {
      this.forEach(e => e + value)
    }
  }

  subtract(value) {
    if(value instanceof Matrix) {
      this.equalCheck(this, value);
      this.forEach((el, row, col) => {
        return el - value.data[row][col]
      })
    } else {
      this.forEach(e => e - value)
    }
  }

  multiply(value) {
    if(value instanceof Matrix) {
      this.equalCheck(this, value);
      this.forEach((el, row, col) => {
        return el * value.data[row][col]
      })
    } else {
      this.forEach(e => e * value)
    }
  }

  equalCheck(a, b) {
    if(a.rows != b.rows) {
      let error = [
        'Rows do not match.',
        `First row: ${a.rows}, second row: ${b.rows}`
      ]

      throw new Error(error.join(' '))
    }

    if(a.cols != b.cols) {
      let error = [
        'Columns do not match.',
        `First column: ${a.cols}, second column: ${b.cols}`
      ]

      throw new Error(error.join(' '))
    }
  }

  toArray() {
    return [].concat(...this.data);
  }

  static fromArray(array, strict = true, empty = 1) {
    const first = array[0];
    const check = array.every(el => {
      return el.length === first.length;
    })

    if(!strict) {
      var max = array.map(e => e.length).sort().slice(-1)
    }

    if(!check && strict) {
      let error = 'Elements do not have equal size.'
      throw new Error(error)
    }

    let result = null;

    if(Array.isArray(first)) {
      result = new Matrix(array.length, first.length);
      for(let i = 0; i < array.length; i++) {
        for(let j = 0; j < max; j++) {
          result.data[i][j] = array[i][j] || empty;
        }
      }
    } else {
      result = new Matrix(array.length, 1);
      array.forEach((el, i) => result.data[i] = [el])
    }

    return result;
  }

  static dot(m1, m2) {
    if(!(m1 instanceof Matrix) || !(m2 instanceof Matrix)) {
      let error = 'Inputs must be of type Matrix.'
      throw new Error(error)
    }

    if(m1.cols != m2.rows) {
      let error = [
        'Inputs don\'t match in size.',
        `\nFirst element columns: ${m1.cols}.`,
        `Second element rows: ${m2.rows}.`
      ]

      throw new Error(error.join(' '))
    }

    const result = new Matrix(m1.rows, m2.cols, 0);
    for(let i = 0; i < m1.rows; i++) {
      for(let j = 0; j < m2.cols; j++) {
        for(let n = 0; n < m2.rows; n++) {
          const a = m1.data[i][n]
          const b = m2.data[n][j]
          result.data[i][j] += a * b
        }
      }
    }

    return result;
  }

  static subtract(m1, m2) {
    const result = m1.clone();
    result.subtract(m2);
    return result;
  }

  static T(value) {
    if(!(value instanceof Matrix)) {
      const error = 'Input is not instance of Matrix.';
      throw new Error(error);
    }

    const result = new Matrix(value.cols, value.rows);
    for(let i = 0; i < value.rows; i++) {
      for(let j = 0; j < value.cols; j++) {
        result.data[j][i] = value.data[i][j]
      }
    }

    return result;
  }

  print() {
    console.table(this.data)
  }
}