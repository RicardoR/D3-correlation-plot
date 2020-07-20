// Todo: update to v5!

d3.csv('./data/data_correlogram_original.csv', function (error, rows) {
  var data = [];

  rows.forEach(function (d) {
    var x = d[''];
    delete d[''];
    for (prop in d) {
      var y = prop,
        value = d[prop];
      data.push({
        x: x,
        y: y,
        value: +value,
      });
    }
  });

  var margin = {
      top: 25,
      right: 80,
      bottom: 25,
      left: 25,
    },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    domain = d3.set(data.map((d) => d.x)).values(),
    num = Math.sqrt(data.length),
    color = d3
      .scaleLinear()
      .domain([-1, 0, 1])
      .range(['#B22222', '#fff', '#000080']);

  var x = d3.scalePoint().range([0, width]).domain(domain),
    y = d3.scalePoint().range([0, height]).domain(domain),
    xSpace = x.range()[1] - x.range()[0],
    ySpace = y.range()[1] - y.range()[0];
  ySpace = y.range()[1] - y.range()[0];

  var svg = d3
    .select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  var cor = svg
    .selectAll('.cor')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'cor')
    .attr('transform', (d) => `translate(${x(d.x)}, ${y(d.y)})`);

  //edited to fit with v4 update  2/5/18
  cor
    .append('rect')
    .attr('width', xSpace / 10)
    .attr('height', ySpace / 10)
    .attr('x', -xSpace / 20)
    .attr('y', -ySpace / 20);

  cor
    .filter(function (d) {
      var ypos = domain.indexOf(d.y);
      var xpos = domain.indexOf(d.x);
      for (var i = ypos + 1; i < num; i++) {
        if (i === xpos) return false;
      }
      return true;
    })
    .append('text')
    .attr('y', 5)
    .text((d) => (d.x === d.y ? d.x : d.value.toFixed(2)))
    .style('fill', (d) => (d.value === 1 ? '#000' : color(d.value)));

  cor
    .filter(function (d) {
      var ypos = domain.indexOf(d.y);
      var xpos = domain.indexOf(d.x);
      for (var i = ypos + 1; i < num; i++) {
        if (i === xpos) return true;
      }
      return false;
    })
    .append('circle')
    .attr('r', (d) => (width / (num * 2)) * (Math.abs(d.value) + 0.1))
    .style('fill', (d) => (d.value === 1 ? '#000' : color(d.value)));

  var aS = d3
    .scaleLinear()
    .range([-margin.top + 5, height + margin.bottom - 5])
    .domain([1, -1]);

  var yA = d3.axisRight().scale(aS).tickPadding(7);

  var aG = svg
    .append('g')
    .attr('class', 'y axis')
    .call(yA)
    .attr('transform', `translate( ${width + margin.right / 2},0)`);

  var iR = d3.range(-1, 1.01, 0.01);
  var h = height / iR.length + 3;
  iR.forEach(function (d) {
    aG.append('rect')
      .style('fill', color(d))
      .style('stroke-width', 0)
      .style('stoke', 'none')
      .attr('height', h)
      .attr('width', 10)
      .attr('x', 0)
      .attr('y', aS(d));
  });
});
