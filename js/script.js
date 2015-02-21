var margin = {top: 20, right: 20, bottom: 60, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.month, 3);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
// switched the keys for these
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.unemploymentRate); });

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Specifying the format of dates in our data in order to convert them into js date objects
var parseDate = d3.time.format("%e-%b-%y").parse;
// specifying the date format in which we actually want to display (e.g., "Jan 2004")
var monthYearFormat = d3.time.format("%b" + ' ' + "%Y");

// converting csv file to json, first argument is the .csv file, second argument is the "accessor" function
d3.csv("./data/clean_data.csv", function(d) { 
	
	// specifying the data types and format the accessor should return
    return {
          date: parseDate(d.date)
        , monthYear: monthYearFormat(parseDate(d.date))
        , laborForce: +d.labor_force
        , employment: +d.employment
        , unemployment: +d.unemployment
        , unemploymentRate: +d.unemployment_rate
    };

}, function(error, rows) {
	x.domain(d3.extent(rows, function(d) { return d.date; }));
	y.domain(d3.extent(rows, function(d) { return d.unemploymentRate; }));

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Unemployment Rate");

	svg.append("path")
		.datum(rows)
		.attr("class", "line")
		.attr("d", line);
});


    
