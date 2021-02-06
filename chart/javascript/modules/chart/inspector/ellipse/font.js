/**
 * Handle font size for ellipse
 */
var ellipseFontSize = (function () {

    let elemId = document.getElementById('ellipse-font-size');
    let body = document.getElementById('body');
    let mouseObject;

    /**
     * When mouse id pressed handle the action
     * 
     * @param {*} e is the mouse event
     */
    function dragMouseDown(e) {

        mouseObject = inspectorModule.initialiseClickObject(elemId, e);

        body.addEventListener('mousemove', ellipseFontSize.elementDrag);
        body.addEventListener('mouseup', ellipseFontSize.closeDrag);

    }

    /**
     * Handle the action, When mouse is dragged
     * 
     * @param {*} e is the event
     */
    function elementDrag(e) {
        mouseObject.elementDrag(e,'ellipse','ellipse-font-size');
        elemId.style.border = "1px solid #0000FF";
        elemId.style.borderRadius = '1%';
    }

    /**
     * Closes the mouse drag here
     */
    function closeDrag(e) {
        body.removeEventListener('mousemove', ellipseFontSize.elementDrag);
        body.removeEventListener('mouseup', ellipseFontSize.closeDrag);
        elemId.style.border = "none";
        mouseObject.closeDrag();
    }

    /**
     * On click remove the event listener for mouse down
     */
    function onClick() {

        if (elemId.onmousedown) {
            elemId.removeEventListener('mousedown', ellipseFontSize.dragMouseDown);
        }
        else {
            elemId.addEventListener('mousedown', ellipseFontSize.dragMouseDown);
        }
    }

    /**
     * It increases the value by one
     */
    function increaseValue() {
        elemId.value = parseInt(elemId.value) + 1 + ' pt';
        ellipseInspector.setFontSize();
    }

    /**
     * It decreases the value by one
     */
    function decreaseValue() {
        let value = parseInt(elemId.value.replace(/\D/g, ''));
        elemId.value = (value - 1) < 0 ? 0 : (value - 1);

        elemId.value += ' pt';
        ellipseInspector.setFontSize();
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