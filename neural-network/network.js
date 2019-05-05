class NeuralNetwork {
  constructor() {
    this.layers = [];
  }

  get isFirst() {
    return !this.layers.length;
  }

  get prev() {
    return this.layers.slice(-1)[0];
  }

  add(layer) {
    if(!this.isFirst) {
      if(this.prev) {
        layer.prev = this.prev;
        layer.inodes = this.prev.onodes;
      }
    } else {
      if(!layer.inodes) {
        const error = 'inodes must be defined on first layer';
        throw new Error(error);
      }
    }

    this.layers.push(layer);
    layer.activate();
  }

  query(input) {
    let prev = undefined;
    let layers = this.layers;

    for(let i = 0; i < layers.length; i++) {
      let layer = layers[i];
      if(!prev) layer.train(input);
      else layer.train(prev.output);
      prev = layer;
    }

    return prev.output.toArray();
  }

  update(target) {
    let prev = undefined;
    let layers = this.layers;

    for(let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      if(!prev) layer.update({ target });
      else layer.update({ prev });
      prev = layer;
    }
  }

  predict(input) {
    return this.query(Matrix.fromArray(input));
  }

  mutate(rate = 0.1) {
    this.layers.forEach(layer => {
      layer.weights.forEach(mutation);
    })

    function mutation(x) {
      if(random(1) < rate) {
        let offset = randomGaussian() * 0.5;
        let newx = x + offset;
        return newx;
      } else {
        return x;
      }
    }
  }

  clone() {
    const clone = new NeuralNetwork();
    this.layers.forEach(layer => {
      clone.layers.push(layer.clone())
    });
    return clone;
  }
}