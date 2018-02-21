import { EscapeSJIS, UnescapeSJIS } from '../../ecl'
import { rodata } from '../rodata'

const bunArr2CsvArr=(bunArr)=>{

  //sentence
  //verb
  //subject
  //object
  //kanshaKoken

  let csvArr=[]
  /*  csvArr.push([UnescapeSJIS(encodeURI('文')),'動詞','主語','目的語','「悪いアイツかわいそうな私」なら1'])
    for(const bun of bunArr){

      if(typeof bun.verbArr !== 'undefined'){
        for(const verb of bun.verbArr){
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

  csvArr.push(['文','動詞','主語','目的語','「悪いアイツかわいそうな私」なら1'])
  for(const bun of bunArr){

    if(isNeededBunToSearch(bun)){
      for(const verb of bun.verbArr){
        if(isNeededVerbForCsv(verb)){
          if(hasNoObject(verb)){
            csvArr.push([bun.surfaceForm,verb.surfaceForm,verb.subject.name,"（なし）",0])
          }else{
            csvArr.push([bun.surfaceForm,verb.surfaceForm,verb.subject.name,verb.object.name,0])
          }
        }
        //console.log(verb.subject)
        //subject不在。object不在の場合の処理
      }
    }
  }

  return csvArr
}

const hasNoObject=(verb)=>{
  if(verb.object===null){
    return true
  }else{
    return false
  }
}

const isNeededBunToSearch=(bun)=>{
  if(typeof bun.verbArr !== 'undefined'){
    return true
  }else{
    return false
  }
}

const isNeededVerbForCsv=(verb)=>{
  if(verb.subject!==null){
    return true
  }else{
    return false
  }
/*  if(verb.subject!==null && verb.object!==null){
    if(rodata.withPeople){
      return true
    }else{
      if(verb.subject.name==="Aさん" && verb.object.name!=="Aさん"){
        return true
      }else{
        return false
      }
    }
  }else{
    return false
  }*/
}

export {bunArr2CsvArr,isNeededBunToSearch,isNeededVerbForCsv,hasNoObject}

class csvRow {
  constructor (){
  }
}