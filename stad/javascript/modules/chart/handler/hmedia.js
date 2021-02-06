/**
 * Handle events for image
 */
var imageHandler = (function () {

    /**
     * Add listener to the  images
     */
    function addListener() {
        document.getElementById('img-btn').addEventListener('click',toolModule.selectImage);

        //scale
        let imageScale = document.getElementById('image-scale');
        imageScale.addEventListener('change', mediaInspector.setScale);
        imageScale.addEventListener('mousedown',mediaScale.dragMouseDown);
        imageScale.addEventListener('click', mediaScale.onClick);
        
        document.getElementById('inc-image-scale').addEventListener('click',mediaScale.increaseValue);
        document.getElementById('dec-image-scale').addEventListener('click', mediaScale.decreaseValue);

        //opacity
        let imageOpacity = document.getElementById('image-opacity');
        imageOpacity.addEventListener('change', mediaInspector.setOpacity);
        imageOpacity.addEventListener('mousedown',mediaOpacity.dragMouseDown);
        imageOpacity.addEventListener('click', mediaOpacity.onClick);

        document.getElementById('inc-image-opacity').addEventListener('click',mediaOpacity.increaseValue);
        document.getElementById('dec-image-opacity').addEventListener('click', mediaOpacity.decreaseValue);

        document.getElementById('image-back').addEventListener('click',mediaInspector.moveBackward);
        document.getElementById('image-forth').addEventListener('click',mediaInspector.moveForward);

    }

    return {
        addListener: addListener
    }
})();