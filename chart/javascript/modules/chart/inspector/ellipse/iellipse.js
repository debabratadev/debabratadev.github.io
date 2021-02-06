/**
 * Handles properties for ellipse component
 */
var ellipseInspector = (function () {

    let ellipseObject;
    let inputNumber = ['ellipse-width', 'ellipse-height', 'ellipse-font-size', 'ellipse-label-x', 'ellipse-label-y','ellipse-label-rotation'];

    /**
     * Set ellipse object here
     * 
     * @param {*} object 
     */
    function setEllipseObject(object) {

        ellipseObject = object;
     
        helperModule.showInspector('ellipse-inspector');
        
        document.getElementById('ellipse-width').value = ellipseObject.getWidth() + ' pt';
        document.getElementById('ellipse-height').value = ellipseObject.getHeight() + ' pt';
        document.getElementById('ellipse-fill-color').value = ellipseObject.fillColor;
        document.getElementById('ellipse-stroke').checked = ellipseObject.stroke;
        document.getElementById('ellipse-caption').value = ellipseObject.name;
        document.getElementById('ellipse-font-size').value = ellipseObject.getFontSize() + ' pt';

        let pos = ellipseObject.getCordinateForLabelInPercentage();
        document.getElementById('ellipse-label-x').value = pos.x + ' %';
        document.getElementById('ellipse-label-y').value = pos.y + ' %';

        if(ellipseObject.backOrder){
            helperModule.addRemoveClass('ellipse-back','ellipse-forth','order-active');
        } else{
            helperModule.addRemoveClass('ellipse-forth','ellipse-back','order-active');
        }

        helperModule.cursorResizeType(inputNumber);
    }

    /**
     * Set the width of the ellipse
     */
    function setWidth() {
        let width = document.getElementById('ellipse-width').value;
        width = parseInt(width.replace(/\D/g, ''));
        ellipseObject.setWidth(width);

        document.getElementById('ellipse-width').value = width + ' pt';
    }

    /**
     * Set the Height of the ellipse
     */
    function setHeight() {
        let height = document.getElementById('ellipse-height').value;
        height = parseInt(height.replace(/\D/g, ''));
        ellipseObject.setHeight(height);

        document.getElementById('ellipse-height').value = height + ' pt';
    }

    /**
     * Set the fill color
     */
    function setColor() {
        let color = document.getElementById('ellipse-fill-color').value;
        ellipseObject.setColor(color);
    }

    /**
    * set the stroke for ellipse
    */
    function setStroke() {
        let stroke = document.getElementById('ellipse-stroke');
        stroke.checked ? (ellipseObject.setStroke(true)) : ellipseObject.setStroke(false);
    }

    /**
    * Set the type of ellipse here
    */
    function setType() {
        let type = document.getElementById('ellipse-type').value;
        ellipseObject.setType(type);
    }

    /**
    * Set the label for ellipse
    */
    function setLabel() {
        let label = document.getElementById('ellipse-caption').value;
        ellipseObject.setCaption(label);
    }

    /**
     * Set the font size for the ellipse text
    */
    function setFontSize() {
        let value = document.getElementById('ellipse-font-size').value;
        value = parseInt(value.replace(/\D/g, ''));
        ellipseObject.updateFontSize(value);
    }

    /**
     * It sets the rotation for the axis.
     */
    function setRotation() {
        let value = document.getElementById('ellipse-label-rotation').value;
        value = parseInt(value.replace(/\D/g, ''));
        ellipseObject.setRotation(value);
    }

    /**
    * Set the position x
    */
    function setPositionX() {
        let value = document.getElementById('ellipse-label-x').value;
        value.trim(" ");
        value = value.split(" ");
        ellipseObject.updateXCordinateForLabel(value[0]);
    }

    /**
     * Set the position y 
    */
    function setPositionY() {
        let value = document.getElementById('ellipse-label-y').value;
        value.trim(" ");
        value = value.split(" ");

        ellipseObject.updateYCordinateForLabel(value[0]);
    }

    /**
     * Move Backward
     */
    function moveBackward(){
        helperModule.addRemoveClass('ellipse-back','ellipse-forth','order-active');
        ellipseObject.moveToBack();
    }

    /**
     * Move Forward
     */
    function moveForward(){
        helperModule.addRemoveClass('ellipse-forth','ellipse-back','order-active');
        ellipseObject.moveToForth();
    }

    return {
        setEllipseObject: setEllipseObject,
        setWidth: setWidth,
        setHeight: setHeight,
        setColor: setColor,
        setStroke: setStroke,
        setType: setType,
        setLabel: setLabel,
        setFontSize: setFontSize,
        setPositionX: setPositionX,
        setPositionY: setPositionY,
        moveBackward:moveBackward,
        moveForward:moveForward,
        setRotation:setRotation
    }

})();