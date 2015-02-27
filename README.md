d3-line-chart
=======================

A line chart using CoMO specific unemployment data from BLS, an exercise for Chris Canipe's d3 class.

-----------------------

While this is far from the first d3 chart I have made, it's first one I've made when felt like I mostly understood what I was doing. As opposed to all the other times when it's mostly a paint-by-numbers exercise, with me filling in a few blanks.

The first revelation was result of my attempt to [add the circles](https://github.com/gordonje/d3-line-chart/blob/master/js/script.js#L112-L119) to the line junctions. I kept getting errors and/or I would see all of the circles bunched up in a straight vertical line in the upper left corner of the chart. Here is what I was trying:

	.attr("cx", function(d) { return d.date; })
	.attr("cy", function(d) { return d.unemploymentRate; })

But guess what? D3 doesn't know how to put a circle at x-position "Sun Sep 01 2013 00:00:00 GMT-0500 (CDT)", and setting the y-position equal to the unemployment rate means they're all within six pixels of each other since the employment rate is 3 to 8 percent. The console.log() was a great help (as per usual) in actually figuring what these values were.

Here is what I supposed to do:

	.attr("cx", function(d) { return x(d.date); })
	.attr("cy", function(d) { return y(d.unemploymentRate); })

Notice the difference? All I was missing were those calls to the x() and y() methods, which is the means by which d3 translates the values of the data to x,y coordinates on the chart. Chris went out of his way to emphasize this in an earlier class, and I believe my response was along the lines of "Oh, that makes sense." But it took me screwing this part up and trying to figure out why in order for me to really get this key point.

The other thing I wanted to do, which was a divergence from the exercise, was to add some conditional styling to the tick text on the x-axis so that the years would stand out more. 

I had previously figured out how to [rotate the tick text](http://www.d3noob.org/2013/01/how-to-rotate-text-labels-for-x-axis-of.html), so I had extra room in which to fit the ticks. D3's [time scale ticks method](https://github.com/mbostock/d3/wiki/Time-Scales#ticks) was a big help because [all I had to do](https://github.com/gordonje/d3-line-chart/blob/master/js/script.js#L26) was specify the time interval (months) and the step (every 3, since I wanted these to roughly represent business quarters). This method is already does some conditional formatting, as in it either shows you the month name or, if the month is January, the four-digit year. The only thing I wanted to change about this formatting was to substitute in the abbreviated month name, again, because I wanted them to be shorter than the year.

I had to spend a little more time learning about d3's [time formating](https://github.com/mbostock/d3/wiki/Time-Formatting), but luckily the pattern is similar to how things work in both Python and SQL (though, I doubt I'll ever have all the specifers memorized). Anyway, by [setting up all the different time formats](https://github.com/gordonje/d3-line-chart/blob/master/js/script.js#L9-L13) I needed for my chart, I could get around relying on another library (i.e., [moment.js](http://momentjs.com/)).

After figuring out conditional formatting for the x-axis, it was a short jump to [adding conditional styling](https://github.com/gordonje/d3-line-chart/blob/master/js/script.js#L81-L94).
