/**
 * Handle the section component
 */
function Section() {

    this.ctx;
    this.seatColor = "#FFA500";     //Orange

    this.lineWidth = 5;
    this.hideBackground = true;
    this.coordinates = [];

    this.strokeColor = "#000000";

    this.opacity = 0.5;
    this.centroid;

    this.sectionComplete = false;

    //handel label from here
    this.label = false;

    this.name = "section";
    this.textAlign = "center";
    this.fontType = "Arial"

    this.labelSize = 10;
    this.labelX = 4;            //text position on x-axis
    this.labelY = 3;            //text position on y-axis
    this.labelPercent;
    this.labelRotation = 0;
    this.labelColor = "#000000";    //Black

    //category
    this.category = null;
    this.bgColor = "#FFFFFF";

    this.rectangle = false;

    this.rectCordinates = null;
    this.lowestX;
    this.lowestY;
    this.highestX;
    this.highestY;

    //Node operation
    this.nodeObject;
    this.showTentativeNode = false;
    this.nodeDrag = false;
    this.tentativeNode;
    this.dragNodeIndex = -1;
    this.enableNode = false;
    this.prevNodeIndex = -1;

    //For increasing or decreasing the percentage of the text
    this.widthInc = 1;
    this.heightInc = 1;
    this.centroid;
    this.percentage = { x: 0, y: 0 };

    // this.Section.name="section";

    //draw the canvas position here
    this.canvas;
    this.prevCursor;

    //For handling the dragging.
    this.startX;
    this.startY;
    this.drag = false;

    //For handling the rotation of the section
    this.rotate = false;
    this.rotatePoint;
    this.rotateFirstPoint;
    this.tempCordinate;
    this.tempFirstPoint;
    this.tempSecondPoint;
    this.tempRectCord;
    this.rotationAngle = 0;
    this.cordOfEnclosingRect;

    //Rotate object
    this.rotateObject;
    this.rotatePolygon;

    //create Polygon
    this.checkPoint;
    this.creation = true;
    this.currentPoint;
    this.startPoint;
    this.approx = 15;

    this.zIndex = 0;

    this.currentFactor;

    this.select = false;

    //Handle row component data
    this.seatRowComponent = [];
    this.polyShapeComponent = [];
    this.rectShapeComponent = [];
    this.ellipseShapeComponent = [];
    this.textComponent = [];
    this.mediaComponent = [];

    this.area = 0;

    /**
     * The main draw function which will run contineously
     */
    this.draw = function (ctx, lineWidth, canvas) {

        this.updateVariable(ctx, lineWidth, canvas);

        if (this.startPoint) {
            this.drawObject();
            this.handleState();
            this.handleRectangle();

            // if (this.showTentativeNode) {
            //     this.drawTentativeNode();
            // }

            if (this.showTentativeNode) {
                this.nodeObject.drawTentativeNode();
            }
        }
    }

    /**
     * Handle the state of the polygon here
     * processing and after creation 
     * scenario
     */
    this.handleState = function () {
        if (this.creation && this.mouse) {
            this.drawTentativeLine();
        } else {
            this.paintPolygon();

            if (this.label) {
                this.displaySectionName();
            }
        }
    }

    /**
     * Handle ther rotation process.
     */
    this.handleRectangle = function () {

        if (this.rectangle && !this.select) {
            this.drawEnclosingRectangle();
            sharedComponent.handleRotation(this);

            if (this.drag && !this.select) {
                sharedComponent.drawLineForSelection(this);
            }

            if (this.rotate) {
                sharedComponent.drawLineForRotation(this);
            }
        }
    }

    /**
     * To paint the polygon.
     */
    this.paintPolygon = function () {

        let fillColor;
        fillColor = this.select ? '#d3d3d3' : this.bgColor;
        canvasModule.paintPolygon(this.ctx, this.coordinates, fillColor, this.opacity);
        this.ctx.globalAlpha = 1;
    }

    /**
     * Set the rotation for the text here
     */
    this.setRotation = function (value) {
        this.labelRotation = circleModule.convertDegreeToRadian(value);
    }

    /**
     * Get the rotation for the text from here
     */
    this.getRotation = function () {
        return parseInt((this.labelRotation) * (180 / Math.PI));
    }

    /**
     *  It draws the section object and its components.
     */
    this.drawObject = function () {

        if (!this.sectionComplete) {
            this.drawPoint();
        }

        this.drawStraightLine();

        if (this.enableNode) {
            this.nodeObject.drawNodePoint();
        }
    }

    /**
     * Draw the point here
     */
    this.drawPoint = function () {
        let length = this.coordinates.length;
        for (let index = 0; index < length; ++index) {
            let point = this.coordinates[index];
            canvasModule.drawPoint(this.ctx, point.x, point.y, this.lineWidth / 2,
                this.lineWidth, '#000000', this.bgColor);
        }
    }

    /**
    * Draw polygon straight line here
    */
    this.drawStraightLine = function () {
        let length = this.coordinates.length;
        if (length < 2) {
            return;
        }
        let prev = this.coordinates[0];
        for (let index = 1; index < length; ++index) {
            let current = this.coordinates[index];
            let width = this.select ? this.lineWidth * 3 : this.lineWidth;
            canvasModule.drawStraightLine(this.ctx, this.strokeColor, prev, current, width, []);
            prev = current;
        }
    }

    /**
     * Update the variable 
     */
    this.updateVariable = function (ctx, lineWidth, canvas) {
        this.lineWidth = lineWidth / 2;
        this.ctx = ctx;
        this.canvas = canvas;
    }

    /**
     * This handles the background...
     */
    this.handleBackground = function () {

        this.opacity = this.hideBackground ? 0.2 : 0.5;
    }

    /**
     * It handles the drag and rotation functionality of a section
     */
    this.handleSelection = function () {

        if (this.rectangle) {
            this.drawEnclosingRectangle();
            sharedComponent.handleRotation(this);
        }
        if (this.drag) {
            sharedComponent.drawLineForSelection(this);
        }
    }

    /**
     * Draw the enclosing rectangle here
     */
    this.drawEnclosingRectangle = function () {

        if (!this.rotate) {
            this.updateRectCordinate();
        }
        canvasModule.drawEnclosingRectangle(this.ctx, this.rectCordinates,
            this.rotate, this.rotationAngle, this.centroid,
            this.lineWidth * 2, '#6BBEEE');
    }

    /**
     *  dispaly the Section name when the background is hidden
     */
    this.displaySectionName = function () {
        canvasModule.drawTextWithRotation(this);
    }

    /**
     *  return whether the point is inside or not.
     *  calls to the polyModule.
     */
    this.pointLiesInsideThePolygon = function (point) {

        return polyModule.isInsidePolygon(this.coordinates, this.coordinates.length, point);
    }

    /**
     *  Draw the tentative line,
     */
    this.drawTentativeLine = function () {
        canvasModule.drawStraightLine(this.ctx, '#FF0000', this.currentPoint, this.mouse, this.lineWidth, []);
    }

    /**
     * It update the x cordinate of label
     */
    this.updateXCordinateForLabel = function (percentage) {
        this.labelX = this.widthInc * percentage + this.centroid.x;
        this.percentage.x = percentage;
    }

    /**
     * It update the y cordiante of label
     */
    this.updateYCordinateForLabel = function (percentage) {
        this.labelY = this.heightInc * percentage + this.centroid.y;
        this.percentage.y = percentage;
    }

    /**
    * Gets the cordiante of label in percentage.
    */
    this.getCordinateForLabelInPercentage = function () {
        return {
            x: parseInt((this.labelX - this.centroid.x) / this.widthInc),
            y: parseInt((this.labelY - this.centroid.y) / this.heightInc)
        }
    }

    /**
     * update the label coordiantes.
     */
    this.updateCoordinatesForLabel = function () {
        sharedComponent.updateCoordinatesForLabel(this);
    }

    /**
     * Update the font size
     */
    this.updateFontSize = function (font) {
        // this.labelSize = font * this.widthInc;
        this.labelSize = font / this.currentFactor;
    }

    /**
     * Returnt the font size of the element
     */
    this.getFontSize = function () {

        // return parseInt(this.labelSize / this.widthInc);
        return parseInt(this.labelSize * this.currentFactor);
    }

    /**
     * Update the rectangle cordinate contineously
     */
    this.updateRectCordinate = function () {
        this.rectCordinates = polyModule.findEnclosingRectangleCoordinate(this.coordinates);
        let cord = polyModule.findAllCoordinatesOfARectangle(this.rectCordinates);
        this.centroid = polyModule.centroidOfAPolygon(cord);
    }

    //Create Polygon here

    /**
     * Create the polygon 
     */
    this.createPolygon = function (mouse, ctx) {

        this.checkPoint = mouse;

        if (!this.creation || this.checkExtremaPoints(mouse, ctx)) {
            return;
        }

        let pt = this.ctx.transformedPoint(mouse.x, mouse.y);
        this.currentPoint = pt;

        let nodes = this.coordinates.length;  //TODO -- handle double point for the same , good way is to handle through extrema
        if (nodes) {
            if (this.coordinates[nodes - 1].x == this.currentPoint.x && this.coordinates[nodes - 1].y == this.currentPoint.y) {
                return;
            }
        }
        this.coordinates.push({ x: pt.x, y: pt.y });
    }

    /**
     * Check the points and
     * assign them to the variable accordoing to that here
     */
    this.checkExtremaPoints = function (mouse, ctx) {
        if (!this.startPoint) {
            // this.startPoint = mouse;
            this.startPoint = { x: mouse.x, y: mouse.y };
            this.ctx = ctx;
        }
        else if (this.isEndPoint()) {
            this.creation = false;
            let pt = this.ctx.transformedPoint(this.startPoint.x, this.startPoint.y);
            this.coordinates.push({ x: pt.x, y: pt.y });
            this.sectionComplete = true;
            this.updateLabel();

            if (!this.componentArea()) {
                mainModule.removeLastComponent('section');
            }
            mainModule.updateChart();

            return true;
        }

        return false;
    }

    /**
     * update the label , after the creation of the object
     * set the initial position for the label here.  .TODO - Need to remove this
     */
    this.updateLabel = function () {
        sectionInspector.setSectionObject(this);
        helperModule.handleSectionInspector(this);
        this.handleCordinatesForLabel(0, 0);
        this.updateFontSize(10);
    }

    /**
     * It handles the coordinates for the label
     * It handles the fall case too
     */
    this.handleCordinatesForLabel = function (xpercent, ypercent) {

        this.updateCoordinatesForLabel();
        this.updateXCordinateForLabel(xpercent);
        this.updateYCordinateForLabel(ypercent);
    }

    /**
     * Handle the movement of the mouse
     * Drawinf of the tentative straight linw
     * 
     */
    this.moveMouse = function (mouse) {
        this.mouse = mouse;
    }

    /**
     * Is the end point found
     */
    this.isEndPoint = function () {

        return ((this.checkPoint.x >= (this.startPoint.x - this.approx)) && (this.checkPoint.x <= (this.startPoint.x + this.approx))) &&
            (this.checkPoint.y >= (this.startPoint.y - this.approx) && this.checkPoint.y <= (this.startPoint.y + this.approx));
    }

    /**
     * Starts the dragging of the sections.
     */
    this.startDrag = function (mouse) {

        if (this.select) {
            return;
        }
        this.dragObject = new Drag(this);
        this.dragObject.startDrag(mouse);

        this.updateChildComponent();

        this.startdragChildCollection(mouse);
    }

    /**
     * When the dragging has been started.
     */
    this.dragging = function (mouse) {

        if (this.select) {
            return;
        }
        this.updateCordinatesWhileDragging(mouse);

        this.rectCordinates = polyModule.findEnclosingRectangleCoordinate(this.coordinates);
        this.handleCordinatesForLabel(this.percentage.x, this.percentage.y);

        this.dragObject.dragging(mouse);

        this.draggingChildCollection(mouse);
    }

    /**
     * Update the coordinates while dragging
     */
    this.updateCordinatesWhileDragging = function (mouse) {
        for (let index = 0; index < this.coordinates.length; ++index) {
            this.coordinates[index].x += mouse.x - this.startX;
            this.coordinates[index].y += mouse.y - this.startY;
        }
    }

    /**
     * End the dragging.
     */
    this.endDrag = function (mouse, childElement) {
        if (this.select) {
            return;
        }
        this.dragObject.endDrag(mouse, childElement);

        this.endDragChildCollection(mouse);
    }

    //For handling the roation of the section, here

    /**
    * Check whether the rotation handler has been hit or not
    */
    this.hitTest = function (ctx, x, y) {

        return canvasModule.pointHitTest(ctx, { x: x, y: y }, this.rotatePoint, this.lineWidth * 10);
    }

    /**
     * Starts the drag for the rotation here
     */
    this.rotateStartDrag = function (mouse) {
        this.rotateObject = new Rotate(this);
        this.rotatePolygon = new RotatePolygon(this);

        this.rotatePolygon.storePolygonPoint();
        this.rotateObject.startRotate(mouse);
        this.initialAngle = this.labelRotation;
        this.tempLabel = { x: this.labelX, y: this.labelY };

        this.updateChildComponent();

        this.rotateStartChildCollection(mouse);
    }

    /**
     * Handles the dragging for rotation
     */
    this.rotateDragging = function (mouse) {
        this.rotateSection(mouse);
        this.rotatingChildCollection(mouse);
    }

    /**
     * It ends the dragging for the rotation.
     */
    this.rotateEndDrag = function (mouse) {
        this.rotateObject.endRotate(mouse);
        this.rotateEndChildCollection(mouse);
        this.percentage = this.getCordinateForLabelInPercentage();
        mainModule.updateChart();
    }

    /**
     * Rotates the section.
     */
    this.rotateSection = function (mouse) {
        this.rotatePolygon.rotatePolygonPoint();
        this.rotateObject.rotating(mouse);
        this.labelRotation = (this.initialAngle - this.rotationAngle);

        let point = pointModule.rotateAroundAnotherPoint(this.centroid, this.rotationAngle, this.tempLabel);
        this.labelX = point.x;  //TODO check whether the point lies inside the modules or not
        this.labelY = point.y;  //TODO check whether the point lies inside the modules or not
    }

    /**
     * Set the enable node here
     */
    this.setEnableNode = function () {
        this.enableNode = true;
        this.nodeObject = new Node(this);
    }

    /**
     * Set the category
     */
    this.setCategory = function (name, color) {
        this.category = name;
        this.bgColor = color;
    }

    /**
     * returns the category
     */
    this.getCategory = function () {
        return [{
            'name': this.category,
            'color': this.bgColor
        }]
    }

    /**
     * Select the section here
     */
    this.selectSection = function (value) {
        this.select = value;

        // let component = mainModule.getComponent();
        // this.seatRowComponent = this.filteringRowsComponent(component['row'])

        this.updateChildComponent();  //TODO better approach is to handle simply by component

        for (let index = 0; index < this.textComponent.length; ++index) {
            const text = this.textComponent[index];
            // text.parentDistanceX = 0;
            // text.parentDistanceY = 0;
        }
    }

    /**
     * Filtering the section rows
     * TODO remove to other modules
     */
    this.filteringRowsComponent = function (component) {
        let temp = [];
        for (let index = 0; index < component.length; ++index) {
            let object = component[index];
            if (object.parentSection == this) {
                temp.push(object);
            }
        }
        return temp;
    }

    /**
     * Get the component area for the section
     * 
     */
    this.componentArea = function () {
        return polyModule.findPolygonArea(this.coordinates);
    }

    /**
     * Update the child component //TODao remove to other class here
     */
    this.updateChildComponent = function () {
        let component = mainModule.getComponent();
        this.seatRowComponent = this.filteringRowsComponent(component['row']);
        this.polyShapeComponent = this.filteringRowsComponent(component['polygon']);
        this.rectShapeComponent = this.filteringRowsComponent(component['rectangle']);
        this.ellipseShapeComponent = this.filteringRowsComponent(component['ellipse']);
        this.textComponent = this.filteringRowsComponent(component['text']);
        this.mediaComponent = this.filteringRowsComponent(component['media']);
    }


    //drag operation for collection of child

    /**
     * Start Dragging for child collection
     */
    this.startdragChildCollection = function (mouse) {
        this.dragChild = new DragChild();
        this.dragChild.startDrag(this.seatRowComponent, mouse, 'row');
        this.dragChild.startDrag(this.polyShapeComponent, mouse, 'polygon');
        this.dragChild.startDrag(this.rectShapeComponent, mouse, 'rectangle');
        this.dragChild.startDrag(this.textComponent, mouse, 'text');
        this.dragChild.startDrag(this.mediaComponent, mouse, 'media');
        this.dragChild.startDrag(this.ellipseShapeComponent, mouse, 'ellipse');
    }

    /**
     * Draggging child collection
     */
    this.draggingChildCollection = function (mouse) {
        this.dragChild.dragging(this.seatRowComponent, mouse, 'row');
        this.dragChild.dragging(this.polyShapeComponent, mouse, 'polygon');
        this.dragChild.dragging(this.rectShapeComponent, mouse, 'rectangle');
        this.dragChild.dragging(this.textComponent, mouse, 'text');
        this.dragChild.dragging(this.mediaComponent, mouse, 'media');
        this.dragChild.dragging(this.ellipseShapeComponent, mouse, 'ellipse');
    }

    /**
     * End drag for chidl collection
     */
    this.endDragChildCollection = function (mouse) {
        this.dragChild.endDrag(this.seatRowComponent, mouse, 'row');
        this.dragChild.endDrag(this.polyShapeComponent, mouse, 'polygon');
        this.dragChild.endDrag(this.rectShapeComponent, mouse, 'rectangle');
        this.dragChild.endDrag(this.textComponent, mouse, 'text');
        this.dragChild.endDrag(this.mediaComponent, mouse, 'media');
        this.dragChild.endDrag(this.ellipseShapeComponent, mouse, 'ellipse');
    }

    //child rotation

    /**
     * Rotate start for child of section
     */
    this.rotateStartChildCollection = function (mouse) {
        this.rotateChild = new RotateChild();
        this.rotateChild.startRotate(this.seatRowComponent, mouse, 'row', this);
        this.rotateChild.startRotate(this.polyShapeComponent, mouse, 'polygon', this);
        this.rotateChild.startRotate(this.rectShapeComponent, mouse, 'rectangle', this);
        this.rotateChild.startRotate(this.textComponent, mouse, 'text', this);
        this.rotateChild.startRotate(this.mediaComponent, mouse, 'media', this);
        this.rotateChild.startRotate(this.ellipseShapeComponent, mouse, 'media', this);
    }

    /**
     * Handles rotation for child of section
     */
    this.rotatingChildCollection = function (mouse) {

        this.rotateChild.rotating(this.seatRowComponent, mouse, "row", this);
        this.rotateChild.rotating(this.polyShapeComponent, mouse, "polygon", this);
        this.rotateChild.rotating(this.rectShapeComponent, mouse, 'rectangle', this);
        this.rotateChild.rotating(this.textComponent, mouse, 'text', this);
        this.rotateChild.rotating(this.mediaComponent, mouse, 'media', this);
        this.rotateChild.rotating(this.ellipseShapeComponent, mouse, 'ellipse', this);
    }

    /**
     * Handles end rotation for child collection
     */
    this.rotateEndChildCollection = function (mouse) {

        this.rotateChild.endRotate(this.seatRowComponent, mouse, "row", this);
        this.rotateChild.endRotate(this.polyShapeComponent, mouse, "polygon", this);
        this.rotateChild.endRotate(this.rectShapeComponent, mouse, 'rectangle', this);
        this.rotateChild.endRotate(this.textComponent, mouse, 'text', this);
        this.rotateChild.endRotate(this.mediaComponent, mouse, 'media', this);
        this.rotateChild.endRotate(this.ellipseShapeComponent, mouse, 'ellipse', this);

        //TODO - end drag has not been not handled for some of
    }
}