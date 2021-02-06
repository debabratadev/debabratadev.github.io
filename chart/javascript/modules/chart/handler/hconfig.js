/**
 * Configuration handler fort seat and rows
 * For matrices
 */
var configHandler = (function () {

    /**
     * Add Listener for Chart
     */
    function addListener() {

        //for rows
        
        //radius size
        document.getElementById('row-seat-config-radius').addEventListener('change', rowConfigInspector.setSeatRadiusConfig);
        document.getElementById('row-seat-config-radius').addEventListener('mousedown', configRowRadius.dragMouseDown);
        document.getElementById('inc-row-seat-config-radius').addEventListener('click',configRowRadius.increaseValue);
        document.getElementById('dec-row-seat-config-radius').addEventListener('click',configRowRadius.decreaseValue);

        //for seat spacing
        document.getElementById('row-seat-config-space').addEventListener('change', rowConfigInspector.setSeatSpaceConfig);
        document.getElementById('row-seat-config-space').addEventListener('mousedown', configRowSpace.dragMouseDown);
        document.getElementById('inc-row-seat-config-space').addEventListener('click',configRowSpace.increaseValue);
        document.getElementById('dec-row-seat-config-space').addEventListener('click',configRowSpace.decreaseValue);

        //for matrix 

        //radius size
        document.getElementById('matrix-seat-config-radius').addEventListener('change', matrixConfigInspector.setSeatRadiusConfig);
        document.getElementById('matrix-seat-config-radius').addEventListener('mousedown', configMatrixRadius.dragMouseDown);
        document.getElementById('inc-matrix-seat-config-radius').addEventListener('click',configMatrixRadius.increaseValue);
        document.getElementById('dec-matrix-seat-config-radius').addEventListener('click',configMatrixRadius.decreaseValue);

        //seat spacing
        document.getElementById('matrix-seat-config-space').addEventListener('change', matrixConfigInspector.setSeatSpaceConfig);
        document.getElementById('matrix-seat-config-space').addEventListener('mousedown', configMatrixSpace.dragMouseDown);
        document.getElementById('inc-matrix-seat-config-space').addEventListener('click',configMatrixSpace.increaseValue);
        document.getElementById('dec-matrix-seat-config-space').addEventListener('click',configMatrixSpace.decreaseValue);

        //row spacing
        document.getElementById('matrix-row-config-space').addEventListener('change', matrixConfigInspector.setRowSpaceConfig);
        document.getElementById('matrix-row-config-space').addEventListener('mousedown', configMatrixRowSpace.dragMouseDown);
        document.getElementById('inc-matrix-row-config-space').addEventListener('click',configMatrixRowSpace.increaseValue);
        document.getElementById('dec-matrix-row-config-space').addEventListener('click',configMatrixRowSpace.decreaseValue);
        
    }

    //for matrices

    return {
        addListener:addListener
    }

})();