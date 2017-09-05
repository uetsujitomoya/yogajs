/**
 * Created by uetsujitomoya on 2017/08/29.
 */

export default class Node {
    constructor(verb,nodeNum,svg){



        this.subject=verb.subject
        this.isSubject=false
        this.nodeX=Math.sin( (nodeNum/5) * Math.PI)
        this.nodeY=Math.cos( (nodeNum/5) * Math.PI)
        this.r=5
        if(this.isSubject){
            this.strokeColor="red"
        }else{
            this.strokeColor="gray"
        }
        this.nodeCharacter=verb.subject
        this.strokeWidth=1
    }
    addStrokeWidth(){
        this.strokeWidth++
    }
}