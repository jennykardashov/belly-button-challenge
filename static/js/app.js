//  get the url

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

let sampleData;
let metaData;

// funtion to load the page with data
function init() {
    // Fetch the JSON data and console log it
    d3.json(url).then(function (data) {
        // console.log(data);
        sampleData = (data['samples']);
        metaData = (data['metadata']);
        let ele = document.getElementById('selDataset');
        for (let i = 0; i < sampleData.length; i++) {
            // POPULATE SELECT ELEMENT WITH JSON.
            ele.innerHTML = ele.innerHTML +
                '<option value="' + sampleData[i]['id'] + '">' + sampleData[i]['id'] + '</option>';
        }
        optionChanged(940);
    }
    );
}
// call function
init();

function optionChanged(id) {
    // console.log(sampleData)
    barChart(id);
    populateMetaData(id);
    // console.log(metaData);
    bubbleChart(id);
    // gaugeChart(id);
}

// Bar Chart
function barChart(id) {
    let xValues = [];
    let yValues = [];
    let labels = [];
    // filter the data passing the id given by the user
    filteredValues = sampleData.filter((data) => id == data.id)

    // to the get array
    filteredList = filteredValues[0];
    console.log(filteredList)

    //get the top 10 sample_values,otu_ids,otu_labels
    xValues = filteredList.sample_values.slice(0, 10);
    yValues = filteredList.otu_ids.slice(0, 10);
    labels = filteredList.otu_labels.slice(0, 10);

    // trace for bar chart
    let trace = {
        x: xValues,
        y: yValues.map(val => `OTU ${val}`),
        text: labels,
        type: 'bar',
        name: 'Belly',
        orientation: 'h'
    }
    //data
    let data1 = [trace];

    //layout
    let layout = {
        title: `<b>Top 10 OTUs Found in an Individual</b><br><b>id:${id}</b>`,
        yaxis: {
            autorange: 'reversed'
        }
    }
    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", data1, layout);
}

// Function for demographis box
function populateMetaData(id) {
   
    // get the demographic box id
    let demobox = d3.select("#sample-metadata");

    // // get the metadata values for the entered id
    let filterData = metaData.filter((data) => id == data.id);
    console.log(filterData);
    
      // Modify the text of an HTML element
    var demoValue = demobox.selectAll("p");
    demoValue.html("");
     
    // get the data using key value
    Object.entries(filterData[0]).forEach(([key,value])=>{
        console.log(key,value);     
        demobox.append("p").text(`${key} : ${value}`)
    })
}

// Bubble chart
function bubbleChart(id) {
    let xValues = [];
    let yValues = [];
    let color = [];
    let size = [];
    let text = [];

    // filter the data passing the id given by the user
    filteredValues = sampleData.filter((data) => id == data.id)
    console.log(filteredValues)
    // to the get array
    filteredList = filteredValues[0];

    // get xvalues,yvalues labels color and size
    xValues = filteredList.otu_ids;
    console.log(xValues)
    yValues = filteredList.sample_values;
    // console.log(yValues)
    color = xValues;
    size = yValues;
    labels = filteredList.otu_labels;

    // trace for bubble chart
    let trace1 = {
        x: xValues,
        y: yValues,
        mode: 'markers',
        text: labels,
        marker: {
            color: color,
            size: size,
            colorscale: 'Earth'
        }
    };
    //data
    let data2 = [trace1];
    //layout
    let layout = {
        title: `<b>OTUs Found in an Individual</b><br><b>id:${id}</b>`,
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' },
    }

    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot('bubble', data2, layout);
}