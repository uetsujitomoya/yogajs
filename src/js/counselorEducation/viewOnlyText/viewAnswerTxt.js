import {rodata} from '../rodata'

const txtViewFontSize
const txtViewClientName

const viewAnswerTxt = (m,txtViewHatsugenNo,allHatsugenIdxArr,hatsugenNo,bun,ansTextureChoiceArr,ansCategoryNoArr) =>{
  m.innerHTML += '<font size=' + txtViewFontSize + '>' + (1 + txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]) + '' + txtViewClientName + ' '
  for (let bunNo = 0; bunNo < bun[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]].length; bunNo++) {
    if (bun[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]][bunNo] === '') { continue }

    m.innerHTML += '<u><font size=' + txtViewFontSize + '><font color=' + ansTextureChoiceArr[ansCategoryNoArr[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]][bunNo]] + '><b>【</b></font>' + bun[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]][bunNo] + '<font color=' + ansTextureChoiceArr[ansCategoryNoArr[txtViewHatsugenNo + allHatsugenIdxArr[hatsugenNo]][bunNo]] + '><b>】</b></font></font></u>'

  }
  m.innerHTML += '<font size=' + txtViewFontSize + '><br><br></font>'
}