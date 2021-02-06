/**
 * Helper module to carry out common inspector methods
 */
var helperModule = (function () {

    let inspector = ['row-inspector', 'chart-inspector', 'section-inspector',
        'matrix-inspector', 'seat-inspector', 'multi-seat-inspector', 'text-inspector',
        'rectangle-inspector', 'polygon-inspector', 'ellipse-inspector', 'image-inspector',
        'row-config-inspector','matrix-config-inspector'];

    let tools = ['section-btn', 'seat-btn', 'choose-btn', 'matrix-btn', 'delete-btn', 'select-seat-btn',
        'text-btn', 'rect-shape-btn', 'ellipse-shape-btn', 'poly-shape-btn', 'img-btn', 'node-btn'];

    let iconTools =  ['section-icon-btn', 'seat-icon-btn', 'choose-icon-btn', 'matrix-icon-btn', 'delete-icon-btn', 'select-seat-icon-btn',
    'text-icon-btn', 'rect-shape-icon-btn', 'ellipse-shape-icon-btn', 'poly-shape-icon-btn', 'img-icon-btn', 'node-icon-btn'];;

    let delTool = 'delete-btn';

    let defaultColor = '#6C58B3';
    let tempColor = "#DF2800";

    let exitChart = document.getElementsByClassName('exit-chart');
    let exitSection = document.getElementsByClassName('exit-section');

    /**
     * Generate random color for use here
     */
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    /**
     * Search for the string
     * 
     * @param {*} find 
     * @param {*} within 
     */
    function regularExpressionSearch(find, within) {
        find = find.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&");
        let searchExpression = new RegExp("^" + find + ".*$", 'i');

        return searchExpression.test(within);
    }

    /**
     * Sets the cursor type to the resize type
     * TODO -- remove the cursor type module
     */
    function cursorResizeType(idArray) {

        idArray.forEach(element => {
            document.getElementById(element).style.cursor = "w-resize";
        });
    }

    /**
     * Choose here which inspector to show and hide here.
     * 
     * @param {*} id is the id of the inspector.
     */
    function showInspector(id) {

        inspector.forEach(element => {
            if (element == id) {
                document.getElementById(element).style.display = "block";
                if(element == 'chart-inspector'){
                    handleChartInspector();
                }
            }
            else {
                document.getElementById(element).style.display = "none";
            }
        });
    }

    /**
     * Handle the chart inspector
     * TODO remove this instance with section and seat instances
     */
    function handleChartInspector(){

        let component = mainModule.getComponent();
        let sectionComponent = component['section'];
        let seatComponent = sharedComponent.updateSeatComponent(component['row'], component['matrix']);

        if(!sectionComponent.length && !seatComponent.length){
            
            toggleBlocks('empty-chart','not-empty-chart');
            return;
        }

        let sectionLength = sectionComponent.length;
        let seatLength = seatComponent.length;
        document.getElementById('section-count').value=sectionLength;
        document.getElementById('seat-count').value = seatLength;

        //TODO will move it somewhere else
        let catg = sharedComponent.getCategorisedObjectCount(sectionComponent,sectionLength);
        catg+=sharedComponent.getCategorisedObjectCount(seatComponent,seatLength);
        
        document.getElementById('not-catg-count').value=sectionLength +seatLength - catg;
        document.getElementById('catg-count').value = catg;
        
        toggleBlocks('not-empty-chart','empty-chart');
    }

    /**
     * Handle the section inspector
     */
    function handleSectionInspector(component){

        //update the seat component for any changes in the rows and the matrices
        component.updateChildComponent();

        let seatsComponent = sharedComponent.updateSeatComponent(component.seatRowComponent, component.matrixRowComponent);
        let length = seatsComponent.length;
        let catgLength = sharedComponent.getCategorisedObjectCount(seatsComponent,length);
        let nonCatgLength = length - catgLength;

        if(!length){                
            toggleBlocks('empty-section','not-empty-section');
        } else{
            toggleBlocks('not-empty-section','empty-section');
            document.getElementById('section-seat-count').value = length;
            document.getElementById('non-catg-section-count').value = nonCatgLength;
            document.getElementById('catg-section-count').value = catgLength;
        }
    }

    /**
     * show and hide the block to be used
     */
    function displayBlock(block, display) {
        block.forEach(element => {
            document.getElementById(element).style.display = display;
        });
    }

    /**
     * Show and  hide the block
     * 
     * @param {*} id      is the element id
     * @param {*} display is the 
     */
    function showAndHideBlock(id, display) {
        if (display) {
            document.getElementById(id).style.display = "block";
        } else {
            document.getElementById(id).style.display = "none";
        }
    }

    /**
     * Toggle the blocks
     */
    function toggleBlocks(id1,id2){
        document.getElementById(id1).style.display ='block';
        document.getElementById(id2).style.display='none';
    }

    /**
     * add and remove class simultaneosuly
     *
     * @param {*} element1 is the id of element
     * @param {*} element2 is the id of the element
     * @param {*} className is the name of the class
     */
    function addRemoveClass(element1, element2, className) {
        document.getElementById(element1).classList.add(className);
        document.getElementById(element2).classList.remove(className);
    }

    /**
     * Change the icon color
     * Select and deselect the icon color
     *  
     * @param {*} id is the element id
     */
    function changeIconColor(id) {
        let index = 0;
        tools.forEach(element => {
            if (element == id) {
                document.getElementById(iconTools[index]).style.color = tempColor;
            } else {
                document.getElementById(iconTools[index]).style.color = defaultColor;
            }
            index++;
        });
    }

    /**
     * Toggle the delete icon here
     * 
     * @param {boolean} show is whether selected or not.
     */
    function selectDeleteIcon(show) {
        if (show) {
            document.getElementById(delTool).style.color = tempColor;
        } else {
            document.getElementById(delTool).style.color = defaultColor;
        }
    }

    /**
     * Show and hide the exit btn
     * 
     * @param {boolean} sectionDisplay set true or false for the section exit btn
     * @param {boolean} chartDisplay set true or false for the chart exit btn
     */
    function showAndHideExitBtn(sectionDisplay,chartDisplay){
        for(let index=0;index<exitChart.length;++index){
            exitSection[index].style.display=sectionDisplay;
            exitChart[index].style.display=chartDisplay;
        }
    }

    return {
        getRandomColor: getRandomColor,
        regularExpressionSearch: regularExpressionSearch,
        cursorResizeType: cursorResizeType,
        showInspector: showInspector,
        displayBlock: displayBlock,
        showAndHideBlock: showAndHideBlock,
        addRemoveClass: addRemoveClass,
        changeIconColor:changeIconColor,
        selectDeleteIcon:selectDeleteIcon,
        handleChartInspector:handleChartInspector,
        showAndHideExitBtn:showAndHideExitBtn,
        handleSectionInspector:handleSectionInspector
    }
}
)();