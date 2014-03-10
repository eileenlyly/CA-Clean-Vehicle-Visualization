var colors = d3.scale.category10();
keyColor = function(d, i) {return colors(d.key)};

var parsedate = d3.time.format("%Y.%m").parse;
nv.addGraph(function() {
  var chart = stackedAreaChart()
                .x(function(d) { return parsedate(d[0]) })
                .y(function(d) { return d[1] })
                .color(keyColor)
                .clipEdge(true);

  chart.xAxis
	.showMaxMin(false)
	.tickFormat(function(d) {return d3.time.format('%b %Y')(new Date(d)) });

  chart.yAxis
      .tickFormat(d3.format(',.d'));

  d3.select('#area_chart svg')
    .datum(chartdata).transition().duration(500).call(chart);

  nv.utils.windowResize(chart.update);


  return chart;
});