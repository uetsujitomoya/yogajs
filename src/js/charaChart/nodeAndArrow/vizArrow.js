/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import{rodata} from '../rodata'
import{r} from './defineNode'

const markerFillColor = rodata.markerFillColor
const yajirushi_refX = rodata.yajirushi_refX

const vizArrow = (svg, arrowPointArr) => {
  //let circle_data_array = [[nodeArray[0].x, nodeArray[0].y, r], [nodeArray[1].x, nodeArray[1].y, r]]
  console.log(arrowPointArr)

  var marker = svg.append('defs').append('marker')
    .attr({
      'id': 'arrowhead',
      // 矢印の位置を一番後ろから手前に少しずらす
      'refX': rodata.yajirushi_refX,
      'refY': 2,
      'markerWidth': 4,
      'markerHeight': 4,
      'orient': 'auto'
    })
  marker.append('path')
    .attr({
      d: 'M 0,0 V 4 L4,2 Z',
      fill: markerFillColor
    })

  var line = d3.svg.line()
    .interpolate('basis')
    .x(function (d) { return d[0] })
    .y(function (d) { return d[1] })

  var path = svg.append('path')
    .attr({
      'd': line(arrowPointArr),
      'stroke': 'red',
      'stroke-width': 5,
      'fill': 'none',
      'marker-end': 'url(#arrowhead)'
    })

  // pathの長さを調べて、丸の半径２個分＋矢印を後ろに下げる分の長さを引きます。
  var totalLength = path.node().getTotalLength()
  var t = totalLength - (r + r + yajirushi_refX)
  path.attr({
    // 破線の指定を行います。
    'stroke-dasharray': '0 ' + r + ' ' + t + ' ' + r,
    // 破線の開始相対位置を指定します
    'stroke-dashoffset': 0
  })
}

export{vizArrow}