import {r} from './defineNode'
import { rodata } from '../rodata'

const fixArrowPointArr = (arrow) => {
  //nodeとarrayを紐付ける

  let subjectX,subjectY,objectX,objectY

  if(arrow.subject.x<=arrow.object.x && rodata.viewMarkEnd){

    subjectX = arrow.subject.x - rodata.arrow.gap
    objectX = arrow.object.x - rodata.arrow.gap
  }else{
    subjectX=arrow.subject.x
    objectX=arrow.object.x
  }

  if(arrow.subject.y<=arrow.object.y && rodata.viewMarkEnd){
    subjectY = arrow.subject.y + rodata.arrow.gap
    objectY = arrow.object.y + rodata.arrow.gap
  }else{
    subjectY=arrow.subject.y
    objectY=arrow.object.y
  }

  arrow.pointArr = [ [ subjectX , subjectY , r ] , [ objectX , objectY , r ] ]

}

export {fixArrowPointArr}