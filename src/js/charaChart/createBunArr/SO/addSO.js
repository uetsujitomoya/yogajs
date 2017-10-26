import {searchNodeArr} from '../searchNodeArrForCharaAndPoint'
import {rodata} from '../../rodata'

const bunsetsu1stJpRowNo=rodata.bunsetsu1stJpRowNo

const searchCharaArrayForCharaToSO=(charaArr, tmpName, bunsetsu,bun)=> {
  //文中で登場人物を見つける。
  let resultNode = searchNodeArr(charaArr, tmpName)
  if (resultNode.isCharacter) {
    addSO(tmpName,resultNode,bunsetsu,bun)
  } else if (bunsetsu.csv_raw_array.length > bunsetsu1stJpRowNo + 1) {/*AさんBさんにも対応*/
    const tmpCharaNameWithHonorific = bunsetsu.csv_raw_array[bunsetsu1stJpRowNo][0] + bunsetsu.csv_raw_array[bunsetsu1stJpRowNo + 1][0]
    resultNode = searchNodeArr(charaArr, tmpCharaNameWithHonorific)
    if (resultNode.isCharacter) {
      addSO(tmpCharaNameWithHonorific,resultNode,bunsetsu,bun)
    } else {
      bunsetsu.findVerbInBunsetsu()
    }
  } else {
    bunsetsu.findVerbInBunsetsu()
  }
}

const addSO=(charaName,node,bunsetsu,bun)=>{
  //文節に主語目的語情報を増やす
  const bunsetsuInfoRow = bunsetsu.csv_raw_array[0]
  for (let colIdx = 0; colIdx < bunsetsuInfoRow.length; colIdx++) {
    if (bunsetsuInfoRow[colIdx].match('ガ格')) {
      addSubject(charaName,node,bunsetsu,bun)
    }
    if ((bunsetsuInfoRow[colIdx].match('ヲ格') || bunsetsuInfoRow[colIdx].match('ニ格'))) {
      addObject(charaName,node,bunsetsu,bun)
      break
    }
  }
}

const addObject= (charaName,node,bunsetsu,bun)=> {
  bunsetsu.isObject = true
  bunsetsu.object = node
  bun.nodeArray+=node//forViz
  node.bunArr+=bun
}

const addSubject= (charaName,node,bunsetsu,bun)=> {
  bunsetsu.isSubject = true
  bunsetsu.subject = node
  bun.nodeArray+=node//forViz
  node.bunArr+=bun
}

export {searchCharaArrayForCharaToSO}

