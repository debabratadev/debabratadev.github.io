/**
 * Handles the drawing of the canvas.
 */
function Draw() {

    this.ctx;
    this.lineWidth;
    this.canvas;
    this.radius;
    this.currentZoomIndex;
    this.factor;

    this.componentArray = [];

    //component

    //creator
    this.sectionComponent;
    this.seatRowComponent;
    this.matrixRowComponent;

    //text
    this.textComponent;

    //media
    this.mediaComponent;

    //shape
    this.rectShapeComponent;
    this.ellipseShapeComponent;
    this.polyShapeComponent;

    /**
     * Main Draw functions 
     */
    this.draw = function () {
        this.drawComponent();
    }

    /**
     * Draw differnt component.
     */
    this.drawComponent = function () {
        for(let index = 0;index<this.componentArray.length;++index){
            this.handleComponent(this.componentArray[index]["type"],this.componentArray[index]["object"]);
        }
    }

    /**
     * Update the variable
     */
    this.updateVariable = function (ctx, lineWidth, canvas, radius, currentZoomIndex, factor) {
        this.ctx = ctx;
        this.lineWidth = lineWidth;
        this.canvas = canvas;
        this.radius = radius;
        this.currentZoomIndex = currentZoomIndex;
        this.factor = factor;
    }

    /**
     * Update different component 
     */
    this.updateComponent = function () {

        let component = mainModule.getComponent();
        this.componentArray = [];

        //TODO -- need to handle it in better way here
        this.storeComponent('section', component['section']);
        this.storeComponent('row', component['row']);
        this.storeComponent('matrix', component['matrix']);
        this.storeComponent('text', component['text']);
        this.storeComponent('rectangle', component['rectangle']);
        this.storeComponent('polygon', component['polygon']);

        this.storeComponent('ellipse', component['ellipse']);
        this.storeComponent('media', component['media']);

        this.componentArray.sort(this.compare);
    }

    /**
     * Handle the component
     */
    this.handleComponent = function (type, object) {

        switch (type) {
            case 'section': object.draw(this.ctx, this.lineWidth, this.canvas);
                break;
            case 'row': object.draw(this.ctx, this.lineWidth, this.radius, this.currentZoomIndex, this.factor, this.canvas);
                break;
            case 'matrix': object.draw(this.ctx, this.lineWidth, this.radius, this.currentZoomIndex, this.factor, this.canvas);
                break;
            case 'text': object.draw(this.ctx, this.factor, this.lineWidth, this.canvas);
                break;
            case 'rectangle': object.draw(this.ctx, this.factor, this.lineWidth, this.canvas);
                break;
            case 'polygon': object.draw(this.ctx, this.factor, this.lineWidth, this.canvas);
                break;
            case 'ellipse': object.draw(this.ctx, this.factor, this.lineWidth, this.canvas);
                break
            case 'media': object.draw(this.ctx, this.lineWidth, this.canvas);
                break;
        }
    }

    /**
     * Store the component 
     */
    this.storeComponent = function (type, component) {
        for (let index = 0; index < component.length; ++index) {
            this.componentArray.push({ 'type': type, 'object': component[index] })
        }
    }

    /**
     * Compare function for the sorting
     */
    this.compare = function (a, b) {

        if (!a || !b) {
            return 0;
        }

        if (a["object"].zIndex > b["object"].zIndex) return 1;
        if (b["object"].zIndex > a["object"].zIndex) return -1;

        return 0
    }
}