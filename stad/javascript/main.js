/**
 *  Main Module
 *
 */
var mainModule = (function () {

    //variable for mouse
    let mouse;
    let offsetLeft;
    let offsetTop;

    //variable for positons
    let currX;
    let currY;

    //variable for canvas
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    let canvasClone;

    //view variable
    let newSeat = false;

    //array for components..
    let sectionComponent = [];
    let seatComponent = [];
    let seatRowComponent = [];
    let matrixRowComponent = [];
    let textComponent = [];
    let rectShapeComponent = [];
    let polyShapeComponent = [];
    let ellipseShapeComponent = [];
    let mediaComponent = [];

    //variable for background
    let background;
    let showBackground = true;

    //variable for chart
    let chartObject;
    let chartId;

    //variable for user
    let userId;

    //temporary variable that stores Sections and seats data
    seats = [];

    //url for image
    let urlImage;

    // toggle the backgroud images
    let toggle = false;

    //transfroming coordinates
    let lastX;
    let lastY;

    //points to be transformed
    let p1;
    let p2;

    //image holder
    let gkhead = new Image;
    let drawComp;

    //track the zoom
    let scaleFactor;
    let scaleCounter = 0;

    //Zoom checker..
    let zoomArray = [0.25, 0.33, 0.50, 0.75, 1, 1.25, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    let factorArray = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    let currentZoomIndex = 4;
    let lastZoomIndex = 12;

    let currentObject = null;
    let currentMatrixRow = null;
    let currentSeat = null;

    //Grid checker
    let snapGrid = false;
    let grid = false;
    let snapCounter = false;
    let snapArray = [];

    //predefined values 
    let lineWidth = 1.1;
    let radius = 7;
    let seatSpacing = 7;
    let rowSpacing = 4;
    let fontSize = 14;
    let scale = 35;

    //range holder
    let range = 1;

    //for maintainig pixel
    let factor = 1;

    //boundary of canvas
    const boundaryLimit = 10000;

    let rectangleArray = []; //holds the cordinate of rectangle

    let selector = {
        type: null,
        level: null,
        action: null,
        drag: false,
        rotate: false,
    }

    let seatCategory = null;

    let seatBtnArray = ['seat-icon-div', 'matrix-icon-div'];
    let sectionSelection = false;
    let currentSectionObject = null;

    /**
     *  This is the first function
     *  to be called after the dom is ready.
     */
    function initialise() {

        setMouseInitialPositon();

        dragDiv();

        canvasClone = canvas;

        setOffset();

        let divwidth = document.getElementById('show-hide').clientWidth;
        canvas.width = divwidth - (divwidth / 4.2);

        lastX = canvas.width / 2;
        lastY = canvas.height / 2;

        trackTransforms(ctx); //TODO Track Transform on hold

        scaleFactor = 1.2;

        chartObject = new Chart();
        chartInspector.setChartObject(chartObject);
        helperModule.showInspector('chart-inspector');

        background = new Background(); //TODO setting of the background

        drawComp = new Draw();

        navModule.setContext(ctx);

        eventListener();

        setChartContext();

        /** The main draw functions is here */
        (function draw() {
            window.requestAnimationFrame(draw);
            drawContent(drawComp);
        })();

    }

    /**
     * Handle the chart uploading 
     * determine whether new chart has been added
     * or we have to update new chart
     */
    function setChartContext() {
        let createNewChart = window.localStorage.getItem('new-chart');
        chartId = window.localStorage.getItem('chart-id');
        userId = window.localStorage.getItem('user-id');

        if (createNewChart == "false") {
            loadJsonModule.jsonFetchRequest(chartId);
            toolModule.select();

        } else {
            gkhead.src = '../images/Eden.jpg';
            bgHelper.setChartReference(gkhead.src);
            // listModule.pushToCategory({ 'name': 'good', 'color': '#00FF00', id: 0 });
        }
    }

    /*
     * TODO ---
     */
    function updateChart() {

        let component = collection.getComponentCollection(
            background, sectionComponent, seatRowComponent, matrixRowComponent,
            textComponent, rectShapeComponent, polyShapeComponent, ellipseShapeComponent,
            chartObject, mediaComponent
        );

        data = {
            "user_id": userId,
            "chart_data": component
        }

        updateChartModule.updateChart(data, chartId);
    }

    /**
     *  Draw The content contineously based 
     *  On Section Component that are available.
     */
    function drawContent(drawComp) {

        ctx.clearRect(-boundaryLimit, -boundaryLimit, boundaryLimit * canvas.width, boundaryLimit * canvas.height);

        if (showBackground) {
            background.draw(ctx, gkhead, canvas); //TODO background calling, Error handling to be done here
        }

        if (snapGrid) {
            drawGrid();
        }

        drawComponent(drawComp);

        if ((selector.type == "creator" && selector.level == "section") ||
            (selector.type == "shape" && selector.level == "polygon")) {
            drawLinesForCursorPosition();
        }

        if (seatCategory) {
            seatCategory.draw(ctx, lineWidth);
        }
    }

    /**
     * It draws the component
     */
    function drawComponent(drawComp) {
        drawComp.updateVariable(ctx, lineWidth, canvas, radius, currentZoomIndex, factor);
        drawComp.updateComponent();

        drawComp.draw();
    }

    /**
     *  Draws the grid   TODO - change after implementing this according to that thing only
     */
    function drawGrid() {

        if (!grid) {

            fillSnap();
            ctx.beginPath();

            for (var x = 0; x < snapArray.length; ++x) {

                ctx.moveTo(snapArray[x][0].x, snapArray[x][0].y);
                ctx.lineTo(snapArray[x][snapArray[x].length - 1].x, snapArray[x][snapArray[x].length - 1].y);
            }

            let length = snapArray[0].length;

            for (var x = 0; x < length; ++x) {

                ctx.moveTo(snapArray[0][x].x, snapArray[0][x].y);
                ctx.lineTo(snapArray[snapArray.length - 1][x].x, snapArray[snapArray.length - 1][x].y);
            }

            snapCounter = true;

            ctx.strokeStyle = '#A9A9B0';
            ctx.lineWidth = 0.1;
            ctx.stroke();
            ctx.strokeStyle = "none";
        }
    }

    /**
     * Draw lines for Cursor position, 
     * Draw x-coordinate line 
     * Draw y-coordinate line
     */
    function drawLinesForCursorPosition() {

        let extremeWidth = canvas.width * boundaryLimit;
        let pt = ctx.transformedPoint(mouse.x, mouse.y);
        let width = lineWidth / 2;
        let strokeColor = "blue";

        let point1 = { x: pt.x, y: -extremeWidth };
        let point2 = { x: pt.x, y: extremeWidth };

        canvasModule.drawStraightLine(ctx, strokeColor, point1, point2, width, []);

        point1 = { x: -extremeWidth, y: pt.y };
        point2 = { x: extremeWidth, y: pt.y };

        canvasModule.drawStraightLine(ctx, strokeColor, point1, point2, width, []);
    }

    /**
   * Drag the bar- property bar and the toolbar
   */
    function dragDiv() {
        trackBall.dragElement(document.getElementById('small-circle'));
    }

    /**
     *  Add Event listener here
     */
    function eventListener() {

        //mouse listener
        canvas.addEventListener('click', mouseClick);
        canvas.addEventListener('mousedown', mouseDown);
        document.addEventListener('mouseup', mouseUp);  //TODO mouse up instead
        canvas.addEventListener('mousemove', mouseMove);
        canvas.addEventListener('contextmenu', mouseRightClick);
        canvas.addEventListener('dblclick', mouseDblClick);

        // canvas.addEventListener('touchstart', mouseClick);
        // canvas.addEventListener('touchmove', mouseMove);
        // canvas.addEventListener('touchend', mouseUp);
    }

    /**
     * On right Click
     * 
     * @param {*} event 
     */
    function mouseRightClick(event) {
        event.preventDefault();
        updateMouse(event);
        currX = mouse.x;
        currY = mouse.y;
        if (selector.type == "node" && currentObject && currentObject.showTentativeNode) {
            let pt = { x: currX, y: currY };
            currentObject.nodeObject.deleteNode(pt);
        }
    }

    /**
     * On Double Click
     *  
     * @param {*} event is the mouse event  TODO -- move mouse dbl click to another folder
     */
    function mouseDblClick(event) {

        event.preventDefault();
        updateMouse(event);

        currX = mouse.x;
        currY = mouse.y;

        rectangleArray = [];

        //TODO not allow section selection for other component here
        if (sectionSelection || selector.type == "creator") {
            return;
        }

        mainModule.selectObject();

        currentSectionObject = [];

        changeColorOnSectionSelection(false);

        if (selector.type == "selector" && selector.level == "section") {
            currentSectionObject = currentObject ? currentObject : null;
            if (currentSectionObject) {
                currentSectionObject.selectSection(true);
                sectionSelection = true;
                document.getElementById('section-div').style.display = "none";

                helperModule.showAndHideExitBtn("block", "none");

                if (sectionComponent.length) {
                    helperModule.displayBlock(seatBtnArray, 'block');
                }
                helperModule.selectDeleteIcon(false);
                rectangleArray = [];
            }
        }
    }

    /**
     * Change the color on section selection
     */
    function changeColorOnSectionSelection(display) {
        for (let index = 0; index < sectionComponent.length; ++index) {
            sectionComponent[index].select = display;
        }
    }

    /**
     * To be handled when the mouse is move up
     * 
     * @param event 
     */
    function mouseUp(event) {

        updateMouse(event);

        currX = mouse.x;
        currY = mouse.y;

        componentSelectorOnMouseUp.updateVariable(currentObject, currentMatrixRow, mouse, event);
        componentSelectorOnMouseUp.select(selector);

    }


    /**
     * Handle rectangle shape on mouse up
     */
    function rectShapeOnMouseUp() {
        if (currentObject) {
            currentObject.stopCreation(mouse);
        }
    }

    /**
     * Handle ellipse shape on mouse up
     */
    function ellipseShapeOnMouseUp() {
        if (currentObject) {
            currentObject.stopCreation(mouse);
        }
    }

    /**
     * It handle the matrix on mouse up
     */
    function handleMatrixOnMouseUp() {

        if (currentMatrixRow && currentMatrixRow.enableSelection) {
            currentMatrixRow.endSelectionDrag(pt);
            if (currentMatrixRow.rowComponent && currentMatrixRow.rowComponent.length) {
                matrixInspector.setMatrixObject(currentMatrixRow);
                toolModule.storeSelection(currentMatrixRow, seatRowComponent, 'matrix');
                helperModule.selectDeleteIcon(true);
            } else {
                selector.level = null;
            }
            if (currentMatrixRow.rectCordinates) {
                rectangleArray = polyModule.findAllCoordinatesOfARectangle(currentMatrixRow.rectCordinates);
                currentMatrixRow.rectangle = true;
            }
        }
    }

    /**
     * It handle the seat on mouse up
     */
    function handleSeatOnMouseUp() {
        if (seatCategory && seatCategory.selection) {
            seatCategory.endSelection(mouse);

            if (seatCategory.seatObject.length) {
                seatCategory.rectangle = true;
                helperModule.showInspector('multi-seat-inspector');
                listModule.setType('multi-seat', seatCategory);
                listModule.createList('multi-seat-column-catg');
            } else {
                helperModule.showInspector('chart-inspector');
                listModule.setType('chart', seatCategory);
                listModule.createList('chart-column-catg');
            }
        }
    }

    /**
     * It modifies the row seat on  mouse up based on the selection
     */
    function modifyRowOnMouseUp() {
        if (currentObject) {
            if (currentObject.leftRectDrag) {
                currentObject.leftRectDrag = false;
                currentObject.dragEndForRowCorner(mouse, 'left');
            } else if (currentObject.rightRectDrag) {
                currentObject.rightRectDrag = false;
                currentObject.dragEndForRowCorner(mouse, 'right');
            }
        }
    }

    /**
     * Modifies the matrix on mouse up
     */
    function modifyMatrixOnMouseUp() {
        if (currentMatrixRow) {
            if (currentMatrixRow.leftRectDrag) {
                currentMatrixRow.leftRectDrag = false;
                currentMatrixRow.dragEndForMatrixCorner(mouse, 'left');
            } else if (currentMatrixRow.rightRectDrag) {
                currentMatrixRow.rightRectDrag = false;
                currentMatrixRow.dragEndForMatrixCorner(mouse, 'right');
            }
        }
    }

    /**
     *  When Mouse is moved over the canvas , this will be called
     * 
     * @param event 
     */
    function mouseMove(event) {

        updateMouse(event);

        currX = mouse.x;
        currY = mouse.y;

        componentSelectorOnMouseMove.updateVariable(currentObject, currentMatrixRow, mouse, canvas, ctx, currX, currY);

        if (!componentSelectorOnMouseMove.select(selector)) {
            return;
        }

        let pt = ctx.transformedPoint(currX, currY);

        if (currentMatrixRow || currentObject) {
            handleCursor();
        }

        if (currentMatrixRow && currentMatrixRow.enableSelection) {
            let pt = { x: currX, y: currY };
            currentMatrixRow.selectionDragging(pt);
        }
    }

    /**
     * Creator on mouse move
     */
    function creatorOnMouseMove() {
        let pt = ctx.transformedPoint(currX, currY);

        switch (selector.level) {
            case 'section': canvas.style.cursor = 'crosshair';
                sectionCreatorOnMouseMove();
                break;
            case 'row': currentObject.moveMouse(pt);
                canvas.style.cursor = 'pointer';
                break;
            case 'matrix': currentMatrixRow.moveMouse(pt);
                canvas.style.cursor = 'pointer';
                break;
        }
    }

    /**
     * Handles section creator on mouse move here
     */
    function sectionCreatorOnMouseMove() {
        let pt = ctx.transformedPoint(currX, currY);
        if (currentObject) {
            currentObject.moveMouse(pt);
        }
    }

    /**
     * Handles seat on mouse move
     */
    function seatOnMouseMove() {
        canvas.style.cursor = "pointer";
        if (seatCategory && seatCategory.selection) {
            let pt = ctx.transformedPoint(currX, currY);
            seatCategory.selecting(pt);
        }
    }

    /**
     * Handles the cursor 
     * Need to refactor the below code here
     * For having move cursor here , we can go for this
     */
    function handleCursor() {
        let pt = ctx.transformedPoint(currX, currY);

        if (selector.type == "selector") {
            if (isInsideRectangle()) {
                canvas.style.cursor = "move";
            }

            if (selector.level == "row") {
                if (currentObject.hitTheLeftPoint(pt) || currentObject.hitTheRightPoint(pt)) {
                    canvas.style.cursor = "col-resize";
                }
            } else if (selector.level == "matrix") {
                if (currentMatrixRow.hitTheLeftPoint(pt) || currentMatrixRow.hitTheRightPoint(pt)) {
                    canvas.style.cursor = "col-resize";
                }
            }
        }

        collection.cursorOnHit(ctx, { x: currX, y: currY });
    }

    /**
     * handle rows on mouse movement
     */
    function handleRowsOnMouseMove() {

        if (currentObject && (currentObject.hitTheLeftPoint(mouse) || currentObject.hitTheRightPoint(mouse))) {
            canvas.style.cursor = "col-resize";
        }

        if (currentObject && (currentObject.leftRectDrag || currentObject.rightRectDrag)) {
            modifyRowOnMouseMove();
        }
        else {
            rowDragOnMouseMove();
        }
    }

    /**
     * Handles the matrix on mouse move
     */
    function handleMatrixOnMouseMove() {
        if (currentMatrixRow && (currentMatrixRow.hitTheLeftPoint(mouse) || currentMatrixRow.hitTheRightPoint(mouse))) {
            canvas.style.cursor = "col-resize";
        }

        if (currentMatrixRow && (currentMatrixRow.leftRectDrag || currentMatrixRow.rightRectDrag)) {
            modifyMatrixOnMouseMove();
        }
        else {
            matrixDragOnMouseMove();
        }
    }

    /**
     * On mouse movement , identify the type of movement
     * Whether row are moving or the corner point are  
     * moving
     */
    function modifyRowOnMouseMove() {
        let pt = ctx.transformedPoint(currX, currY);
        canvas.style.cursor = "col-resize";

        if (currentObject.cornerDrag) {
            selectCornerToMove(pt);
        }
    }

    /**
     * It selects the corner to move
     * 
     * @param {*} pt is the transformed point for the mouse
     */
    function selectCornerToMove(pt) {
        if (currentObject.leftRectDrag) {
            currentObject.draggingRowCorner(pt, 'left');
        } else if (currentObject.rightRectDrag) {
            currentObject.draggingRowCorner(pt, 'right');
        }
    }

    /**
     * It modifies the matrix on mouse move
     */
    function modifyMatrixOnMouseMove() {
        let pt = ctx.transformedPoint(currX, currY);
        if (currentMatrixRow.hitTheLeftPoint(mouse) || currentMatrixRow.hitTheRightPoint(mouse)) {
            canvas.style.cursor = "col-resize";
        }

        selectMatrixCornerToMove(pt);
    }

    /**
     * It selects the matrix corner to move
     */
    function selectMatrixCornerToMove(pt) {
        if (currentMatrixRow.leftRectDrag) {
            currentMatrixRow.draggingMatrixCorner(pt, 'left');
        } else if (currentMatrixRow.rightRectDrag) {
            currentMatrixRow.draggingMatrixCorner(pt, 'right');
        }
    }

    /**
     * Drag the row on mouse move
     */
    function rowDragOnMouseMove() {
        sharedComponent.componentDragOnMouseMove(seatRowComponent, mouse, canvas, ctx);
    }

    /**
     * Drag the matrix on mouse move
     */
    function matrixDragOnMouseMove() {
        sharedComponent.componentDragOnMouseMove(matrixRowComponent, mouse, canvas, ctx);
    }

    /**
     * Make the seats draggable here
     * 
     * @param event 
     */
    function mouseDown(event) {

        updateMouse(event);

        currX = mouse.x;
        currY = mouse.y;

        componentSelectorOnMouseDown.updateVariable(
            mouse, canvas, ctx, currentObject, currentMatrixRow, { x: currX, y: currY }, event
        );
        componentSelectorOnMouseDown.select(selector);
    }

    /**
     * Seat on mouse down
     */
    function seatOnMouseDown() {
        if (!currentSeat) {
            handleSeatOnMouseDown();
        }
    }

    /**
     * It handle the matrix selection
     * on mouse down
     */
    function handleMatrixOnMouseDown() {

        if (!sectionComponent.length) {
            return;
        }

        if (!currentObject && !selector.drag) {
            if (!sectionSelection || (currentMatrixRow && (currentMatrixRow.rotate)) || selector.rotate) {
                return;
            }

            matrixRowComponent = [];

            // currentMatrixRow = new RowMatrix();
            currentMatrixRow = new selectionMatrix();
            currentMatrixRow.ctx = ctx;
            currentMatrixRow.currentFactor = getCurrentFactor();

            currentMatrixRow.seatSpacing = seatSpacing;
            currentMatrixRow.rowSpacing = rowSpacing;
            currentMatrixRow.seatRadius = radius;

            matrixRowComponent.push(currentMatrixRow);
            // let pt = ctx.transformedPoint(currX, currY);
            let pt = { x: currX, y: currY };
            currentMatrixRow.startSelectionDrag(pt, seatRowComponent);

            selector.level = "matrix";
        }
    }

    /**
     * Handles seat on mouse down
     * For handling selection
     */
    function handleSeatOnMouseDown() {
        seatCategory = new SeatCategory();
        let pt = ctx.transformedPoint(currX, currY);
        seatCategory.ctx = ctx;
        seatCategory.startSelection(pt, seatComponent);
    }

    /**
     * Modfify the seat on row by adding or delete seats
     * 
     */
    function modifyRowOnMouseDown() {
        let pt = ctx.transformedPoint(currX, currY);

        if (!selector.drag && !selector.rotate && currentObject) {
            if (currentObject.hitTheLeftPoint(pt)) {
                canvas.style.cursor = "col-resize";
                currentObject.leftRectDrag = true;
                currentObject.dragStartForRowCorner(pt, 'left');
                currentObject.rectangle = false;
            } else if (currentObject.hitTheRightPoint(pt)) {
                canvas.style.cursor = "col-resize";
                currentObject.rightRectDrag = true;
                currentObject.rectangle = false;
                currentObject.dragStartForRowCorner(pt, 'right');
            }
        }
    }

    /**
     * Modfify the seat on row by adding or delete seats
     * 
     */
    function modifyMatrixOnMouseDown() {
        let pt = ctx.transformedPoint(currX, currY);

        if (!selector.drag && !selector.rotate && currentMatrixRow) {
            if (currentMatrixRow.hitTheLeftPoint(pt)) {
                canvas.style.cursor = "col-resize";
                currentMatrixRow.leftRectDrag = true;
                currentMatrixRow.dragStartForMatrixCorner(pt, 'left');
                currentMatrixRow.rectangle = false;
            } else if (currentMatrixRow.hitTheRightPoint(mouse)) {
                canvas.style.cursor = "col-resize";
                currentMatrixRow.rightRectDrag = true;
                currentMatrixRow.dragStartForMatrixCorner(pt, 'right');
                currentMatrixRow.rectangle = false;
            }
        }
    }

    /**
     * Handle rectangle shape on mouse down
     */
    function addRectangleObject() {

        currentObject = new Rectangle();
        currentObject.labelSize = fontSize;
        currentObject.currentFactor = getCurrentFactor();
        let pt = ctx.transformedPoint(currX, currY);
        currentObject.startCreation(pt);
        if (sectionSelection) {
            currentObject.parentSection = currentSectionObject;
        }
        rectShapeComponent.push(currentObject);

        mainModule.updateChart();
    }

    /**
     * Handle ellipse shape on mouse down
     */
    function addEllipseObject() {

        currentObject = new Ellipse();
        currentObject.labelSize = fontSize;
        currentObject.currentFactor = getCurrentFactor();
        let pt = ctx.transformedPoint(currX, currY);
        currentObject.startCreation(pt);
        if (sectionSelection) {
            currentObject.parentSection = currentSectionObject;
        }
        ellipseShapeComponent.push(currentObject);

        mainModule.updateChart();
    }
    /**
     * It handles the action of the section drag, when the mouse is clicked down.
     */
    function sectionDragOnMouseDown() {

        if (!isInsideRectangle()) {
            return;
        }

        sharedComponent.componentDragOnMouseDown(sectionComponent);
        if (currentObject) {
            updateSelectedObject(currentObject);
            selector = { type: 'selector', level: 'section', action: 'drag', drag: true, rotate: false };
        }
    }

    /**
     * Handles the dragging of rows while mouse is down
     */
    function rowDragOnMouseDown() {

        if (!isInsideRectangle()) {
            return;
        }

        sharedComponent.componentDragOnMouseDown(seatRowComponent);
        if (currentObject) {
            updateSelectedObject(currentObject);
            selector = { type: 'selector', level: 'row', action: 'drag', drag: true, rotate: false };
        }
    }

    /**
     * Handle matrix drag on mouse down
     */
    function matrixDragOnMouseDown() {

        if (!isInsideRectangle()) {
            return;
        }

        sharedComponent.componentDragOnMouseDown(matrixRowComponent);
        if (currentMatrixRow) {
            updateSelectedObject(currentMatrixRow);
            selector = { type: 'selector', level: 'matrix', action: 'drag', drag: true, rotate: false };
        }
    }

    /**
     * Handle text drag on mouse down here
     */
    function textDragOnMouseDown() {

        if (!isInsideRectangle()) {
            return;
        }

        sharedComponent.componentDragOnMouseDown(textComponent);
        if (currentObject) {
            updateSelectedObject(currentObject);
            selector = { type: 'selector', level: 'text', action: 'drag', drag: true, rotate: false };
        }
    }

    /**
     * Handle text drag on mouse down here
     */
    function mediaDragOnMouseDown() {

        if (!isInsideRectangle()) {
            return;
        }

        sharedComponent.componentDragOnMouseDown(mediaComponent);
        if (currentObject) {
            updateSelectedObject(currentObject);
            selector = { type: 'selector', level: 'media', action: 'drag', drag: true, rotate: false };
        }
    }

    /**
     * Handle poly shape drag on mouse down
     * 
     */
    function rectShapeDragOnMouseDown() {

        if (!isInsideRectangle()) {
            return;
        }

        sharedComponent.componentDragOnMouseDown(rectShapeComponent);
        if (currentObject) {
            updateSelectedObject(currentObject);
            selector = { type: 'selector', level: 'rectangle', action: 'drag', drag: true, rotate: false };
        }
    }

    /**
     * Handle poly shape drag on mouse down here
     */
    function polyShapeDragOnMouseDown() {

        if (!isInsideRectangle()) {
            return;
        }

        sharedComponent.componentDragOnMouseDown(polyShapeComponent);
        if (currentObject) {
            updateSelectedObject(currentObject);
            selector = { type: 'selector', level: 'polygon', action: 'drag', drag: true, rotate: false };
        }
    }

    /**
     * Handle ellipse shape drag on mouse down here
     */
    function ellipseShapeDragOnMouseDown() {

        if (!isInsideRectangle()) {
            return;
        }

        sharedComponent.componentDragOnMouseDown(ellipseShapeComponent);
        if (currentObject) {
            updateSelectedObject(currentObject);
            selector = { type: 'selector', level: 'ellipse', action: 'drag', drag: true, rotate: false };
        }
    }

    /**
     * Check id lies inside the rectangle
     */
    function isInsideRectangle() {

        let pt = ctx.transformedPoint(currX, currY);
        if (!polyModule.isInsidePolygon(rectangleArray, rectangleArray.length, pt)) {
            return false;
        }
        return true;
    }

    /**
     * Update Selected Object here
     */
    function updateSelectedObject(object) {
        canvas.style.cursor = "move";
        object.drag = true;
        object.rectangle = true;
        let pt = ctx.transformedPoint(currX, currY);
        object.startDrag(pt);
    }

    /**
     * Capture the click of the mouse and on the basis of that
     * make the Section or the seat draggable
     * 
     * @param event
     */
    function mouseClick(event) {

        updateMouse(event);

        currX = mouse.x;
        currY = mouse.y;

        componentSelectorOnMouseClick.select(selector);
    }

    /**
     * Handle polygon shape on click  //TODO - renname to something like add polygon object
     */
    function addPolygonObject() {

        let pt = { x: currX, y: currY };

        if (currentObject && currentObject.creation) {
            currentObject.createPolygon(pt);
        } else {

            currentObject = new Polygon();
            currentObject.labelSize = fontSize;
            currentObject.currentFactor = getCurrentFactor();
            currentObject.createPolygon(pt, ctx);

            if (sectionSelection) {
                currentObject.parentSection = currentSectionObject;
            }

            polyShapeComponent.push(currentObject);

            mainModule.updateChart();
        }
    }

    /**
     * Add the section on click
     */
    function addSectionObject() {
        let pt = { x: currX, y: currY };
        if (currentObject && currentObject.creation) {
            currentObject.createPolygon(pt);   //can be used to set the detail afterward from here
        } else {

            currentObject = new Section();
            currentObject.currentFactor = getCurrentFactor();
            currentObject.labelSize = fontSize;
            currentObject.createPolygon(pt, ctx);
            sectionComponent.push(currentObject);

            // if (sectionComponent.length) {
            //     helperModule.displayBlock(seatBtnArray, 'block');
            // }
        }
    }

    /**
     *  Set the initial positon of the mouse click here.
     */
    function setMouseInitialPositon() {

        mouse = {
            x: canvas.width / 2, //Initial position
            y: canvas.height / 2
        }
    }

    /**  
     *  Set offset for the canvas here
     */
    function setOffset() {
        offsetLeft = canvasClone.offsetLeft;
        offsetTop = canvasClone.offsetTop; //TODO - repeatedly find canvas clone fuctionality might be missing
    }

    /**
     * Add text to the object 
     */
    function addTextObject() {

        currentObject = new Text();

        let pt = ctx.transformedPoint(currX, currY);
        currentObject.setCoordinate(pt);
        currentObject.fontSize = fontSize;

        if (sectionSelection) {
            currentObject.parentSection = currentSectionObject;
        }

        currentObject.currentFactor = getCurrentFactor();
        textComponent.push(currentObject);

        mainModule.updateChart();

        textInspector.setTextObject(currentObject);
        selector = { type: 'selector', level: 'text', action: '' };
        helperModule.changeIconColor('choose-btn');
        toolModule.storeSelection(currentObject, textComponent, 'text');
        helperModule.selectDeleteIcon(true);
    }

    /**
     * Add image to object here
     */
    function addMediaObject(url) {

        let image = new Image;
        image.src = url;

        currentObject = new Media(image);
        currentObject.currentFactor = getCurrentFactor();
        currentObject.scale = scale;

        if (sectionSelection) {
            currentObject.parentSection = currentSectionObject;
        }

        mediaComponent.push(currentObject);

        // mediaInspector.setMediaObject(currentObject);

        selector = { type: 'selector', level: 'media', action: '' };
        helperModule.changeIconColor('choose-btn');
        toolModule.storeSelection(currentObject, mediaComponent, 'media');
        helperModule.selectDeleteIcon(true);
    }

    /**
     *  Add Sections and the seat should be binded
     */
    function addSection() {

        selector = { type: 'creator', level: 'section' };
        currentObject = null;

        setOffset();

        refiningSelectedComponent();
    }

    /**
     * It adds a rows of seats.
     */
    function addSeatRows() {

        if (!sectionComponent.length) {
            return;
        }

        refiningSelectedComponent();

        const seatRow = new Row();
        seatRow.radius = radius;
        seatRow.seatSpacing = seatSpacing;

        if (sectionSelection) {
            seatRow.parentSection = currentSectionObject;
        }

        let fac = getCurrentFactor();
        seatRow.currentFactor = fac;
        seatRowComponent.push(seatRow);
        seatRow.currentZoom = currentZoomIndex;

        mainModule.updateChart();

        currentObject = seatRow;
        rowFirstPoint = true;
        newSeat = false;
        seatCategory = null;

        selector = { type: 'creator', level: 'row' };

        if (currentSeat) {
            currentSeat.select = false;
        }
    }

    /**
     * Add matrix of rows
     */
    function addMatrixOfRows() {

        if (!sectionComponent.length) {
            return;
        }

        matrixRowComponent = []; //TODO - handle it once instead 

        const matrixRow = new Matrix();
        let fac = getCurrentFactor();
        matrixRow.radius = radius;
        matrixRow.rowSpacing = rowSpacing;
        matrixRow.seatSpacing = seatSpacing;
        matrixRow.currentZoom = currentZoomIndex;

        if (currentSectionObject) {
            matrixRow.parentSection = currentSectionObject;
        }

        matrixRow.currentFactor = fac;

        matrixRowComponent.push(matrixRow);

        currentMatrixRow = matrixRow;
        matrixFirstPoint = true;
        newSeat = false;
        seatCategory = null;

        selector = { type: 'creator', level: 'matrix' };

        if (currentSeat) {
            currentSeat.select = false;
        }

        refiningSelectedComponent();
    }

    /**
     * add the text
     */
    function addText() {
        currentObject = null;
        selector = { type: 'text', level: 'text' };

        refiningSelectedComponent();
    }

    /**
     * Add image
     */
    function addImage() {
        currentObject = null;
        selector = { type: 'image', level: 'image' };

        refiningSelectedComponent();

        canvas.style.cursor = "default";
    }

    /**
     * Add the rectangle shape
     */
    function addRectShape() {

        currentObject = null;
        selector = { type: 'shape', level: 'rectangle' };

        refiningSelectedComponent();
        seatRowComponent = refineModule.refineRowComponent(seatRowComponent);
    }

    /**
     * Add the ellipse shape
     */
    function addEllipseShape() {

        currentObject = null;
        selector = { type: 'shape', level: 'ellipse' };

        refiningSelectedComponent();
    }

    /**
     * Add polygon shape 
     */
    function addPolyShape() {

        currentObject = null;
        selector = { type: 'shape', level: 'polygon' };

        refiningSelectedComponent();
    }

    /**
     * check which rows point it is , here.
     */
    function checkRowsPoint() {

        let pt = ctx.transformedPoint(currX, currY);
        currentObject.createRow(pt);

        if (!currentObject.creation) {
            addSeatRows();
        }
    }

    /**
     * It checks the matrix point, here.
     */
    function checkMatrixPoint() {

        let pt = ctx.transformedPoint(currX, currY);

        currentMatrixRow.createMatrix(pt);
        if (!currentMatrixRow.creation) {
            seatRowComponent = seatRowComponent.concat(matrixRowComponent[0].rowComponent);
            matrixRowComponent = [];
            addMatrixOfRows();
        }
    }

    /**
     *  Update the position of the mouse
     */
    function updateMouse(event) {
        mouse.x = event.pageX - offsetLeft - 1.1;
        mouse.y = event.pageY - offsetTop - 1.3;
    }

    /**
     *  Toggle the background images..
     */
    function toggleBackground() {

        if (urlImage == null) {

            toggleDefaultBackground();
            return;
        }

        if (toggle) {

            gkhead.src = urlImage.value;

            ctx.clearRect(-boundaryLimit * canvas.width, -boundaryLimit * canvas.height,
                boundaryLimit * canvas.width, boundaryLimit * canvas.height);

            sectionCollection.handleBackground(sectionComponent, true);
            showBackground = true;

        } else {
            sectionCollection.handleBackground(sectionComponent, false);
            showBackground = false;
        }
        toggle = !toggle;
    }


    /** 
     *  Toggle the default background that will be present there
     */
    function toggleDefaultBackground() {
        let query = document.querySelector('#canvas');
        showBackground ? showAndHideBtn('hide-bg-icon', 'bg-icon') : showAndHideBtn('bg-icon', 'hide-bg-icon');

        if (query.classList.contains('is-toggle')) {
            ctx.clearRect(0, 0, 2 * gkhead.width, 2 * gkhead.height);
            showBackground = false;
            query.classList.remove('is-toggle');

            sectionCollection.handleBackground(sectionComponent, false);

        } else {
            query.classList.add('is-toggle');
            showBackground = true;
            sectionCollection.handleBackground(sectionComponent, true);

        }
    }

    /**
     *  Save as a json file by going through the corresponding URL 
     */
    function saveAsJson() {

        let component = collection.getComponentCollection(
            background, sectionComponent, seatRowComponent, matrixRowComponent,
            textComponent, rectShapeComponent, polyShapeComponent, ellipseShapeComponent
        );

        // saveFile(component, 'newMap.json');

        let data = encode(JSON.stringify(component));

        let blob = new Blob([data], {
            type: 'application/octet-stream'
        });

        let url = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'newChart.json');

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    }

    /**
     * encode it in the josn format
     * @param {*} s is the data to be encoded 
     */
    function encode(s) {
        let out = [];
        for (let index = 0; index < s.length; index++) {
            out[index] = s.charCodeAt(index);
        }
        return new Uint8Array(out);
    }

    /**
     * Update the chart from json --TODO Generic handling of data
     * 
     * @param {*} component is the overall component
     */
    function updateChartFromJson(component) {

        //TODO - error handling while uploadig the media

        sectionComponent = component[1]['section'];
        seatRowComponent = component[2]['row'];
        matrixRowComponent = component[3]['matrix'];
        textComponent = component[4]['text'];
        rectShapeComponent = component[5]['rectangle'];
        polyShapeComponent = component[6]['polygon'];
        ellipseShapeComponent = component[7]['ellipse'];
        let chart = component[8]['chart'];

        document.getElementById('display-chart-name').value = chart.name;
        document.getElementById('chart-name').value = chart.name;

        let catg = component[9]['category'];

        if (component[10]) {
            mediaComponent = component[10]['media'];
        }

        listModule.setCategory(catg);
        listModule.setType('chart', seatCategory);
        listModule.createList('chart-column-catg');

        if (sectionComponent.length) {
            helperModule.displayBlock(seatBtnArray, 'block');
        }
    }

    /**
     * Upload image for the background
     */
    function uploadImage() {
        updateImageModule.updateImageRequest(chartId);
    }

    // zoom functioanlity functions

    /**
     *  redraw the canvas when zoomm functioanlity is called.
     */
    function redraw() {

        if (newSeat) {
            return;
        }

        p1 = ctx.transformedPoint(0, 0);
        p2 = ctx.transformedPoint(canvas.width, canvas.height);
        ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(-boundaryLimit * canvas.width, -boundaryLimit * canvas.height,
            boundaryLimit * canvas.width, boundaryLimit * canvas.height);

        ctx.restore();
    }

    /**
     * zoom the canvas based on the clicks
     * 
     * @param clicks is the scale at which zoom in and out is happening
     */
    function zoom(clicks) {

        toolModule.select();

        scaleCounter += clicks;

        lastX = canvas.width / 2;           //TODO
        lastY = canvas.height / 2;          //TODO - 

        let pt = ctx.transformedPoint(lastX, lastY);
        ctx.translate(pt.x, pt.y);
        factor = Math.pow(scaleFactor, clicks);
        ctx.scale(factor, factor);
        ctx.translate(-pt.x, -pt.y);

        redraw();

        factorArray[currentZoomIndex] = factor;
        lineWidth = lineWidth / factor;
        radius = radius / factor;
        seatSpacing = seatSpacing / factor;
        rowSpacing = rowSpacing / factor;
        fontSize = fontSize / factor;
        scale = scale / factor;

        navModule.setNav(factor, getCurrentFactor());
    }

    /**
     * track the transform and change based on the basis of zoom in and zoom out
     * 
     * @param ctx here will have the current reference
     */
    function trackTransforms(ctx) {

        var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        var xform = svg.createSVGMatrix();
        ctx.getTransform = function () { return xform; };

        var savedTransforms = [];
        var save = ctx.save;
        ctx.save = function () {
            savedTransforms.push(xform.translate(0, 0));
            return save.call(ctx);
        };

        var restore = ctx.restore;
        ctx.restore = function () {
            xform = savedTransforms.pop();
            return restore.call(ctx);
        };

        var scale = ctx.scale;
        ctx.scale = function (sx, sy) {
            xform = xform.scaleNonUniform(sx, sy);
            return scale.call(ctx, sx, sy);
        };

        var rotate = ctx.rotate;
        ctx.rotate = function (radians) {
            xform = xform.rotate(radians * 180 / Math.PI);
            return rotate.call(ctx, radians);
        };

        var translate = ctx.translate;
        ctx.translate = function (dx, dy) {
            xform = xform.translate(dx, dy);
            return translate.call(ctx, dx, dy);
        };

        var transform = ctx.transform;
        ctx.transform = function (a, b, c, d, e, f) {
            var m2 = svg.createSVGMatrix();
            m2.a = a;
            m2.b = b;
            m2.c = c;
            m2.d = d;
            m2.e = e;
            m2.f = f;
            xform = xform.multiply(m2);
            return transform.call(ctx, a, b, c, d, e, f);
        };

        var setTransform = ctx.setTransform;
        ctx.setTransform = function (a, b, c, d, e, f) {
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(ctx, a, b, c, d, e, f);
        };

        var pt = svg.createSVGPoint();
        ctx.transformedPoint = function (x, y) {
            pt.x = x;
            pt.y = y;
            return pt.matrixTransform(xform.inverse());
        }
    }

    //zoom feature

    /**
     *  Bring back to the original zoom
     */
    function realZoom() {

        zoom(-scaleCounter);

        currentZoomIndex = 4;

        let pt = ctx.transformedPoint(0, 0);
        ctx.translate(pt.x, pt.y);

        redraw();
        fillSnap();
    }

    /**
     * Zoom in by the scale of 1
     */
    function zoomIn() {

        ctx.clearRect(-boundaryLimit * canvas.width, -boundaryLimit * canvas.height,
            boundaryLimit * canvas.width, boundaryLimit * canvas.height);
        if (currentZoomIndex == lastZoomIndex) {
            return;
        }
        zoom(+(zoomArray[currentZoomIndex] + zoomArray[++currentZoomIndex]));
    }

    /**
     * Zoom out by the scale of 1
     */
    function zoomOut() {

        ctx.clearRect(-boundaryLimit * canvas.width, -boundaryLimit * canvas.height, boundaryLimit * canvas.width, boundaryLimit * canvas.height);

        if (!currentZoomIndex)
            return;
        zoom(-(zoomArray[currentZoomIndex] + zoomArray[--currentZoomIndex]));
    }

    /**
     * Toggle the snap to grid checkbox based on the condition
     */
    function snapToGrid() {

        fillSnap();

        snapGrid = !snapGrid;
        snapCounter != snapCounter;
    }

    /**
     *  Fill the snap value there
     */
    function fillSnap() {

        let index = 0;

        snapArray = [];

        let snaparray;

        let pt = {
            x: 0,
            y: 40
        }

        let can = {
            x: canvas.width + 1000,
            y: canvas.height,
        }

        for (var x = pt.x; x <= can.x; x += pt.y / (range)) {
            snaparray = [];
            for (var y = pt.x; y <= can.y; y += pt.y / (range)) {

                //here the changes made.. you can take it to normal
                let qr = ctx.transformedPoint(x, y);
                snaparray.push({
                    x: qr.x,
                    y: qr.y
                })
                // snaparray.push({
                //     x: x,
                //     y: y
                // })
            }
            snapArray[index] = snaparray;
            index++;
        }

        snapArray = transpose(snapArray);
        grid != grid;
    }

    /**
     *  Snap the grid according to the range value
     */
    function rangeSlider() {

        range = document.getElementById('range').value;
        range *= 1;
        snapArray = [];

        // radius -= (range * 0.2);
        // radius = 3.75 - (range * 0.1);
        fillSnap();

        grid = false;
    }

    /**
     *  load the json --TODO 
     * @param {*} callback 
     */
    function fetchJSONFile(path, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (callback) callback(data);
                }
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    }

    /**
     * This will start snapping the grids to the corresponding grid
     * points.
     */
    function startSnapping() {

        pt = ctx.transformedPoint(mouse.x, mouse.y);

        currX = pt.x;
        currY = pt.y;

        for (let i = 0; i < snapArray.length - 1; ++i) {
            for (let index = 0; index < snapArray[i].length - 1; ++index) {

                if (currX >= snapArray[i][index].x && currX <= snapArray[i][index + 1].x &&
                    currY >= snapArray[i][index].y && currY <= snapArray[i + 1][index].y
                ) {

                    //identify x axis::
                    if ((snapArray[i][index].x + snapArray[i][index + 1].x) / 2 >= currX) {

                        pt.x = snapArray[i][index].x;
                    } else {
                        pt.x = snapArray[i][index + 1].x;
                    }

                    //identify y-> axis
                    if ((snapArray[i][index].y + snapArray[i + 1][index].y) / 2 >= currY) {
                        pt.y = snapArray[i][index].y;
                    } else {
                        pt.y = snapArray[i + 1][index].y;
                    }
                }
            }
        }
        return pt;
    }

    /**
     *  Transform the grid point according to the zoom level  -- TODO may require in future versions.
     */
    function transformGridPoint() {
        for (let i = 0; i < snapArray.length; ++i) {
            for (let index = 0; index < snapArray[i].length; ++index) {
                snapArray[i][index] = ctx.transformedPoint(snapArray[i][index].x, snapArray[i][index].y);
            }
        }
    }

    /**
     * Toggle between show and hide
     * @param {*} hideBtn    the button which  is not active
     */
    function showAndHideBtn(displayBtn, hideBtn) {

        document.getElementById(displayBtn).style.display = "inline";
        document.getElementById(hideBtn).style.display = "none";
    }

    /**
     *  Get the transpose of a 2D matrix in order to get 
     *  the coordinates.
     * 
     * @param {array} matrix is the matrixr which you wants to transform .
     */
    function transpose(matrix) {
        const rows = matrix.length,
            cols = matrix[0].length;
        const grid = [];
        for (let j = 0; j < cols; j++) {
            grid[j] = Array(rows);
        }
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[j][i] = matrix[i][j];
            }
        }
        return grid;
    }


    //svg 

    /**
     * Export the element as Svg
     */
    function exportAsSvg() {

        exportEachSvg();
    }

    /**
     * Export each svg element by drawing them again 
     * 
     */

    function exportEachSvg() {

        document.getElementById('svg').innerHTML = "";

        var draw = SVG('svg').size(canvas.width, canvas.height);

        var base64 = getBase64Image(gkhead);

        //draw image
        if (showBackground) {
            drawImageInSvg(draw, base64);
        }

        //draw Sections
        drawSectionsInSvg(draw);

        //draw seats from here
        drawSeatInSvg(draw);

        //change view box
        if (!showBackground) {
            changeViewBox(draw);
        }

        //save file here
        saveFile(draw.svg(), "svg.svg");
    }

    /**
     * Draw the images in svg
     * 
     * @param {*} draw 
     * @param {*} base64 
     */
    function drawImageInSvg(draw, base64) {
        draw.image(base64, canvas.width, canvas.height);
    }

    /**
     * Draw the Sections in svg 
     * 
     * @param {*} draw 
     */
    function drawSectionsInSvg(draw) {

        for (let index = 0; index < sectionComponent.length; ++index) {

            let coordinates = sectionComponent[index].coordinates;

            //two d coordinates will be here..
            let polyArray = [];

            for (let j = 0; j < coordinates.length - 1; ++j) {
                let twod = [];
                // draw.line(coordinates[j].x, coordinates[j].y, coordinates[j + 1].x, coordinates[j + 1].y).
                //stroke({ width: lineWidth, color: sectionComponent[index].strokeColor });
                twod.push(coordinates[j].x);
                twod.push(coordinates[j].y);

                polyArray[j] = twod;
            }
            draw.polygon(polyArray).fill({ color: sectionComponent[index].bgColor, opacity: sectionComponent[index].opacity }).
                stroke({ width: lineWidth, color: sectionComponent[index].strokeColor });

            //display the text here.

            // let text = draw.text(sectionComponent[index].Sections.name);
            // text.move(sectionComponent[index].centroidOfAPolygon().x - 15, sectionComponent[index].centroidOfAPolygon().y - 15).
            //font({ fill: '#000', size: sectionComponent[index].lineWidth + 5, opacity: sectionComponent[index].opacity });
            // text.font({ fill: '#f06', family: 'Inconsolata' })
        }
    }

    /**
     * Draw the seats in Sv
     * 
     * @param {*} draw 
     */
    function drawSeatInSvg(draw) {
        for (let index = 0; index < seatComponent.length; ++index) {

            // let point = ctx.transformedPoint(0, seatComponent[index].radius);
            let coordinates = seatComponent[index].coordinates;
            // let circle = draw.circle(seatComponent[index].radius * 1.6);
            let circle = draw.circle(radius * 2);

            circle.fill(seatComponent[index].seats.color).move(coordinates[0].x, coordinates[0].y);
        }
    }

    /**
     * Dynamically change the view box here.
     * 
     * @param {*} draw  
     */
    function changeViewBox(draw) {

        draw.viewbox();
        var trans1 = ctx.transformedPoint(0, 0);
        var trans2 = ctx.transformedPoint(canvas.width, canvas.height);
        draw.viewbox(trans1.x, trans1.y, trans2.x - trans1.x, trans2.y - trans1.y);
    }

    /**
     * saveFile downloads the file, provides export functions
     * 
     * @param {*} newData   the information to save
     * @param {*} fileName  is the name of the file
     */
    function saveFile(newData, fileName) {
        // const file = JSON.stringify(newData).replace("'\'", "");

        let data = encode(newData);
        let blob = new Blob([data], {
            type: 'application/octet-stream' //arbitar binary data
        });

        let url = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    }

    /**
     * Get the base64 of the images... 
     * 
     * @param {} img is the image you want to draw.
     */
    function getBase64Image(img) {

        var canvas1 = document.createElement("canvas");
        canvas1.width = 2 * canvas.width;
        canvas1.height = 2 * canvas.height;
        var ctx1 = canvas1.getContext("2d");

        let bg = new Background();
        // var ctx1 = ctx;
        bg.draw(ctx1, img, canvas1);

        ctx.drawImage(img, 0, 0); //not required

        // return canvas.toDataURL("image/png"); 
        return canvas1.toDataURL('image/png');
    }

    //Select Feature

    /**
     * Take you to the select mode.
     * You can drag the canvas.
     */
    function select() {

        newSeat = false;

        selector = { type: 'selector', level: 'NA', action: '' };

        seatRowComponent = sharedComponent.updateRowComponent(seatRowComponent, matrixRowComponent);
        seatRowComponent = refineModule.refineRowComponent(seatRowComponent);

        collection.hideNode();
        sectionComponent = refineModule.refinePolygonComponent(sectionComponent);
        polyShapeComponent = refineModule.refinePolygonComponent(polyShapeComponent);

        rectangleArray = [];
        seatCategory = null;
    }

    /**
     * Select the Node 
     */
    function selectNode() {

        selector = { type: 'node', level: 'node', action: '' };
        canvas.style.cursor = "pointer";
        currentObject = null;

        refiningSelectedComponent();
    }

    /**
     * Selects the object for the node
     * Currently polygon.
     */
    function nodeSelector() {

        selectTypesOfNode();

        let point = ctx.transformedPoint(currX, currY);

        if (
            (object = polyModule.findPolygonForThePoint(polyShapeComponent, point)) ||
            (object = polyModule.findPolygonForThePoint(sectionComponent, point))
        ) {

            selector.level = "polygon";
        }
        else if ((object = polyModule.findPolygonForThePoint(rectShapeComponent, point))) {
            selector.level = "rectangle";
        }
        else if ((object = ellipseModule.findEllipseForThePoint(ellipseShapeComponent, point))) {
            selector.level = "ellipse";
        }

        if (object) {
            collection.hideNode(); //TODO current Object wiil be fine here
            object.setEnableNode();
            currentObject = object;
        }
    }

    /**
     * Select the type of nodes
     */
    function selectTypesOfNode() {
        switch (selector.level) {
            case 'polygon': polygonNodeSelector();
                break;
        }
    }

    /**
     * Handles node selection for polygon
     */
    function polygonNodeSelector() {
        if (currentObject && currentObject.showTentativeNode) {
            let pt = { x: currX, y: currY };
            currentObject.nodeObject.addNode(pt);
        }
    }

    /**
     * choose a particular seat
     */
    function chooseSeat() {
        newSeat = true;
        refiningSelectedComponent();

        seatRowComponent = sharedComponent.updateRowComponent(seatRowComponent, matrixRowComponent);
        seatComponent = sharedComponent.updateSeatComponent(seatRowComponent, matrixRowComponent);

        matrixRowComponent = [];

        selector = { type: 'seat', level: 'NA', action: '' };
    }

    /**
     * It Selects the object.
     */
    function selectObject() {

        pt = ctx.transformedPoint(currX, currY);

        if (polyModule.isInsidePolygon(rectangleArray, rectangleArray.length, pt)) {

            if (currentObject) {
                currentObject.rectangle = true;
            }

            return;
        }

        if (selector.level == "matrix") {
            return;
        }

        rectangleArray = [];
        currentObject = conditionForSelectionOfObject();

        if (!currentObject) {
            currentMatrixRow = null;

            handleParentCornerForMatrix(false);

            helperModule.selectDeleteIcon(false);
            helperModule.showInspector('chart-inspector');
            listModule.createList('chart-column-catg');
            listModule.setType('chart', seatCategory);
        }
    }

    /**
     * It handles the condition for selection of object
     */
    function conditionForSelectionOfObject() {
        let object = null;
        let point = ctx.transformedPoint(currX, currY);

        if (selector.drag || selector.rotate) {  //To handle the matrix point basically
            return;
        }

        //TODO - solve according to hit test cases here

        let tempComponent = sharedComponent.getFilteredComponentforSelection(sectionSelection, currentSectionObject);

        if (object = polyModule.findPolygonForThePoint(tempComponent['row'], { x: currX, y: currY })) {
            selectRows(object);
        }
        else if (object = polyModule.findPolygonForThePoint(tempComponent['text'], point)) {
            selectText(object);
        }
        else if (object = polyModule.findPolygonForThePoint(tempComponent['media'], point)) {
            selectMedia(object);
        }
        else if (object = polyModule.findPolygonForThePoint(tempComponent['rectangle'], point)) {
            selectRectShape(object);
        }
        else if (object = polyModule.findPolygonForThePoint(tempComponent['polygon'], point)) {
            selectPolyShape(object);
        }
        else if (object = ellipseModule.findEllipseForThePoint(tempComponent['ellipse'], point)) {
            selectEllipseShape(object);
        }
        else if (!sectionSelection && (object = polyModule.findPolygonForThePoint(tempComponent['section'], point))) {
            selectSection(object);
        }

        return object;
    }

    /**
     * It selects the section 
     * 
     * @param {"*"} object 
     */
    function selectSection(object) {

        object.rectangleCord = polyModule.findEnclosingRectangleCoordinate(object.coordinates);
        rectangleArray = polyModule.findAllCoordinatesOfARectangle(object.rectangleCord);

        object.rectangle = true;

        sectionInspector.setSectionObject(object);
        helperModule.handleSectionInspector(object);
        toolModule.storeSelection(object, sectionComponent, 'section');
        helperModule.selectDeleteIcon(true);
        currentObject = object;

        selector.level = "section";
    }

    /**
     * It select the rows 
     */
    function selectRows(object) {

        currentObject = object;
        object.rectangle = true;

        seatRowComponent = sharedComponent.updateRowComponent(seatRowComponent, matrixRowComponent);
        rectangleArray = polyModule.findAllCoordinatesOfARectangle(object.rectCordinates);
        matrixRowComponent = [];

        rowInspector.setRowObject(object);
        toolModule.storeSelection(currentObject, seatRowComponent, 'row');
        helperModule.selectDeleteIcon(true);
        selector.level = "row";
    }

    /**
     * Select the seat 
     * TODO - remove seat component update from here
     */
    function selectSeat() {

        if (seatCategory && seatCategory.tempSeat.length) {
            return;
        }
        currentSeat = null;

        for (let index = 0; index < seatComponent.length; ++index) {
            if (seatComponent[index].hitTest(ctx, mouse.x, mouse.y)) {
                currentSeat = seatComponent[index];
                seatCategory = null;
                canvas.style.cursor = 'pointer';
                currentSeat.select = true;
                toolModule.storeSelection(currentSeat, seatComponent, 'seat');
                seatInspector.setSeatObject(seatComponent[index]);
            }
            else {
                seatComponent[index].select = false;
            }
        }
    }

    /**
     * Select the text
     */
    function selectText(object) {
        currentObject = object;
        currentObject.rectangle = true;
        rectangleArray = polyModule.findAllCoordinatesOfARectangle(currentObject.rectCordinates);

        textInspector.setTextObject(object);
        toolModule.storeSelection(currentObject, textComponent, 'text');
        helperModule.selectDeleteIcon(true);
        selector.level = "text";
    }

    /**
     * Select Media
     * 
     * @param {*} object is the current object
     */
    function selectMedia(object) {
        currentObject = object;
        currentObject.rectangle = true;
        rectangleArray = polyModule.findAllCoordinatesOfARectangle(currentObject.rectCordinates);

        mediaInspector.setMediaObject(object);
        toolModule.storeSelection(currentObject, mediaComponent, 'media');
        helperModule.selectDeleteIcon(true);
        selector.level = "media";
    }

    /**
     * Select Rect shape 
     * 
     * @param {*} object is the current object
     */
    function selectRectShape(object) {
        currentObject = object;
        currentObject.rectangle = true;
        rectangleArray = currentObject.coordinates;

        //rectShapeInspector.setRectShapeObject(object);
        rectangleInspector.setRectangleObject(object);
        toolModule.storeSelection(currentObject, rectShapeComponent, 'rectangle');
        helperModule.selectDeleteIcon(true);
        selector.level = "rectangle";
    }

    /**
     * Select the poly shape 
     * 
     * @param {*} object 
     */
    function selectPolyShape(object) {
        currentObject = object;
        currentObject.rectangle = true;
        rectangleArray = currentObject.coordinates; //will be enclose rectangle instead here

        polygonInspector.setPolygonObject(object);
        toolModule.storeSelection(currentObject, polyShapeComponent, 'polygon');
        helperModule.selectDeleteIcon(true);
        selector.level = "polygon";
    }

    /**
     * Select the ellipse object 
     * 
     * @param {*} object 
     */
    function selectEllipseShape(object) {
        currentObject = object;
        currentObject.rectangle = true;
        rectangleArray = currentObject.coordinates;

        ellipseInspector.setEllipseObject(object);
        toolModule.storeSelection(currentObject, ellipseShapeComponent, 'ellipse');
        helperModule.selectDeleteIcon(true);
        selector.level = "ellipse";
    }

    //Delete featur

    /**
     * It deletes the selected object
     */
    function deleteObject(component, type) {

        if (sectionSelection && type == "section") {
            return;
        }

        switch (type) {
            case 'section': sectionComponent = deleteModule.deleteSection(component, seatBtnArray);
                break;
            case 'row': seatRowComponent = deleteModule.deleteRow(component);
                break;
            case 'matrix': seatRowComponent = deleteModule.deleteMatrix(component);
                matrixRowComponent = [];
                break;
            case 'seat': seatComponent = deleteModule.deleteSeat(component);
                break;
            case 'text': textComponent = deleteModule.deleteText(component);
                break;
            case 'media': mediaComponent = deleteModule.deleteMedia(component);
                break;
            case 'rectangle': rectShapeComponent = deleteModule.deleteRectangle(component);
                break;
            case 'ellipse': ellipseShapeComponent = deleteModule.deleteEllipse(component);
                break;
            case 'polygon': polyShapeComponent = deleteModule.deletePolygon(component);
                break;
        }
        helperModule.selectDeleteIcon(false);
        helperModule.showInspector('chart-inspector');
        listModule.setType('chart', seatCategory);
        listModule.createList('chart-column-catg');
        rectangleArray = [];
        mainModule.updateChart();
    }

    /**
     * Update multi seat Colot
     * TODO - remove from here
     */
    function updateMultiSeatColor(name, color) {
        seatCategory.updateSeatColor(name, color);
    }

    /**
     * Upload the background image
     * 
     * @param {*} event is the mouse event
     */
    function uploadBackgroundImage(event) {
        event.preventDefault();
    }

    /**
     * Get the component list
     */
    function getComponent() {

        return {
            'section': sectionComponent,
            'row': seatRowComponent,
            'matrix': matrixRowComponent,
            'text': textComponent,
            'media': mediaComponent,
            'rectangle': rectShapeComponent,
            'ellipse': ellipseShapeComponent,
            'polygon': polyShapeComponent
        }
    }

    /**
     * Set the component
     * 
     * @param {*} component is the collection of component
     */
    function setComponent(component) {
        sectionComponent = component['section'];
        seatRowComponent = component['row'];
        textComponent = component['text'];
        mediaComponent = component['media'];
        rectShapeComponent = component['rectangle'];
        ellipseShapeComponent = component['ellipse'];
        polyShapeComponent = component['polygon'];
    }

    /**
     * Set the selector value after operation here
     * 
     * @param {*} selector 
     */
    function setSelector(selector) {
        selector = selector;

        // if(selector.type=="selector"){
        //     updateRectangleArray(selector.level);
        // }
    }

    /**
     * Set the canvas
     * 
     * @param {*} canvas 
     */
    function setCanvas(canvas) {
        canvas = canvas;
    }

    /**
     * Refining selected component
     */
    function refiningSelectedComponent() {

        collection.hideSelection();
        collection.hideNode();

        sectionComponent = refineModule.refinePolygonComponent(sectionComponent);
        polyShapeComponent = refineModule.refinePolygonComponent(polyShapeComponent);
        seatRowComponent = refineModule.refineRowComponent(seatRowComponent);
    }


    /**
     * Handle whether you want to show the parent corner or not
     * TODO - remove from here
     */
    function handleParentCornerForMatrix(display) {
        for (let index = 0; index < seatRowComponent.length; ++index) {
            seatRowComponent[index].parentCorner = display;
        }
    }

    /**
     * handle category 
     * 
     * @param {*} type  is the type 
     * @param {*} name  is the name
     * @param {*} color is the color
     * 
     * TODO - discussion on type of object
     */
    function handleCategory(type, name, color) {
        switch (type) {
            case 'section': currentObject.setCategory(name, color);
                break;
            case 'seat': seatInspector.setSeatColor(color, name);
                break;
            case 'multi-seat': updateMultiSeatColor(name, color);
                break;
            case 'row': currentObject.setSeatCategory(name, color);
                break;
            case 'matrix': currentMatrixRow.setCategory(name, color);
                break;
        }
    }

    /**
     * Get the current factor
     */
    function getCurrentFactor() {
        let fac = 1;

        //TODO -- need to improve this with reference to power multiplication
        for (let index = 4; index <= currentZoomIndex; ++index) {
            fac *= factorArray[index];
        }
        for (let index = 0; index < 4; ++index) {
            fac /= factorArray[index];
        }

        return fac;
    }

    //TODO -- rectangle handler update to be handled herer

    function exitSectionOrChart() {

        mainModule.updateChart();
        if (sectionSelection) {
            sectionSelection = false;
            changeColorOnSectionSelection(false);
            helperModule.displayBlock(seatBtnArray, 'none');
            document.getElementById('section-div').style.display = "block";

            helperModule.showAndHideExitBtn("none", "block");

            toolModule.select();

            if (currentObject) {
                currentObject.rectangle = false;
                currentObject = null;
                rectangleArray = [];
            }
        }
        else {
            //exit chart here
            //close the chart
            window.location.assign('list.html');
        }
    }

    /**
     * Remove the last component
     */
    function removeLastComponent(type) {
        switch (type) {
            case 'section': sectionComponent.pop();
                break;
            case 'row': seatRowComponent.pop();
                break;
            case 'text': textComponent.pop();
                break;
            case 'rectangle': rectShapeComponent.pop();
                break;
            case 'ellipse': ellipseShapeComponent.pop();
                break;
            case 'polygon': polyShapeComponent.pop();
                break;
            case 'media': mediaComponent.pop();
                break;
        }
    }

    /**
     * update the rectangle array
     * when dragging the component
     * when scaling media component
     * when changing width and height of the component
     * when dealing with node tool of polygon and rectangle
     * 
     * @param {*} type is the component typr
     */
    function updateRectangleArray(value) {
        rectangleArray = value;
    }

    /**
     * Get Rows config
     */
    function getComponentConfig() {

        return {
            'seat-radius': radius,
            'seat-spacing': seatSpacing,
            'row-spacing': rowSpacing,
            'font-size': fontSize,
            'media-scale': scale,
            'current-factor': getCurrentFactor()
        }
    }

    /**
     * Set Component configuration
     * 
     * @param {*} type is the type fof the configuration
     */
    function setComponentConfig(type, value, selection = null) {

        let fac = getCurrentFactor();
        value /= fac;

        switch (type) {
            case 'seat-radius': radius = value;
                break;
            case 'seat-spacing': seatSpacing = value;
                break;
            case 'row-spacing': rowSpacing = value;
                break;
            case 'font-size': fontSize = value;
                break;
            case 'media-scale': scale = value;
                break;
        }

        if (selection) {
            selectConfigType(selection);
        }
    }

    /**
     * Pop out the previous component 
     * And call for the new component
     * 
     * @param {*} type 
     */
    function selectConfigType(type) {
        removeLastComponent(type);
        switch (type) {
            case 'row': addSeatRows();
                break;
            case 'matrix': addMatrixOfRows();
                break;
        }
    }

    /** 
     *   Method which can be accessed outside this function.
     */
    return {
        initialise: initialise,
        addSection: addSection,
        addSeatRows: addSeatRows,
        addMatrixOfRows: addMatrixOfRows,
        addText: addText,
        toggleBackground: toggleBackground,
        zoomIn: zoomIn,
        zoomOut: zoomOut,
        realZoom: realZoom,
        saveAsJson: saveAsJson,
        selectSection: selectSection,
        uploadImage: uploadImage,
        snapToGrid: snapToGrid,
        rangeSlider: rangeSlider,
        exportAsSvg: exportAsSvg,
        select: select,
        selectNode: selectNode,
        selectObject: selectObject,
        deleteObject: deleteObject,
        chooseSeat: chooseSeat,
        updateMultiSeatColor: updateMultiSeatColor,
        addRectShape: addRectShape,
        addEllipseShape: addEllipseShape,
        addPolyShape: addPolyShape,
        addImage: addImage,
        gkhead: gkhead,
        updateChartFromJson: updateChartFromJson,
        updateChart: updateChart,
        uploadBackgroundImage: uploadBackgroundImage,
        getComponent: getComponent,
        setComponent: setComponent,
        handleMatrixOnMouseUp: handleMatrixOnMouseUp,
        setSelector: setSelector,
        modifyRowOnMouseUp: modifyRowOnMouseUp,
        modifyMatrixOnMouseUp: modifyMatrixOnMouseUp,
        handleSeatOnMouseUp: handleSeatOnMouseUp,
        rectShapeOnMouseUp: rectShapeOnMouseUp,
        ellipseShapeOnMouseUp: ellipseShapeOnMouseUp,
        setCanvas: setCanvas,
        sectionCreatorOnMouseMove: sectionCreatorOnMouseMove,
        creatorOnMouseMove: creatorOnMouseMove,
        seatOnMouseMove: seatOnMouseMove,
        handleRowsOnMouseMove: handleRowsOnMouseMove,
        handleMatrixOnMouseMove: handleMatrixOnMouseMove,
        sectionDragOnMouseDown: sectionDragOnMouseDown,
        modifyRowOnMouseDown: modifyRowOnMouseDown,
        rowDragOnMouseDown: rowDragOnMouseDown,
        modifyMatrixOnMouseDown: modifyMatrixOnMouseDown,
        matrixDragOnMouseDown: matrixDragOnMouseDown,
        textDragOnMouseDown: textDragOnMouseDown,
        mediaDragOnMouseDown: mediaDragOnMouseDown,
        rectShapeDragOnMouseDown: rectShapeDragOnMouseDown,
        ellipseShapeDragOnMouseDown: ellipseShapeDragOnMouseDown,
        polyShapeDragOnMouseDown: polyShapeDragOnMouseDown,
        seatOnMouseDown: seatOnMouseDown,
        handleMatrixOnMouseDown: handleMatrixOnMouseDown,
        addRectangleObject: addRectangleObject,
        addEllipseObject: addEllipseObject,
        addPolygonObject: addPolygonObject,
        addSectionObject: addSectionObject,
        selectSeat: selectSeat,
        addTextObject: addTextObject,
        addMediaObject: addMediaObject,
        checkRowsPoint: checkRowsPoint,
        checkMatrixPoint: checkMatrixPoint,
        updateSelectedObject: updateSelectedObject,
        isInsideRectangle: isInsideRectangle,
        nodeSelector: nodeSelector,
        handleCategory: handleCategory,
        exitSectionOrChart: exitSectionOrChart,
        removeLastComponent: removeLastComponent,
        getComponentConfig: getComponentConfig,
        setComponentConfig: setComponentConfig,
        updateRectangleArray: updateRectangleArray
    }
})();