/**
 * Handles event for matrix
 */
var matrixHandler = (function () {

    /**
     * Add the listener for matrix
     */
    function addListener() {

        let matrixCurveId =  document.getElementById('matrix-curve');
        matrixCurveId.addEventListener('change', matrixInspector.setCurve);
        matrixCurveId.addEventListener('mousedown',matrixCurve.dragMouseDown);

        document.getElementById('inc-matrix-curve').addEventListener('click',matrixCurve.increaseValue);
        document.getElementById('dec-matrix-curve').addEventListener('click',matrixCurve.decreaseValue);

        //Row spacing in matrix
        document.getElementById('matrix-space').addEventListener('change', matrixInspector.setRowSpacing);
        document.getElementById('matrix-space').addEventListener('mousedown', matrixSpace.dragMouseDown);
        document.getElementById('inc-matrix-space').addEventListener('click',matrixSpace.increaseValue);
        document.getElementById('dec-matrix-space').addEventListener('click',matrixSpace.decreaseValue);

        //seat spacing in matrix
        document.getElementById('matrix-seat-space').addEventListener('change', matrixInspector.setSeatSpacing);
        document.getElementById('matrix-seat-space').addEventListener('mousedown', matrixSeatSpace.dragMouseDown);
        document.getElementById('inc-matrix-seat-space').addEventListener('click',matrixSeatSpace.increaseValue);
        document.getElementById('dec-matrix-seat-space').addEventListener('click',matrixSeatSpace.decreaseValue);

        //seat radius in matrix
        document.getElementById('matrix-seat-radius').addEventListener('change', matrixInspector.setSeatRadius);
        document.getElementById('matrix-seat-radius').addEventListener('mousedown', matrixSeatRadius.dragMouseDown);
        document.getElementById('inc-matrix-seat-radius').addEventListener('click',matrixSeatRadius.increaseValue);
        document.getElementById('dec-matrix-seat-radius').addEventListener('click',matrixSeatRadius.decreaseValue);

        //seat label in matrix
        document.getElementById('matrix-label').addEventListener('change', matrixInspector.toggleRowLabel);
        document.getElementById('matrix-sequence').addEventListener('change', matrixInspector.setRowLabelType);
        document.getElementById('matrix-start').addEventListener('change', matrixInspector.setRowStartAt);
        document.getElementById('matrix-seat-label').addEventListener('change', matrixInspector.toggleSeatLabel);
        document.getElementById('matrix-seat-seq').addEventListener('change', matrixInspector.setSeatLabelType);
        document.getElementById('matrix-seat-start').addEventListener('change', matrixInspector.setStartAt);
        document.getElementById('matrix-direction').addEventListener('change', matrixInspector.setTheMatrixDirection);
        document.getElementById('matrix-seat-direction').addEventListener('change', matrixInspector.setDirection);
    }

    return {
        addListener: addListener
    }

})();