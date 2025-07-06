const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

var margin = {top: 80, right: 25, bottom: 30, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];

var svg = d3.select("body")
  .append('div')
  .append("svg")
  .attr('id', 'graph')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(url).then(function(data){
  dataset = data.monthlyVariance;
  dataset.forEach(d => {
    year = dataset.map(d => d.year);
     year = year.filter(function(v, i) {
      return year.indexOf(v) == i;
    });
      d.month = +d.month;
      variance = dataset.map(d => d.variance);
  });

var minVar = d3.min(variance);
var maxVar = d3.max(variance);

var minYear = d3.min(year);
var maxYear = d3.max(year);
var startDate = new Date(minYear, 0);
var endDate = new Date(maxYear, 0);

var rectWidth = width/year.length;
var rectHeight = height/month.length;

var x = d3.scaleTime()
  .domain([startDate, endDate])
  .range([0, width]);

g.append("g")
  .attr('id', 'x-axis')
  .style("font-size", 12)
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).ticks(d3.timeYear.every(10)));

var y = d3.scaleBand()
  .range([0, height])
  .domain(month);

g.append("g")
  .attr('id', 'y-axis')
  .style("font-size", 15)
  .call(d3.axisLeft(y).tickSize(0))
  .select(".domain").remove();

var myColor = d3.scaleQuantile()
  .domain([minVar+8.66, maxVar+8.66])
  .range(colors);

var tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("id", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style('position', 'absolute');

var temps = g.selectAll('rect')
  .data(dataset, d => (d.year + ':' + d.month))
  .enter()
  .append('rect')
  .attr('class', 'cell')
  .attr('data-year', d => d.year)
  .attr('data-month', d => d.month-1)
  .attr('data-temp', d => d.variance+8.66)
  .attr('x', d => (d.year-minYear)*rectWidth)
  .attr('y', d => (d.month-1)*rectHeight)
  .attr('rx', 0)
  .attr('ry', 0)
  .attr('width', rectWidth)
  .attr('height', rectHeight)
  .style("fill", 'white')
  .style("stroke-width", 4)
  .style("stroke", "none")
  .style("opacity", 0.8)
  .on("mouseover", function(event, d) {
    tooltip
      .attr('data-year', d.year)
      .transition()
      .duration(200)
      .style("opacity", 1);
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);
  })
  .on("mousemove", function(event, d) {
    tooltip
      .attr('data-year', d.year);
    tooltip
      .html(d.year + ':' + d.month + '<br>' + d.variance)
      .style("left", event.pageX + "px")
      .style("top", event.pageY + "px");})
  .on("mouseleave", function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0);
    d3.select(this)
      .style("stroke", "none");
  });

temps.transition()
  .duration(1000)
  .style('fill', d => myColor(d.variance + 8.66));

});

d3.select("body")
  .append('div')
  .attr('id', 'container')
  .append('svg')
  .attr('id', 'legend')
  .selectAll('rect')
  .data(colors)
  .enter()
  .append('rect')
  .attr('x', (d, i) => 30*i)
  .attr('y', 15)
  .attr('width', '30px')
  .attr('height', '30px')
  .style('fill', (d, i) => colors[i]);

labels = [0, 2.7, 3.9, 5, 6.1, 7.2, 8.3, 9.4, 10.5, 11.6, 12.7];

d3.select('#legend')
  .selectAll('text')
  .data(labels)
  .enter()
  .append('text')
  .attr('x', (d, i) => 5+30*i)
  .attr('y',  12)
  .text((d, i) => labels[i])
  .style('fill', 'black');


