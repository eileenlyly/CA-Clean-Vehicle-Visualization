var data;
var path = d3.geo.path();
var monthindex=35;
var svg_map = d3.select("#ca_map")
    .append("svg")
	.attr("width",400)
	.attr("heigh",550)
	.call(d3.behavior.zoom().on("zoom", redraw))
    .append("g")
	.attr("transform", "scale(2.8)translate(-110,-130)")
    .append("g");

var counties = svg_map.append("g")
    .attr("id", "counties");

d3.json("data/ca-counties.json", function(json) {
  counties.selectAll("path")
      .data(json.features)
      .enter()
      .append("svg:path")
      .attr("d", path)
      .on("mouseover", function(d){
        $('#county_state').html(data[d.id]["county"]);
        $('#pop').html(data[d.id]["population"]);
		$('#station').html(data[d.id]["station"]);
		$('#ev').html(data[d.id]["EV"][monthindex]);
        d3.select(this).style("opacity", ".5");
      })
      .on("mouseout", function(){
        $('#county_state').html("&nbsp");
        $('#pop').html("&nbsp");
		$('#station').html("&nbsp");
		$('#ev').html("&nbsp");
        d3.select(this).style("opacity", "1");
      });
});


d3.json("data/ca-data.json", function(json) {
  data = json;
  $('#info_ev').html((data["59"]["EV"][monthindex]));

  counties.selectAll("path").attr("class", quantize);
  var chart;
  nv.addGraph(function() {
  	chart = nv.models.scatterChart()
                .showDistX(true)
                .showDistY(true)
                .height(400)
				.width(550)
                .useVoronoi(true)
                .color(["#ff7f0e","#d62728"]);

    chart.xAxis.tickFormat(d3.format('.02f'))
    chart.yAxis.tickFormat(d3.format('.d'))
    d3.select('#scatter_chart svg')
      .datum(getData)
      .transition().duration(500)
      .call(chart);
    nv.utils.windowResize(chart.update);
	chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
    updatemap();
    return chart;
});



$("#ev_slider").slider({
        min: 0,
        max: 35,
        value: 35,
        slide: function(event, ui) {
		  monthindex=ui.value;
          document.getElementById("ev_label").innerHTML="Month: "+IndextoMonth(ui.value);
          updatemap();
		  updatescatterchart();
        }
    });

function updatescatterchart(){
d3.select('#scatter_chart svg')
      .datum(getData)
    .transition().duration(500)
      .call(chart);
}

})

function getData(){
	var scatterdata=[];
	scatterdata.push({
		key:'by population',
		values: []});

	scatterdata.push({
		key:'by charging stations',
		values: []});

	for(j=1;j<=58;j++){
		scatterdata[0].values.push({
			x: data[j.toString()]["population"]/10000000,
			y: data[j.toString()]["EV"][monthindex],
			size: 10,
			shape: 'circle'});
		scatterdata[1].values.push({
			x: data[j.toString()]["station"]/250,
			y: data[j.toString()]["EV"][monthindex],
			size: 10,
			shape: 'circle'});
	}
	return scatterdata;
}


function quantize(d) {

	i = data[d.id]["EV"][monthindex];
	k=0;
	if(i>=100)
		k=8;
	else if(i>=70&&i<100)
		k=7;
	else if(i>=50&&i<70)
		k=6;
	else if(i>=20&&i<30)
		k=5;
	else if(i>=10&&i<20)
		k=4;
	else if(i>=5&&i<10)
		k=3;
	else if(i>=2&&i<5)
		k=2;
	else if(i==1)
		k=1;
	else
		k=0;
	return "Bluesq"+k.toString()+"-9";

}


function redraw() {
  svg_map.attr("transform",
      "translate(" + d3.event.translate + ")" +
      "scale(" + d3.event.scale + ")");
}

function updatemap() {
	counties.selectAll("path").attr("class", quantize);
	$('#info_ev').html((data["59"]["EV"][monthindex]));
}


function IndextoMonth(index){
	index=index+2;
	var year=Math.floor(index/12)+2010;
	var Month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	return (Month[index%12]+' '+year.toString());
}






