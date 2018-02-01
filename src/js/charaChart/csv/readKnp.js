import { csv2Arr } from '../../manageCsv/csv2Arr'
import { setting } from '../setting'

const readKnp=(knpCsvName, knp)=>{
  knp=csv2Arr(setting.knpCsvFolder+knpCsvName+".csv")
}

export {readKnp}