import { EscapeSJIS, UnescapeSJIS } from '../../ecl'
import { csv2Arr } from '../../manageCsv/csv2Arr'
import { charaChartRodata } from '../rodata'
import { hasNoObject, isNeededBunToSearch, isNeededVerbForCsv } from './bunArr2CsvArr'
import { fromCsvTxt2Arr } from './getCSVFile'

const inputBunArrCsv=(bunArr, bunArrCsv)=>{
  //bunArrの中身を書き換える
  //makeCsvの逆をやればいい
  const csvArr=fromCsvTxt2Arr(bunArrCsv)
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
          csvArrRowNo++
        }
        //subject不在。object不在の場合の処理
      }
    }
  }
}

export {inputBunArrCsv}