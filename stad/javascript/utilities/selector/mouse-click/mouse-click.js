/**
 * Handles component selection on mouse click
 */
var componentSelectorOnMouseClick = (function () {

    let selector;

    /**
     * Branch from here
     * 
     * @param {*} componentSelector is the selector for the component
     */
    function select(componentSelector){
        selector = componentSelector;

        switch (selector.type) {
            case 'creator': creatorOnClick();
                break;
            case 'selector':
                // mainModule.selectObject();
                break;
            case 'node':
                mainModule.nodeSelector();  //set the type of selector here
                break;
            case 'seat':
                mainModule.selectSeat();
                break;
            case 'text':
                mainModule.addTextObject();
                break;
            case 'shape': shapeOnClick();
                break;
        }
    }

    /**
     * Handle creator on the click
     */
    function creatorOnClick() {
        switch (selector.level) {
            case 'section': mainModule.addSectionObject();
                break;
            case 'row': mainModule.checkRowsPoint();
                break;
            case 'matrix': mainModule.checkMatrixPoint();
                break;
        }
    }

    /**
     * Shape on click
     */
    function shapeOnClick() {
        switch (selector.level) {
            case 'polygon': mainModule.addPolygonObject();
                break;
        }
    }

    return {
        select:select,
    }
})();