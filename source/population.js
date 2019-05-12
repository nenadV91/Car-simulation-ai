class Population {
  constructor(Unit, opts = {}) {
    this.opts = opts;
    this.Unit = Unit;

    this.generation = 1;
    this.active = [];
    this.saved = [];
    this.pool = [];

    this.create()
  }

  get isEmpty() {
    return !this.active.length;
  }

  get best() {
    this.active.sort((a, b) => b.score - a.score);
    return this.active[0];
  }

  create() {
    for(let i = 0; i < config.populationTotal; i++) {
      this.active.push(new this.Unit(this.opts));
    }
  }

  killActive() {
    for(let i = this.active.length - 1; i >= 0; i--) {
      this.remove(i);
    }
  }

  remove(index) {
    const [unit] = this.active.splice(index, 1);
    this.saved.push(unit);
  }

  load(data) {
    for(let i = this.active.length - 1; i >= 0; i--) {
      const unit = this.active[i];
      unit.loadData(data);
      this.remove(i);
    }
  }

  reset() {
    this.active = [];
    this.saved = [];
    this.pool = [];
    this.generation = 1;
    this.score = 0;
    this.create();
  }

  update() {
    this.calcFitness();
    this.nextGeneration();

    this.saved.length = 0;
    this.pool.length = 0;
    this.generation += 1;
    this.score = 0;

    this.timeout = setTimeout(() => {
      this.imortal = false;
    }, 1000)
  }

  pick() {
    let index = 0;
    let r = random(1);

    while(r > 0) {
      r = r - this.pool[index].fitness;
      index++
    }

    index--;
    return this.pool[index];
  }

  calcFitness() {
    this.saved.sort((a, b) => {
      return a.score - b.score
    });

    this.pool = this.saved.slice(-5).filter(Boolean);

    const total = this.pool.reduce((r, e) => {
      if(e) return r + e.score;
      else return r;
    }, 0);

    this.pool.forEach(unit => {
      unit.fitness = unit.score / total;
    })
  }

  nextGeneration() {
    for(let i = 0; i < config.populationTotal; i++) {
      const parent = this.pick();
      const brain = { ...this.opts, brain: parent.brain }
      const child = new this.Unit(brain);
      this.active.push(child);
    }
  }
}