class Controls {
  constructor(params) {
    this.params = params;
    this.track = params.track;
    this.population = params.population;
    this.trainedData = trainedData;

    this.$reset = $("#reset-all");
    this.$trackSelect = $("#track-select");
    this.$unitsSlider = $("#total-units-slider");
    this.$mutationSlider = $("#mutation-rate-slider");
    this.$visionLinesSlider = $("#vision-line-length-slider");
    this.$killActive = $("#kill-active");
    this.$visionLines = $("#vision-lines");
    this.$visionPoints = $("#vision-points");
    this.$checkpoints = $("#checkpoints");
    this.$toggleButtons = $(".toggle-button");
    this.$saveData = $("#save-data");
    this.$loadData = $("#load-data");
    this.$loaded = $("#loaded-data");
    this.$clear = $("#clear-data");
    this.$apply = $("#apply-data");
    this.$reverse = $("#reverse");
    this.$preTrained = $("#pre-trained-data");

    this.initSliders = this.initSliders.bind(this);
    this.trackSelect = this.trackSelect.bind(this);
    this.killActive = this.killActive.bind(this);
    this.reset = this.reset.bind(this);
    this.save = this.save.bind(this);
    this.upload = this.upload.bind(this);
    this.clear = this.clear.bind(this);
    this.apply = this.apply.bind(this);
    this.readerLoad = this.readerLoad.bind(this);
    this.reverse = this.reverse.bind(this);
    this.selectTrained = this.selectTrained.bind(this);

    this.$reset.on('click', this.reset);
    this.$trackSelect.on('change', this.trackSelect);
    this.$killActive.on('click', this.killActive);
    this.$saveData.on('click', this.save);
    this.$loadData.on('change', this.upload);
    this.$clear.on('click', this.clear);
    this.$apply.on('click', this.apply);
    this.$preTrained.on('change', this.selectTrained);
    this.$visionLines.on('click', (e) => this.toggle('visionLines', e));
    this.$visionPoints.on('click', (e) => this.toggle('visionPoints', e));
    this.$checkpoints.on('click', (e) => this.toggle('checkpoints', e));
    this.$reverse.on('click', this.reverse);

    this.$toggleButtons.each(function() {
      if(config[$(this).data('config')]) {
        $(this).addClass('active');
      }
    })

    this.reader = new FileReader();
    this.initPretrained();
    this.initSliders();
  }

  initPretrained() {
    if(this.trainedData) {
      this.trainedData.forEach((el, index) => {
        const option = $("<option />", {
          value: index,
          text: `Pre-trained ${index + 1}`
        })

        this.$preTrained.append(option)
      })
    }
  }

  selectTrained(event) {
    const value = event.target.value;
    const data = this.trainedData[value];
    const input = JSON.stringify(data, 0, 4)
    this.$loaded.val(input);
  }

  reverse(event) {
    this.track.reverse();
    this.killActive();
    config.reverse = !config.reverse;
  }

  clear() {
    this.$loaded.val('');
  }

  apply() {
    const value = this.$loaded.val();

    if(value.length) {
      try {
        const data = JSON.parse(value);

        if(Array.isArray(data)) {
          population.load(data);
          this.$loaded.val("");
        }
      } catch (err) {
        console.log('Not valid data type.')
      }
    }
  }

  upload(event) {
    const file = event.target.files[0];

    if(file) {
      this.reader.onload = this.readerLoad;
      this.reader.readAsText(file);
      this.$loaded.focus()
    }
  }

  readerLoad(event) {
    var data = event.target.result;
    this.$loaded.val(data)
  }

  save() {
    const data = population.best.getData();
    saveJSON(data, 'data.json')
  }

  toggle(value, event) {
    config[value] = !config[value];
    $(event.target).toggleClass('active', config[value]);
  }

  reset() {
    time = 0;
    this.population.reset();
  }

  killActive() {
    this.population.killActive();
  }

  trackSelect(event) {
    const value = int(event.target.value);

    if(config.reverse) {
      this.track.reverse();
      config.reverse = false;
    }

    this.track.change(value);
    this.population.killActive();
  }

  initSliders() {
    const that = this;

    this.$unitsSlider.ionRangeSlider({
      min: 1,
      max: 250,
      grid: true,
      skin: "modern",
      from: config.populationTotal,
      onFinish: function(data) {
        config.populationTotal = data.from;
      }
    });

    this.$mutationSlider.ionRangeSlider({
      min: 0,
      max: 1,
      step: 0.01,
      grid: true,
      skin: "modern",
      from: config.mutationRate,
      onFinish: function(data) {
        config.mutationRate = data.from;
      }
    });

    this.$visionLinesSlider.ionRangeSlider({
      min: 30,
      max: 200,
      step: 1,
      grid: true,
      skin: "modern",
      from: config.lineLength,
      onFinish: function(data) {
        config.lineLength = data.from;
      }
    });
  }
}