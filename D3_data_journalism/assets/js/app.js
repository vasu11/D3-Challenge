// @TODO: YOUR CODE HERE!
var svgWidth = 400;
var svgHeight = 500;

var margin = {
  top: 10,
  right: 20,
  bottom: 40,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("./assets/data/data.csv").then(function(healthcare) {

    // Print the data
    console.log(healthcare);

    healthcare.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });

      var xLinearScale = d3.scaleLinear()
      .domain([10, d3.max(healthcare, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([6, d3.max(healthcare, d => d.healthcare)])
      .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthcare)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5");

    //This logic for adding state labels was found in a stackoverflow article
    var circleLabels = chartGroup.selectAll(null).data(healthcare).enter().append("text");

    circleLabels
  .attr("x", function(d) {
    return xLinearScale(d.poverty);
  })
  .attr("y", function(d) {
    return yLinearScale(d.healthcare);
  })
  .text(function(d) {
    return d.abbr;
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("text-anchor", "middle")
  .attr("fill", "white");

  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Lacks Healthcare (%)");

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("In Poverty (%)");

});