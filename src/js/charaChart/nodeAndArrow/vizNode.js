/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import d3 from 'd3'
import $ from 'jquery'
import {rodata} from '../rodata'

//import{rodata} from '../../rodata'
//const r = rodata.nodeR

const clientColor = 'red'
const aroundClientPeopleColor = 'gray'

//const r = 60
const yajirushi_refX = 16

const markerFillColor = 'red'

let vizNodes = (svg,nodeArr,arrowArr) => {

  let nodes = svg.selectAll('g')
        .data(nodeArr).enter().append('g')
        .attr({
          transform: function (d) {
            return 'translate(' + d.x + ',' + d.y + ')'
          }
        })

  nodes.append('circle')
        .attr({
          'r': function (d) { return d.r },
          'stroke': function (d, i) { if (i === 0) { return clientColor } else { return aroundClientPeopleColor } },
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
}

let removeSVG = () => {
  d3.select(rodata.characterChartAreaID).select('svg').remove()
}

export {vizNodes, removeSVG}
