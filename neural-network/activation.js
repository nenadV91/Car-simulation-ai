function leakyRelu(x) {
  if(x > 0) return x;
  else return 0.01 * x;
}

const sigmoid = {
  func: x => 1 / (1 + Math.exp(-x)),
  dfunc: y => y * (1 - y)
}

const relu = {
  func: x => x < 0 ? 0 : x,
  dfunc: y => y < 0 ? 0 : 1,
  useX: true
}

const tanh = {
  func: x => Math.tanh(x),
  dfunc: y => 1 - (y * y)
}

const softplus = {
  func: x => Math.log(1 + Math.exp(x)),
  dfunc: y => 1 / 1 + Math.exp(-y),
  useX: true
}

class Activation {
  constructor(type) {
    this.type = type.toLowerCase();
    this.func = this.select.func;
    this.dfunc = this.select.dfunc;
    this.useX = this.select.useX || false;
  }

  get select() {
    switch (this.type) {
      case 'sigmoid':
        return sigmoid;
        break;

      case 'relu':
        return relu;
        break;

      case 'tanh':
        return tanh;
        break;

      default:
        return sigmoid;
    }
  }
}