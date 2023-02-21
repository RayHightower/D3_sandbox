const data = [5, 10, 15, 20, 25];

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", 400)
  .attr("height", 300);

svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 70)
  .attr("y", (d) => 300 - 10 * d)
  .attr("width", 50)
  .attr("height", (d) => d * 10)
  .attr("fill", "steelblue");
