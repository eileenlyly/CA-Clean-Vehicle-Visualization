// TOOLTIP
var tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .text("a simple tooltip");

var data; // loaded asynchronously

var path = d3.geo.path();

var svg = d3.select("#ca_map")
    .append("svg:svg")    
	.call(d3.behavior.zoom().on("zoom", redraw))
    .append("svg:g")
	.attr("transform", "scale(2.5)translate(-100,-120)")
    .append("svg:g")    
    .attr("id", "map");



var counties = svg.append("svg:g")
    .attr("id", "counties");

var numChecked = 2;

d3.json("js/ca-counties.json", function(json) {
  var getInfo = function(id, type) {
    var val = data[id][type];
    if (val == undefined || val == "") {
      val = "--";
    }
    return val;
  };

  counties.selectAll("path")
      .data(json.features)
    .enter().append("svg:path")
      .attr("class", data ? quantize : null) // color counties
      .attr("d", path)
      .on("mouseover", function(d){
        $('#county_state').html(data[d.id]["county"]);
        $('#pop').html(data[d.id]["population"]);
        $('#info_name').html(data[d.id]["county"]);
        $('#info_population').html("<b>" + getInfo(d.id, "population") + "</b>");
        $('#info_ev').html("<b>" + getInfo(d.id, "female_headed") + "%</b>");       
        d3.select(this).style("opacity", ".5");
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(d){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+15)+"px").text(data[d.id]["name"]);})
      .on("mouseout", function(){
        $('#county_state').html("&nbsp");
        $('#pop').html("&nbsp");
        $('#info_name').html("&nbsp");
        $('#info_population').html("&nbsp");
        $('#info_ev').html("<b>&nbsp&nbsp--%</b>");  
        d3.select(this).style("opacity", "1");
        return tooltip.style("visibility", "hidden");
      });
});


d3.json("js/data.json", function(json) {
  data = json;
  counties.selectAll("path").attr("class", quantize);
})

params = {female_headed: {color:"Greensq",set_min:0,min:20,max:45,set_max:45},};


function quantize(d) {
  county_data = data[d.id]
  var stats = [];

  if (typeof county_data === "undefined") return "ignore"
      if (county_data["female_headed"] >= params["female_headed"]["min"] && county_data["female_headed"] <= params["female_headed"]["max"]) {
        stats.push("female_headed");
      }


  if (stats.length == 0) {
      return "ignore";
  } else if (stats.length == 2) {
      return "overlap";
  } else {
      var stat = stats[0];
      return params[stat]["color"] + Math.min(8, ~~(county_data[stat] * 9 / params[stat]["set_max"])) + "-9";
      //return params[stat]["color"] + Math.min(8, ~~(county_data[stat] * 9 / params[stat]["max"]- params[stat]["min"]*9/params[stat]["max"])) + "-9";
  }
}

$(function() {
    $('#pop').html("&nbsp;");
    $(".checkbox_label").hide("fast");
    $("#sliders").hover(
        function() {
            $(".checkbox_label").show();
        },
        function() {
            $(".checkbox_label").hide("fast");
        }
    );
});

function redraw() {
  svg.attr("transform",
      "translate(" + d3.event.translate + ")" +
      "scale(" + d3.event.scale + ")");
}

function adjust_range(stat, min, max) {
    params[stat]["min"]= min;
    params[stat]["max"] = max;
    counties.selectAll("path")
      .attr("class", quantize); // recolor
}


// Create ev slider
$("#ev_slider").slider({
        min: 1,
        max: 36,
        value: 36,
        slide: function(event, ui) {
          document.getElementById("ev_label").innerHTML="Month: "+ui.value;
          //selectedYearValue=ui.value;
          //updateCountries();
          //refresh();
        }
    });



