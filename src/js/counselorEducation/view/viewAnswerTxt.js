import {rodata} from '../rodata'

const txtViewFontSize=rodata.txtView.fontSize
const txtViewClient=rodata.txtView.client

const viewAnswerTxt = (input) =>{
  //txtViewHatsugenNo onlyTxtViewのときは0を入力してこよう

  let m = input.m;
  const txtViewHatsugenNo = input.txtViewHatsugenNo
  const allHatsugenIdxArr = input.allHatsugenIdxArr
  const hatsugenNo = input.hatsugenNo
  const bun = input.bun
  const ansTextureChoiceArr = input.ansTextureChoiceArr
  const ansCategoryNoArr = input.ansCategoryNoArr

  m.innerHTML += '<font size=' + txtViewFontSize + '>' + (1 + txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]) + '' + txtViewClient + ' '
  for (let bunNo = 0; bunNo < bun[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]].length; bunNo++) {
    if (bun[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]][bunNo] === '') { continue }



    //console.log(txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo])
    //console.log(ansCategoryNoArr[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]])
    //console.log(ansTextureChoiceArr[ansCategoryNoArr[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]]])
    //console.log(bun[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]][bunNo])
    //console.log(ansTextureChoiceArr[ansCategoryNoArr[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]][bunNo]])
    m.innerHTML += '<u><font size=' + txtViewFontSize + '><font color=' + ansTextureChoiceArr[ansCategoryNoArr[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]][bunNo]] + '><b>【</b></font>' + bun[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]][bunNo] + '<font color=' + ansTextureChoiceArr[ansCategoryNoArr[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]][bunNo]] + '><b>】</b></font></font></u>'

  }
  m.innerHTML += '<font size=' + txtViewFontSize + '><br><br></font>'
}

export{viewAnswerTxt}