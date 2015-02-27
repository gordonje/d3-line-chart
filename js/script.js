var margin = {top: 20, right: 20, bottom: 60, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Specifying the various formats of dates I know I want to use (Read more: https://github.com/mbostock/d3/wiki/Time-Formatting)
// First, use this methodin order to convert the current format of dates in our data into js date objects
var parseDate = d3.time.format("%e-%b-%y").parse;
// And a year format (e.g., "2004")
var yearFormat = d3.time.format("%Y");
// And then here's a monthYear format (e.g., "Jan 2004")
var monthYearFormat = d3.time.format("%b" + ' ' + "%Y");
// And an abbreviated month format (e.g., "Jan")
var monthAbbrvFormat = d3.time.format("%b");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    // How we tell d3 to create ticks every three months (like business quarters). 
    // Read more here: https://github.com/mbostock/d3/wiki/Time-Scales#ticks
    .ticks(d3.time.month, 3)
    // With this interval and step, the default tick labels will vary using the full month name and four-digit year
    // But I want to vary using abbreviated month and four-digit year
    .tickFormat(function(d, i) {
        if (d.getMonth() === 0) {
            return yearFormat(d);
        } else {
            return monthAbbrvFormat(d);
        }
    });

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(function(d, i) {
        return d.toFixed(1)+"%"
    }        
    );

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.unemploymentRate); });

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
// the third argument is the callback function (do I have that right?)
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
            .attr("transform", "rotate(-65)")
            .attr("font-weight", function(d) {
                if (d.getMonth() === 0) {
                    return "bold";
                } else {
                    return "normal";
                }
            })
            .attr("font-size", function(d) {
                
                if (d.getMonth() === 0) {
                    return "13px";
                } else {
                    return "11px";
                }
            });;

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

    svg.selectAll('.dot')
        .data(rows)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.unemploymentRate); })
        .attr("r", 4)
        .on("mouseover", function(d) {
          // .tt is the class of a div we've added to our chart in the index.html file
            $(".tt").html(
              // .tt is where we put our date and unemployment data to be displayed
              "<div class='date'>"+ d.monthYear +"</div>"+
              "<div class='val'>"+ d.unemploymentRate +"%</div>"
          );
          //Adding .active class to this circle so it turns red.
          d3.select(this)
          //The fill color for .dot.active is set in style.css  
            .classed("active", true)
          // increasing the radius of the circle
            .attr("r", 7);

      // In the css, .tt has a 'display' property set to 'hidden'. This keeps it from showing up on page load.
      // When we roll over it, we use the show() method to see it.
        $(".tt").show();
    })
    // On 'mouseout', we hide the tooltip again.
    .on("mouseout", function(d) {

      //Remoing .active class to this circle so it turns back to blue.
      d3.select(this)
        .classed("active", false)
        // Also, reset the radius to 4
        .attr("r", 4);
        
      $(".tt").hide();
    })
    //And on 'mousemove', we calculate the position where we want the tooltip to show up.
    //The position is dependent on the position of the mouse.
    .on("mousemove", function(d) {
        //pos is equal to the mouse position.
      //It shows up as a two value array [x, y]
      var pos = d3.mouse(this);
    
      var left = pos[0] // + margin.left + 15 - ($(".tt").outerWidth()/2);

      //Here we add the top margin and subtract the height of the tooltip so it displays above our mouse
      var top = pos[1] + 50 // + margin.top - $(".tt").height() - 30

        $(".tt").css({
            "left" : left+"px",
            "top" : top+"px"
        });

    });

});


    
