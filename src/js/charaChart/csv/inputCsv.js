import { EscapeSJIS, UnescapeSJIS } from '../../ecl'

const inputCsv=(csvArr)=>{
  //bunArrの中身を書き換える
  //makeCsvの逆をやればいい


  csvArr.splice(0, 1)

  let bunCnt=0
  let verbCnt=0
  let csvArrRowNo=0

  for(const bun of bunArr){

    if(typeof bun.verb_array !== 'undefined'){
      for(const verb of bun.verb_array){

        const col = csvArr[csvArrRowNo]
        bun.surfaceForm=col[0]
        verb.surfaceForm=col[1]
        verb.subject.name=col[2]
        verb.object.name=col[3]
        verb.isBlueArrowColor=col[4]

        csvArrRowNo++

        //console.log(verb.subject)

        //subject不在。object不在の場合の処理

      }
    }
  }

/*  csvArr.push([UnescapeSJIS(encodeURI('文')),'動詞','主語','目的語','「悪いアイツかわいそうな私」なら1'])
  for(const bun of bunArr){

    if(typeof bun.verb_array !== 'undefined'){
      for(const verb of bun.verb_array){
        //console.log(verb.subject)

        //subject不在。object不在の場合の処理
        csvArr.push([
          EscapeSJIS(bun.surfaceForm),
          EscapeSJIS(verb.surfaceForm),
          EscapeSJIS(verb.subject.name),
          EscapeSJIS(verb.object.name),
          0
        ])
      }
    }
  }*/

}

export {inputCsv}