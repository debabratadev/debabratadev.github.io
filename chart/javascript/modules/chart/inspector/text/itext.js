/**
 * Handles text component inspector properties
 */
var textInspector = (function () {

    let textObject;
    let inputNumber = ['caption-size'];

    /**
     * set the text object here
     */
    function setTextObject(object) {
        textObject = object;

        helperModule.showInspector('text-inspector');

        document.getElementById('caption-name').value = textObject.caption;
        // document.getElementById('caption-size').value = textObject.fontSize;
        document.getElementById('caption-size').value = textObject.getFontSize();

        document.getElementById('caption-color').value = textObject.textColor;

        handleBoldText();
        handleItalicText();

        helperModule.cursorResizeType(inputNumber);
    }

    /**
     * Set the font size
     */
    function setFontSize() {

        let value = document.getElementById('caption-size').value;
        value = parseInt(value.replace(/\D/g, ''));
        // textObject.fontSize = value;
        textObject.setFontSize(value);
        document.getElementById('caption-size').style.border = "none";
    }

    /**
     * Set the caption name here
     */
    function setCaptionName() {
        textObject.caption = document.getElementById('caption-name').value;
    }

    /**
     * Set the caption color 
     */
    function setCaptionColor() {
        textObject.textColor = document.getElementById('caption-color').value;
    }

    /**
     * Set Bold
     */
    function setBold() {
        textObject.setBold();
        handleBoldText();
    }

    /**
     * Set Italic 
     */
    function setItalic() {
        textObject.setItalic();
        handleItalicText();
    }

    /**
     * Handle the bold text
     */
    function handleBoldText() {
        if (textObject.bold) {
            document.getElementById('caption-bold').classList.add("black-btn");
        } else {
            document.getElementById('caption-bold').classList.remove("black-btn");
        }
    }

    /**
     * Handle the italic text
     */
    function handleItalicText() {
        if (textObject.italic) {
            document.getElementById('caption-italic').classList.add("black-btn");
        } else {
            document.getElementById('caption-italic').classList.remove("black-btn");
        }
    }

    return {
        setTextObject: setTextObject,
        setFontSize: setFontSize,
        setCaptionName: setCaptionName,
        setCaptionColor: setCaptionColor,
        setBold: setBold,
        setItalic: setItalic
    }

})();