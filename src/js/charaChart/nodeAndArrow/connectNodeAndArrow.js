import {r} from './defineNode'

const connectNodeAndArrow = (arrow) => {
  //nodeとarrayを紐付ける
  console.log(arrow)
  arrow.pointArray = [ [ arrow.subject.x , arrow.subject.y , r ] , [ arrow.object.x , arrow.object.y , r ] ]
}

export {connectNodeAndArrow}