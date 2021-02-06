/**
 * Handles event for text
 */
var textHandler = (function () {

    /**
     * add the event listener
     */
    function addListener(){
        document.getElementById('text-btn').addEventListener('click',toolModule.selectText);

        document.getElementById('caption-name').addEventListener('keyup',textInspector.setCaptionName);

        let captionSize = document.getElementById('caption-size');    
        captionSize.addEventListener('change', textInspector.setFontSize);
        captionSize.addEventListener('mousedown', textFontSize.dragMouseDown);
        captionSize.addEventListener('click', textInspector.onClick);

        document.getElementById('inc-caption-size').addEventListener('click', textFontSize.increaseValue);
        document.getElementById('dec-caption-size').addEventListener('click', textFontSize.decreaseValue);

        document.getElementById('caption-color').addEventListener('change',textInspector.setCaptionColor);

        document.getElementById('caption-bold').addEventListener('click',textInspector.setBold);
        document.getElementById('caption-italic').addEventListener('click',textInspector.setItalic);
    }

    return {
        addListener:addListener
    }

})();