const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

var consoles = ['Wii', 'GB', 'PS2', 'SNES', 'GBA', '2600', 'DS', 'PS3', '3DS', 'PS', 'XB', 'PSP', 'X360', 'NES', 'PS4', 'N64', 'PC', 'XOne'];

var colorScheme = ["#406677", "#D18975", "#8FD175", "#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142", 'red', 'aqua', 'green', 'grey'];

const margin = {top: 50, right: 50, bottom: 50, left: 50},
      width = 1000 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;

const svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json(url).then(function(data) {

var root = d3.hierarchy(data)
  .eachBefore(function(d){
    d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
  })
  .sum(d => d.value)
  .sort((a, b) => b.height-a.height || b.value - a.value);

d3.treemap()
    .size([width, height])
    .paddingTop(5)
    .paddingRight(5)
    .paddingInner(5)
    (root);

const color = d3.scaleOrdinal()
    .domain(consoles)
    .range(colorScheme);

const opacity = d3.scaleLinear()
    .domain([10, 30])
    .range([0.5,1]);

var tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style("opacity", 0);

 var g = svg.append('g')
    .attr('transform', 'translate(0, 20)');

   g.selectAll("rect")
    .data(root.leaves())
    .join("rect")
    .attr('class', 'tile')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('data-name', d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr('data-value', d => d.data.value)
      .style("stroke", "black")
      .style("fill", d => color(d.data.category))
      .style("opacity", 0.7)
      .on('mouseover', function(event, d){
        tooltip.attr('data-value', d.data.value)
          .transition()
          .duration(200)
          .style('opacity', 0.7);
        tooltip.html(d.data.category + ': ' + d.data.name + '<br>' + d.data.value)
          .style('left', event.pageX + 'px')
          .style('top', event.pageY + 'px');
      })
    .on('mouseout', function(d){
        tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      });

 g.selectAll('text')
      .data(root.leaves())
      .enter()
      .append('text')
      .selectAll('tspan')
      .data(d => {
       return d.data.name.split(/(?=[A-Z][^A-Z])/g).map(v => {
         return {  text: v,
                   x0: d.x0,
                   y0: d.y0
                };
              });
       })
      .enter()
      .append('tspan')
      .attr('id', 'tile-text')
      .attr("x", d => d.x0 + 2)
      .attr("y", (d, i) => d.y0 + 10 + (i * 10))
      .text(d => d.text);

});

svg.append("text")
      .attr("x", 300)
      .attr("y", -20)
      .text("Video Game Sales")
      .attr("font-size", "35px")
      .attr("fill",  "white" )
      .style('font-weight', 'bold');

svg.append("text")
      .attr('id', 'description')
      .attr("x", 100)
      .attr("y", 25)
      .text("Top 100 Most Sold Video Games Grouped by Platform")
      .attr("font-size", "27px")
      .attr("fill",  "white" );

d3.select('#legend')
     .selectAll('rect')
     .data(colorScheme)
     .enter()
     .append('rect')
     .attr('class', 'legend-item')
     .attr('x', 10)
     .attr('y', (d, i) => 20 + i*45)
     .attr('width', '40px')
     .attr('height', '40px')
     .style('fill', (d, i) => colorScheme[i]);

d3.select('#legend')
  .selectAll('text')
  .data(consoles)
  .enter()
  .append('text')
  .attr('x', 60)
  .attr('y', (d, i) => 45 + i*45)
  .text((d, i) => consoles[i]);
