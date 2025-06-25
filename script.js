const loc_url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const edu_url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

var loc;
var edu;
var colors = ['darkgreen', 'forestgreen', 'limegreen', 'lightgreen', '#e0ffdd'];

d3.json(loc_url).then(function(data){
    loc = topojson.feature(data, data.objects.counties).features;                 d3.json(edu_url).then(function(data){                       
    edu = data;                           
    draw();
   })    
})

var svg = d3.select('body')
  .append('svg')
  .attr('id', 'chart');

var tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var draw = function(){
    svg.selectAll('path')
            .data(loc)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', function(d){
              var id = d.id;
              var county = edu.find((d) => {
                    return d.fips === id;
                  })
              var percentage = county.bachelorsOrHigher;
              return colors[Math.floor(percentage/15)];
              })
            .attr('data-fips', d => d.id)
            .attr('data-education', function(d){
                var id = d.id;
                var county = edu.find((d) => {
                    return d.fips === id
                })
                var percentage = county.bachelorsOrHigher;
                return percentage;
              })
            .on('mouseover', function(event, d) {
                var id = d.id;
                var county = edu.find((d) => {
                  return d.fips === id;
                });    
                tooltip.attr('data-education', county.bachelorsOrHigher)
                  .transition()
                  .duration(200)                  
                  .style('opacity', 0.9);
                tooltip.html(county.state + ', ' + county.area_name + '<br>' + county.bachelorsOrHigher + '%')
                      .style('left', event.pageX + 'px')
                      .style('top', event.pageY + 'px');    
                })
            .on('mouseout', function(d){
                tooltip.transition() 
                       .duration(200)
                       .style('opacity', 0);
                })
}

var labels = ['< 15%', '15% to 30%', '30% to 45%', '45% to 65%', '> 65%'];

d3.select("body")
  .append('div')
  .attr('id', 'container')
  .append('svg')
  .attr('id', 'legend')
  .selectAll('rect')
  .data(colors)
  .enter()
  .append('rect')
  .attr('x', 10)
  .attr('y', (d, i) => 40*i)
  .attr('width', '40px')
  .attr('height', '40px')
  .style('fill', (d, i) => colors[i])

d3.select('#legend')
  .selectAll('text')
  .data(labels)
  .enter()
  .append('text')
  .attr('x', 60)
  .attr('y', (d, i) => 25+40*i)
  .text((d, i) => labels[i])
  .style('fill', 'white')
