import { EscapeSJIS } from '../../ecl'

const bunArr2CsvArr=(bunArr)=>{

  //sentence
  //verb
  //subject
  //object
  //kanshaKoken

  let csvArr=[]
  csvArr.push(['文','動詞','主語','目的語','「悪いアイツかわいそうな私」なら1'])
  for(const bun of bunArr){
    //console.log(bun)
    if(typeof bun.verb_array !== 'undefined'){
      for(const verb of bun.verb_array){
        csvArr.push([
          EscapeSJIS(bun.surfaceForm),
          EscapeSJIS(verb.surfaceForm),
          EscapeSJIS(verb.subject),
          EscapeSJIS(verb.object),
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