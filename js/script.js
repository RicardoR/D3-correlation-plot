// Graph dimension
var margin = { top: 60, right: 40, bottom: 20, left: 80 };
var baseSide = 400;
var width = baseSide - margin.left - margin.right;
var height = baseSide - margin.top - margin.bottom;

// Create the svg area
var svg = d3
  .select('#my_dataviz')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

d3.csv('data/data.csv').then((rows) => {
  // Going from wide to long format
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

  // List of all variables and number of them
  var domainX = d3.set(data.map((d) => d.x)).values();
  var domainY = d3.set(data.map((d) => d.y)).values();

  var maxDomain =
    domainX.length > domainY.length ? domainX.length : domainY.length;

  var myColor = d3.scaleOrdinal().domain(domainX).range(d3.schemeDark2);

  const maxBubbleSize = baseSide / (maxDomain * 2.2) - 1;
  // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
  var size = d3.scaleSqrt().domain([0, 1]).range([0, maxBubbleSize]);

  // X scale
  var x = d3.scalePoint().range([0, width]).domain(domainX);

  // Y scale
  var y = d3.scalePoint().range([0, height]).domain(domainY);

  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${-maxBubbleSize})`)
    .call(d3.axisTop(x).tickSize(0))
    .select('.domain')
    .remove();

  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${-maxBubbleSize}, 0)`)
    .call(d3.axisLeft(y).tickSize(0))
    .select('.domain')
    .remove();

  // Create one 'g' element for each cell of the correlogram
  var cor = svg
    .selectAll('.cor')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'cor')
    .attr('transform', (d) => `translate(${x(d.x)}, ${y(d.y)})`);

  // Up right part: add circles
  cor
    .append('circle')
    .attr('r', (d) => size(Math.abs(d.value)))
    .style('fill', (d) => myColor(d.x));

  cor
    .append('text')
    .attr('y', 3)
    .attr('text-anchor', 'middle')
    .attr('class', 'label')
    .text((d) => d3.format('.0%')(d.value));
});
