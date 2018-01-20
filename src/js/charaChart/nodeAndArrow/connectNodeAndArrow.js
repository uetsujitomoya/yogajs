import {r} from './defineNode'
import { rodata } from '../rodata'

const definePointArr = (arrow) => {
  //nodeとarrayを紐付ける

  let subjectX,subjectY,objectX,objectY

  if(arrow.subject.x<=arrow.object.x && rodata.viewMarkEnd){

    subjectX = arrow.subject.x - 10
    objectX = arrow.object.x - 10
  }else{
    subjectX=arrow.subject.x
    objectX=arrow.object.x
  }

  if(arrow.subject.y<=arrow.object.y && rodata.viewMarkEnd){
    subjectY = arrow.subject.y + 10
    objectY = arrow.object.y + 10
  }else{
    subjectY=arrow.subject.y
    objectY=arrow.object.y
  }

  arrow.pointArr = [ [ subjectX , subjectY , r ] , [ objectX , objectY , r ] ]

}

export {definePointArr}