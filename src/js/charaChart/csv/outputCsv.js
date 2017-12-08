import { bunArr2CsvArr } from './bunArr2CsvArr'
import { downloadAsCSV } from '../../manageCsv/downloadAsCsv'
import { now, today, year } from '../../getDate'

const outputCsv = (bunArr)=>{

  //sentence
  //verb
  //subject
  //object
  //kanshaKoken


  const csvArr = bunArr2CsvArr(bunArr)
  downloadAsCSV("bunArr"+now,csvArr)

}

export {outputCsv}