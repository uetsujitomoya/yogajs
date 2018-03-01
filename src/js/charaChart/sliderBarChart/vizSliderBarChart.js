import * as d3 from 'd3'
import { charaChartRodata } from '../rodata'
import { vizBarChart } from './vizBarChart'

const vizSliderBarChart=()=>{
  //svg
  let svg = d3.select(charaChartRodata.sliderBarChart.id).append('svg')
    .attr({
      width: charaChartRodata.sliderBarChart.fullW,
      height: charaChartRodata.sliderBarChart.h
    })
  //add四角
  vizBarChart()

}

export {vizSliderBarChart}