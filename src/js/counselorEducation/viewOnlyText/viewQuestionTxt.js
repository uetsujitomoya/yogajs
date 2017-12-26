import{rodata} from '../rodata'

const txtViewFontSize
const txtViewCounselor

const viewQuestionTxt = (m,allHatsugenNoArr,hatsugenNo,allQuestionHatsugenColorArr) =>{
  m.innerHTML += '<b><u><font size=' + txtViewFontSize + '>' + (1 + allHatsugenNoArr[hatsugenNo]) + '' + txtViewCounselor + ' <font color=' + allQuestionHatsugenColorArr[allHatsugenNoArr[hatsugenNo] / 2] + '>【</font>' + hatsugen[allHatsugenNoArr[hatsugenNo]] + '<font color=' + allQuestionHatsugenColorArr[allHatsugenNoArr[hatsugenNo] / 2] + '>】</font></u></b><font size=' + txtViewFontSize + '><br><br>'
}

export {viewQuestionTxt}