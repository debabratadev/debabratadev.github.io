/**
 * List module for category 
 * TODO - category and list module to be in the same folder
 */
var listModule = (function () {

    let tabId = document.getElementById('chart-column-catg');  //TODO setting up of tabid according to this is to be done here
    let currName;
    let currColor;
    let currIndex = -1;
    let category = [];
    let listCheckBoxState = [];
    let catgIndex=0;
    let type=null;
    let currentObj = null;

    /**
     * Create the list  -> It will create an Olist here.
     */
    function createList(id) {
        tabId = document.getElementById(id);
        listModule.deleteCategoryList();
        catgIndex=0;
        for (let index = 0; index < category.length; ++index) {
            currIndex = index;
            currName = category[index].name;
            currColor = category[index].color;
            category.id = index;
            catgIndex = index;
            listModule.addCategoryToList();
        }
        currIndex = -1;
        catgIndex = category.length;
        selectCheckBox();
    }

    /**
     *  delete the list here.
     */
    function deleteList() {
        var child = tabId.lastElementChild;
        while (child) {
            tabId.removeChild(child);
            child = tabId.lastElementChild;
        }
        tabId.style.display = "none";
    }

    /**
     * add Zone to list
     */
    function addCategoryToList() {

        let oList = document.createElement('li');
        oList.classList.add('column');
        oList.setAttribute('draggable', true);
        oList.setAttribute('style','{list-style:none}');
        oList.setAttribute('id',catgIndex);

        let header = createHeader();
        oList.appendChild(header);
        tabId.appendChild(oList);

        //TODO - call wiil be reduced  //TODO - update it once instead of multiple times here
        categoryModule.maximiseCategory();
    }

    /**
     * Create the header here
     */
    function createHeader() {
        let header = document.createElement('header');
        let div = createDiv();
        header.appendChild(div);

        return header;
    }

    /**
     * Create div 
     */
    function createDiv() {
        let div = document.createElement('div');
        div.classList.add('row');

        div.appendChild(document.createTextNode(''));

        let radioDiv = createRadioDiv();
        div.appendChild(radioDiv);
        div.appendChild(document.createTextNode(''));

        let colorDiv = createColorDiv();
        div.appendChild(colorDiv);
        div.appendChild(document.createTextNode(''));

        let category = createCategoryDiv();
        div.appendChild(category);
        div.appendChild(document.createTextNode(''));

        let del = createDeleteDiv();
        div.appendChild(del);
        div.appendChild(document.createTextNode(''));

        return div;

    }

    /**
     * Create the radio Button 
     */
    function createRadioDiv() {
        let div = document.createElement('div');
        div.classList.add('col-md-1','checkbox-margin');

        if(type=="chart"){
            let icons = document.createElement('i');
            icons.classList.add('fas','fa-grip-lines')
            div.appendChild(icons);
        } else{
            let input = createRadioInput();
            div.appendChild(input);
        }

        return div;
    }

    /**
     * Create the radio button
     */
    function createRadioInput() {
        let input = document.createElement('input');
        input.classList.add('checkbox-margin');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('name', 'catg-select');
        input.setAttribute('onclick', 'listModule.selectCategory(this)');

        return input;
    }

    /**
     * Create div for color
     */
    function createColorDiv() {
        let div = document.createElement('div');
        div.classList.add('inspector-label', 'col-md-2');
        let input = createColorInput();
        div.appendChild(input);

        return div;
    }

    /**
     * Create color input here
     */
    function createColorInput() {
        let input = document.createElement('input');
        input.classList.add('color-change');
        input.setAttribute('type', 'color');
        input.setAttribute('onchange', 'listModule.updateColor(this)');

        if (currIndex != -1) {
            input.setAttribute('value', currColor);
        } else {
            let color = helperModule.getRandomColor();
            input.setAttribute('value', color);
            category.push({'name':'New category','color':color,'id':catgIndex});
            catgIndex++;
        }
        return input;
    }

    /**
     * Create the category div
     */
    function createCategoryDiv() {
        let div = document.createElement('div');
        div.classList.add('col-md-6');
        let input = createCategoryInput();
        div.appendChild(input);

        return div;
    }

    /**
     * Create the category input
     */
    function createCategoryInput() {
        let input = document.createElement('input');
        input.classList.add('category-input');
        input.setAttribute('onchange', 'listModule.updateCategoryName(this)');

        if (currIndex == -1) {
            input.setAttribute('value', 'New Category');
            mainModule.updateChart();
        } else {
            input.setAttribute('value', currName);
        }

        return input;
    }

    /**
     * Create the delete div here
     */
    function createDeleteDiv() {

        let div = document.createElement('div');
        div.classList.add('col-md-2');
        let i = createDeleteIcon();
        div.appendChild(i);

        return div;
    }

    /**
     * Create the delete icon here
     */
    function createDeleteIcon() {
        let i = document.createElement('i');
        i.classList.add('fas', 'fa-trash-alt', 'catg-delete');
        i.setAttribute('onclick', 'listModule.deleteCategory(event,this)');
        return i;
    }

    /**
    *   
    * @param {*} el    is the id
    * @param {*} attrs is the attribute
    */
    function setAttributes(el, attrs) {

        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }

    /**
     * Minimise the category list here
     */
    function minimise() {
        let childNodes = tabId.childNodes;
        for (let index = 0; index < childNodes.length; ++index) {
            if (childNodes[index].style) {
                childNodes[index].style.display = "none";
            }
        }
    }

    /**
     * Maximise the category list here
     */
    function maximise() {

        let childNodes = tabId.childNodes;
        for (let index = 0; index < childNodes.length; ++index) {
            if (childNodes[index].style) {
                childNodes[index].style.display = "block";
            }
        }
    }

    /**
     * Delete the category
     */
    function deleteCategory(event,node) {
        event.preventDefault();
        let childNode = node.parentNode.parentNode.parentNode.parentNode;
        let listId  = parseInt(childNode.id);
        let found = -1;
        let name ;
        let color;
        for(index = 0 ;index<category.length;++index){
            if(category[index].id == listId){
                found = index;
                name = category[index].name;
                color = category[index].color;
                break; 
            }
        }

        if(found!=-1){
            category.splice(found,1);
            tabId.removeChild(childNode);
            categoryOperation.deleteCategory(name,color);
        }   
    }

    /**
     * Delete Category list from here
     */
    function deleteCategoryList(){
        let child = tabId.lastElementChild;
        while (child) {
            tabId.removeChild(child);
            child = tabId.lastElementChild;
        }
    }

    /**
     * Select the category here
     * TODO - need beter approach to do so
     */
    function selectCategory(node) {
        
        let refNode  = node.parentNode.parentNode;
        let color = refNode.childNodes[3].childNodes[0].value;
        let name = refNode.childNodes[5].childNodes[0].value;
        let selectedNodeId = refNode.parentNode.parentNode.id;

        // deselectCheckBox(type,selectedNodeId); //TODO -find better way to handle this 
        deselectCheckBox(type);
        node.checked = true;
        mainModule.handleCategory(type,name,color,currentObj);
    }

    /**
     * Set type 
     */
    function setType(catgType,object) {
        type = catgType;
        currentObj = object;
    }

    /**
     * Deselect all the checkbox for category
     */
    function deselectCheckBox(type,exception){

        if(typeof exception =="undefined"){
            exception = null;
        }

        let container = document.getElementById(type+'-catg');
        let checkbox = container.getElementsByTagName("input");

        //TODO - we can reduce the call by calling it multiple times
        for(let index=0;index<checkbox.length;++index){

            if(exception && (exception == index)){
                continue;
            }

            let item = checkbox[index];
            let type = item.getAttribute("type");
            let name = item.getAttribute("name");

            if(type == "checkbox" && name =="catg-select"){
                item.checked = false;
            }
        }
    }

    /**
     * Select the checkbox according to catg name
     * Will allow multiple selection of checkbox for seat toot
     */
    function selectCheckBox(){
   
        if(!currentObj|| !(categoryDetails = currentObj.getCategory())){
            return;
        }
        
        let indexHolder =[];

        //TODO - this two loop will be decreased in the subsequent version
        for(let index=0;index<category.length;++index){
            for(let j=0;j<categoryDetails.length;++j){
                if(!categoryDetails[j].name){
                    continue;
                }
                if(categoryDetails[j].name.toLowerCase() ==category[index].name.toLowerCase() && 
                    categoryDetails[j].color.toLowerCase() == category[index].color.toLowerCase()){
                    indexHolder.push(index);
                }
            }
        }

        indexHolder = [... new Set(indexHolder)]; //get the distinct value from an array here
        //for every index holder - holds the array 
        for(let  index = 0;index<tabId.childNodes.length;++index){
            let parent = tabId.childNodes[index];
            for(let j=0;j<indexHolder.length;++j){
                if(parent.id == indexHolder[j]){
                    let element = parent.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
                    element.setAttribute('checked',true);
                }
            }
        }
    }

    /**
     * Change the category name
     */
    function updateCategoryName(node){
        let id = node.parentNode.parentNode.parentNode.parentNode.id;
        let prevName = category[id].name;
        let prevColor = category[id].color;
        let newName = node.value;
        category[id].name = newName;  //Update to all existing  name  //TODO trim and update the category name here
        categoryOperation.updateCategory(prevName,prevColor,newName,prevColor);
    }

    /**
     * Update color name 
     */
    function updateColor(node){

        let id = node.parentNode.parentNode.parentNode.parentNode.id;
        let prevName = category[id].name;
        let prevColor = category[id].color;
        let newColor =  node.value;
        category[id].color = newColor;  //Update to all existing color
        categoryOperation.updateCategory(prevName,prevColor,prevName,newColor);
    }

    /**
     * Set the category and push the data
     * 
     * @param {*} data is the data 
     */
    function pushToCategory(data){
        category.push(data);
    }

    /**
     * Get the category 
     */
    function getCategory(){
        return category;
    }

    /**
     * Set the category 
     */
    function setCategory(catg){
        category  = catg;
    }

    return {
        createList: createList,
        deleteList: deleteList,
        addCategoryToList: addCategoryToList,
        minimise: minimise,
        maximise: maximise,
        deleteCategory: deleteCategory,
        selectCategory: selectCategory,
        deleteCategoryList:deleteCategoryList,
        setType:setType,
        deselectCheckBox:deselectCheckBox,
        selectCheckBox:selectCheckBox,
        updateCategoryName:updateCategoryName,
        updateColor:updateColor,
        pushToCategory:pushToCategory,
        getCategory:getCategory,
        setCategory:setCategory
    }
})();