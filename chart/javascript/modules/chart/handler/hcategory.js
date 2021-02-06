/**
 * Handles categories event
 * TODO -- need to find the better approach
 */
var categoryHandler = (function () {

    let addBtn = ['seat-add-category','multi-seat-add-category',
                    'section-add-category','row-add-category','matrix-add-category','chart-add-category'];
    let minBtn = ['seat-min-catg','multi-seat-min-catg','section-min-catg','row-min-catg','matrix-min-catg','chart-min-catg'];
    let maxBtn = ['seat-max-catg','multi-seat-max-catg','section-max-catg','row-max-catg','matrix-max-catg','chart-max-catg'];

    /**
     * Add Listener for Chart
     */
    function addListener() {

        addBtn.forEach(function(element){
            document.getElementById(element).addEventListener('click', categoryModule.addCategory);
        });

        minBtn.forEach(function(element){
            document.getElementById(element).addEventListener('click',categoryModule.minimiseCategory);
        });

        maxBtn.forEach(function(element){
            document.getElementById(element).addEventListener('click',categoryModule.maximiseCategory);
        });
    
    }

    return {
        addListener: addListener
    }

})();