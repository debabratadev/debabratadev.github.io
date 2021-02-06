/**
 * Handles event for
 */
var polygonHandler = (function () {

    /**
     * Add listener to the  images
     */
    function addListener() {

        //color
        document.getElementById('polygon-fill-color').addEventListener('change', polygonInspector.setColor);

        //stroke
        document.getElementById('polygon-stroke').addEventListener('click', polygonInspector.setStroke);

        //caption
        document.getElementById('polygon-caption').addEventListener('keyup', polygonInspector.setLabel);
        document.getElementById('polygon-type').addEventListener('keyup', polygonInspector.setType);

        //font size
        let fontSize = document.getElementById('polygon-font-size');
        fontSize.addEventListener('change', polygonInspector.setFontSize);
        fontSize.addEventListener('mousedown', polygonFontSize.dragMouseDown);
        fontSize.addEventListener('click', polygonFontSize.onClick);

        document.getElementById('inc-polygon-font-size').addEventListener('click', polygonFontSize.increaseValue);
        document.getElementById('dec-polygon-font-size').addEventListener('click', polygonFontSize.decreaseValue);

        //rotation
        let polygonLabelRotation =  document.getElementById('polygon-label-rotation');
        polygonLabelRotation.addEventListener('change', polygonInspector.setRotation);
        polygonLabelRotation.addEventListener('mousedown', polygonRotation.dragMouseDown);
        polygonLabelRotation.addEventListener('click', polygonRotation.onClick);

        document.getElementById('inc-polygon-label-rotation').addEventListener('click', polygonRotation.increaseValue);
        document.getElementById('dec-polygon-label-rotation').addEventListener('click', polygonRotation.decreaseValue);

        //label x position
        let polygonLabelX  = document.getElementById('polygon-label-x');
        polygonLabelX.addEventListener('change', polygonInspector.setPositionX);
        polygonLabelX.addEventListener('mousedown', polygonXLabel.dragMouseDown);
        polygonLabelX.addEventListener('click', polygonXLabel.onClick);

        document.getElementById('inc-polygon-label-x').addEventListener('click', polygonXLabel.increaseValue);
        document.getElementById('dec-polygon-label-x').addEventListener('click', polygonXLabel.decreaseValue);

        //label y position
        let polygonLabelY =  document.getElementById('polygon-label-y');
        polygonLabelY.addEventListener('change', polygonInspector.setPositionY);
        polygonLabelY.addEventListener('mousedown', polygonYLabel.dragMouseDown);
        polygonLabelY.addEventListener('click', polygonYLabel.onClick);

        document.getElementById('inc-polygon-label-y').addEventListener('click', polygonYLabel.increaseValue);
        document.getElementById('dec-polygon-label-y').addEventListener('click', polygonYLabel.decreaseValue);

        document.getElementById('polygon-back').addEventListener('click',polygonInspector.moveBackward);
        document.getElementById('polygon-forth').addEventListener('click',polygonInspector.moveForward);

    }

    return {
        addListener: addListener
    }
})();