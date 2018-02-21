import { EscapeSJIS, UnescapeSJIS } from '../../ecl'
import { csv2Arr } from '../../manageCsv/csv2Arr'
import { rodata } from '../rodata'
import { hasNoObject, isNeededBunToSearch, isNeededVerbForCsv } from './bunArr2CsvArr'
import { fromCsvTxt2Arr } from './getCSVFile'

const inputBunArrCsv=(bunArr, bunArrCsv)=>{
  //bunArrの中身を書き換える
  //makeCsvの逆をやればいい

  //const csvArr=csv2Arr(rodata.bunArrCsvFolder+rodata.bunArrCsvName)
  const csvArr=fromCsvTxt2Arr(bunArrCsv)


  //csvArr.splice(0, 1)

  let bunCnt=0
  let verbCnt=0
  let csvArrRowNo=1

  //丸にも対応させないといけない！

  for(const bun of bunArr){

    if(isNeededBunToSearch(bun)){
      for(const verb of bun.verbArr){
        if(isNeededVerbForCsv(verb)){
          const col = csvArr[csvArrRowNo]
          if(hasNoObject(verb)){
            verb.isBlueCircleColor=col[4]
          }else{
            verb.isBlueArrowColor=col[4]
          }
          //後は青くするだけ

          //bun.surfaceForm=col[0]
          //verb.surfaceForm=col[1]
          //verb.subject.name=col[2]
          //verb.object.name=col[3]


          csvArrRowNo++
        }
        //console.log(verb.subject)
        //subject不在。object不在の場合の処理
      }
    }
  }

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

}

export {inputBunArrCsv}