/**
 * Drag and drop for the list 
 * 
 */
var dragNDrop = (function () {

    var dragSrcEl = null;

    /**
     * Handle the drag start 
     * 
     * @param {*} e is the event
     */
    function handleDragStart(e) {
        // Target (this) element is the source node.
        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);

        this.classList.add('dragElem');
    }

    /**
     * Handle the drag over
     * 
     * @param {*} e is the event
     */
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        this.classList.add('over');

        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

        return false;
    }

    /**
     * Handle the drag enter event
     * 
     * @param {*} e is the mouse event
     */
    function handleDragEnter(e) {
        // this / e.target is the current hover target.
    }

    /**
     * Handle the drag leave 
     * 
     * @param {*} e is the event
     */
    function handleDragLeave(e) {
        this.classList.remove('over');  // this / e.target is previous target element.
    }

    /**
     * Handle the drop 
     * 
     * @param {*} e is the mouse event
     */
    function handleDrop(e) {
        // this/e.target is current target element.

        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting.
        }

        // Don't do anything if dropping the same column we're dragging.
        if (dragSrcEl != this) {
            this.parentNode = document.getElementById('columns');
        
            // Set the source column's HTML to the HTML of the column we dropped on.
            //alert(this.outerHTML);
            // dragSrcEl.innerHTML = this.innerHTML;
            // this.innerHTML = e.dataTransfer.getData('text/html');
            this.parentNode.removeChild(dragSrcEl);
            var dropHTML = e.dataTransfer.getData('text/html');
            this.insertAdjacentHTML('beforebegin', dropHTML);
            var dropElem = this.previousSibling;
            dNDHandler.addEventListener(dropElem);
        }
        this.classList.remove('over');
        return false;
    }

    /**
     * Handle the drag end
     * 
     * @param {*} e is the mouse event
     */
    function handleDragEnd(e) {
        // this/e.target is the source node.
        this.classList.remove('over');

        /*[].forEach.call(cols, function (col) {
          col.classList.remove('over');
        });*/
    }

    return {
        handleDragStart: handleDragStart,
        handleDragOver:handleDragOver,
        handleDragEnter:handleDragEnter,
        handleDragLeave: handleDragLeave,
        handleDrop: handleDrop,
        handleDragEnd:handleDragEnd
    }

})();
