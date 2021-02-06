/**
 * To handle the input click and drag
 * Functionality
 */
function ClickAndDrag() {

    this.id;
    this.drag = false;
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;

    /**
     * Handles the mouse down event
     */
    this.dragMouseDown = function (e) {

        e = e || window.event;
        e.preventDefault();

        this.pos3 = e.clientX;
        this.pos4 = e.clientY;

        this.drag = true;
    }

    /**
     * Handles the mouse drag event
     */
    this.elementDrag = function (e, inspType, type) {
        if (!this.drag) {
            return false;
        }

        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;

        // this.setSectionInput(e, type);
        this.inspectorType(e, inspType, type);

        this.pos3 = e.clientX;
        this.pos4 = e.clientY;

        return true;
    }

    /**
     * Check the type of inspector
     */
    this.inspectorType = function (e, insType, inputType) {

        switch (insType) {
            case 'section': this.setSectionInput(e, inputType);
                break;
            case 'row': this.setRowInput(e, inputType);
                break;
            case 'matrix': this.setMatrixInput(e, inputType);
                break;
            case 'chart':
                break;
            case 'seat':
                break;
            case 'text': this.setTextInput(e, inputType);
                break;
            case 'media': this.setMediaInput(e, inputType);
                break;
            case 'rectangle': this.setRectangleInput(e, inputType);
                break;
            case 'ellipse': this.setEllipseInput(e, inputType);
                break;
            case 'polygon': this.setPolygonInput(e, inputType);
                break;
            case 'row-config':this.setRowConfigInput(e,inputType);
                break;
            case 'matrix-config':this.setMatrixConfigInput(e,inputType);
                break;
        }

    }

    /**
     * It sets the input for the inspector
     */
    this.setSectionInput = function (e, type) {

        switch (type) {
            case 'section-font': this.id.value = this.positiveInput(e) + ' pt';
                sectionInspector.setFontSize();
                break;
            case 'section-rotation': this.id.value = this.rotationInput(e) + ' ' + String.fromCharCode(176);
                sectionInspector.setRotation();
                break;
            case 'section-label-x': this.id.value = this.handlePosition(e) + ' %';
                sectionInspector.setPositionX();
                break;
            case 'section-label-y': this.id.value = this.handlePosition(e) + ' %';
                sectionInspector.setPositionY();
                break;
        }
    }

    /**
     * It sets the row input.
     */
    this.setRowInput = function (e, inputType) {

        switch (inputType) {
            case 'row-curve': this.id.value = this.rotationInputForCurve(e) + ' ' + String.fromCharCode(176);
                rowInspector.setCurve();
                break;
            case 'row-space': this.id.value = this.positiveInput(e) + ' pt';
                rowInspector.setRowSpacing();
                break;
            case 'row-seat-space': this.id.value = this.positiveInput(e) + ' pt';
                rowInspector.setSeatSpacing();
                break;
            case 'row-seat-radius': this.id.value = this.positiveInput(e) + ' pt';
                rowInspector.setSeatRadius();
                break;
        }
    }

    /**
     * It sets the matrix input of the canvas here.
     */
    this.setMatrixInput = function (e, inputType) {

        switch (inputType) {
            case 'matrix-curve': this.id.value = this.rotationInputForCurve(e) + ' ' + String.fromCharCode(176);
                matrixInspector.setCurve();
                break;
            case 'matrix-space': this.id.value = this.positiveInput(e) + ' pt';
                matrixInspector.setRowSpacing();
                break;
            case 'matrix-seat-space': this.id.value = this.positiveInput(e) + ' pt';
                matrixInspector.setSeatSpacing();
                break;
            case 'matrix-seat-radius': this.id.value = this.positiveInput(e) + ' pt';
                matrixInspector.setSeatRadius();
                break;
        }
    }

    /**
     * set the text input here
     */
    this.setTextInput = function (e, inputType) {
        switch (inputType) {
            case 'text-font': this.id.value = this.positiveInput(e) + ' pt';
                textInspector.setFontSize();
                break;
        }
    }

    /**
     * Set the scale input here
     */
    this.setMediaInput = function (e, inputType) {
        switch (inputType) {
            case 'media-scale': this.id.value = this.scaleInput(e) + ' %';
                mediaInspector.setScale();
                break;
            case 'media-opacity': this.id.value = this.opacityInput(e) + ' %';
                mediaInspector.setOpacity();
                break;
        }
    }

    /**
     * Set the scale input here
     */
    this.setRectangleInput = function (e, inputType) {
        switch (inputType) {
            case 'rectangle-width': this.id.value = this.dimensionInput(e) + ' pt';
                rectangleInspector.setWidth();
                break;
            case 'rectangle-height': this.id.value = this.dimensionInput(e) + ' pt';
                rectangleInspector.setHeight();
                break;
            case 'rectangle-font-size': this.id.value = this.positiveInput(e) + ' pt';
                rectangleInspector.setFontSize();
                break;
            case 'rectangle-rotation': this.id.value = this.rotationInput(e) + ' ' + String.fromCharCode(176);
                rectangleInspector.setRotation();
                break;
            case 'rectangle-label-x': this.id.value = this.handlePosition(e) + ' %';
                rectangleInspector.setPositionX();
                break;
            case 'rectangle-label-y': this.id.value = this.handlePosition(e) + ' %';
                rectangleInspector.setPositionY();
                break;
        }
    }

    /**
     * Set the scale input here
     */
    this.setEllipseInput = function (e, inputType) {
        switch (inputType) {
            case 'ellipse-width': this.id.value = this.dimensionInput(e) + ' pt';
                ellipseInspector.setWidth();
                break;
            case 'ellipse-height': this.id.value = this.dimensionInput(e) + ' pt';
                ellipseInspector.setHeight();
                break;
            case 'ellipse-font-size': this.id.value = this.positiveInput(e) + ' pt';
                ellipseInspector.setFontSize();
                break;
            case 'ellipse-rotation': this.id.value = this.rotationInput(e) + ' ' + String.fromCharCode(176);
                ellipseInspector.setRotation();
                break;
            case 'ellipse-label-x': this.id.value = this.handlePosition(e) + ' %';
                ellipseInspector.setPositionX();
                break;
            case 'ellipse-label-y': this.id.value = this.handlePosition(e) + ' %';
                ellipseInspector.setPositionY();
                break;
        }
    }

    /**
     * Set the scale input here
     */
    this.setPolygonInput = function (e, inputType) {
        switch (inputType) {
            case 'polygon-font-size': this.id.value = this.positiveInput(e) + ' pt';
                polygonInspector.setFontSize();
                break;
            case 'polygon-rotation': this.id.value = this.rotationInput(e) + ' ' + String.fromCharCode(176);
                polygonInspector.setRotation();
                break;
            case 'polygon-label-x': this.id.value = this.handlePosition(e) + ' %';
                polygonInspector.setPositionX();
                break;
            case 'polygon-label-y': this.id.value = this.handlePosition(e) + ' %';
                polygonInspector.setPositionY();
                break;
        }
    }

    /**
     * Set the scale input here
     */
    this.setRowConfigInput = function (e, inputType) {
        switch (inputType) {
            case 'row-seat-config-radius':this.id.value = this.positiveInput(e) + ' pt';
                rowConfigInspector.setSeatRadiusConfig();
                break;
            case 'row-seat-config-space':this.id.value = this.positiveInput(e) + ' pt';
                rowConfigInspector.setSeatSpaceConfig();
                break;
        }
    }

    /**
     * Set the scale input here
     */
    this.setMatrixConfigInput = function (e, inputType) {
        switch (inputType) {
            case 'matrix-seat-config-radius':this.id.value = this.positiveInput(e) + ' pt';
                matrixConfigInspector.setSeatRadiusConfig();
                break;
            case 'matrix-seat-config-space':this.id.value = this.positiveInput(e) + ' pt';
                matrixConfigInspector.setSeatSpaceConfig();
                break;
            case 'matrix-row-config-space':this.id.value = this.positiveInput(e) + ' pt';
                matrixConfigInspector.setRowSpaceConfig();
                break;
        }
    }
    
    /**
     * Handles the mouse up event
     * call the update chart functions
     */
    this.closeDrag = function () {
        this.drag = false;
        mainModule.updateChart();
    }

    /**
     * Handles the font input.
     */
    this.positiveInput = function (e) {

        let temp = this.pos3 > e.clientX ? parseInt(this.id.value) - 1 : parseInt(this.id.value) + 1;
        temp = temp < 0 ? 0 : temp;

        return temp;
    }

    /**
     * Handles the rotation input
     */
    this.rotationInput = function (e) {
        let temp = this.pos3 > e.clientX ? parseInt(this.id.value) - 1 : parseInt(this.id.value) + 1;
        temp = temp < 0 ? 360 : temp;
        temp = temp > 360 ? 0 : temp;

        return temp;
    }

    /**
     * Provide rotation input for making the curve
     */
    this.rotationInputForCurve = function (e) {
        let temp = this.pos3 > e.clientX ? parseInt(this.id.value) - 1 : parseInt(this.id.value) + 1;
        temp = temp < -30 ? -30 : temp;
        temp = temp > 30 ? 30 : temp;

        return temp;
    }

    /**
     * Handles the position of the label x-axis and y-axis label
     */
    this.handlePosition = function (e) {
        let temp = this.pos3 > e.clientX ? parseInt(this.id.value) - 1 : parseInt(this.id.value) + 1;
        temp = temp < -50 ? -50 : temp;
        temp = temp > 50 ? 50 : temp;

        return temp;
    }

    /**
     * Handle the input for scale here
     */
    this.scaleInput = function (e) {
        let temp = this.pos3 > e.clientX ? parseInt(this.id.value) - 1 : parseInt(this.id.value) + 1;
        temp = temp < 1 ? 1 : temp;
        temp = temp > 200 ? 200 : temp;

        return temp;
    }

    /**
     * Handled the input for the opacity
     */
    this.opacityInput = function (e) {
        let temp = this.pos3 > e.clientX ? parseInt(this.id.value) - 1 : parseInt(this.id.value) + 1;
        temp = temp < 1 ? 1 : temp;
        temp = temp > 100 ? 100 : temp;

        return temp;
    }

    /**
     * Handles the dimension for the shape
     * Width and height for the shape
     */
    this.dimensionInput = function (e) {
        let temp = this.pos3 > e.clientX ? parseInt(this.id.value) - 1 : parseInt(this.id.value) + 1;
        temp = temp < 1 ? 1 : temp;
        temp = temp > 1000 ? 1000 : temp;

        return temp;
    }
}