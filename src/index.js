import "./styles.css";
import { select } from "d3-selection";
import { transition } from "d3-transition";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { clampToHexCentroid } from "./clampToHexCentroid";

const width = 800;
const height = 600;

const flatData = [];

const binSize = 26;

for (let i = 0; i < 3000; i++) {
  flatData.push({
    x: Math.random() * (width - binSize) + binSize / 2,
    y: Math.random() * (height - binSize) + binSize / 2
  });
}

const countHash = {};
const binnedData = flatData.map((d) => {
  const binned = clampToHexCentroid(d.x, d.y, binSize);
  const binKey = `${binned.x}-${binned.y}`;
  const count = () => countHash[binKey].count;
  if (countHash.hasOwnProperty(binKey)) {
    countHash[binKey].count += 1;
  } else {
    countHash[binKey] = {
      count: 1,
      x: binned.x,
      y: binned.y
    };
  }
  return {
    x: d.x,
    y: d.y,
    binnedX: binned.x,
    binnedY: binned.y,
    count
  };
});

console.log(countHash);

const hexBins = Object.keys(countHash).map((k) => countHash[k]);

const root = select("svg");
const selection = root.selectAll("circle").data(binnedData);

const counts = Object.keys(countHash).map((key) => countHash[key]);
const countsExtent = extent(counts);

const lowColor = "#AAAAAA";
const highColor = "#FF0033";

const colorScale = scaleLinear()
  .domain(countsExtent)
  .range([lowColor, highColor]);

root
  .selectAll(".heatbin")
  .data(hexBins)
  .enter()
  .append("path")
  .classed("heatbin", true)
  .attr("transform", (d) => `translate(${d.x},${d.y}) scale(${binSize})`)
  .attr("opacity", 0.05)
  .attr(
    "d",
    "M0,-0.5L0.433,-0.25L0.433,0.25L0,0.5L-0.433,0.25L-0.433,-0.25L0,-0.5Z"
  );

selection
  .enter()
  .append("circle")
  .attr("cx", (d) => d.x)
  .attr("cy", (d) => d.y)
  .attr("r", 1)
  .attr("fill", lowColor);

root
  .transition()
  .delay(2000)
  .duration(5000)
  .selectAll("circle")
  .attr("cx", (d) => d.binnedX)
  .attr("cy", (d) => d.binnedY)
  .attr("fill", (d) => colorScale(d.count()));

// .attr("r", (d) => d.count());
//<path d="M5,0.006L9.334,2.503L9.334,7.497L5,9.994L0.666,7.497L0.666,2.503L5,0.006Z"/>
