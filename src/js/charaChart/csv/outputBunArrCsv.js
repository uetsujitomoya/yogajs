import { bunArr2CsvArr } from './bunArr2CsvArr'
import { downloadAsCSV } from '../../manageCsv/downloadAsCsv'
import { now, today, year } from '../../getDate'
import { charaChartSetting } from '../setting'

const outputBunArrCsv = (bunArr)=>{

  //sentence
  //verb
  //subject
  //object
  //kanshaKoken

  const csvArr = bunArr2CsvArr(bunArr)
  downloadAsCSV( now+"_" + charaChartSetting.knpCsvName +"_withPeople" , csvArr )

}

export {outputBunArrCsv}