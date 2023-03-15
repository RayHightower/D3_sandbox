// Define the dimensions of the SVG element
var width = 800;
var height = 500;

// Create the SVG element
var svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);

// Define the projection for the map
var projection = d3.geoMercator()
  .center([-111.0937, 34.0489])
  .scale(4000)
  .translate([width / 2, height / 2]);

// Define the path generator
var path = d3.geoPath()
  .projection(projection);

// Load the county data and population data
Promise.all([
  d3.json("./us-10m.v1.json"),
  d3.csv("./arizona-population.csv")
]).then(function([us, population]) {
  // Extract the features for Arizona
  var arizona = this.topojson.feature(us, us.objects.states).features.filter(function(d) {
    return d.properties.name === "Arizona";
  })[0];

  // Extract the features for the counties in Arizona
  var counties = topojson.feature(us, us.objects.counties).features.filter(function(d) {
    return d.properties.STATE === "04";
  });

  // Create a map of county populations
  var populationMap = {};
  population.forEach(function(d) {
    populationMap[d.county] = +d.population;
  });

  // Compute the range of population values
  var populationValues = Object.values(populationMap);
  var populationRange = d3.extent(populationValues);

  // Define the color scale
  var colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateBlues)
    .domain(populationRange);

  // Create the county paths
  svg.selectAll(".county")
    .data(counties)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("d", path)
    .attr("fill", function(d) {
      var population = populationMap[d.properties.NAME];
      return colorScale(population);
    })
    .attr("stroke", "white")
    .attr("stroke-width", 0.5);
});
