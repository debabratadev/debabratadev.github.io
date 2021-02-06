/**
 * Handles category display and selection
 */
var categoryModule = (function () {

    let minimise = document.querySelectorAll(".min-catg");
    let maximise = document.querySelectorAll(".max-catg");

    /**
     * Add the Category here.
     */
    function addCategory(){
        listModule.addCategoryToList();
    }

    /**
     * Minimise the category
     */
    function minimiseCategory(){
        for(let index=0;index<minimise.length;++index){
            hideAndShowBtn(maximise[index],minimise[index]);
        }
        listModule.minimise();
    }

    /**
     * Maximise the category
     */
    function maximiseCategory(){
        for(let index=0;index<minimise.length;++index){
            hideAndShowBtn(minimise[index],maximise[index]);
        }
        listModule.maximise();
    }

    /**
     * Hide and show the min and max button
     * 
     * @param {*} show is show btn
     * @param {*} hide is the min btn
     */
    function hideAndShowBtn(show,hide){
        show.style.display = "block";
        hide.style.display = "none";
    }

    return {
        addCategory:addCategory,
        minimiseCategory:minimiseCategory,
        maximiseCategory:maximiseCategory,
        hideAndShowBtn:hideAndShowBtn
    }
})();