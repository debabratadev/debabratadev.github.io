/**
 * Handles seat radius feature for rows
 */
var rowSeatRadius= (function () {

    let elemId = document.getElementById('row-seat-radius');
    let body = document.getElementById('body');
    let mouseObject;

    /**
     * When mouse id pressed handle the action
     * 
     * @param {*} e is the mouse event
     */
    function dragMouseDown(e) {

        mouseObject = inspectorModule.initialiseClickObject(elemId, e);

        body.addEventListener('mousemove', rowSeatRadius.elementDrag);
        body.addEventListener('mouseup', rowSeatRadius.closeDrag);

    }

    /**
     * Handle the action, When mouse is dragged
     * 
     * @param {*} e is the event
     */
    function elementDrag(e) {
        mouseObject.elementDrag(e,'row', 'row-seat-radius');// need to create for section also
        elemId.style.border = "1px solid #0000FF";
        elemId.style.borderRadius = '1%';
    }

    /**
     * Close the mouse drag
     * @param {*} e 
     */
    function closeDrag(e) {
        body.removeEventListener('mousemove', rowSeatRadius.elementDrag);
        body.removeEventListener('mouseup', rowSeatRadius.closeDrag);
        elemId.style.border = "none";
        mouseObject.closeDrag();
    }


    /**
     * On click remove the event listener for mouse down
     */
    function onClick() {

        if (elemId.onmousedown) {
            elemId.removeEventListener('mousedown', rowSeatRadius.dragMouseDown);
        }
        else {
            elemId.addEventListener('mousedown', rowSeatRadius.dragMouseDown);
        }
    }

    /**
     * It increases the value by one
     */
    function increaseValue() {
        elemId.value = parseInt(elemId.value) + 1 + ' pt';
        rowInspector.setSeatRadius();
    }

    /**
     * It decreases the value by one
     */
    function decreaseValue() {
        let value = parseInt(elemId.value.replace(/\D/g, ''));
        elemId.value = (value - 1) < 0 ? 0 : (value - 1);

        elemId.value += ' pt';
        rowInspector.setSeatRadius();
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