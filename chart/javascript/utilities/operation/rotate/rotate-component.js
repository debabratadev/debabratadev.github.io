/**
 * Rotate child component
 */
function RotateChild(){

    /**
     * start Rotation 
     */
    this.startRotate = function(component,mouse,type,parent){ 
        if(type=="row"){
            for(let index=0;index<component.length;++index){
                const row = component[index];
                this.storeTempRotationCordinate(row)
            }
        }
        else{
            for(let index=0;index<component.length;++index){
                const object = component[index];
                object.rotateStartDrag(mouse,parent);
            }
        }
    }

    /**
     * handles rotating
     */
    this.rotating = function(component,mouse,type,parent){

        //rotation angle
        if(type=="row"){
            for(let index=0;index<component.length;++index){
                const row = component[index];
                this.rotateSeats(row,parent);
            }
        } 
        else{
            for(let index=0;index<component.length;++index){
                const object = component[index];
                object.rotateDragging(mouse,parent);
            }
        }
    }

    /**
     * end rotate
     */
    this.endRotate = function(component,mouse,type,parent){

        if(type == "row"){
            
        } else{
            for(let index=0;index<component.length;++index){
                const object = component[index];
                object.rotateEndDrag(mouse,parent);
            }
        }
    }

    /**
     * Store Initial Rotation cordinats on a temporary variabl
     */
    this.storeTempRotationCordinate = function(component){

        component.tempCordForRotation = [];
        for(let index =0;index<component.seatComponent.length;++index){
            const seat = component.seatComponent[index];
            component.tempCordForRotation.push(seat.coordinates[0]);
        }
    }

    /**
     * Rotate th seats here
     */
    this.rotateSeats = function(component,parent){
        let length = component.seatComponent.length;
        for(let index = 0; index < length; ++index) {
            const seat = component.seatComponent[index];
            let point = pointModule.rotateAroundAnotherPoint(parent.centroid, parent.rotationAngle, component.tempCordForRotation[index]);
            seat.coordinates[0] = {x:point.x,y:point.y};
            component.seatOriginalCordinate[index]={x:point.x,y:point.y};
        }

        component.firstSeat = component.seatComponent[0].coordinates[0];
        component.lastSeat = component.seatComponent[length - 1].coordinates[0];
        
        length = lineModule.lengthOfALine(component.firstSeat,component.lastSeat);
        component.startPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(component.lastSeat,component.firstSeat,length+component.radius);
        component.endPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(component.firstSeat,component.lastSeat,length+component.radius);
    }
}