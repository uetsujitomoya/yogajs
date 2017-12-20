import {r} from './defineNode'

const definePointArr = (arrow) => {
  //nodeとarrayを紐付ける

  let subjectX,subjectY,objectX,objectY

  if(arrow.subject.x>arrow.object.x){
    subjectX=arrow.subject.x
    objectX=arrow.object.x
  }else{
    subjectX = arrow.subject.x - 10
    objectX = arrow.object.x - 10
  }

  if(arrow.subject.y>arrow.object.y){
    subjectY=arrow.subject.y
    objectY=arrow.object.y
  }else{
    subjectY = arrow.subject.y + 10
    objectY = arrow.object.y + 10
  }

  arrow.pointArr = [ [ subjectX , subjectY , r ] , [ objectX , objectY , r ] ]

}

export {definePointArr}