/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import Node from "../js/defineNodeClass.js";
import Arrow from "../js/defineArrowClass.js"

let createNodeAndArrowArray=(KNP_sentence_array)=>{
    let arrowArray=[]
    let nodeArray=[]
    KNP_sentence_array.forEach((sentence)=>{
        sentence.verb_array.forEach((verb)=>{

            if(existsObject(verb)){
                let isNewArrow=true
                for(let tempNodeNum=0;tempNodeNum<nodeArray.length;tempNodeNum++){
                    if ( isSameArrow ( nodeArray[tempNodeNum] , verb ) ) {
                        nodeArray[tempNodeNum].addNodeStrokeWidth()
                        isNewNode=false
                        break
                    }
                }
                if(isNewArrow){
                    arrowArray.push(new Arrow())
                }

            }else if(existsSubject(verb)){
                let isNewNode=true
                for(let tempArrowNum=0;tempArrowNum<nodeArray.length;tempArrowNum++){
                    if(一致){
                        arrowArray[tempArrowNum].addNodeStrokeWidth()
                        isNewNode=false
                        break
                    }
                }
                if(isNewNode){
                    arrowNode.push(new Node())
                }
            }
            //加算も要る

        })
    })
}

let isSameArrow=(node,verb)=>{
    if ( (node.subject==verb.subject) && (node.object==verb.object)){
        return true
    }else{
        return false
    }
}

let existsObject=()=>{

}

let existsSubject=()=>{

}

//let isNewNode=()=>{



//let isNewArrow=()=>{



let createNode=()=>{


}

let createArrow=()=>{

}
/*
class Node{
    constructor(){
        this.xml
        this.y;
        this.r;
        this.strokeColor
    }
}
class Arrow{
    constructor(){

    }
}*/

export {createNodeAndArrowArray}