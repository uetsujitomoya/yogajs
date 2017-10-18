import {r} from './defineNode'

const connectNodeAndArray = (arrow) => {
  //nodeとarrayを紐付ける
  arrow.pointArray = [ [ arrow.subject.x , arrow.object.y , r ] , [ arrow.object.x , arrow.object.y , r ] ]
}

export {connectNodeAndArray}