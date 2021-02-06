/**
 * Contains different methods to handle the tool of the toolbar
 * Minimise and maximise content may require thinking on the same.
 */
var toolModule = (function () {

    //For the selected object here
    let selectedObject = null;
    let selectedComponent = null;
    let selectedType = null;

    /**
     * Close chart and redirect to back 
     */
    function closeChart(){
        mainModule.exitSectionOrChart();
    }

    /**
     * Creates the New Chart
     */
    function createNewChart() {
        //TODO
        helperModule.showInspector('chart-inspector');
        listModule.setType('chart',seatCategory);
        listModule.createList('chart-column-catg');
    }

    /**
     * Deletes the selection here.
     */
    function deleteSelection() {

        if(!selectedObject || !selectedComponent || !selectedComponent.length){
            return;
        }

        selectedComponent = deleteType();

        mainModule.deleteObject(selectedComponent, selectedType);
    }

    /**
     * Choose the type of object you need to delete
     * returns the component after deletion
     */
    function deleteType() {
        let component;

        if (selectedType == 'matrix') {
            component = matrixCollection.deleteMatrix(selectedComponent, selectedObject);

        } else {

            if(selectedType == "section"){
                sectionCollection.deleteSection(selectedObject);
            }
            component = sharedComponent.deleteComponent(selectedComponent, selectedObject);
        }

        return component;
    }

    /**
     * Stores the detail of the selected object here.
     * This will get override , each time the selection has been 
     * changed
     * 
     * @param {*} object    is the current object
     * @param {*} component is the current component
     * @param {*} type      is the current type;
     */
    function storeSelection(object, component, type) {

        selectedObject = object;
        selectedComponent = component;
        selectedType = type;
    }

    /**
     * Selects the section
     */
    function selectSection() {
        helperModule.changeIconColor('section-btn');
        helperModule.showInspector('chart-inspector');
        mainModule.addSection();
    }

    /**
     * Select the seats //TODO select Rows Inspector will change the seat Radius for the rest of the component
     */
    function selectRow() {
        helperModule.changeIconColor('seat-btn');
        helperModule.showInspector('row-config-inspector');
        rowConfigInspector.displayRowConfig();
        mainModule.addSeatRows();
    }

    /**
     * Selects the matrix herr
     */
    function selectMatrix() {
        helperModule.changeIconColor('matrix-btn');
        helperModule.showInspector('matrix-config-inspector');
        matrixConfigInspector.displayMatrixConfig();
        mainModule.addMatrixOfRows();
    }

    /**
     * select any Object here.
     * suits, rows, sections.
     */
    function select() {
        helperModule.changeIconColor('choose-btn');
        mainModule.select();
        helperModule.showInspector('chart-inspector');
    }

    /**
     * Select the seat
     */
    function selectSeat() {
        helperModule.changeIconColor('select-seat-btn');
        mainModule.chooseSeat();
        helperModule.showInspector('chart-inspector');
        listModule.createList('seat-column-catg');
    }

    /**
     * Select Node
     */
    function selectNode(){
        helperModule.changeIconColor('node-btn');
        mainModule.selectNode();
    }

    /**
     * Select the text here
     */
    function selectText(){
        helperModule.changeIconColor('text-btn');
        mainModule.addText();
        helperModule.showInspector('text-inspector');
    }

    /**
     * Select the image
     */
    function selectImage(){
        helperModule.changeIconColor('img-btn');
        // mediaInspector.displayImgOnDiv("");
        //TODO -- clear the div for the new object here
        mediaInspector.displayShapeProperty("none");
        mainModule.addImage();
        helperModule.showInspector('image-inspector');
        document.getElementById('inspector-image').disabled = false;
    }

    /**
     * Select the shape 
     */
    function selectShape(){
        helperModule.changeIconColor('shape-btn');
        helperModule.showInspector('shape-rectangle-inspector');
    }

    /**
     * Select the rectangle shape 
     */
    function selectRectShape(){
        helperModule.changeIconColor('rect-shape-btn');
        mainModule.addRectShape();
        helperModule.showInspector('chart-inspector');
    }

    /**
     * Select the ellipse shape here
     */
    function selectEllipseShape(){
        helperModule.changeIconColor('ellipse-shape-btn');
        mainModule.addEllipseShape();
        helperModule.showInspector('chart-inspector');
    }

    /**
     * Select the poly shape here
     */
    function selectPolyShape(){
        helperModule.changeIconColor('poly-shape-btn');
        mainModule.addPolyShape();
        helperModule.showInspector('chart-inspector');
    }

    return {
        createNewChart: createNewChart,
        deleteSelection: deleteSelection,
        selectSection: selectSection,
        selectRow: selectRow,
        selectMatrix: selectMatrix,
        select: select,
        storeSelection: storeSelection,
        selectSeat: selectSeat,
        selectText:selectText,
        selectShape:selectShape,
        selectRectShape:selectRectShape,
        selectEllipseShape:selectEllipseShape,
        selectPolyShape:selectPolyShape,
        selectImage:selectImage,
        selectNode:selectNode,
        closeChart:closeChart
    }
})();