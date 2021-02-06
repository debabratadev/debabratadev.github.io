/**
 * Handles node operation for polygon shape/section component
 * 
 * @param {*} component is polygonshape/section component
 */
function Node(component) {

    this.object = component;

    //TODO - removing the redudant material and placiang it here for the refactor. ( Polygon and section )

    /**
     * Draw the tentative node points   --TODO look for generic point module
     */
    this.drawTentativeNode = function () {
        if (this.nodeHitTest(this.object.tentativeMousePoint) != -1 || this.object.nodeDrag) {
            return;
        }
        canvasModule.drawPointForRotation(this.object.ctx, this.object.tentativeNode, this.object.lineWidth);
    }

    /**
     * Handles the hit test for node here
     * TODO - change the linewidth variable to the radius variable
     */
    this.nodeHitTest = function (point) {
        let length = this.object.coordinates.length;
        for (let index = 0; index < length; ++index) {
            let center = this.object.coordinates[index];
            if (canvasModule.pointHitTest(this.object.ctx, point, center, this.object.lineWidth * 20)) {
                return index;
            }
        }
        return -1;
    }

    /**
     * Draw the tentative node point here - will be moved to separate place in order to use it properly
     * TODO set the property here
     */
    this.setTentativeNodePoint = function (mousePoint) {

        // let mPoint = mousePoint;
        this.object.tentativeMousePoint = mousePoint;
        mousePoint = this.object.ctx.transformedPoint(this.object.tentativeMousePoint.x, this.object.tentativeMousePoint.y);

        let tolerance = this.object.lineWidth * 10;
        for (let index = 0; index < this.object.coordinates.length - 1; ++index) {
            let prev = this.object.coordinates[index];
            let next = this.object.coordinates[index + 1];

            if ((prev.x < next.x) && (mousePoint.x < prev.x || mousePoint.x > next.x)
                || ((prev.x > next.x) && (mousePoint.x > prev.x || mousePoint.x < next.x))
                || ((prev.y < next.y) && (mousePoint.y < prev.y || mousePoint.y > next.y))
                // || ((prev.y > next.y) && (mousePoint.y > prev.y || mousePoint.y < prev.y))
            ) {
                continue;
            }

            let line = { x0: prev.x, y0: prev.y, x1: next.x, y1: next.y };
            let linePoint = lineModule.linePointNearestMouse(line, mousePoint.x, mousePoint.y);
            let dx = mousePoint.x - linePoint.x;
            let dy = mousePoint.y - linePoint.y;
            let distance = Math.abs(Math.sqrt(dx * dx + dy * dy));  //Get the distance between two points

            if (distance < tolerance) {
                this.object.tentativeNode = linePoint;
                this.object.showTentativeNode = true;
                this.object.currIndex = this.nodeHitTest(this.object.tentativeMousePoint);    //TODO - handle this point here
                this.object.prevNodeIndex = index + 1;
                return;
            }
            this.object.showTentativeNode = false;
        }
    }

    /**
     * Draw the node point here  --TODO move to separate component for section
     */
    this.drawNodePoint = function () {

        let length = this.object.coordinates.length;
        this.object.currIndex = (this.object.currIndex == 0) ? length - 1 : this.object.currIndex;
        for (let index = 0; index < this.object.coordinates.length; ++index) {
            let point = this.object.coordinates[index];
            let color;
            if (this.object.currIndex == index || this.object.dragNodeIndex == index) {
                color = "#FF0000";
            }
            canvasModule.drawPointForRotation(this.object.ctx, point, this.object.lineWidth, color);
        }
    }

    /**
     * Add node to the polygon
     */
    this.addNode = function (point) {

        if (this.nodeHitTest(point) != -1) {
            return;
        }
        point = this.object.ctx.transformedPoint(point.x, point.y);

        this.object.coordinates.splice(this.object.prevNodeIndex, 0, point);
        this.object.handleCordinatesForLabel(this.object.percentage.x, this.object.percentage.y);
    }

    /**
     * Delete Node here
     */
    this.deleteNode = function (point) {

        let length = this.object.coordinates.length;

        if (length < 5) {
            return;
        }

        this.object.hitIndex = this.nodeHitTest(point);
        if (this.object.hitIndex != -1) {
            if ((this.object.hitIndex == 0) || (this.object.hitIndex == length - 1)) {
                this.object.coordinates.splice(0, 1);
                this.object.coordinates.splice(length - 2, 1);
                this.object.coordinates.push(this.object.coordinates[0]);
            } else {
                this.object.coordinates.splice(this.object.hitIndex, 1);
            }
            this.object.showTentativeNode = false;
            this.object.currIndex = -1;
        }

        this.object.handleCordinatesForLabel(this.object.percentage.x, this.object.percentage.y);
    }

    /**
     * Start the node drag 
     */
    this.startNodeDrag = function (point) {
        this.object.dragNodeIndex = this.nodeHitTest(point);
        this.object.nodeDrag = (this.object.dragNodeIndex != -1) ? true : false;
        let pt = this.object.ctx.transformedPoint(point.x, point.y);
        this.object.startX = pt.x;
        this.object.startY = pt.y;
    }

    /**
     * Node dragging
     */
    this.nodeDragging = function (point) {
        if (this.object.nodeDrag == false) {
            return;
        }

        let tempIndex = []
        let length = this.object.coordinates.length;
        if (this.object.dragNodeIndex == 0) {
            tempIndex.push(length - 1);
        }

        tempIndex.push(this.object.dragNodeIndex);

        for (let index = 0; index < tempIndex.length; ++index) {
            let nodeCord = this.object.coordinates[tempIndex[index]];
            this.object.coordinates[tempIndex[index]] = {
                x: nodeCord.x + point.x - this.object.startX,
                y: nodeCord.y + point.y - this.object.startY
            }
        }

        this.object.startX = point.x;
        this.object.startY = point.y;

        this.object.handleCordinatesForLabel(this.object.percentage.x, this.object.percentage.y);
    }

    /**
     * End node drag
     */
    this.endNodeDrag = function () {
        this.object.nodeDrag = false;
        this.object.dragNodeIndex = -1;
        //do nothing
    }


    //for ellipse and rectangle

    this.drawNodePointByNodeCordinate = function () {
        for (let index = 0; index < this.nodeCordinates.length; ++index) {

            let color;
            if (this.currIndex == index) {
                color = "#FF0000";
            }
            canvasModule.drawPointForRotation(this.ctx, this.nodeCordinates[index], this.lineWidth,color);
        }
    } 
}