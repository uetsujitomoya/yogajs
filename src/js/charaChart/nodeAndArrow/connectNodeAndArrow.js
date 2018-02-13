import {r} from './defineNode'

const definePointArr = (arrow) => {
  //nodeとarrayを紐付ける

  let subjectX,subjectY,objectX,objectY

  if(arrow.subject.x>arrow.object.x){
    subjectX=arrow.subject.x+5
    objectX=arrow.object.x+5
  }else{
    subjectX = arrow.subject.x - 5
    objectX = arrow.object.x - 5
  }

  if(arrow.subject.y>arrow.object.y){
    subjectY=arrow.subject.y-5
    objectY=arrow.object.y-5
  }else{
    subjectY = arrow.subject.y + 5
    objectY = arrow.object.y + 5
  }

  arrow.pointArr = [ [ subjectX , subjectY , r ] , [ objectX , objectY , r ] ]

}

export {definePointArr}