/**
 * Drag child component
 */
function DragChild() {

    /**
     * Start Child drag
     */
    this.startDrag = function (component, mouse, type) {

        for (let index = 0; index < component.length; ++index) {
            let object = component[index];
            object.startDrag(mouse);
            object.rectangle = false;
            this.handleTypeForStartDrag(object,type);
        }
    }

    /**
     * Handles child dragging
     */
    this.dragging = function (component, mouse, type) {

        for (let index = 0; index < component.length; ++index) {
            let object = component[index];
            object.dragging(mouse);
            object.rectangle = false;
            this.handleTypeForDragging(type);
        }
    }

    /**
     * End Child drag
     */
    this.endDrag = function (component, mouse, type) {

        let childElement = true;
        for (let index = 0; index < component.length; ++index) {
            let object = component[index];
            object.endDrag(mouse,childElement);
            object.rectangle = false;
            this.handleTypeForEndDrag(type);
        }
    }

    /**
     * Handle type for start drag
     */
    this.handleTypeForStartDrag = function (object,type) {

        switch(type){
            case 'row':this.handleRowStartDrag(object);
                break
        }
    }

    /**
     * Handlt type for dragging
     */
    this.handleTypeForDragging = function (type) {

    }

    /**
     * Handle type for end drag
     */
    this.handleTypeForEndDrag = function (type) {

    }

    //rows

    /**
     * Handle start drag
     */
    this.handleRowStartDrag = function(object){
        object.selection = true;
    }

    /**
     * Handles the row dragging
     */
    this.handleRowDragging = function(object){
        object.selection = true;
    }

    /**
     * Handle row end drag
     */
    this.handleRowEndDrag = function(object){
        object.selection = false;
    }
}