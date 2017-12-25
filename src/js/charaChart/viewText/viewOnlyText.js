import {createBox} from './createBox'
import { addBun } from './addBun'

const viewOnlyText = (bunArr) => {
  createBox(ViewOnlyText)
  bunArr.forEach((d,i)=>{
    addBun(d,"msgViewOnlyText",false)
  })
}

export {viewOnlyText}