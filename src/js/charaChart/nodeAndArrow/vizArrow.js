/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import {rodata} from '../rodata'
import {viewArrowText} from '../viz/viewArrowText'

const markerFillColor = rodata.markerFillColor
const yajirushi_refX = rodata.yajirushi_refX


const vizArrow = (svg, arrow, r, arrowId,allBunArr) => {
  //let circle_data_array = [[nodeArray[0].x, nodeArray[0].y, r], [nodeArray[1].x, nodeArray[1].y, r]]

  //出発点の取得失敗？

  let color=null

  if (arrow.subject.isClient) {
    color= rodata.clientArrowColor
  } else {
    color= rodata.aroundClientPeopleArrowColor
  }

  let marker = svg.append('defs').append('marker')
    .attr({
      'id': 'arrowhead'+arrowId,
      // 矢印の位置を一番後ろから手前に少しずらす
      //'refX': rodata.yajirushi_refX,
      'refX': 4.5*Math.sqrt(r),
      'refY': 4,
      'markerWidth': 8,
      'markerHeight': 8,
      'orient': 'auto'
    })

  marker.append('path')
    .attr({
      "d": 'M 0,0 V 8 L8,4 Z',
      "fill": color
    })
    .on('click', ()=>{
      viewArrowText(arrow, allBunArr)
    })


  let line = d3.svg.line()

    .interpolate('basis')
    .x(function (d) { return d[0] })
    .y(function (d) { return d[1] })


  let path = svg.append('path')

    .attr({
      'd': line(arrow.pointArr),
      'stroke': color,
      'stroke-width': arrow.strokeWidth,
      'fill': 'none',
      'marker-end': 'url(#arrowhead'+arrowId+')'
    })
    .on('click', ()=>{
      viewArrowText(arrow, allBunArr)
    })

  // pathの長さを調べて、丸の半径２個分＋矢印を後ろに下げる分の長さを引きます。
  const totalLen = path.node().getTotalLength()
  const t = totalLen - (r + r + yajirushi_refX)
  path.attr({
    // 破線の指定を行います。
    'stroke-dasharray': '0 ' + r + ' ' + t + ' ' + r,
    // 破線の開始相対位置を指定します
    'stroke-dashoffset': 0
  })
}

export{vizArrow}