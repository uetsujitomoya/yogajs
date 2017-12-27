import{rodata} from '../rodata'

const txtViewFontSize=rodata.txtView.fontSize
const txtViewCounselor=rodata.txtView.counselor

const viewQuestionTxt = (m,allHatsugenNoArr,hatsugenNo,allQuestionHatsugenColorArr,hatsugenArr) =>{
  m.innerHTML += '<b><u><font size=' + txtViewFontSize + '>' + (1 + allHatsugenNoArr[hatsugenNo]) + '' + txtViewCounselor + ' <font color=' + allQuestionHatsugenColorArr[allHatsugenNoArr[hatsugenNo] / 2] + '>【</font>' + hatsugenArr[allHatsugenNoArr[hatsugenNo]] + '<font color=' + allQuestionHatsugenColorArr[allHatsugenNoArr[hatsugenNo] / 2] + '>】</font></u></b><font size=' + txtViewFontSize + '><br><br>'
}

export {viewQuestionTxt}