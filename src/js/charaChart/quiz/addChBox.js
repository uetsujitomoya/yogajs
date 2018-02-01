const addChBox=()=>{
  target.innerHTML += '<div id="b' + ansCnt + '" style="cursor: pointer"><u>' + (hatsugenIdx + 1) + '(C) ' + bun[hatsugenIdx][bunIdx] + '</u></div><div id="r' + ansCnt + '"><label><input type=radio name="r' + ansCnt + '" value=0>どれにも含まない</label></div><br>'

  const createAnswerRadioButton = (answerNumber, value, color, answerGroupName, checked) => {
    const targetInRow = document.getElementById('r' + answerNumber)
    if(checked){
      targetInRow.innerHTML += '<label><input type=radio name="r' + answerNumber + '" value=' + value + ' checked><font color="' + color + '">【</font>「' + answerGroupName + '」に含む<font color="' + color + '">】</font></label>'

    }else{
      targetInRow.innerHTML += '<label><input type=radio name="r' + answerNumber + '" value=' + value + '><font color="' + color + '">【</font>「' + answerGroupName + '」に含む<font color="' + color + '">】</font></label>'

    }
  }

}