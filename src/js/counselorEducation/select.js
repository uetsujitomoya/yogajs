// 入れ替える点の入力（トースト）

/*
 let Button= {
 html:"",
 orijinalSentence:""
 }; */

const kaishakuName = '解釈と助言'
const selfTxtColor = "black"
const spiritualTxtColor = "black"

import {convertCSV2Storage} from './sub/convertCsv2Storage.js'

const createGraphSelectButton = () => {
  let GraphSelectButtonPlaceID = 'GraphSelectButton'
  let stackedChartName = '積み重ねグラフ'
  let barChartName = '帯グラフ'
  let target = document.getElementById(GraphSelectButtonPlaceID)// checkboxを出す場所
  target.innerHTML += '<div id="graph" style="cursor: pointer"></div><br>'
  document.getElementById('graph').innerHTML += '<label><input type=radio name="graph" value=11>' + stackedChartName + '</label>'
  // document.getElementById("graph").innerHTML += "<label><input type=radio name=\"graph\" value=12>graph2</label>";
  document.getElementById('graph').innerHTML += '<label><input type=radio name="graph" value=13>' + barChartName + '</label>'
}

const makeRGB = (RGB, hatsugen) => {
  const loveNumber = 0
  const workNumber = 1
  const friendNumber = 2
  const noClassNumber = 3

  for (let hatsugenNo = 1; hatsugenNo < hatsugen.length; hatsugenNo = hatsugenNo + 2) {
    RGB[hatsugenNo] = []
    hatsugen[hatsugenNo].sentence.forEach((sentenceNumber) => {
      RGB[hatsugenNo][sentenceNumber] = [0, 0, 0, 0]
      if (hatsugen[hatsugenNo].sentences[sentenceNumber].task === 'love') {
        RGB[hatsugenNo][sentenceNumber][loveNumber] = 1
      } else if (hatsugen[hatsugenNo].sentences[sentenceNumber].task === 'work') {
        RGB[hatsugenNo][sentenceNumber][workNumber] = 1
      } else if (hatsugen[hatsugenNo].sentences[sentenceNumber].task === 'friend') {
        RGB[hatsugenNo][sentenceNumber][friendNumber] = 1
      } else {
        RGB[hatsugenNo][sentenceNumber][noClassNumber] = 1
      }
    })
  }
}

const createAnswerRadioButton = (answerNumber, value, color, answerGroupName, checked) => {
  const targetInRow = document.getElementById('r' + answerNumber)
  if(checked){
    targetInRow.innerHTML += '<label><input type=radio name="r' + answerNumber + '" value=' + value + ' checked><font color="' + color + '">【</font>「' + answerGroupName + '」に含む<font color="' + color + '">】</font></label>'

  }else{
    targetInRow.innerHTML += '<label><input type=radio name="r' + answerNumber + '" value=' + value + '><font color="' + color + '">【</font>「' + answerGroupName + '」に含む<font color="' + color + '">】</font></label>'

  }
}

