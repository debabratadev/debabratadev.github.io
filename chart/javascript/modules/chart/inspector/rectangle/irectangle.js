/**
 * Handles properties for rectangle
 */
var rectangleInspector = (function () {

    let rectangleObject;
    let inputNumber=['rectangle-width','rectangle-height','rectangle-font-size','rectangle-label-x','rectangle-label-y','rectangle-label-rotation'];

    /**
     * Set the rectangle object here
     */
    function setRectangleObject(object){
        rectangleObject = object;

        helperModule.showInspector('rectangle-inspector');

        document.getElementById('rectangle-width').value = rectangleObject.getWidth() + ' pt';
        document.getElementById('rectangle-height').value = rectangleObject.getHeight() + ' pt';
        document.getElementById('rectangle-stroke').checked = rectangleObject.stroke;
        document.getElementById('rectangle-fill-color').value = rectangleObject.fillColor;
        document.getElementById('rectangle-type').value = rectangleObject.type;
        document.getElementById('rectangle-caption').value = rectangleObject.name;
        document.getElementById('rectangle-font-size').value = rectangleObject.getFontSize() + ' pt';
        document.getElementById('rectangle-label-rotation').value = rectangleObject.getRotation() + ' ' + String.fromCharCode(176);

        let pos = rectangleObject.getCordinateForLabelInPercentage();
        document.getElementById('rectangle-label-x').value  = pos.x + ' %';
        document.getElementById('rectangle-label-y').value = pos.y + ' %';

        if(rectangleObject.backOrder){
            helperModule.addRemoveClass('rectangle-back','rectangle-forth','order-active');
        } else{
            helperModule.addRemoveClass('rectangle-forth','rectangle-back','order-active');
        }
        
        helperModule.cursorResizeType(inputNumber);
    }

    /**
     * Set the width of the rectangle
     */
    function setWidth(){    
        let width = document.getElementById('rectangle-width').value;
        width = parseInt(width.replace(/\D/g, ''));
        rectangleObject.setWidth(width);

        document.getElementById('rectangle-width').value = width + ' pt';
    }

    /**
     * Set the Height of the rectangle
     */
    function setHeight(){
        let height = document.getElementById('rectangle-height').value;
        height = parseInt(height.replace(/\D/g, ''));
        rectangleObject.setHeight(height);

        document.getElementById('rectangle-height').value = height + ' pt';
    }

    /**
     * Set the fill color
     */
    function setColor(){
        let color = document.getElementById('rectangle-fill-color').value;
        rectangleObject.setColor(color);
    }

    /**
     * set the stroke for rectangle
     */
    function setStroke(){
        let stroke = document.getElementById('rectangle-stroke');
        stroke.checked ? (rectangleObject.setStroke(true)):rectangleObject.setStroke(false);
    }

    /**
     * Set the type of rectangle here
     */
    function setType(){
        let type = document.getElementById('rectangle-type').value;
        rectangleObject.setType(type);
    }

    /**
     * Set the label for rectangle
     */
    function setLabel(){
        let label = document.getElementById('rectangle-caption').value;
        rectangleObject.setCaption(label);
    }

    /**
     * Set the font size for the rectangle text
     */
    function setFontSize(){
        let value = document.getElementById('rectangle-font-size').value;
        value = parseInt(value.replace(/\D/g, ''));
        rectangleObject.updateFontSize(value);
    }

    /**
     * It sets the rotation for the axis.
     */
    function setRotation() {
        let value = document.getElementById('rectangle-label-rotation').value;
        value = parseInt(value.replace(/\D/g, ''));
        rectangleObject.setRotation(value);
    }


    /**
     * Set the position x
     */
    function setPositionX(){
        let value = document.getElementById('rectangle-label-x').value;
        value.trim(" ");
        value = value.split(" ");
        rectangleObject.updateXCordinateForLabel(value[0]);
    }

    /**
     * Set the position y 
     */
    function setPositionY(){
        let value = document.getElementById('rectangle-label-y').value;
        value.trim(" ");
        value = value.split(" ");

        rectangleObject.updateYCordinateForLabel(value[0]);
    }

    /**
     * Move Backward
     */
    function moveBackward(){
        helperModule.addRemoveClass('rectangle-back','rectangle-forth','order-active');
        rectangleObject.moveToBack();
    }

    /**
     * Move Forward
     */
    function moveForward(){
        helperModule.addRemoveClass('rectangle-forth','rectangle-back','order-active');
        rectangleObject.moveToForth();
    }

    return {
        setRectangleObject:setRectangleObject,
        setWidth:setWidth,
        setHeight:setHeight,
        setColor:setColor,
        setStroke:setStroke,
        setType:setType,
        setLabel:setLabel,
        setFontSize:setFontSize,
        setPositionX:setPositionX,
        setPositionY:setPositionY,
        moveBackward:moveBackward,
        moveForward:moveForward,
        setRotation:setRotation
    }

})();