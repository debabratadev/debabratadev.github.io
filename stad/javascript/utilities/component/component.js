/**
 * Operation shared amoong subsequent component
 */
var sharedComponent = (function () {

    //Mouse Up

    /**
     * Handle the dragging of the component when the mouse is up
     */
    function componentDragOnMouseUp(component, mouse) {
        for (let index = 0; index < component.length; ++index) {    //TODO -- point transform to be done here.
            if (component[index].drag) {
                component[index].drag = false;
                component[index].endDrag(mouse);
            }
        }
    }

    /**
     * Handle rotating of component when mouse is up.
     */
    function componentRotateOnMouseUp(component, mouse) {
        for (let index = 0; index < component.length; ++index) {
            if (component[index].rotate) {
                component[index].rotate = false;
                component[index].rotateEndDrag(mouse);
            }
        }
    }

    //Mouse Move

    /**
     * Handles the component drag on mouse move
     * 
     * @param {*} component is the level array
     * @param {*} mouse     is the  mouse object
     * @param {*} canvas   
     * @param {*} ctx 
     */
    function componentDragOnMouseMove(component, mouse, canvas, ctx) {
        for (let index = 0; index < component.length; ++index) {
            if (component[index].drag) {
                canvas.style.cursor = 'move';
                mouse = ctx.transformedPoint(mouse.x, mouse.y);
                component[index].dragging(mouse);
                break;
            }
        }
    }

    /**
     * Rotate the component on mouse move
     * TODO -- handling rotation point issue
     * @param {*} component is the array of levels
     * @param {*} mouse     is the mouse object
     * @param {*} canvas    
     * @param {*} ctx 
     */
    function componentRotateOnMouseMove(component, mouse, canvas, ctx) {
        let found = false;
        for (let index = 0; index < component.length; index++) {

            if (component[index].rotatePoint && component[index].hitTest(ctx, mouse.x, mouse.y)) {
                canvas.style.cursor = 'grabbing';
            }
            if (component[index].rotate) {
                mouse = ctx.transformedPoint(mouse.x, mouse.y);
                component[index].rotateDragging(mouse);
                found = true;
                break;
            }
        }
        return found;
    }

    //Mouse Down

    /**
     * Drag the component on mouse move
     * 
     * @param {*} component is the array of the component  --TODO - will handle the test cases after approval
     */
    function componentDragOnMouseDown(component) {
        for (let index = 0; index < component.length; ++index) {
            component.drag = true;
            component.rotate = false;
        }
    }

    /**
     * Handle component rotation on mouse move
     * 
     * @param {*} component is the array of levels
     * @param {*} mouse     is the mouse object
     * @param {*} canvas 
     * @param {*} ctx 
     */
    function componentRotateOnMouseDown(component, mouse, canvas, ctx) {
        let found = false;
        for (let index = 0; index < component.length; ++index) {
            if (component[index].rotatePoint && component[index].hitTest(ctx, mouse.x, mouse.y)) {
                canvas.style.cursor = "grab";
                component[index].rotate = true;
                mouse = ctx.transformedPoint(mouse.x, mouse.y);
                component[index].rotateStartDrag(mouse);
                found = true;
            } else {
                component[index].rotate = false;
            }
        }
        return found;
    }

    //Cursor

    /**
     * Change component cursor on hit
     * 
     * @param {*} ctx 
     * @param {*} mouse 
     * @param {*} component 
     */
    function cursorOnHit(ctx, mouse, component) {
        for (let index = 0; index < component.length; index++) {
            if (component[index].rotatePoint && component[index].hitTest(ctx, mouse.x, mouse.y)) {
                canvas.style.cursor = 'grab';
            }
        }
    }

    /**
     * Delete the object from the component
     * 
     * @param {*} component is the array of the level 
     * @param {*} object    is the current object
     */
    function deleteComponent(component, object) {
        let temp = [];
        for (let index = 0; index < component.length; ++index) {
            if (object != component[index]) {
                temp.push(component[index]);
            }
        }
        return temp;
    }

    /**
     * Delete the child component for the section
     * 
     * @param {*} component is the component 
     * @param {*} sectionComponent is the section object
     */
    function deleteChildComponent(component,sectionComponent){

        let temp = [];
        for(let index=0;index<component.length;++index){
            let object = component[index];
            if(object.parentSection!==sectionComponent){
                temp.push(object);
            }
        }
        return temp;
    }

    /**
     * Hide the component rectangle
     * 
     * @param {*} component 
     */
    function hideRectangle(component) {
        for (let index = 0; index < component.length; ++index) {
            if (component[index].rectangle) {
                component[index].rectangle = false;
            }
        }
    }

    /**
     * Hide the component rectangle
     * 
     * @param {*} component 
     */
    function hideNode(component) {
        for (let index = 0; index < component.length; ++index) {
            if (component[index].enableNode) {
                component[index].enableNode = false;
                component[index].showTentativeNode = false;
            }
        }
    }

    /**
     * disble rotation
     * 
     * @param {*} component 
     */
    function disableRotation(component) {
        for (let index = 0; index < component.length; ++index) {
            if (component.rotate) {
                component.rotate = false;
            }
        }
    }

    /**
     * Update the seat component here
     * 
     * @param {*} rowComponent    is the row component
     * @param {*} matrixComponent is the matrix component
     */
    function updateSeatComponent(rowComponent, matrixComponent) {

        let seat = [];
        rowComponent.concat(getRowOfComponent(matrixComponent)); //TODO might not work here
        for (let index = 0; index < rowComponent.length; ++index) {
            seat = seat.concat(rowComponent[index].seatComponent);
        }
        return seat;
    }

    /**
     * Update the row component 
     * @param {*} rowComponent     is the collection of rows
     * @param {*} matrixComponent  is the collection of matrices
     */
    function updateRowComponent(rowComponent, matrixComponent) {
        return rowComponent.concat(getRowOfComponent(rowComponent, matrixComponent));
    }

    /**
     * Get the rows of the component   //Need to refactot this code properly
     * 
     * @param {*} component  is the component array
     */
    function getRowOfComponent(rowComponent, matrixComponent) {

        if (!matrixComponent || !rowComponent) {
            return;
        }

        let row = [];
        for (let index = 0; index < matrixComponent.length; ++index) {
            let matrix = matrixComponent[index];
            if(!matrix.rowComponent){
                return row;
            }
            for (let y = 0; y < matrix.rowComponent.length; ++y) {
                let found = false;
                for (let k = 0; k < rowComponent.length; ++k) {
                    if (rowComponent[k] === matrix.rowComponent[y]) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    row = row.concat(matrix.rowComponent[y]);
                }
            }
        }
        return row;
    }

    /**
     * Handle the rotation 
     */
    function handleRotation(object,rectCord) {
        if (object.rotate) {
            sharedComponent.drawObjectForRotation(object.ctx, object.rPoint1,
                object.rPoint2, object.lineWidth);
        }
        else {
            sharedComponent.drawRotationHandler(object,rectCord);
        }
    }

    /**
     * Draw the handler for rotation 
     * 
     * @param {*} object is the current object
     */
    function drawRotationHandler(object, cordinate) {
        if (typeof cordinate == "undefined") {
            cordinate = object.rectCordinates;
        }
        
        let point = pointModule.getRotationHandlerPoint(cordinate, object.lineWidth);

        object.rotateFirstPoint = point.lineFirstPoint;
        object.rotatePoint = object.tempSecondPoint = point.lineSecondPoint;

        sharedComponent.drawObjectForRotation(object.ctx, point.lineFirstPoint, point.lineSecondPoint, object.lineWidth);
    }

    /**
     * Draws the object for the rotation
     * 
     * @param {*} ctx               is the context
     * @param {*} lineFirstPoint    is the firstPoint
     * @param {*} lineSecondPoint   is the second Point
     * @param {*} lineWidth         is the lineWidth
     */
    function drawObjectForRotation(ctx, lineFirstPoint, lineSecondPoint, lineWidth) {
        canvasModule.drawStraightLine(ctx, "#6BBEEE", lineFirstPoint, lineSecondPoint, lineWidth, []);
        canvasModule.drawPointForRotation(ctx, lineSecondPoint, lineWidth);
    }

    /**
     * It draws line For selection
     */
    function drawLineForSelection(object) {
        drawVerticalLineForSelection(object, object.centroid, object.rectCordinates);
        drawHorizontalLineForSelection(object, object.centroid, object.rectCordinates);
    }

    /**
     * Draw vertical line for selection
     */
    function drawVerticalLineForSelection(object, midPoint, rectangleCord) {

        canvasModule.drawStraightLine(object.ctx, '#6BBEEE', { x: rectangleCord.lowestX, y: rectangleCord.lowestY },
            { x: rectangleCord.lowestX, y: -object.canvas.width * 10000 },
            object.lineWidth, []);

        canvasModule.drawStraightLine(object.ctx, '#6BBEEE', { x: rectangleCord.lowestX, y: rectangleCord.highestY },
            { x: rectangleCord.lowestX, y: object.canvas.width * 10000 },
            object.lineWidth, []);

        canvasModule.drawStraightLine(object.ctx, '#FF0000', { x: midPoint.x, y: -object.canvas.width * 10000 },
            { x: midPoint.x, y: object.canvas.width * 10000 },
            object.lineWidth, []);

        canvasModule.drawStraightLine(object.ctx, '#6BBEEE', { x: rectangleCord.highestX, y: rectangleCord.lowestY },
            { x: rectangleCord.highestX, y: -object.canvas.width * 10000 },
            object.lineWidth, []);

        canvasModule.drawStraightLine(object.ctx, '#6BBEEE', { x: rectangleCord.highestX, y: rectangleCord.highestY },
            { x: rectangleCord.highestX, y: object.canvas.width * 10000 },
            object.lineWidth, []);
    }

    /**
     * Draw Horizontal Line for selection
     * 
     * @param {*} object 
     * @param {*} midPoint 
     * @param {*} rectangleCord 
     */
    function drawHorizontalLineForSelection(object, midPoint, rectangleCord) {

        canvasModule.drawStraightLine(object.ctx, '#6BBEEE', { x: -object.canvas.width * 10000, y: rectangleCord.lowestY },
            { x: rectangleCord.lowestX, y: rectangleCord.lowestY },
            object.lineWidth, []);

        canvasModule.drawStraightLine(object.ctx, '#6BBEEE', { x: rectangleCord.highestX, y: rectangleCord.lowestY },
            { x: object.canvas.width * 10000, y: rectangleCord.lowestY },
            object.lineWidth, []);

        canvasModule.drawStraightLine(object.ctx, '#FF0000', { x: -object.canvas.width * 10000, y: midPoint.y },
            { x: 10000 * object.canvas.width, y: midPoint.y },
            object.lineWidth, []);

        canvasModule.drawStraightLine(object.ctx, '#6BBEEE', { x: -object.canvas.width * 10000, y: rectangleCord.highestY },
            { x: rectangleCord.lowestX, y: rectangleCord.highestY },
            object.lineWidth, []);

        canvasModule.drawStraightLine(object.ctx, '#6BBEEE', { x: rectangleCord.highestX, y: rectangleCord.highestY },
            { x: object.canvas.width * 10000, y: rectangleCord.highestY },
            object.lineWidth, []);
    }

    /**
     * Draw selection line for rotation
     * 
     * @param {*} object is the copmponent object
     */
    function drawLineForRotation(object) {

        let horizontalLinePoint = getHorizontalLineRotationPoint(object);
        let verticalLinePoint = getVerticalLineRotationPoint(object);

        drawSelectionLineForRotation(object, horizontalLinePoint);
        drawSelectionLineForRotation(object, verticalLinePoint);
    }

    /**
     * Draw the horizontal line for rotation
     * 
     * @param {*} object is rhe component object
     * @param {*} array contains horizontal line points
     */
    function drawSelectionLineForRotation(object, array) {

        for (let index = 0; index < array.length; index += 2) {

            let color = (index != 2) ? '#6BBEEE' : '#FF0000';
            canvasModule.drawStraightLine(object.ctx, color, { x: array[index].x, y: array[index].y },
                { x: array[index + 1].x, y: array[index + 1].y },
                object.lineWidth / 2, []);
        }
    }

    /**
     * Gets the horizontal line rotation points
     * 
     * @param {*} object is the component object
     */
    function getHorizontalLineRotationPoint(object) {

        let temp = [];

        temp.push({ x: object.rectCordinates.lowestX, y: -object.canvas.width * 1000 });
        temp.push({ x: object.rectCordinates.lowestX, y: object.canvas.width * 1000 });
        temp.push({ x: object.centroid.x, y: -object.canvas.width * 1000 });
        temp.push({ x: object.centroid.x, y: object.canvas.width * 1000 });
        temp.push({ x: object.rectCordinates.highestX, y: -object.canvas.width * 1000 });
        temp.push({ x: object.rectCordinates.highestX, y: object.canvas.width * 1000 });

        return pointModule.rotateArrayPoint(temp, object.centroid, object.rotationAngle);
    }

    /**
     * Returns the vertical line rotation point
     * 
     * @param {*} object is the component object
     */
    function getVerticalLineRotationPoint(object) {

        let temp = [];

        temp.push({ y: object.rectCordinates.lowestY, x: -object.canvas.width * 1000 });
        temp.push({ y: object.rectCordinates.lowestY, x: object.canvas.width * 1000 });
        temp.push({ y: object.centroid.y, x: -object.canvas.width * 1000 });
        temp.push({ y: object.centroid.y, x: object.canvas.width * 1000 });
        temp.push({ y: object.rectCordinates.highestY, x: -object.canvas.width * 1000 });
        temp.push({ y: object.rectCordinates.highestY, x: object.canvas.width * 1000 });

        return pointModule.rotateArrayPoint(temp, object.centroid, object.rotationAngle);
    }

    //handle text
     
    /**
     * Update coordinates for label
     * 
     * @param {*} object is the componen object
     */
    function updateCoordinatesForLabel(object){

        let rectanglePoints = polyModule.findEnclosingRectangleCoordinate(object.coordinates);
        let rectangleCord = polyModule.findAllCoordinatesOfARectangle(rectanglePoints);

        object.centroid = polyModule.centroidOfAPolygon(rectangleCord);

        let width = rectanglePoints.highestX - rectanglePoints.lowestX;
        let height = rectanglePoints.highestY - rectanglePoints.lowestY;

        object.widthInc = width / 100;
        object.heightInc = height / 100;
    }

    /**
     * Returns the count of categorised object count
     */
    function getCategorisedObjectCount(component,length){
        let catg=0;
        for(let index =0;index<length;++index){
            if(component[index].category){
                catg++;
            }
        }
        return catg;;
    }

    /**
     * Filter component according to relationship (parent/independent)
     * 
     * @param {*} parent        is whether parent is available or not
     * @param {*} parentObject  if parent is available then object of the parent
     */
    function getFilteredComponentforSelection(parent,parentObject){

        let tempComponent = mainModule.getComponent();
        if(parent){
            tempComponent['row'] = filterComponentWithRelation(tempComponent['row'],parentObject);
            tempComponent['text'] = filterComponentWithRelation(tempComponent['text'],parentObject);
            tempComponent['media'] = filterComponentWithRelation(tempComponent['media'],parentObject);
            tempComponent['rectangle'] = filterComponentWithRelation(tempComponent['rectangle'],parentObject);
            tempComponent['polygon'] = filterComponentWithRelation(tempComponent['polygon'],parentObject);
            tempComponent['ellipse'] = filterComponentWithRelation(tempComponent['ellipse'],parentObject);
        } else{
            tempComponent['row'] = filterComponentWithNoRelation(tempComponent['row']);
            tempComponent['text'] = filterComponentWithNoRelation(tempComponent['text']);
            tempComponent['media'] = filterComponentWithNoRelation(tempComponent['media']);
            tempComponent['rectangle'] = filterComponentWithNoRelation(tempComponent['rectangle']);
            tempComponent['polygon'] = filterComponentWithNoRelation(tempComponent['polygon']);
            tempComponent['ellipse'] = filterComponentWithNoRelation(tempComponent['ellipse']);
        }

        return tempComponent;
    }

    /**
     * Remove the child component from here
     */
    function filterComponentWithRelation(component,parent){
        let temp =[]
        for(let index = 0;index<component.length;++index){
            let object = component[index];
            if(object.parentSection == parent){
                temp.push(object);
            }
        }
        return temp;
    }

    /**
     * Filter the independent component here
     */
    function filterComponentWithNoRelation(component){
        let temp =[]
        for(let index = 0;index<component.length;++index){
            let object = component[index];
            if(!object.parentSection){
                temp.push(object);
            }
        }
        return temp;
    }

    return {
        componentDragOnMouseUp: componentDragOnMouseUp,
        componentRotateOnMouseUp: componentRotateOnMouseUp,
        componentDragOnMouseMove: componentDragOnMouseMove,
        componentRotateOnMouseMove: componentRotateOnMouseMove,
        componentDragOnMouseDown: componentDragOnMouseDown,
        componentRotateOnMouseDown: componentRotateOnMouseDown,
        deleteComponent: deleteComponent,
        updateSeatComponent: updateSeatComponent,
        getRowOfComponent: getRowOfComponent,
        updateRowComponent: updateRowComponent,
        drawObjectForRotation: drawObjectForRotation,
        disableRotation: disableRotation,
        hideRectangle: hideRectangle,
        cursorOnHit: cursorOnHit,
        drawLineForSelection: drawLineForSelection,
        drawLineForRotation: drawLineForRotation,
        drawRotationHandler: drawRotationHandler,
        handleRotation: handleRotation,
        hideNode:hideNode,
        updateCoordinatesForLabel:updateCoordinatesForLabel,
        getCategorisedObjectCount:getCategorisedObjectCount,
        deleteChildComponent:deleteChildComponent,
        getFilteredComponentforSelection:getFilteredComponentforSelection
    }
})();