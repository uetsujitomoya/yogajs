import { EscapeSJIS, UnescapeSJIS } from '../../ecl'

const bunArr2CsvArr=(bunArr)=>{

  //sentence
  //verb
  //subject
  //object
  //kanshaKoken

  let csvArr=[]
  csvArr.push([UnescapeSJIS(encodeURI('文')),'動詞','主語','目的語','「悪いアイツかわいそうな私」なら1'])
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
  }
  return csvArr
}

export {bunArr2CsvArr}

class csvRow {
  constructor (){
  }
}