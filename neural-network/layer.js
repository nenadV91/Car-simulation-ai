class Layer {
  constructor(opts) {
    this.opts = opts;
    this.inodes = opts.inodes;
    this.onodes = opts.onodes;
    this.activationType = opts.activation || 'sigmoid';
    this.lr = opts.lr || 0.1;
  }

  initWeights() {
    this.weights = new Matrix(this.onodes, this.inodes);
    this.weights.randomize();
  }

  initBias() {
    this.bias = new Matrix(this.onodes, 1);
    this.bias.randomize();
  }

  initActivation() {
    this.activation = new Activation(this.activationType)
  }

  activate() {
    this.initWeights();
    this.initBias();
    this.initActivation();
  }

  train(input) {
    this.input = input;
    this.output = Matrix.dot(this.weights, this.input);
    this.output.add(this.bias);

    if(this.activation.useX) {
      this.outputX = this.output.clone();
    }

    this.output.forEach(this.activation.func);
  }

  update({ target, prev }) {
    let error = null;
    let input = Matrix.T(this.prev ? this.prev.output : this.input);

    if(target) {
      error = Matrix.subtract(target, this.output);
    } else {
      const weightsT = Matrix.T(prev.weights);
      const prevError = prev.error;
      error = Matrix.dot(weightsT, prevError);
    }

    this.error = error;

    if(this.activation.useX) {
      this.gradient = this.outputX.map(this.activation.dfunc);
    } else {
      this.gradient = this.output.map(this.activation.dfunc);
    }

    this.gradient.multiply(this.error);
    this.gradient.multiply(this.lr);

    this.deltaW = Matrix.dot(this.gradient, input);

    this.weights.add(this.deltaW);
    this.bias.add(this.gradient);
  }

  clone() {
    const clone = new Layer(this.opts);
    clone.weights = this.weights.clone();
    clone.bias = this.bias.clone();
    clone.initActivation();
    return clone;
  }
}