/**
 * Handles drag and drop features for category
 */
var dNDHandler = (function () {

    /**
     * Add the event listener for drag and drop
     * 
     * @param {*} elem is the element 
     */
    function addEventListener(elem) {
        elem.addEventListener('dragstart', dragNDrop.handleDragStart, false);
        elem.addEventListener('dragenter', dragNDrop.handleDragEnter, false)
        elem.addEventListener('dragover', dragNDrop.handleDragOver, false);
        elem.addEventListener('dragleave', dragNDrop.handleDragLeave, false);
        elem.addEventListener('drop', dragNDrop.handleDrop, false);
        elem.addEventListener('dragend', dragNDrop.handleDragEnd, false);
    }

    /**
     * Remove the event listener
     * 
     * @param {*} elem is the elem id
     */
    function removeEventListener(elem) {
        elem.addEventListener('dragstart', dragNDrop.handleDragStart, false);
        elem.addEventListener('dragenter', dragNDrop.handleDragEnter, false)
        elem.addEventListener('dragover', dragNDrop.handleDragOver, false);
        elem.addEventListener('dragleave', dragNDrop.handleDragLeave, false);
        elem.addEventListener('drop', dragNDrop.handleDrop, false);
        elem.addEventListener('dragend', dragNDrop.handleDragEnd, false);
    }

    return {
        addEventListener: addEventListener,
        removeEventListener:removeEventListener
    }
})();