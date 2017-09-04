/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import Node from "../js/defineNodeClass.js";
import Arrow from "../js/defineArrowClass.js"

let createNodeAndArrowArray=(sentenceArray)=>{
    let arrowArray=[]
    let nodeArray=[]
    //KNP_sentence_array.forEach((sentence)=>{
    for(let sentenceNum=0;sentenceNum<sentenceArray.length;sentenceNum++){
        let sentence=sentenceArray[sentenceNum]
        console.log(sentence)

        let containsVerbArray = {
            value: 'verb_array' in sentence ? sentence.verb_array : 'No'
        }

        if(containsVerbArray.value=='No'){continue}

        sentence.verb_array.forEach((verb)=>{

            if(existsObject(verb)){
                let isNewArrow=true
                for(let tempArrowNum=0;tempArrowNum<nodeArray.length;tempArrowNum++){
                    if ( isSameArrow ( arrowArray[tempArrowNum] , verb ) ) {
                        nodeArray[tempArrowNum].addArrowStrokeWidth()
                        isNewArrow=false
                        break
                    }
                }
                if(isNewArrow){
                    arrowArray.push(new Arrow(verb))
                }
            }else if(existsSubject(verb)){
                let isNewNode=true
                for(let tempNodeNum=0;tempNodeNum<nodeArray.length;tempNodeNum++){
                    if ( isSameNode ( nodeArray[tempNodeNum] , verb ) ) {
                        nodeArray[tempNodeNum].addNodeStrokeWidth()
                        isNewNode=false
                        break
                    }
                }
                if(isNewNode){
                    nodeArray.push(new Node(verb))
                }
            }
        })
    }

    console.log(nodeArray)
    console.log(arrowArray)
}

let isSameArrow=(arrow,verb)=>{
    if ( (arrow.subject==verb.subject) && (arrow.object==verb.object)){
        return true
    }else{
        return false
    }
}

let isSameNode=(node,verb)=>{
    if (node.subject==verb.subject){
        return true
    }else{
        return false
    }
}

let existsObject=(verb)=>{
    if(verb.object=='null'){
        return false
    }else{
        return true
    }

}

let existsSubject=(verb)=>{
    if(verb.subject='null'){
        return false
    }else{
        return true
    }
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