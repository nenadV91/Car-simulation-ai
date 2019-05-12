class Stats {
  constructor({ population }) {
    this.population = population;
    this.count = 0;
    this.stats = []
  }

  add(label, key, value) {
    const index = this.count += 1;
    this.stats.push({ key, label, index, value })
  }

  show() {
    this.stats.forEach(({ key, label, index, value }) => {
      const val = value ? value(this.population) : this.population[key].toFixed(2);
      const string = `${label}: ${val}`

      fill(1);
      noStroke();
      textSize(10);
      text(string, 30, (15 + index * 15));
    })
  }
}