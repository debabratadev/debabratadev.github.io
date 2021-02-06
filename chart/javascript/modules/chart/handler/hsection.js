/**
 * Handle events for sections
 */
var sectionHandler = (function () {

    /**
     * Add the listener for the section.
     */
    function addListener() {

        document.getElementById('section-name').addEventListener('change', sectionInspector.setLabel);
        document.getElementById('section-label').addEventListener('change', sectionInspector.setVisible);

        //label size
        let sectionLabelSize = document.getElementById('section-label-size');    
        sectionLabelSize.addEventListener('change', sectionInspector.setFontSize);
        sectionLabelSize.addEventListener('mousedown', sectionFontSize.dragMouseDown);
        sectionLabelSize.addEventListener('click', sectionFontSize.onClick);

        document.getElementById('inc-section-label-size').addEventListener('click', sectionFontSize.increaseValue);
        document.getElementById('dec-section-label-size').addEventListener('click', sectionFontSize.decreaseValue);

        //label Rotation
        let sectionLabelRotation =  document.getElementById('section-label-rotation');
        sectionLabelRotation.addEventListener('change', sectionInspector.setRotation);
        sectionLabelRotation.addEventListener('mousedown', sectionRotation.dragMouseDown);
        sectionLabelRotation.addEventListener('click', sectionRotation.onClick);

        document.getElementById('inc-section-label-rotation').addEventListener('click', sectionRotation.increaseValue);
        document.getElementById('dec-section-label-rotation').addEventListener('click', sectionRotation.decreaseValue);

        //label x poistion
        let sectionLabelX  = document.getElementById('section-label-x');
        sectionLabelX.addEventListener('change', sectionInspector.setPositionX);
        sectionLabelX.addEventListener('mousedown', sectionXLabel.dragMouseDown);
        sectionLabelX.addEventListener('click', sectionXLabel.onClick);

        document.getElementById('inc-section-label-x').addEventListener('click', sectionXLabel.increaseValue);
        document.getElementById('dec-section-label-x').addEventListener('click', sectionXLabel.decreaseValue);

        //label y position
        let sectionLabelY =  document.getElementById('section-label-y');
        sectionLabelY.addEventListener('change', sectionInspector.setPositionY);
        sectionLabelY.addEventListener('mousedown', sectionYLabel.dragMouseDown);
        sectionLabelY.addEventListener('click', sectionYLabel.onClick);

        document.getElementById('inc-section-label-y').addEventListener('click', sectionYLabel.increaseValue);
        document.getElementById('dec-section-label-y').addEventListener('click', sectionYLabel.decreaseValue);

    }

    return {
        addListener: addListener
    }
})();