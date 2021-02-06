/**
 * Handles inspector properties for matrices
 */
var matrixInspector = (function () {

    let matrixObject;
    let inputNumber = ['matrix-curve', 'matrix-space', 'matrix-seat-space', 'matrix-seat-radius'];

    /**
     * This sets the matrix object
     * 
     * @param {*} object 
     */
    function setMatrixObject(object) {
        matrixObject = object;

        helperModule.showInspector('matrix-inspector');
        helperModule.showAndHideBlock('matrix-label-icon', matrixObject.label);
        helperModule.showAndHideBlock('matrix-seat-icon', matrixObject.seatLabel);

        document.getElementById('matrix-curve').value = matrixObject.getCurve() + ' ' + String.fromCharCode(176);
        document.getElementById('matrix-space').value = parseInt(matrixObject.rowSpacing) + ' pt';
        // document.getElementById('matrix-seat-space').value = matrixObject.spacing + ' pt';
        document.getElementById('matrix-seat-space').value = matrixObject.getSeatSpacing() + ' pt';
        document.getElementById('matrix-seat-radius').value = matrixObject.getSeatRadius()+ ' pt';

        document.getElementById('matrix-label').checked = matrixObject.label;
        document.getElementById('matrix-sequence').value = matrixObject.rowSequence;
        document.getElementById('matrix-start').value = matrixObject.startAt;

        document.getElementById('matrix-seat-label').checked = matrixObject.seatLabel;
        document.getElementById('matrix-seat-seq').value = matrixObject.seatSequence;
        document.getElementById('matrix-seat-start').value = matrixObject.seatStartAt;
        document.getElementById('matrix-seat-direction').checked = matrixObject.seatDirection;
        
        listModule.setType('matrix',matrixObject);
        listModule.createList('matrix-column-catg');
        helperModule.cursorResizeType(inputNumber);
    }

    /**
     * Sets the curve
     */
    function setCurve() {
        let value = document.getElementById('matrix-curve').value;
        value.trim(" ");
        value = value.split(" ");

        matrixObject.setCurve(value[0]);
        // matrixObject.curve = value[0];

        // for (let index = 0; index < matrixObject.rowComponent.length; ++index) {
        //     matrixObject.rowComponent[index].curve = matrixObject.curve;
        //     matrixObject.rowComponent[index].drawCurve();
        // }
    }

    /**
     * Sets the row spacing
     */
    function setRowSpacing() {
        let value = document.getElementById('matrix-space').value;
        value = parseInt(value.replace(/\D/g, ''));

        if(value<=0){
            return;
        }
        
        matrixObject.setRowSpacing(value);
        // matrixObject.rowSpace = value;
        // matrixObject.updateRowCoordinate();
    }

    /**
     * Sets the seat spacing
     */
    function setSeatSpacing() {

        let value = document.getElementById('matrix-seat-space').value;
        value = parseInt(value.replace(/\D/g, ''));

        matrixObject.setSeatSpacing(value);
        // matrixObject.spacing = value / 10;

        // for (let index = 0; index < matrixObject.rowComponent.length; ++index) {
        //     let rowObject = matrixObject.rowComponent[index];
        //     rowObject.spacing = matrixObject.spacing;
        //     rowObject.updateSeatSpacing();
        // }
    }

    /**
     * Sets the seats Radius
     */
    function setSeatRadius() {

        let value = document.getElementById('matrix-seat-radius').value;
        value = parseInt(value.replace(/\D/g, ''));
        
        matrixObject.setSeatRadius(value);

        // matrixObject.seatRadius = document.getElementById('matrix-seat-radius').value;
        // matrixObject.seatRadius = value;
        // for (let index = 0; index < matrixObject.rowComponent.length; ++index) {

        //     let rowObject = matrixObject.rowComponent[index];

        //     rowObject.updateSeatRadius(value);
        //     rowObject.updateSeatSpacing();
        // }
        // matrixObject.rowSpace = 1;
        // matrixObject.updateRowCoordinate();
    }

    /**
     * Toggle the Row label
     */
    function toggleRowLabel() {
        matrixObject.label = document.getElementById('matrix-label').checked;

        // for (let index = 0; index < matrixObject.rowComponent.length; ++index) {
        //     matrixObject.rowComponent[index].label = matrixObject.label;
        // }

        if (matrixObject.label) {
            document.getElementById('matrix-label-icon').style.display = "block";
        }
        else {
            document.getElementById('matrix-label-icon').style.display = "none";
        }

        matrixObject.displayRowLabel(matrixObject.label);
    }

    /**
     * Set the type of row label here
     */
    function setRowLabelType() {
        matrixObject.rowSequence = document.getElementById('matrix-sequence').value;

        for (let index = 0; index < matrixObject.rowComponent.length; ++index) {
            matrixObject.rowComponent[index].rowSequence = matrixObject.rowSequence;
        }

        setStartAtValue(matrixObject.rowSequence, document.getElementById('matrix-start'));
        setRowStartAt();
    }

    /**
     * Toggle the seat label
     */
    function toggleSeatLabel() {
        matrixObject.seatLabel = document.getElementById('matrix-seat-label').checked;

        for (let index = 0; index < matrixObject.rowComponent.length; ++index) {
            matrixObject.rowComponent[index].seatLabel = matrixObject.seatLabel;
        }

        if (matrixObject.seatLabel) {
            document.getElementById('matrix-seat-icon').style.display = "block";
        }
        else {
            document.getElementById('matrix-seat-icon').style.display = "none";
        }
    }

    /**
     * Toggle the seat label type
     */
    function setSeatLabelType() {
        matrixObject.sequence = document.getElementById('matrix-seat-seq').value;
        for (let index = 0; index < matrixObject.rowComponent.length; ++index) {
            matrixObject.rowComponent[index].sequence = matrixObject.sequence;
        }
    }

    /**
     * Sets the start At
     */
    function setStartAt() {
        matrixObject.seatStartAt = document.getElementById('matrix-seat-start').value;
        for (let index = 0; index < matrixObject.rowComponent.length; ++index) {
            matrixObject.rowComponent[index].seatStartAt = matrixObject.seatStartAt;
        }
    }

    /**
     * Sets the row start at
     */
    function setRowStartAt() {
        matrixObject.startAt = document.getElementById('matrix-start').value;
        for (let index = 0; index < matrixObject.rowComponent.length; ++index) {
            matrixObject.rowComponent[index].startAt = matrixObject.startAt;
        }
    }

    /**
     * Sets the matrix direction from up to down
     * and down to up.
     */
    function setTheMatrixDirection() {
        let value = document.getElementById('matrix-direction').value;
        matrixObject.setDirection(value);
    }

    /** 
     * Sets the direction.
     */
    function setDirection() {
        matrixObject.seatDirection = document.getElementById('matrix-seat-direction').value;
        for (let index = 0; index < matrixObject.rowComponent.length; ++index) {
            matrixObject.rowComponent[index].direction = matrixObject.seatDirection;
        }
    }

    /**
     * Sets the start value for the sequence
     * 
     * @param {*} value  is the value
     * @param {*} id     is the id to be set
     */
    function setStartAtValue(value, id) {
        if (value == "Numeric") {
            id.value = 0;
        }
        else if (value == "Alphabet") {
            id.value = 'A';
        }
        else {
            id.value = null;
        }
    }

    return {
        setCurve: setCurve,
        setRowSpacing: setRowSpacing,
        toggleRowLabel: toggleRowLabel,
        toggleSeatLabel: toggleSeatLabel,
        setSeatLabelType: setSeatLabelType,
        setStartAt: setStartAt,
        setRowStartAt: setRowStartAt,
        setDirection: setDirection,
        setSeatSpacing: setSeatSpacing,
        setSeatRadius: setSeatRadius,
        setRowLabelType: setRowLabelType,
        setMatrixObject: setMatrixObject,
        setTheMatrixDirection: setTheMatrixDirection
    }

})();