import * as d3 from 'd3'
import { charaChartRodata } from '../rodata'
import { vizBarChart } from './vizBarChart'
import { borderBunNoArr } from './borderBunNoArr'

const vizSliderBarChart=()=>{
  //svg

  console.log("vizSliderBarChart")

  const fullW=charaChartRodata.sliderBarChart.fullW
  let svg = d3.select(charaChartRodata.sliderBarChart.id).append('svg')
    .attr({
      width: charaChartRodata.sliderBarChart.fullW,
      height: charaChartRodata.sliderBarChart.h
    })
  //add四角
  console.log(svg)
  vizBarChart(["hoge","hoge","hoge","hoge","hoge"],svg,borderBunNoArr,fullW,0,0)

}

export {vizSliderBarChart}