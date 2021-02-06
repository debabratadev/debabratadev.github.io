/**
 * Handle properties of polygon inspector
 */
var polygonInspector = (function () {
    
    let polygonObject;
    let inputNumber=['polygon-font-size','polygon-label-x','polygon-label-y','polygon-label-rotation'];

      /**
     * Set the polygon object here
     */
    function setPolygonObject(object){
        polygonObject = object;
        
        helperModule.showInspector('polygon-inspector');
        document.getElementById('polygon-fill-color').value = polygonObject.fillColor;
        document.getElementById('polygon-stroke').value = polygonObject.stroke;
        document.getElementById('polygon-type').value = polygonObject.type;
        document.getElementById('polygon-caption').value = polygonObject.name;
        document.getElementById('polygon-font-size').value = polygonObject.getFontSize() + ' pt';
        document.getElementById('polygon-label-rotation').value = polygonObject.getRotation() + ' ' + String.fromCharCode(176);
        document.getElementById('polygon-stroke').checked = polygonObject.stroke;

        let pos = polygonObject.getCordinateForLabelInPercentage();
        document.getElementById('polygon-label-x').value = pos.x + ' %';
        document.getElementById('polygon-label-y').value = pos.y + ' %';

        if(polygonObject.backOrder){
            helperModule.addRemoveClass('polygon-back','polygon-forth','order-active');
        } else{
            helperModule.addRemoveClass('polygon-forth','polygon-back','order-active');
        }

        helperModule.cursorResizeType(inputNumber);
    }

     /**
     * Set the fill color
     */
    function setColor(){
        let color = document.getElementById('polygon-fill-color').value;
        polygonObject.setColor(color);
    }

    /**
     * set the stroke for polygon
     */
    function setStroke(){
        let stroke = document.getElementById('polygon-stroke');
        stroke.checked ? (polygonObject.setStroke(true)):polygonObject.setStroke(false);
    }

    /**
     * Set the type of polygon here
     */
    function setType(){
        let type = document.getElementById('polygon-type').value;
        polygonObject.setType(type);
    }

    /**
     * Set the label for polygon
     */
    function setLabel(){
        let label = document.getElementById('polygon-caption').value;
        polygonObject.setCaption(label);
    }

    /**
     * Set the font size for the polygon text
     */
    function setFontSize(){
        let value = document.getElementById('polygon-font-size').value;
        value = parseInt(value.replace(/\D/g, ''));
        polygonObject.updateFontSize(value);
    }

    /**
     * It sets the rotation for the axis.
     */
    function setRotation() {
        let value = document.getElementById('polygon-label-rotation').value;
        value = parseInt(value.replace(/\D/g, ''));
        polygonObject.setRotation(value);
    }

    /**
     * Set the position x
     */
    function setPositionX(){
        let value = document.getElementById('polygon-label-x').value;
        value.trim(" ");
        value = value.split(" ");
        polygonObject.updateXCordinateForLabel(value[0]);
    }

    /**
     * Set the position y 
     */
    function setPositionY(){
        let value = document.getElementById('polygon-label-y').value;
        value.trim(" ");
        value = value.split(" ");

        polygonObject.updateYCordinateForLabel(value[0]);
    }

    /**
     * Move Backward
     */
    function moveBackward(){
        helperModule.addRemoveClass('polygon-back','polygon-forth','order-active');
        polygonObject.moveToBack();
    }

    /**
     * Move Forward
     */
    function moveForward(){
        helperModule.addRemoveClass('polygon-forth','polygon-back','order-active');
        polygonObject.moveToForth();
    }

    return {
        setPolygonObject:setPolygonObject,
        setColor:setColor,
        setStroke:setStroke,
        setType:setType,
        setLabel:setLabel,
        setFontSize:setFontSize,
        setRotation:setRotation,
        setPositionX:setPositionX,
        setPositionY:setPositionY,
        moveBackward:moveBackward,
        moveForward:moveForward
    }
})();