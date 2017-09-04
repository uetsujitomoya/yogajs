/**
 * Created by uetsujitomoya on 2017/08/29.
 */

export default class Node {
    constructor(verb){
        this.subject=verb.subject
        this.isSubject=false
        this.nodeX=0
        this.nodeY=0
        this.r=0
        if(this.isSubject){
            this.strokeColor="red"
        }else{
            this.strokeColor="gray"
        }
        this.nodeCharacter=character
        this.strokeWidth=1
    }
    addStrokeWidth(){
        this.strokeWidth++
    }
}