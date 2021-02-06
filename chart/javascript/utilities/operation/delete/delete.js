/**
 * Delete operation for component
 */
var deleteModule = (function () {

    /**
     * Delete the section 
     */
    function deleteSection(component,seatBtnArray) {
        if (!component.length) {
            helperModule.displayBlock(seatBtnArray, 'none');
        }
        return component;
    }

    /**
     * delete the row
     * 
     * @param {*} component 
     */
    function deleteRow(component) {
        return component;
    }

    /**
     * Delete the seat component 
     * 
     * @param {*} component 
     */
    function deleteSeat(component) {
        return component;

    }

    /**
     * Delete the matrix 
     * 
     * @param {*} component 
     */
    function deleteMatrix(component) {
        mainModule.matrixRowComponent = [];
        return component;
    }

    /**
     * Delete the text 
     * 
     * @param {*} component 
     */
    function deleteText(component) {
        return component;
    }

    /**
     * Delete the Media 
     * 
     * @param {*} component 
     */
    function deleteMedia(component) {
        return component;
    }

    /**
     * Delete the rectangle
     * 
     * @param {*} component 
     */
    function deleteRectangle(component) {
        return component;
    }

    /**
     * Delete the ellipse component
     * 
     * @param {*} component 
     */
    function deleteEllipse(component) {
        return component;
    }

    /**
     * Draw the Polygon component
     * 
     * @param {*} component 
     */
    function deletePolygon(component) {
        return component;
    }

    return {
       deleteSection:deleteSection,
       deleteRow:deleteRow,
       deleteSeat:deleteSeat,
       deleteMatrix:deleteMatrix,
       deleteText:deleteText,
       deleteMedia:deleteMedia,
       deleteRectangle:deleteRectangle,
       deleteEllipse:deleteEllipse,
       deletePolygon:deletePolygon
    }
})();