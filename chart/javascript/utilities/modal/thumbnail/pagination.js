/**
 * Pagination module
 */
var paginationModule = (function () {

    let pagination = document.getElementById('img-pagination');
    let imgData;

    let numOfPageToShow = 5;

    //for holding pages
    let startPage = 0;
    let currentPage = 1;
    let endPage = 0;

    let numofImgToShow = 10;
    let totalImages = 0;;

    /*
     * Create Pagination
     * 
     * @param {*} data 
     * @param {*} viewCount 
     */
    function createPagination(data, viewCount) {

        imgData = data;
        numofImgToShow = viewCount;
        totalImages = data.length;

        totalPages = (Math.ceil)(totalImages / numofImgToShow);

        startPage = 0;
        endPage = (startPage+numOfPageToShow)>totalPages?(totalPages):numOfPageToShow;
        activePage = currentPage;

        createLinks(startPage, endPage,activePage);
        
        loadPaginationData();
    }

    /**
     * Create Links for pagination here
     */
    function createLinks(startPage, endPage,activePage) {

        let lquote = createLeftQuote();
        pagination.appendChild(lquote);

        createPageList(startPage, endPage,activePage);

        let rquote = createRightQuote();
        pagination.appendChild(rquote);
    }

    /**
     * Create the page list
     */
    function createPageList(startIndex, lastIndex,activePage) {

        for (let index = startIndex; index < lastIndex; ++index) {
            let link = document.createElement('a')

            setAttributes(link, { 'onclick': 'paginationModule.selectPages(this)', 'value': index + 1 });

            if (index == (activePage-1)) {
                link.classList.add('pg-active');
            }

            let text = document.createTextNode(index + 1);

            link.appendChild(text);
            pagination.appendChild(link);
        }
    }

    /**
     * Delete the pagination 
     */
    function deletePagination() {
        let child = pagination.lastElementChild;
        while (child) {
            pagination.removeChild(child);
            child = pagination.lastElementChild;
        }
    }

    /**
     * Create the left quote here
     */
    function createLeftQuote() {
        let link = document.createElement('a')
        setAttributes(link, { 'onclick': 'paginationModule.prevPage(this)' });

        let text = document.createTextNode('Prev');
        link.appendChild(text);

        link.style.cursor="default";

        return link;
    }

    /**in
     * Create the right quote here
     */
    function createRightQuote() {
        let link = document.createElement('a')
        setAttributes(link, { 'onclick': 'paginationModule.nextPage(this)' });

        let text = document.createTextNode('Next');
        link.appendChild(text);

        return link;
    }

    /**
     * Select the page
     * 
     * @param {*} event is the mouse event
     */
    function selectPages(event) {

        disableActivePage();

        event.classList.add("pg-active");
        currentPage = event.getAttribute('value');

        thumbnailModule.deleteThumbNail();

        loadPaginationData();
    }


    /**
     * Disable the active page 
     */
    function disableActivePage() {
        let childNodes = pagination.childNodes;
        for (child of childNodes) {
            if (child.className == "pg-active") {
                child.classList.remove("pg-active")
            }
        }
    }

    /**
     * Load the pagination data.
     */
    function loadPaginationData() {
        let start = (currentPage - 1) * numofImgToShow;
        let lastIndex = ((start + numofImgToShow) < totalImages ? numofImgToShow : (totalImages - start));
        for (let index = 0; index < lastIndex; ++index) {
            let currentIndex = start + index;
            thumbnailModule.createThumbNail(imgData[currentIndex]['src'], imgData[currentIndex]['name']);
        }
    }

    /**
     * Go to the next page
     */
    function nextPage(event) {

        if(checkNextEndPoint()){
            return;
        }

        handleNextSelection();

        if (!(currentPage % numOfPageToShow)) {
            createNextPageList();
        }

        currentPage = (currentPage == totalPages) ? currentPage : ++currentPage;

        thumbnailModule.deleteThumbNail();

        loadPaginationData();
    }

    /**
     * Check the end point for next 
     * 
     */
    function checkNextEndPoint(){
        return currentPage == totalPages;
    }

    /**
     * Handle next pagination list
     */
    function createNextPageList() {

        paginationModule.deletePagination();

        startPage = startPage + numOfPageToShow;
        endPage = startPage + numOfPageToShow;

        endPage = (endPage>totalPages)?totalPages:endPage;
        activePage = currentPage+1;

        createLinks(startPage, endPage,activePage);
    }

    /**
     * Hanle which element to be selected after
     * Clicking the next button
     */
    function handleNextSelection() {
        let childNodes = pagination.childNodes;
        let found = false;

        for (child of childNodes) {
            if (found) {
                child.classList.add('pg-active');
                break;
            }
            if (child.className == "pg-active") {
                child.classList.remove('pg-active');
                found = true;
                ele = child;
            }
        }

    }

    /**
     * Go to the prev page
     */
    function prevPage(event) {

        if(checkPrevEndPoint()){
            return;
        }
        
        handlePrevSelection();

        currentPage = (currentPage == startPage) ? currentPage : --currentPage;

        if (!(currentPage % numOfPageToShow)) {
            createPrevPageList();
        }

        thumbnailModule.deleteThumbNail();

        loadPaginationData();
    }

    /**
     * Check for the end point for previous
     */
    function checkPrevEndPoint(){

        return (currentPage ==1);
    }

    /**
     * Create the previous page list
     */
    function createPrevPageList() {
        paginationModule.deletePagination();

        startPage = (startPage - numOfPageToShow) > 0 ? (startPage-numOfPageToShow) : 0;
        endPage = startPage + numOfPageToShow;
        activePage = currentPage;

        createLinks(startPage, endPage,activePage);
    }

    /**
     * Handle the previouse selection ,
     * When the prev button is clicked
     */
    function handlePrevSelection() {
        let childNodes = pagination.childNodes;
        let prevChild;

        for (child of childNodes) {
            if (child.className == "pg-active") {

                if (prevChild) {
                    prevChild.classList.add('pg-active');
                    child.classList.remove('pg-active');
                }
            }
            prevChild = child;
        }
    }

    /**
     * Set the attribute for the object
     * 
     * @param {*} el 
     * @param {*} attrs 
     */
    function setAttributes(el, attrs) {

        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }

    return {
        createPagination: createPagination,
        selectPages: selectPages,
        nextPage: nextPage,
        prevPage: prevPage,
        deletePagination: deletePagination
    }

})();
