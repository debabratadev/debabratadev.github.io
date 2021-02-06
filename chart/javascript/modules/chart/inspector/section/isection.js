/**
 * Handles section inspector properties
 */
var sectionInspector = (function () {

    let sectionObject;
    let inputNumber = ['section-label-size', 'section-label-rotation', 'section-label-x', 'section-label-y'];

    /**
     * It sets the section object
     * @param {*} object is the section object here.
     */
    function setSectionObject(object) {
        sectionObject = object;
        
        sectionObject.updateCoordinatesForLabel();
        helperModule.showInspector('section-inspector');

        document.getElementById('section-label-size').value = sectionObject.getFontSize() + ' pt';
        document.getElementById('section-label-rotation').value = sectionObject.getRotation() + ' ' + String.fromCharCode(176);
        document.getElementById('section-name').value = sectionObject.name;

        document.getElementById('section-label').checked = sectionObject.label;

        let labelId = document.getElementById('section-label-icon');

        if (sectionObject.label) {
            labelId.style.display = "block"
        } else {
            labelId.style.display = "none";
        }

        document.getElementById('section-label-x').value = parseInt(sectionObject.percentage.x) + ' %';
        document.getElementById('section-label-y').value = parseInt(sectionObject.percentage.y) + ' %';

        helperModule.cursorResizeType(inputNumber);
        listModule.setType('section',sectionObject);
        listModule.createList('section-column-catg');
    }

    /**
     * It sets the label
     */
    function setLabel() {
        sectionObject.name = document.getElementById('section-name').value;
    }

    /**
     * Handle whether you want to see the font or not.
     */
    function setVisible() {

        sectionObject.label = document.getElementById('section-label').checked;

        if (sectionObject.label) {
            document.getElementById('section-label-icon').style.display = "block";
        }
        else {
            document.getElementById('section-label-icon').style.display = "none";
        }
    }

    /**
     * It sets the font size for the zone.
     */
    function setFontSize() {
        let value = document.getElementById('section-label-size').value;
        value = parseInt(value.replace(/\D/g, ''));
        sectionObject.updateFontSize(value);
        document.getElementById('section-label-size').style.border = "none";
    }

    /**
     * It sets the rotation for the axis.
     */
    function setRotation() {
        let value = document.getElementById('section-label-rotation').value;
        value = parseInt(value.replace(/\D/g, ''));
        sectionObject.setRotation(value);
        // sectionObject.labelRotation = circleModule.convertDegreeToRadian(value);
    }

    /**
     * It sets the position x
     */
    function setPositionX() {
        let value = document.getElementById('section-label-x').value;
        value.trim(" ");
        value = value.split(" ");
        sectionObject.updateXCordinateForLabel(value[0]);
    }

    /**
     * It sets the position y
     */
    function setPositionY() {
        let value = document.getElementById('section-label-y').value;
        value.trim(" ");
        value = value.split(" ");

        sectionObject.updateYCordinateForLabel(value[0]);
    }

    /**
     *  It handles the category of the items that has been 
     *  defined.
     */
    function category() {
        // sectionObject.category = document.getElementById('section-label').value;

    }

    return {
        setSectionObject: setSectionObject,
        setLabel: setLabel,
        setVisible: setVisible,
        setRotation: setRotation,
        setFontSize: setFontSize,
        setPositionX: setPositionX,
        setPositionY: setPositionY,
        category: category,
    }

})();