/**
 * Handles y property for rectangle label
 */
var rectangleYLabel = (function () {

    let elemId = document.getElementById('rectangle-label-y');
    let body = document.getElementById('body');
    let mouseObject;

    /**
     * Action to perform when mouse is pressed down
     * 
     * @param {*} e is the event
     */
    function dragMouseDown(e) {

        mouseObject = inspectorModule.initialiseClickObject(elemId, e);

        body.addEventListener('mousemove', rectangleYLabel.elementDrag);
        body.addEventListener('mouseup', rectangleYLabel.closeDrag);
    }

    /**
     * Action to perform when element is dragged
     * 
     * @param {*} e is the event
     */
    function elementDrag(e) {
        mouseObject.elementDrag(e, 'rectangle','rectangle-label-y');
        elemId.style.border="1px solid #0000FF";
        elemId.style.borderRadius = '1%';
    }

    /**
     * close the drag 
     * @param {*} e is the mouse event
     */
    function closeDrag(e) {
        body.removeEventListener('mousemove', rectangleYLabel.elementDrag);
        body.removeEventListener('mouseup', rectangleYLabel.closeDrag);
        elemId.style.border="none";
        mouseObject.closeDrag();
    }

    /**
     * Handles on click event for the mouse
     */
    function onClick() {

        if (elemId.onmousedown) {
            elemId.removeEventListener('mousedown', rectangleYLabel.dragMouseDown);
        }
        else {
            elemId.addEventListener('mousedown', rectangleYLabel.dragMouseDown);
        }
    }

    /**
     * Increases the value
     */
    function increaseValue() {

        let value = elemId.value;
        value.trim(" ");
        value= value.split(" ");
        value = parseInt(value[0]);
        elemId.value = (value+1)>50?50:(value+1);
        elemId.value+=' %';
        rectangleInspector.setPositionY();
    }

    /**
     * Decreases the value
     */
    function decreaseValue() {
        let value = elemId.value;
        value.trim(" ");
        value = value.split(" ");
        value = parseInt(value[0]);
        elemId.value = (value - 1) < -50 ? -50 : value - 1;
        elemId.value +=' %';
        rectangleInspector.setPositionY();
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