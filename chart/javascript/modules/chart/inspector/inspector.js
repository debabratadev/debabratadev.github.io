var inspectorModule = (function () {


    /**
     * Initialises the mouse click object
     */
    function initialiseClickObject(elemId, event) {

        let mouseObject = new ClickAndDrag();
        mouseObject.id = elemId;
        mouseObject.dragMouseDown(event);

        return mouseObject;

    }

    return{
        initialiseClickObject:initialiseClickObject
    }

})();