/**
 * Operation related to matrix
 * TODO - remove or merge
 */
var matrixCollection = (function () {

    /**
     * Delete the component
     * 
     * @param {*} rowComponent    is the row object array
     * @param {*} matrixComponent is the matrix object array
     */
    function deleteMatrix(rowComponent, matrixComponent) {
        let temp = [];
        for (let index = 0; index < rowComponent.length; ++index) {
            let found = false;
            for (let y = 0; y < matrixComponent.rowComponent.length; ++y) {
                if (matrixComponent.rowComponent[y] == rowComponent[index]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                temp.push(rowComponent[index]);
            }
        }
        return temp;
    }

    return {
        deleteMatrix: deleteMatrix
    }
})();