const select = (jsonName, storage, checkboxlist, keitaisokaiseki, miserables, chboxlist, chboxlist2, answerClassification3dArrayforCreatingSelect, RGBlist, hatsugen, bun, checked, checked2, taiou, taiou2, chBoxLen, chboxlength2) => {

  convertCSV2Storage(jsonName, storage)

  var bunIdx, hatsugenIdx, n, categoryIdx
  taiou = []
  taiou2 = []

  var target = document.getElementById('radio_buttons')// checkboxを出す場所

  var ansCnt = 0
  n = 0
  chBoxLen = 0
  chboxlength2 = 0
  var questionCnt = 0

  createGraphSelectButton()

  for (let hatsugenIdx = 0; hatsugenIdx < keitaisokaiseki.length; hatsugenIdx++) {
    if (hatsugenIdx % 2 === 1) {
      for (bunIdx = 0; bunIdx < keitaisokaiseki[hatsugenIdx].length; ++bunIdx) {
        if (bun[hatsugenIdx][bunIdx] === 'Ａ' || bun[hatsugenIdx][bunIdx] === 'Ｂ' || bun[hatsugenIdx][bunIdx] === 'Ｔ' || bun[hatsugenIdx][bunIdx] === 'A' || bun[hatsugenIdx][bunIdx] === 'B' || bun[hatsugenIdx][bunIdx] === 'T' || bun[hatsugenIdx][bunIdx] === '') {
          continue
        }
        n++
        chboxlist[n] = []// こいつの長さは、チェックボックスの有無にかかわらず全文数なので、ifの外
        chboxlist[n][0] = bun[hatsugenIdx][bunIdx]
        chboxlist[n][1] = 0

        ansCnt++
        chBoxLen++

        let stockedAnsGroupNo = storage.getItem(jsonName + 'RGB' + ansCnt)

        const categorizedAnswerCategoryQty=5

        if (stockedAnsGroupNo !== null) {
          answerClassification3dArrayforCreatingSelect[hatsugenIdx][bunIdx][stockedAnsGroupNo] = 1

          for (let categoryIdx = 0; categoryIdx < categorizedAnswerCategoryQty; categoryIdx++) {
            if (categoryIdx != stockedAnsGroupNo) {
              answerClassification3dArrayforCreatingSelect[hatsugenIdx][bunIdx][categoryIdx] = 0
            }// 全てゼロなら濃いグレーが出力
          }

        }
        taiou[ansCnt - 1] = n - 1


        //どれにも属さない
        if (answerClassification3dArrayforCreatingSelect[hatsugenIdx][bunIdx][0] + answerClassification3dArrayforCreatingSelect[hatsugenIdx][bunIdx][1] + answerClassification3dArrayforCreatingSelect[hatsugenIdx][bunIdx][2] >= 2) {
          target.innerHTML += '<div id="b' + ansCnt + '" style="cursor: pointer"><u>' + (hatsugenIdx + 1) + '(C) ' + bun[hatsugenIdx][bunIdx] + '</u></div><div id="r' + ansCnt + '"><label><input type=radio name="r' + ansCnt + '" value=0>どれにも含まない</label></div><br>'
        } else {
          target.innerHTML += '<div id="b' + ansCnt + '" style="cursor: pointer"><font size=2><u>' + (hatsugenIdx + 1) + '(C) ' + bun[hatsugenIdx][bunIdx] + '</u></div><div id="r' + ansCnt + '" class="hide"<label><input type=radio name="r' + ansCnt + '" value=0>どれにも含まない</label></div></font><br>'
        }

        if (answerClassification3dArrayforCreatingSelect[hatsugenIdx][bunIdx][0] !== 0) {
          chboxlist[n][1] = 0
          document.getElementById('r' + ansCnt).innerHTML += '<label><input type=radio name="r' + ansCnt + '" value=1 checked><font color="#ff7777">【</font>「愛」に含む<font color="#ff7777">】</font></label>'
        } else {
          document.getElementById('r' + ansCnt).innerHTML += '<label><input type=radio name="r' + ansCnt + '" value=1><font color="#ff7777">【</font>「愛」に含む<font color="#ff7777">】</font></label>'
        }
        if (answerClassification3dArrayforCreatingSelect[hatsugenIdx][bunIdx][1] !== 0) {
          document.getElementById('r' + ansCnt).innerHTML += '<label><input type=radio name="r' + ansCnt + '" value=2 checked><font color="#77ff77">【</font>「交友」に含む<font color="#77ff77">】</font></label>'
          chboxlist[n][1] = 1
        } else {
          document.getElementById('r' + ansCnt).innerHTML += '<label><input type=radio name="r' + ansCnt + '" value=2><font color="#77ff77">【</font>「交友」に含む<font color="#77ff77">】</font></label>'
        }
        if (answerClassification3dArrayforCreatingSelect[hatsugenIdx][bunIdx][2] !== 0) {
          document.getElementById('r' + ansCnt).innerHTML += '<label><input type=radio name="r' + ansCnt + '" value=3 checked><font color="#7777ff">【</font>「仕事」に含む<font color="#7777ff">】</font></label>'
          chboxlist[n][1] = 2
        } else {
          document.getElementById('r' + ansCnt).innerHTML += '<label><input type=radio name="r' + ansCnt + '" value=3><font color="#7777ff">【</font>「仕事」に含む<font color="#7777ff">】</font></label>'
        }

        if (answerClassification3dArrayforCreatingSelect[hatsugenIdx][bunIdx][3] !== 0) {
          createAnswerRadioButton(ansCnt, 4, selfTxtColor, '自己', true)
          chboxlist[n][1] = 3
        } else {
          createAnswerRadioButton(ansCnt, 4, selfTxtColor, '自己', false)
        }

        if (answerClassification3dArrayforCreatingSelect[hatsugenIdx][bunIdx][4] !== 0) {
          createAnswerRadioButton(ansCnt, 5, spiritualTxtColor, 'スピリチュアル', true)
          chboxlist[n][1] = 4
        } else {
          createAnswerRadioButton(ansCnt, 5, spiritualTxtColor, 'スピリチュアル', false)
        }
      }
    } else {
      questionCnt++
      chboxlength2++
      chboxlist2[questionCnt] = []
      chboxlist2[questionCnt][0] = hatsugen[hatsugenIdx]
      chboxlist2[questionCnt][1] = 4
      taiou2[questionCnt - 1] = questionCnt - 1

      var stockedQuestionGroupNo = storage.getItem(jsonName + 'RGBlist' + questionCnt)

      if (stockedQuestionGroupNo !== null) {
        for (categoryIdx = 3; categoryIdx <= 7; categoryIdx++) {
          if (categoryIdx == stockedQuestionGroupNo) {
            RGBlist[hatsugenIdx / 2][categoryIdx] = 1
          } else {
            RGBlist[hatsugenIdx / 2][categoryIdx] = 0
          }
        }
      }

      if (RGBlist[hatsugenIdx / 2][3] === 1) {
        target.innerHTML += '<div id="bs' + questionCnt + '" style="cursor: pointer"><font size=2 color=dimgray><u>' + (hatsugenIdx + 1) + '(T) ' + hatsugen[hatsugenIdx] + '</u></font></div><div id="rs' + questionCnt + '" class="hide"><label><input type=radio name="rs' + questionCnt + '" value=3 checked><font color=deeppink>開かれた質問</font></label><label><input type=radio name="rs' + questionCnt + '" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name="rs' + questionCnt + '" value=5><font color=purple>相づち</font></label><label><input type=radio name="rs' +
          questionCnt + '" value=6><font color=orangered>解釈と助言</font></label><label><input type=radio name="rs' + questionCnt + '" value=7><font color=black>世間話</font></label></div><br>'
      } else	if (RGBlist[hatsugenIdx / 2][5] === 1) {
        target.innerHTML += '<div id="bs' + questionCnt + '" style="cursor: pointer"><font size=2 color=dimgray><u>' + (hatsugenIdx + 1) + '(T) ' + hatsugen[hatsugenIdx] + '</u></font></div><div id="rs' + questionCnt + '" class="hide"><label><input type=radio name="rs' + questionCnt + '" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name="rs' + questionCnt + '" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name="rs' + questionCnt + '" value=5 checked><font color=purple>相づち</font></label><label><input type=radio name="rs' +
          questionCnt + '" value=6><font color=orangered>解釈と助言</font></label><label><input type=radio name="rs' + questionCnt + '" value=7><font color=black>世間話</font></label></div><br>'
      } else	if (RGBlist[hatsugenIdx / 2][4] === 1) {
        target.innerHTML += '<div id="bs' + questionCnt + '" style="cursor: pointer"><font size=2 color=dimgray><u>' + (hatsugenIdx + 1) + '(T) ' + hatsugen[hatsugenIdx] + '</u></font></div><div id="rs' + questionCnt + '" class="hide"><label><input type=radio name="rs' + questionCnt + '" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name="rs' + questionCnt + '" value=4 checked><font color=blue>閉じられた質問</font></label><label><input type=radio name="rs' + questionCnt + '" value=5><font color=purple>相づち</font></label><label><input type=radio name="rs' +
          questionCnt + '" value=6><font color=orangered>解釈と助言</font></label><label><input type=radio name="rs' + questionCnt + '" value=7><font color=black>世間話</font></label></div><br>'
      } else	if (RGBlist[hatsugenIdx / 2][6] === 1) {
        target.innerHTML += '<div id="bs' + questionCnt + '" style="cursor: pointer"><u>' + (hatsugenIdx + 1) + '(T) ' + hatsugen[hatsugenIdx] + '</u></div><div id="rs' + questionCnt + '"><label><input type=radio name="rs' + questionCnt + '" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name="rs' + questionCnt + '" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name="rs' + questionCnt + '" value=5><font color=purple>相づち</font></label><label><input type=radio name="rs' + questionCnt +
          '" value=6 checked><font color=orangered>解釈と助言</font></label><label><input type=radio name="rs' + questionCnt + '" value=7><font color=black>世間話</font></label></div><br>'
      } else {
        target.innerHTML += '<div id="bs' + questionCnt + '" style="cursor: pointer"><u>' + (hatsugenIdx + 1) + '(T) ' + hatsugen[hatsugenIdx] + '</u></div><div id="rs' + questionCnt + '"><label><input type=radio name="rs' + questionCnt + '" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name="rs' + questionCnt + '" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name="rs' + questionCnt + '" value=5><font color=purple>相づち</font></label><label><input type=radio name="rs' + questionCnt +
          '" value=6><font color=orangered>解釈と助言</font></label><label><input type=radio name="rs' + questionCnt + '" value=7 checked><font color=black>世間話</font></label></div><br>'
      }
    }
  }



  const createAnswerRadioButtonRow = (answerNumber, value, color, answerGroupName) => {
    const targetInRow = document.getElementById('r' + answerNumber)
    targetInRow.innerHTML += '<label><input type=radio name="r' + answerNumber + '" value=' + value + '><font color="' + color + '">【</font>「' + answerGroupName + '」に含む<font color="' + color + '">】</font></label>'
  }

  const createQuestionRadioButton = (answerNumber, value, color, answerGroupName) => {
    const targetInRow = document.getElementById('r' + answerNumber)
    targetInRow.innerHTML += '<label><input type=radio name="r' + answerNumber + '" value=' + value + '><font color="' + color + '">【</font>「' + answerGroupName + '」に含む<font color="' + color + '">】</font></label>'
  }

  const createQuestionRadioButtonRow = (answerNumber, value, color, answerGroupName) => {
    const targetInRow = document.getElementById('r' + answerNumber)
    targetInRow.innerHTML += '<label><input type=radio name="r' + answerNumber + '" value=' + value + '><font color="' + color + '">【</font>「' + answerGroupName + '」に含む<font color="' + color + '">】</font></label>'
  }

  var ansNoMax = ansCnt
  var questionNoMax = questionCnt

  return {
    checkboxlist: checkboxlist,
    chboxlist: chboxlist,
    chboxlist2: chboxlist2,
    RGB: answerClassification3dArrayforCreatingSelect,
    RGBlist: RGBlist,
    checked: checked,
    checked2: checked2,
    taiou: taiou,
    taiou2: taiou2,
    chboxlength: chBoxLen,
    chboxlength2: chboxlength2,
    answerNumbermax: ansNoMax,
    questionNumbermax: questionNoMax
  }
}

export {select}