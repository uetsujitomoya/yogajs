import{rodata} from '../rodata'

const txtViewFontSize=rodata.txtView.fontSize
const txtViewCounselor=rodata.txtView.counselor

const viewQuestionTxt = (m,rectHatsugenNoArr,hatsugenNo,allQuestionHatsugenColorArr,hatsugenArr,isToViewOnlyTxt) =>{
  //bar chartにおいて、 hatsugenNo = rectHatsugenNoArr[rectNo]
  if(isToViewOnlyTxt){
    m.innerHTML += '<b><u><font size=' + txtViewFontSize + '>' + (1 + hatsugenNo) + '' + txtViewCounselor + ' <font color="gray">【</font>' + hatsugenArr[hatsugenNo] + '<font color="gray">】</font></u></b><font size=' + txtViewFontSize + '><br><br>'
  }else{
    m.innerHTML += '<b><u><font size=' + txtViewFontSize + '>' + (1 + hatsugenNo) + '' + txtViewCounselor + ' <font color=' + allQuestionHatsugenColorArr[hatsugenNo / 2] + '>【</font>' + hatsugenArr[hatsugenNo] + '<font color=' + allQuestionHatsugenColorArr[hatsugenNo / 2] + '>】</font></u></b><font size=' + txtViewFontSize + '><br><br>'
  }

}

export {viewQuestionTxt}