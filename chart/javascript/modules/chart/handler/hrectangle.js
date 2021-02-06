/**
 * Handle events for rectangle
 */
var rectangleHandler = (function () {

    /**
     * Add listener to the  images
     */
    function addListener() {

        //rectangle width
        let rectWidth = document.getElementById('rectangle-width');
        rectWidth.addEventListener('change', rectangleInspector.setWidth);
        rectWidth.addEventListener('mousedown', rectangleWidth.dragMouseDown);
        rectWidth.addEventListener('click', rectangleWidth.onClick);

        document.getElementById('inc-rectangle-width').addEventListener('click', rectangleWidth.increaseValue);
        document.getElementById('dec-rectangle-width').addEventListener('click', rectangleWidth.decreaseValue);

        //rectangle height
        let rectHeight = document.getElementById('rectangle-height');
        rectHeight.addEventListener('change', rectangleInspector.setHeight);
        rectHeight.addEventListener('mousedown', rectangleHeight.dragMouseDown);
        rectHeight.addEventListener('click', rectangleHeight.onClick);

        document.getElementById('inc-rectangle-height').addEventListener('click', rectangleHeight.increaseValue);
        document.getElementById('dec-rectangle-height').addEventListener('click', rectangleHeight.decreaseValue);

        //color
        document.getElementById('rectangle-fill-color').addEventListener('change', rectangleInspector.setColor);

        //stroke
        document.getElementById('rectangle-stroke').addEventListener('click', rectangleInspector.setStroke);

        //order
        document.getElementById('rectangle-back').addEventListener('click',rectangleInspector.moveBackward);
        document.getElementById('rectangle-forth').addEventListener('click',rectangleInspector.moveForward);

        //text

        //caption
        document.getElementById('rectangle-caption').addEventListener('keyup', rectangleInspector.setLabel);
        document.getElementById('rectangle-type').addEventListener('keyup', rectangleInspector.setType);

        //font size
        let fontSize = document.getElementById('rectangle-font-size');
        fontSize.addEventListener('change', rectangleInspector.setFontSize);
        fontSize.addEventListener('mousedown', rectangleFontSize.dragMouseDown);
        fontSize.addEventListener('click', rectangleFontSize.onClick);

        document.getElementById('inc-rectangle-font-size').addEventListener('click', rectangleFontSize.increaseValue);
        document.getElementById('dec-rectangle-font-size').addEventListener('click', rectangleFontSize.decreaseValue);

        let rectangleLabelRotation =  document.getElementById('rectangle-label-rotation');
        rectangleLabelRotation.addEventListener('change', rectangleInspector.setRotation);
        rectangleLabelRotation.addEventListener('mousedown', rectangleRotation.dragMouseDown);
        rectangleLabelRotation.addEventListener('click', rectangleRotation.onClick);

        document.getElementById('inc-rectangle-label-rotation').addEventListener('click', rectangleRotation.increaseValue);
        document.getElementById('dec-rectangle-label-rotation').addEventListener('click', rectangleRotation.decreaseValue);
   
        //label x position
        let rectangleLabelX  = document.getElementById('rectangle-label-x');
        rectangleLabelX.addEventListener('change', rectangleInspector.setPositionX);
        rectangleLabelX.addEventListener('mousedown', rectangleXLabel.dragMouseDown);
        rectangleLabelX.addEventListener('click', rectangleXLabel.onClick);

        document.getElementById('inc-rectangle-label-x').addEventListener('click', rectangleXLabel.increaseValue);
        document.getElementById('dec-rectangle-label-x').addEventListener('click', rectangleXLabel.decreaseValue);

        //label y position
        let rectangleLabelY =  document.getElementById('rectangle-label-y');
        rectangleLabelY.addEventListener('change', rectangleInspector.setPositionY);
        rectangleLabelY.addEventListener('mousedown', rectangleYLabel.dragMouseDown);
        rectangleLabelY.addEventListener('click', rectangleYLabel.onClick);

        document.getElementById('inc-rectangle-label-y').addEventListener('click', rectangleYLabel.increaseValue);
        document.getElementById('dec-rectangle-label-y').addEventListener('click', rectangleYLabel.decreaseValue);
    }

    return {
        addListener: addListener
    }
})();