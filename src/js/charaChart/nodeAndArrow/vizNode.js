/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import d3 from 'd3'
import $ from 'jquery'
import {vizArrow} from './vizArrow'
import {connectNodeAndArray} from './connectNodeAndArrow'

import {r} from './defineNode'

//import{rodata} from '../../rodata'
//const r = rodata.nodeR

const color_of_client = 'red'
const color_of_people_around_client = 'gray'

//const r = 60
const yajirushi_refX = 16

const markerFillColor = 'red'

const characterChartAreaID = '#example'

let vizNodes = (nodeArray,arrowArray) => {
    // console.log("entered vizNodes")

  let svg = d3.select(characterChartAreaID).append('svg')
        .attr({
          width: 1300,
          height: 800
        })


  let nodes = svg.selectAll('g')
        .data(nodeArray).enter().append('g')
        .attr({
          transform: function (d) {
            //console.log(d)
            //console.log(d.x)
            //console.log(d.y)
            return 'translate(' + d.x + ',' + d.y + ')'
          }
        })

  nodes.append('circle')
        .attr({
          'r': function (d) { return r },
          'stroke': function (d, i) { if (i === 0) { return color_of_client } else { return color_of_people_around_client } },
          'fill': 'white',
          'stroke-width': (d) => { return　d.circleStrokeWidth }
        })

  nodes.append('text')
        .attr({
          'text-anchor': 'middle',
          'dy': '.35em',
          'fill': 'black'
        })
        .text(function (d) {
          //if(d.nodeCharacter==="Aさん"){alert("Aさん")}
          return d.nodeCharacter
        })
  console.log(nodes)
  console.log(arrowArray)

  for(let arrow of arrowArray){
    connectNodeAndArray(arrow)
    vizArrow(svg, arrow.pointArray)
  }
}

let removeSVG = () => {
  d3.select(characterChartAreaID).select('svg').remove()
}

export {vizNodes, removeSVG}
