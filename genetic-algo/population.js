class Population {
  constructor(Unit, total = 100) {
    this.generation = 1;
    this.imortal = false;
    this.Unit = Unit;
    this.total = total;
    this.active = [];
    this.saved = [];
    this.pool = [];
    this.score = 0;
    this.mutationRate = 0.2;

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
    for(let i = 0; i < this.total; i++) {
      this.active.push(new this.Unit());
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

  update() {
    if(frameCount % 5 === 0) {
      this.score += 1;
    }
  }

  load(data) {
    for(let i = this.active.length - 1; i >= 0; i--) {
      const unit = this.active[i];
      unit.loadData(data);
      this.remove(i);
    }
  }

  reset() {
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

    this.pool = this.saved.slice(-20);

    const total = this.pool.reduce((r, e) => {
      return r + e.score
    }, 0);

    this.pool.forEach(unit => {
      unit.fitness = unit.score / total;
    })
  }

  nextGeneration() {
    for(let i = 0; i < this.total; i++) {
      const parent = this.pick();
      const child = new this.Unit({
        brain: parent.brain,
        mutationRate: this.mutationRate
      });
      this.active.push(child);
    }
  }
}