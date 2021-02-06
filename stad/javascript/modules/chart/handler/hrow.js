/**
 * Handle events for row
 */
var rowHandler = (function () {

    /**
     * Add The listener for row
     */
    function addListener() {

        //curving of the rows
        document.getElementById('row-curve').addEventListener('change', rowInspector.setCurve);
        document.getElementById('row-curve').addEventListener('mousedown',rowCurve.dragMouseDown);
        document.getElementById('inc-row-curve').addEventListener('click',rowCurve.increaseValue);
        document.getElementById('dec-row-curve').addEventListener('click',rowCurve.decreaseValue);

        //seat spacing
        document.getElementById('row-seat-space').addEventListener('change', rowInspector.setSeatSpacing);
        document.getElementById('row-seat-space').addEventListener('mousedown', rowSeatSpace.dragMouseDown);
        document.getElementById('inc-row-seat-space').addEventListener('click',rowSeatSpace.increaseValue);
        document.getElementById('dec-row-seat-space').addEventListener('click',rowSeatSpace.decreaseValue);

        //seat radius
        document.getElementById('row-seat-radius').addEventListener('change', rowInspector.setSeatRadius);
        document.getElementById('row-seat-radius').addEventListener('mousedown',rowSeatRadius.dragMouseDown);
        document.getElementById('inc-row-seat-radius').addEventListener('click',rowSeatRadius.increaseValue);
        document.getElementById('dec-row-seat-radius').addEventListener('click',rowSeatRadius.decreaseValue);

        //label
        document.getElementById('row-label').addEventListener('change', rowInspector.toggleRowLabel);
        document.getElementById('row-sequence').addEventListener('change', rowInspector.setRowLabelType);
        document.getElementById('row-start').addEventListener('change', rowInspector.setRowStartAt);
        document.getElementById('row-seat-label').addEventListener('change', rowInspector.toggleSeatLabel);
        document.getElementById('row-seat-seq').addEventListener('change', rowInspector.setSeatLabelType);
        document.getElementById('row-seat-start').addEventListener('change', rowInspector.setStartAt);
        document.getElementById('row-seat-direction').addEventListener('change', rowInspector.setDirection);
    }
    return {
        addListener: addListener
    }
})();