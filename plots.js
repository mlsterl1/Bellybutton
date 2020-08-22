 
   
function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");


    PANEL.html("");
    PANEL.append("h6").text("ID : " + result.id);
    PANEL.append("h6").text("ETHINICITY : " + result.ethnicity);
    PANEL.append("h6").text("GENDER : " + result.gender);
    PANEL.append("h6").text("AGE : " + result.age);
    PANEL.append("h6").text("LOCATION : "  + result.location);
    PANEL.append("h6").text("BBTYPE : " + result.bbtype);
    PANEL.append("h6").text("WFREQ : " + result.wfreq);
    
  });
}

function buildCharts(sample){
  d3.json("samples.json").then((data) => {
    var metadata = data.samples;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    buildbarchart(result);
    buildbubblechart(result);



  });
}


function buildbarchart(data){
  var bardata = [{
   type:"bar" ,
   x: data.sample_values.slice(0,10),
   y: data.otu_ids.slice(0,10).map(OTU => "OTU " + OTU),
   text: data.otu_labels.slice(0,10),
   orientation:"h"
  }  ];

  Plotly.newPlot("bar" , bardata);
}

function getColor(val, min, max) {
	let range = max - min,
        value = val - min,
        percent = value / range,
        hue = percent * 360;
  	return `hsl(${hue}%, 100%, 50%)`;
}
function getSize(val, min, max) {
	let minimumSize = 10,
        maximumSize = 100,
        sizeRange = maximumSize - minimumSize,
    	  range = max - min,
        value = val - min,
        percent = value / range,
        size = percent * sizeRange + minimumSize;
  	return size;
}


function buildbubblechart(data){
  var minId = Math.min(...data.otu_ids);
  var maxId = Math.max(...data.otu_ids);
  var minValue = Math.min(...data.sample_values);
  var maxValue = Math.max(...data.sample_values);

  var bubbledata = [{
    mode: "markers",
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    marker: {
     color: data.otu_ids.map(id => getColor(id, minId, maxId)), 
     size: data.sample_values.map(val => getSize(val, minValue, maxValue))
    }
  }];
  Plotly.newPlot("bubble" , bubbledata);

  

}  
init();