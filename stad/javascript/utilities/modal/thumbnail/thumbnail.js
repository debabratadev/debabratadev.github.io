/**
 * Handles thumbnail for modal
 */
var thumbnailModule = (function () {

    let gallery = document.getElementById('img-thumbnail');
    let src;
    let imageName;
    let selectedImage;

    /**
     * Create ThumbNail
     */
    function createThumbNail(imgSrc,imgName){

        src = imgSrc;
        imageName = imgName;

        let thumbNail = document.createElement('div');
        setAttributes(thumbNail,{'onclick': 'thumbnailModule.selectImage(this)'});

        let image = createImage();
        thumbNail.appendChild(image);

        let name = createName();
        thumbNail.appendChild(name);

        gallery.appendChild(thumbNail);
    }

    /**
     * Create Image 
     */
    function createImage(){
        let image = document.createElement('img');
        setAttributes(image,{'src':src,'alt':imageName});

        return image;
    }

    /**
     * Create the name 
     */
    function createName(){
        let p = document.createElement('p');
        let name = document.createTextNode(imageName);
        p.appendChild(name);

        return p;
    }

    /**
     * Select the image on click
     */
    function selectImage(event){

        let imageNode = event.childNodes[0];

        let src= imageNode.getAttribute('src');
        let name = imageNode.getAttribute('alt');

        selectedImage = {
            'src':src,
            'name':name
        }
        
        mediaInspector.displayImgOnDiv(src);
        
        toggleModal();
    }

    /**
     * Toggle the Modal --TODO - Need to change this modal
     */
    function toggleModal() {
        let modal = document.querySelector(".image-modal");
        modal.classList.toggle("show-modal");  
    }

    /**
     * Get the selected image 
     */
    function getSelectedImage(){

        return selectedImage;
    }

    /**
     * Set the attribute for the object here
     * 
     * @param {*} el 
     * @param {*} attrs 
     */
    function setAttributes(el, attrs) {

        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }

    /**
     * Delete thumb nail
     */
    function deleteThumbNail(){
        let child = gallery.lastElementChild;
        while (child) {
            gallery.removeChild(child);
            child = gallery.lastElementChild;
        }
    }

    return {
        createThumbNail:createThumbNail,
        selectImage:selectImage,
        deleteThumbNail:deleteThumbNail,
        getSelectedImage:getSelectedImage
    }

})();
