function processTrack() {
  const innerEl = $("#inner");
  const outerEl = $("#outer");
  const checkpointsEl = $("#checkpoints line");
  const carEl = $("#car circle");

  function getTrack(el) {
    return el.attr('points').replace(/\s+/g, " ").trim()
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

  return JSON.stringify(data)
}


function toTime(input) {
  var sec_num = parseInt(input, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if(hours < 10) { hours = "0" + hours; }
  if(minutes < 10) { minutes = "0" + minutes; }
  if(seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds;
}