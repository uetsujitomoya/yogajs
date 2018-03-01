import * as d3 from 'd3'
import { charaChartRodata } from './charaChart/rodata'

const createSvgArea=(id,w,h)=>{
  let svg = d3.select(id).append('svg')
    .attr({
      width: w,
      height: h
    })
}