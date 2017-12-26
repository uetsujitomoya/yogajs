import {createBox} from './createBox'
import { addBun } from './addBun'

const boxId="viewonlytxt"

const viewOnlyTxt = (bunArr) => {
  createBox(boxId)
  bunArr.forEach((d,i)=>{
    addBun("msg"+boxId,d,false)
  })
}

export {viewOnlyTxt}