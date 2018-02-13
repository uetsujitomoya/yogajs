import d3 from 'd3'

const vizStackChart = () => {

  // 積み重ね折れ線

  const axisDescription = '縦軸の単位：文の数、 横軸の単位：患者の全ての発言の全ての文字数'

  // stack
  var context = svg.append('g') // 全体グラフグループ作成
    .attr('class', 'context')
    .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')')

  var scaleY = d3.scale.linear().domain([0, 6]).range([0, height0])
  var colors = [workColor, friendColor, loveColor]

  var stack = d3.layout.stack()
    .x(function () { return 1 })
    .y(function (d) { return d.y })
    .values(function (d) { return d })
  var stackdata = stack(stackdataArr)

  var area0 = d3.svg.area()
    .x(function (d, i) {
      if (i % 3 === 0) { return nagasa[i / 3] } else if (i % 3 === 1) { return nagasa[(i - 1) / 3 + 1] - 3 } else { return nagasa[(i - 2) / 3 + 1] - 2 }
    })
    .y0(function () { return height0 })
    .y1(function (d) { return height0 - scaleY(d.y + d.y0) })

  context.selectAll('path')
    .data(stackdata.reverse())
    .enter()
    .append('path')
    .attr('d', area0)
    .attr('fill', function (d, i) { return colors[i] })
  // 以上、stack

  // 棒
  const range = d3.range((width) - (width / (colorArrayInAllQuestionHatsugen.length * 2)), colorArrayInAllQuestionHatsugen.length - 1, -width / (colorArrayInAllQuestionHatsugen.length))
  context.selectAll('line.v')
    .data(range).enter().append('line')
    .attr('x1', function (d, i) {
      return nagasa[i]
    }).attr('y1', 0)
    .attr('x2', function (d, i) { return nagasa[i] }).attr('y2', height0)

  context.selectAll('line')
    .attr('stroke', function (d, i) {
      return colorArrayInAllQuestionHatsugen[i]
    })
    .attr('stroke-width', function (d, i) {
      return (Math.sqrt(keitaisokaiseki[2 * i].length))
    })
    .on('mouseover', function (d, i) {
      var e = document.getElementById('msg')
      var k, l
      e.innerHTML = ''
      for (k = -3; k <= 3; k++) {
        if (2 * (i) + k < 0 || 2 * (i) + k >= hatsugen.length) {
          continue
        }
        if (k === 0) {
          e.innerHTML += '<b><u><font size=' + fontSizeInTextView + '>' + (1 + 2 * i) + '' + txtViewCounselor + ' <font color=' + colorArrayInAllQuestionHatsugen[i] + '>【</font>' + hatsugen[2 * i] + '<font color=' + colorArrayInAllQuestionHatsugen[i] + '>】</font></font></u></b><font size=' + fontSizeInTextView + '><br><br>'
        } else if (k % 2 === 0) {
          e.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + 2 * i) + '' + txtViewCounselor + ' <font color=' + colorArrayInAllQuestionHatsugen[k / 2 + i] + '><b>【</b></font>' + hatsugen[k + 2 * i] + '<font color=' + colorArrayInAllQuestionHatsugen[k / 2 + i] + '><b>】</b></font><br><br>'
        } else { // forループを回さないと各文ごとの表示ができない
          e.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + 2 * i) + '' + clientInTextView + ' '
          for (l = 0; l < bun[k + 2 * i].length; l++) {
            if (bun[k + 2 * i][l] === '') { continue }
            e.innerHTML += '<font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArr[ansCategoryNumArr[k + 2 * i][l]] + '><b>【</b></font>' + bun[k + 2 * i][l] + '<font color=' + answerTextureChoiceArr[ansCategoryNumArr[k + 2 * i][l]] + '><b>】</b></font></font>'
          }
          e.innerHTML += '<font size=' + fontSizeInTextView + '><br><br></font>'
        }
      }
    })

  let datae3 = []
  let jj3
  let mojia1 = []

  for (jj3 = 0; jj3 < nagasa.length; jj3++) {
    if (colorArrayInAllQuestionHatsugen[jj3] === openColor) {
      mojia1[jj3] = '開 質問'
    } else if (colorArrayInAllQuestionHatsugen[jj3] === aiduchiColor) {
      mojia1[jj3] = '相槌'
    } else if (colorArrayInAllQuestionHatsugen[jj3] === closeColor) {
      mojia1[jj3] = '閉 質問'
    } else if (colorArrayInAllQuestionHatsugen[jj3] === kaishakuColor) {
      mojia1[jj3] = '解釈'
    } else {
      mojia1[jj3] = '世間話'
    }
  }

  for (jj3 = 0; jj3 < nagasa.length; jj3++) {
    datae3[jj3] = {x: nagasa[jj3], y: 10, color: colorArrayInAllQuestionHatsugen[jj3], text: mojia1[jj3]}
  }
  context.selectAll('circle')
    .data(datae3)
    .enter()
    .append('circle')
    .attr({
      cx: (d) => d.x,
      cy: (d) => d.y,
      r: 13
    })
    .style('fill', (d) => d.color)
    .on('mouseover', function (d, i) {
      var e = document.getElementById('msg')
      var k, l
      e.innerHTML = ''
      for (k = -3; k <= 3; k++) {
        if (2 * (i) + k < 0 || 2 * (i) + k >= hatsugen.length) {
          continue
        }
        if (k === 0) {
          e.innerHTML += '<b><u><font size=' + fontSizeInTextView + '>' + (1 + 2 * i) + '' + txtViewCounselor + ' <font color=' + colorArrayInAllQuestionHatsugen[i] + '>【</font>' + hatsugen[2 * i] + '<font color=' + colorArrayInAllQuestionHatsugen[i] + '>】</font></font></u></b><font size=' + fontSizeInTextView + '><br><br>'
        } else if (k % 2 === 0) {
          e.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + 2 * i) + '' + txtViewCounselor + ' <font color=' + colorArrayInAllQuestionHatsugen[k / 2 + i] + '><b>【</b></font>' + hatsugen[k + 2 * i] + '<font color=' + colorArrayInAllQuestionHatsugen[k / 2 + i] + '><b>】</b></font><br><br>'
        } else { // forループを回さないと各文ごとの表示ができない
          e.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + 2 * i) + '' + clientInTextView + ' '
          for (l = 0; l < bun[k + 2 * i].length; l++) {
            if (bun[k + 2 * i][l] === '') { continue }
            e.innerHTML += '<font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArr[ansCategoryNumArr[k + 2 * i][l]] + '><b>【</b></font>' + bun[k + 2 * i][l] + '<font color=' + answerTextureChoiceArr[ansCategoryNumArr[k + 2 * i][l]] + '><b>】</b></font></font><br>   '
          }
          e.innerHTML += '<font size=' + fontSizeInTextView + '><br><br></font>'
        }
      }
    })

  const scaleX2 = d3.scale.linear().domain([0, bunsuu]).range([0, width])
  const scaleY2 = d3.scale.linear().domain([0, RGBmaxmax]).range([height, 0])
  const yAxisC = d3.svg.axis().scale(scaleY2).orient('left')// focus

  const xAxisC = d3.svg.axis().scale(scaleX2).orient('bottom')// context

  context.append('g') // focusのy目盛軸
    .attr('class', 'y axis')
    .call(yAxisC)

  context.append('g') // 全体x目盛軸
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height0 + ')')
    .call(xAxisC)

  addTextToSVG(0, axisDescriptionY, axisDescription)
}

export {vizStackChart}