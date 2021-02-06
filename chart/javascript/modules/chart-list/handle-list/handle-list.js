/**
 * List creation for chart list
 */
var listHandlingModule = (function () {

    let uList = document.getElementById('chart-list');
    let chartId;
    let reference;
    let chartName;

    /**
     * Create List
     */
    function createList(id,src,name) {
        chartId = id;
        reference = src;
        chartName = name;

        let li = document.createElement('li');

        setAttributes(li, {'style': 'list-style:none','id':chartId });

        let div = createDiv();
        li.appendChild(div);
        uList.appendChild(li);
    }

    /**
     * Create div
     */
    function createDiv() {
        let card = document.createElement('div');
        card.classList.add('card');

        let container = createContainer();
        card.appendChild(container);

        return card;
    }

    /**
     * Create container
     */
    function createContainer() {
        let container = document.createElement('div');
        container.classList.add('container');

        let row = createRow();
        container.appendChild(row);

        return container;

    }

    /**
     * Create Row
     */
    function createRow() {
        let row = document.createElement('div');
        row.classList.add('row');

        let firstColumn = createFirstColumn();
        row.appendChild(firstColumn);

        let secondColumn = createSecondColumn();
        row.appendChild(secondColumn);

        let thirdColumn = createThirdColumn();
        row.appendChild(thirdColumn);

        return row;
    }

    /**
     * Create first column
     */
    function createFirstColumn() {
        let div = document.createElement('div');
        div.classList.add('col-md-6');
        setAttributes(div,{'onclick': 'chartListModule.selectedChart(this)','id':chartId});

        let image = createImage();
        div.appendChild(image);

        return div;
    }

    /**
     * Get the image and set the image reference
     */
    function createImage(){
        let image  = document.createElement("img");
        setAttributes(image,{'src':reference,'width':'40%','height':'100%','alt':"Image Not found"});

        return image;
    }

    /**
     * Create second column
     */
    function createSecondColumn() {
        let div = document.createElement('div');
        div.classList.add('col-md-5');
        setAttributes(div,{'onclick': 'chartListModule.selectedChart(this)','id':chartId});

        let bold = document.createElement('b');
        let name = document.createTextNode(chartName);
        bold.appendChild(name);
        div.appendChild(bold);

        let br = document.createElement('br');
        div.appendChild(br);

        let i = document.createElement('i');
        let subtitle = document.createTextNode("chart id :  "+chartId);
        div.appendChild(subtitle);

        return div;
    }

    /**
     * Create third column
     */
    function createThirdColumn() {
        let div = document.createElement('div');
        div.classList.add('col-md-1');

        let i = document.createElement('i');
        i.classList.add('fas','fa-trash-alt','delete-icon');
        setAttributes(i, {'onclick': 'listHandlingModule.deleteList(this)' });

        div.appendChild(i);

        return div;
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
     * Delete list
     */
    function deleteList(node){
        let childNode = node.parentNode.parentNode.parentNode.parentNode.parentNode;

        if(confirm("Are you sure want to delete this")){
            uList.removeChild(childNode);
            chartListModule.deleteChartFromList(childNode.id);
        }
        chartListModule.setDeleteVar();
    }
    /**
     *  delete the list here.
     */
    function clearList() {
        let child = uList.lastElementChild;
        while (child) {
            uList.removeChild(child);
            child = uList.lastElementChild;
        }
    }
    return {
        createList: createList,
        deleteList:deleteList,
        clearList:clearList
    }
})();
