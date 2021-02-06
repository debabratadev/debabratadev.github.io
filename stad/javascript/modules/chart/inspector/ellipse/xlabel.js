/**
 * Handles x position for label of ellipse
 */
var ellipseXLabel= (function () {

    let elemId = document.getElementById('ellipse-label-x');
    let body = document.getElementById('body');
    let mouseObject;

    /**
     * Action to perform when mouse is pressed down
     * 
     * @param {*} e is the event
     */
    function dragMouseDown(e) {

        mouseObject = inspectorModule.initialiseClickObject(elemId, e);

        body.addEventListener('mousemove', ellipseXLabel.elementDrag);
        body.addEventListener('mouseup', ellipseXLabel.closeDrag);

    }

    /**
     * Action to perform when element is dragged
     * 
     * @param {*} e is the event
     */
    function elementDrag(e) {
        mouseObject.elementDrag(e,'ellipse','ellipse-label-x');
        elemId.style.border="1px solid #0000FF";
        elemId.style.borderRadius = '1%';
    }

    /**
     * close the drag 
     * @param {*} e is the mouse event
     */
    function closeDrag(e) {
        body.removeEventListener('mousemove', ellipseXLabel.elementDrag);
        body.removeEventListener('mouseup', ellipseXLabel.closeDrag);
        elemId.style.border="none";
        mouseObject.closeDrag();
    }

    /**
     * Handles on click event for the mouse
     */
    function onClick() {

        if (elemId.onmousedown) {
            elemId.removeEventListener('mousedown', ellipseXLabel.dragMouseDown);
        }
        else {
            elemId.addEventListener('mousedown', ellipseXLabel.dragMouseDown);
        }
    }

    /**
     * Increases the value
     */
    function increaseValue(){
        let value = elemId.value;
        value.trim(" ");
        value= value.split(" ");
        value = parseInt(value[0]);
        elemId.value = (value-1)>50?50:value+1;
        elemId.value+=' %';
        ellipseInspector.setPositionX();
    }

    /**
     * Decreases the value
     */
    function decreaseValue(){
        let value = elemId.value;
        value.trim(" ");
        value = value.split(" ");
        value = parseInt(value[0]);
        elemId.value =(value-1)<-50?-50:value-1;
        elemId.value+=' %';
        ellipseInspector.setPositionX();
    }
    return {
        dragMouseDown: dragMouseDown,
        elementDrag: elementDrag,
        closeDrag: closeDrag,
        onClick: onClick,
        increaseValue: increaseValue,
        decreaseValue:decreaseValue
    }

})();