/***
 * Handles events for ellipse component
 */
var ellipseHandler = (function () {

    /**
     * Add listener to the  images
     */
    function addListener() {

        //ellipse width
        let rectWidth = document.getElementById('ellipse-width');
        rectWidth.addEventListener('change', ellipseInspector.setWidth);
        rectWidth.addEventListener('mousedown', ellipseWidth.dragMouseDown);
        rectWidth.addEventListener('click', ellipseWidth.onClick);

        document.getElementById('inc-ellipse-width').addEventListener('click', ellipseWidth.increaseValue);
        document.getElementById('dec-ellipse-width').addEventListener('click', ellipseWidth.decreaseValue);

        //ellipse height
        let rectHeight = document.getElementById('ellipse-height');
        rectHeight.addEventListener('change', ellipseInspector.setHeight);
        rectHeight.addEventListener('mousedown', ellipseHeight.dragMouseDown);
        rectHeight.addEventListener('click', ellipseHeight.onClick);

        document.getElementById('inc-ellipse-height').addEventListener('click', ellipseHeight.increaseValue);
        document.getElementById('dec-ellipse-height').addEventListener('click', ellipseHeight.decreaseValue);

        //color
        document.getElementById('ellipse-fill-color').addEventListener('change', ellipseInspector.setColor);

        //stroke
        document.getElementById('ellipse-stroke').addEventListener('click', ellipseInspector.setStroke);

        //text

        //caption
        document.getElementById('ellipse-caption').addEventListener('keyup', ellipseInspector.setLabel);
        document.getElementById('ellipse-type').addEventListener('keyup', ellipseInspector.setType);

        //font size
        let fontSize = document.getElementById('ellipse-font-size');
        fontSize.addEventListener('change', ellipseInspector.setFontSize);
        fontSize.addEventListener('mousedown', ellipseFontSize.dragMouseDown);
        fontSize.addEventListener('click', ellipseFontSize.onClick);

        document.getElementById('inc-ellipse-font-size').addEventListener('click', ellipseFontSize.increaseValue);
        document.getElementById('dec-ellipse-font-size').addEventListener('click', ellipseFontSize.decreaseValue);

        let ellipseLabelRotation =  document.getElementById('ellipse-label-rotation');
        ellipseLabelRotation.addEventListener('change', ellipseInspector.setRotation);
        ellipseLabelRotation.addEventListener('mousedown', ellipseRotation.dragMouseDown);
        ellipseLabelRotation.addEventListener('click', ellipseRotation.onClick);

        document.getElementById('inc-ellipse-label-rotation').addEventListener('click', ellipseRotation.increaseValue);
        document.getElementById('dec-ellipse-label-rotation').addEventListener('click', ellipseRotation.decreaseValue);

        //label x position
        let ellipseLabelX  = document.getElementById('ellipse-label-x');
        ellipseLabelX.addEventListener('change', ellipseInspector.setPositionX);
        ellipseLabelX.addEventListener('mousedown', ellipseXLabel.dragMouseDown);
        ellipseLabelX.addEventListener('click', ellipseXLabel.onClick);

        document.getElementById('inc-ellipse-label-x').addEventListener('click', ellipseXLabel.increaseValue);
        document.getElementById('dec-ellipse-label-x').addEventListener('click', ellipseXLabel.decreaseValue);

        //label y position
        let ellipseLabelY =  document.getElementById('ellipse-label-y');
        ellipseLabelY.addEventListener('change', ellipseInspector.setPositionY);
        ellipseLabelY.addEventListener('mousedown', ellipseYLabel.dragMouseDown);
        ellipseLabelY.addEventListener('click', ellipseYLabel.onClick);

        document.getElementById('inc-ellipse-label-y').addEventListener('click', ellipseYLabel.increaseValue);
        document.getElementById('dec-ellipse-label-y').addEventListener('click', ellipseYLabel.decreaseValue);

        document.getElementById('ellipse-back').addEventListener('click',ellipseInspector.moveBackward);
        document.getElementById('ellipse-forth').addEventListener('click',ellipseInspector.moveForward);
    }

    return {
        addListener: addListener
    }
})();