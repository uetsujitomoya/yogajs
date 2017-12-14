import { bunArr2CsvArr } from './bunArr2CsvArr'
import { downloadAsCSV } from '../../manageCsv/downloadAsCsv'
import { now, today, year } from '../../getDate'
import { rodata } from '../rodata'

const outputCsv = (bunArr)=>{

  //sentence
  //verb
  //subject
  //object
  //kanshaKoken

  const csvArr = bunArr2CsvArr(bunArr)
  downloadAsCSV( "bunArr_" + rodata.knpCsvName + now , csvArr )

}

export {outputCsv}