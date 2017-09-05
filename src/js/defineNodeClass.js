/**
 * Created by uetsujitomoya on 2017/08/29.
 */

let nodeNum=0

export default class Node {
    constructor(verb){

        this.subject=verb.subject
        this.isSubject=false
        this.x=300+200*Math.sin( (nodeNum/5) * Math.PI)
        this.y=200+200*Math.cos( (nodeNum/5) * Math.PI)
        this.r=5
        if(this.isSubject){
            this.strokeColor="red"
        }else{
            this.strokeColor="gray"
        }
        this.nodeCharacter=verb.subject
        this.circleStrokeWidth=1
        nodeNum++
    }
    addStrokeWidth(){
        this.strokeWidth++
    }
}