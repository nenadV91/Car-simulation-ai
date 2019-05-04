class Stats {
  constructor(car) {
    this.car = car;
    this.count = 0;
    this.stats = []
  }

  add(label, key, value) {
    const index = this.count += 1;
    this.stats.push({ key, label, index, value })
  }

  show() {
    this.stats.forEach(({ key, label, index, value }) => {
      const val = value ? value(this.car) : this.car[key].toFixed(2);
      const string = `${label}: ${val}`

      fill(1)
      noStroke()
      textSize(12)
      text(string, 15, height - index * 15)
    })
  }
}