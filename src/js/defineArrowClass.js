/**
 * Created by uetsujitomoya on 2017/08/29.
 */

export default class Arrow{
    constructor(verb){
        this.subject=verb.subject
        this.object=verb.object
        this.startPointX=0
        this.startPointY=0
        this.endPointX=0
        this.endPointY=0
        this.strokeColor="gray"
        this.strokeWidth=1
    }
    addStrokeWidth(){
        this.strokeWidth++
    }
}