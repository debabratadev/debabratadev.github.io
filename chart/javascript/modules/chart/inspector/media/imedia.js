/**
 * Handles inspector properties for media component
 */
var mediaInspector = (function () {

    let imageObject;
    let inputNumber = ['image-scale', 'image-opacity'];

    /**
     * It sets the image inspector
     * 
     * @param {*} object 
     */
    function setMediaObject(object) {
        imageObject = object;

        helperModule.showInspector('image-inspector');

        displayImage(imageObject.getUrl());

        document.getElementById('image-scale').value = imageObject.getScale() + ' %';
        document.getElementById('image-opacity').value = imageObject.getOpacity() + ' %';

        displayShapeProperty("block");

        if(imageObject.backOrder){
            helperModule.addRemoveClass('image-back','image-forth','order-active');
        } else{
            helperModule.addRemoveClass('image-forth','image-back','order-active');
        }

        helperModule.cursorResizeType(inputNumber);
    }

    /**
     * Display image 
     * TODO --
     * @param {*} url 
     */
    function displayImage(url){
        let chartImage = document.getElementById('image-inspector-div');
        chartImage.style.backgroundImage = "url(" + url + ")";
        chartImage.style.backgroundSize = "100% 100%";

        // mainModule.addMediaObject(url);

        let placeholder = document.getElementById('image-inspector-placeholder');
        // placeholder.style.display = "none";

        if(url!=null){
            document.getElementById('inspector-image').disabled = true;
        }
    }

    /**
     * Display the image on the di
     */
    function displayImgOnDiv(url) {
    
        displayImage(url);
        //update the image component here
        mainModule.addMediaObject(url);
    }

    /**
     * Set scale for the image
     */
    function setScale() {
        let scale = document.getElementById('image-scale').value;
        scale = parseInt(scale.replace(/\D/g, ''));
        imageObject.setScale(scale);
        document.getElementById('image-scale').value = scale + ' %';
    }

    /**
     * Set opacity for the image
     */
    function setOpacity() {
        let opacity = document.getElementById('image-opacity').value;
        opacity = parseInt(opacity.replace(/\D/g, ''));
        imageObject.setOpacity(opacity);
        document.getElementById('image-opacity').value = opacity + ' %';
    }
    
    /**
     * Move Backward
     */
    function moveBackward(){
        helperModule.addRemoveClass('image-back','image-forth','order-active');
        imageObject.moveToBack();
    }

    /**
     * Move Forward
     */
    function moveForward(){
        helperModule.addRemoveClass('image-forth','image-back','order-active');
        imageObject.moveToForth();
    }

    /**
     * Hide/show the shape property
     * 
     * @param {*} display 
     */
    function displayShapeProperty(display){
        let  shapeArray = document.getElementsByClassName('shape-display');
        for(let index = 0;index<shapeArray.length;++index){
            shapeArray[index].style.display = display;
        }
    }

    return {
        setMediaObject: setMediaObject,
        displayImgOnDiv: displayImgOnDiv,
        setScale: setScale,
        setOpacity: setOpacity,
        moveForward:moveForward,
        moveBackward:moveBackward,
        displayShapeProperty:displayShapeProperty
    }

})();