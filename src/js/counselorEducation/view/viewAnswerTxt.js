import {rodata} from '../rodata'

const txtViewFontSize=rodata.txtView.fontSize
const txtViewClient=rodata.txtView.client

const viewAnswerTxt = (input) =>{
  //txtViewHatsugenNo onlyTxtViewのときは0を入力してこよう
  //bar chartにおいて、 hatsugenNo = txtViewHatsugenNo + rectHatsugenNoArr[rectNo]

  //hatsugenNoが実際には繰り返されている

  let m = input.m;
  const txtViewHatsugenNo = input.txtViewHatsugenNo
  const hatsugenNo = input.hatsugenNo
  const bun = input.bun
  const ansTextureChoiceArr = input.ansTextureChoiceArr
  const ansCategoryNoArr = input.ansCategoryNoArr

  //console.log(txtViewHatsugenNo + hatsugenNo[rectNo])

  m.innerHTML += '<font size=' + txtViewFontSize + '>' + (1 + hatsugenNo) + '' + txtViewClient + ' '
  for (let bunNo = 0; bunNo < bun[hatsugenNo].length; bunNo++) {
    if (bun[hatsugenNo][bunNo] === '') { continue }
    if(input.isToViewOnlyTxt){
      m.innerHTML += '<u><font size=' + txtViewFontSize + '><font color="gray"><b>【</b></font>' + bun[hatsugenNo][bunNo] + '<font color="gray"><b>】</b></font></font></u>'
    }else{
      m.innerHTML += '<u><font size=' + txtViewFontSize + '><font color=' + ansTextureChoiceArr[ansCategoryNoArr[hatsugenNo][bunNo]] + '><b>【</b></font>' + bun[hatsugenNo][bunNo] + '<font color=' + ansTextureChoiceArr[ansCategoryNoArr[hatsugenNo][bunNo]] + '><b>】</b></font></font></u>'
    }
  }
  m.innerHTML += '<font size=' + txtViewFontSize + '><br><br></font>'
}

export{viewAnswerTxt}