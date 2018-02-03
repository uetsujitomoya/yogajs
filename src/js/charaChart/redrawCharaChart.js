import { nowWatchingArrowOrNode } from './nowWatchingArrowOrNode'
import { applySliderForNodeText } from './viewText/applySliderForNodeTxt'
import { createArrowArr } from './nodeAndArrow/createArrowArr'
import { viewNodeTxt } from './viewText/viewNodeTxt'

const redrawCharaChart = (allBunArr, selectedArea, charaArr) => {
  let selectedBunArr = allBunArr.concat()
  selectedBunArr.splice(selectedArea.end, allBunArr.length - selectedArea.end)
  selectedBunArr.splice(0, selectedArea.start)
  applySliderForNodeText(selectedBunArr, charaArr)
  createArrowArr(selectedBunArr,charaArr,allBunArr)
  if(nowWatchingArrowOrNode.node!==null){
    viewNodeTxt(nowWatchingArrowOrNode.node,allBunArr)
  }
}

export {redrawCharaChart}