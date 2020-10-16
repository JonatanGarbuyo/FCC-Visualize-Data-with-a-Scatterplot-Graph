const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";


document.addEventListener('DOMContentLoaded', () => {
  const myReq = new XMLHttpRequest();
  myReq.open("GET", url, true);
  myReq.send();
  myReq.onload = () => {

    const dataset = JSON.parse(myReq.responseText);
    console.log(dataset); ///
    console.log(dataset[0]); ///
    console.log(dataset[0].Year); ///
    dataset.forEach(d => {
      //d.Place = +d.Place;

      const parsedTime = d.Time.split(':');
      d.Time = new Date(2000, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });

    const w = 1000,
    h = 500,
    padding = 60;

    const tooltip = d3.select(".chart").
    append("div").
    attr("id", "tooltip").
    style("opacity", 0);

    const xScale = d3.scaleLinear().
    domain([d3.min(dataset, d => d.Year - 1),
    d3.max(dataset, d => d.Year + 1)]).
    range([padding, w - padding]);


    const yScale = d3.scaleTime().
    domain([d3.max(dataset, d => d.Time),
    d3.min(dataset, d => d.Time)]).
    range([h - padding, padding]);

    const timeFormat = d3.timeFormat("%M:%S");
    const xAxisFormat = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxisFormat = d3.axisLeft(yScale).tickFormat(timeFormat);

    const svg = d3.select(".chart").
    append("svg").
    attr("width", w).
    attr("height", h);

    svg.selectAll("circle").
    data(dataset).
    enter().
    append("circle").
    attr("class", "dot").
    attr("cx", d => xScale(d.Year)).
    attr("data-xvalue", d => d.Year).
    attr("cy", d => yScale(d.Time)).
    attr("data-yvalue", d => d.Time.toISOString()).
    attr("r", d => 5).
    on('mouseover', function (d, i) {
      tooltip.transition().
      duration(200).
      style('opacity', .9);
      tooltip.html(`
                    <div> 
                        <div><strong>Year</strong> ${d.Year}</div>
                        <div><strong>Time</strong> ${d.Time.getMinutes()}:${d.Time.getSeconds()}</div>
                        <div><strong>Doping</strong> ${d.Doping}</div>
                    </div>`).
      attr('data-year', d.Year).
      style('left', i * w + padding).
      style('top', h - 1 + 'px');
    }).
    on('mouseout', function (d) {
      tooltip.transition().
      duration(200).
      style('opacity', 0);
    });


    svg.append("text").
    attr("id", "legend").
    attr("x", 500).
    attr("y", 20).
    attr("text-anchor", "middle").
    style("font-size", "20px").
    text("35 Fastest times up Alpe d'Huez");



    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g").
    attr("class", "x axis").
    attr("id", "x-axis").
    call(xAxisFormat).
    attr("transform", "translate(0," + (h - padding) + ")").
    attr("id", "x-axis");

    svg.append("g").
    attr("class", "y axis").
    attr("id", "y-axis").
    call(yAxisFormat).
    attr("transform", `translate(${padding}, 0)`).
    attr("id", "y-axis");



  };
});