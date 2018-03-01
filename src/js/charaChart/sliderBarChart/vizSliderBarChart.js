import * as d3 from 'd3'
import { charaChartRodata } from '../rodata'
import { vizBarChart } from './vizBarChart'
import { borderBunNoArr } from './borderBunNoArr'

const vizSliderBarChart=()=>{
  //svg

  const fullW=charaChartRodata.sliderBarChart.fullW
  let svg = d3.select(charaChartRodata.sliderBarChart.id).append('svg')
    .attr({
      width: charaChartRodata.sliderBarChart.fullW,
      height: charaChartRodata.sliderBarChart.h
    })
  //add四角
  vizBarChart([null,null,null,null,null],svg,borderBunNoArr,fullW,0,0)

}

export {vizSliderBarChart}