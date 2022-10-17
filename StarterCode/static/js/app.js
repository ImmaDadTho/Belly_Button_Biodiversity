//populating the metadata 
function demoInfo(sample)
{
        // console.log(sample);

        d3.json("samples.json").then((data) => {
            var metadata = data.metadata;
            //console.log(metadata);
            //filter mbased on the value of the sample
            var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);


            //access the 0 index from the array 
            var resultdata = resultArray[0];
            // console.log(resultdata)

            d3.select("#sample-metadata").html("");

            Object.entries(resultdata).forEach(([key, value]) => {
                d3.select("#sample-metadata")
                    .append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}
// buildCharts function
function buildCharts(sample)
{
    // function for bar chart
    d3.json('./samples.json').then((data) => {
        // create variable that holds the samples array
        var samples = data.samples;

        // filter for selected OTU ID
        var resultArray = samples.filter(obj => obj.id == sample);
        
        var result = resultArray[0];

        // holding the data arrays samples
        var otu_ids = result.otu_ids;
        var otu_ids = otu_ids.slice(0, 10);
        // console.log(otu_ids)
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
        
        // filter only to top 10 otu_ids and add OTU to string label
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        // bar chart trace
        var barChart = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: 'bar',
            text: otu_labels,
            orientation: 'h'
        };

        var layout = {
            title: "Top 10 OTU's Found"
        }
        // Data array
        var barChartTrace = [barChart];

        // render plot
        Plotly.newPlot('bar', barChartTrace, layout);

        Plotly.restyle('bar', data)
    });
}

function buildbubblechart(sample)
{
// function for bubble chart
d3.json('./samples.json').then((data) => {
    // create variable that holds the samples array
    var samples = data.samples;

    // variable to hold filter for selected OTU ID
    var resultArray = samples.filter(obj => obj.id == sample);

    // variable to hold first sample in array
    var result = resultArray[0];
    //console.log(result)

    // variables holding the necessary data arrays
    var otu_ids = result.otu_ids;
    var otu_ids = otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    
    // bubble chart trace
    var bubbleChart = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale:"Viridis"
            }

    };

    // Apply xaxis title to layout
    var layout = {
        title: "OTU's per sample",
        xaxis: {
            title: 'OTU ID'
        },
        hovermode:"closest"
    }

    // Data array
    var bubbleChartTrace = [bubbleChart];

    // render plot
    Plotly.newPlot('bubble', bubbleChartTrace, layout);

    })
};

function Initialize() 
{

// Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
    let sampleNames = data.names;
        // console.log(sampleNames);
    
        sampleNames.forEach((sample) => {
            selector.append("option")
                .text(sample)
                .property("value", sample);
        });

        let firstSample = sampleNames[0];

        demoInfo(firstSample);
    });
}

function optionChanged(newSample)
// Fetch new data each time a new sample is selected
{   
    demoInfo(newSample);
    buildCharts(newSample);
    buildbubblechart(newSample);
}
Initialize();