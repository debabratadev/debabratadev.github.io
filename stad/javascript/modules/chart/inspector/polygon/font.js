/**
 * Handles font size property for polygon component
 */
var polygonFontSize = (function () {

    let elemId = document.getElementById('polygon-font-size');
    let body = document.getElementById('body');
    let mouseObject;

    /**
     * When mouse id pressed handle the action
     * 
     * @param {*} e is the mouse event
     */
    function dragMouseDown(e) {

        mouseObject = inspectorModule.initialiseClickObject(elemId, e);

        body.addEventListener('mousemove', polygonFontSize.elementDrag);
        body.addEventListener('mouseup', polygonFontSize.closeDrag);

    }

    /**
     * Handle the action, When mouse is dragged
     * 
     * @param {*} e is the event
     */
    function elementDrag(e) {
        mouseObject.elementDrag(e,'polygon','polygon-font-size');
        elemId.style.border = "1px solid #0000FF";
        elemId.style.borderRadius = '1%';
    }

    /**
     * Closes the mouse drag here
     */
    function closeDrag(e) {
        body.removeEventListener('mousemove', polygonFontSize.elementDrag);
        body.removeEventListener('mouseup', polygonFontSize.closeDrag);
        elemId.style.border = "none";
        mouseObject.closeDrag();
    }

    /**
     * On click remove the event listener for mouse down
     */
    function onClick() {

        if (elemId.onmousedown) {
            elemId.removeEventListener('mousedown', polygonFontSize.dragMouseDown);
        }
        else {
            elemId.addEventListener('mousedown', polygonFontSize.dragMouseDown);
        }
    }

    /**
     * It increases the value by one
     */
    function increaseValue() {
        elemId.value = parseInt(elemId.value) + 1 + ' pt';
        polygonInspector.setFontSize();
    }

    /**
     * It decreases the value by one
     */
    function decreaseValue() {
        let value = parseInt(elemId.value.replace(/\D/g, ''));
        elemId.value = (value - 1) < 0 ? 0 : (value - 1);

        elemId.value += ' pt';
        polygonInspector.setFontSize();
    }

    return {
        dragMouseDown: dragMouseDown,
        elementDrag: elementDrag,
        closeDrag: closeDrag,
        onClick: onClick,
        increaseValue: increaseValue,
        decreaseValue: decreaseValue
    }

})();