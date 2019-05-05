const innerEl = $("#inner");
const outerEl = $("#outer");
const checkpointsEl = $("#checkpoints line");
const carEl = $("#car circle");

function getTrack(el) {
  return el.attr('points').replace(/\s+/g, " ");
}

function getStart(el) {
  return {
    x: +el.attr('cx'),
    y: +el.attr('cy')
  }
}

function getCheckpoints(el) {
  return el.map(function() {
    const { x1, y1, x2, y2 } = this.attributes;
    return [
      [{
        x: Math.round(x1.value),
        y: Math.round(y1.value)
      }, {
        x: Math.round(x2.value),
        y: Math.round(y2.value)
      }]
    ]
  }).get();
}

const data = {
  inner: getTrack(innerEl),
  outer: getTrack(outerEl),
  start: getStart(carEl),
  checkpoints: getCheckpoints(checkpointsEl)
}

console.log(JSON.stringify(data))