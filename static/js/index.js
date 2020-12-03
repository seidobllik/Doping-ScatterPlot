const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const graphW = 800;
const graphH = 400;
const padding = 35;

fetch(url)
  .then((response) => response.json())
  .then((dataset) => {
    dataset.forEach((obj) => {
      let temp = obj.Time.split(":");
      obj.Time = new Date(1970, 0, 1, 0, temp[0], temp[1]);
    });

    const timeMin = d3.min(dataset.map((obj) => obj.Time));
    const timeMax = d3.max(dataset.map((obj) => obj.Time));
    const yearMin = d3.min(dataset.map((obj) => obj.Year));
    const yearMax = d3.max(dataset.map((obj) => obj.Year));

    const xScale = d3
      .scaleLinear()
      .domain([yearMin - 1, yearMax + 1])
      .range([padding, graphW - padding]);
    const yScale = d3
      .scaleTime()
      .domain([timeMin, timeMax])
      .range([padding, graphH - padding]);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    tooltip.append("p").attr("id", "place");
    tooltip.append("p").attr("id", "info");
    tooltip.append("p").attr("id", "time");
    tooltip.append("p").attr("id", "doping");
    tooltip.append("p").attr("id", "url");

    const svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", graphW)
      .attr("height", graphH);

    svg
      .append("g")
      .attr("transform", "translate(0, " + (graphH - padding) + ")")
      .attr("id", "x-axis")
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .attr("id", "y-axis")
      .call(yAxis);

    svg
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(d.Year))
      .attr("cy", (d, i) => yScale(d.Time))
      .attr("r", 5)
      .attr("class", "dot")
      .attr("id", (d, i) => i)
      .attr("data-xvalue", (d, i) => d.Year)
      .attr("data-yvalue", (d, i) => d.Time)
      .style("fill", (d, i) => (d.Doping.length <= 0 ? "orange" : "blue"));

    svg
      .selectAll("circle")
      .on("mouseover", (d, i) => {
        const id = this.event.target.id;
        tooltip
          .style("left", this.event.pageX + 15 + "px")
          .style("top", this.event.pageY - 15 + "px");
        tooltip.style("opacity", 0.9);
        tooltip.select("#place").text("#" + dataset[id].Place);
        tooltip
          .attr("data-year", dataset[id].Year)
          .select("#info")
          .text(
            dataset[id].Name +
              " | " +
              dataset[id].Nationality +
              " | " +
              dataset[id].Year
          );
        tooltip
          .select("#time")
          .text(
            "Time: " +
              dataset[id].Time.getMinutes() +
              ":" +
              dataset[id].Time.getSeconds()
          );
        tooltip.select("#doping").text(dataset[id].Doping);
        tooltip.select("#url").text(dataset[id].URL);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", "translate(600, 200)")
      .append("text")
      .text("No doping allegations")
      .attr("font-size", "12px");

    svg
      .select("#legend")
      .append("text")
      .text("With doping allegations")
      .attr("font-size", "12px")
      .attr("transform", "translate(-8, 15)");

    svg
      .select("#legend")
      .append("rect")
      .attr("x", 110)
      .attr("y", -10)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", "orange");

    svg
      .select("#legend")
      .append("rect")
      .attr("x", 110)
      .attr("y", 5)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", "blue");
  });
