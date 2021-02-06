/**
 * Handles modal modules
 */
var modalModule = (function () {

    var modal = document.querySelector(".image-modal");

    let userId = localStorage.getItem('user-id');
    const token = localStorage.getItem('token');

    // let token = localStorage.getItem('token');
    let imgArray;

    /**
     * Toggle the mdoal
     */
    function toggleModal(event) {

        if(event){
            event.preventDefault();
        }

        thumbnailModule.deleteThumbNail();
        paginationModule.deletePagination();

        getUserImage();

        modal.classList.toggle("show-modal");
    }

    /**
     * When target is modal then click the modal here
     * 
     * @param {*} event 
     */
    function windowOnClick(event) {
        if (event.target === modal) {
            toggleModal();
        }
    }

    /**
     * Filter image on name
     * @param {*} event is the mouse event
     */
    function filterImageOnName(event) {
        let value = document.getElementById('image-search').value;
        value = value.trim();

        //clear the images //clear the pagination list
        thumbnailModule.deleteThumbNail();
        paginationModule.deletePagination();

        //Create new pagination here
        let temp = [];
        for (let index = 0; index < imgArray.length; ++index) {

            let src = imgArray[index]['src'];
            let imgName = imgArray[index]['name'];

            if (helperModule.regularExpressionSearch(value, imgName)) {
                temp.push(imgArray[index]);
            }
        }

        if (value == null) {
            temp = imgArray;
        }

        paginationModule.createPagination(temp, 10);
    }

    /**
     * Get the user image from here
     */
    function getUserImage() {

        const url = urlModule.header + urlModule.mediaURL + userId;
        const getMethod = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + token
            },
        }

        fetch(url, getMethod)
            .then(response => response.json())
            .then(data => processMediaOfUser(data))
            .catch(err => console.log(err))
    }

    /**
     * Process the media for the user here
     * 
     * @param {*} data 
     */
    function processMediaOfUser(data) {

        data = data.data;
        imgArray = [];
        for (let index = 0; index < data.length; ++index) {
            imgArray.push({ 'src': data[index]['media_path'], 'name': data[index]['media_title'] });
        }
        paginationModule.createPagination(imgArray, 10);
    }

    /**
     * Upload the mediat to the database
     */
    function uploadMedia(event) {

        toggleModal(event);

        let url = urlModule.header + urlModule.mediaURL+"create";

        const method = "POST";

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                selectMedia(this.responseText);
            }
        };

        let form = document.getElementById('upload-media-file').files[0];

        let mediaName = form.name;
        mediaName = mediaName.replace(/\..+$/, '');

        let formData = new FormData();
        formData.append('media_type_id', 1);
        formData.append('media_title', mediaName);
        formData.append('user_id', userId);
        formData.append('image', form);
        formData.append('created_date', 1);   //TODO - will be handled that side
        formData.append('modified_date', 1);
        xhttp.open(method, url, true);
        xhttp.setRequestHeader('Authorization', 'Bearer ' + token);

        xhttp.send(formData);
    }

    /**
     * Select the media
     */
    function selectMedia (data){

        let url = JSON.parse(data).data.path;
        mediaInspector.displayImgOnDiv(url);
    }

    return {
        toggleModal: toggleModal,
        windowOnClick: windowOnClick,
        filterImageOnName: filterImageOnName,
        getUserImage: getUserImage,
        uploadMedia: uploadMedia,
        selectMedia:selectMedia
    }

})();