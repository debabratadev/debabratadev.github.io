/**
 * Holds the overall information about the chart.
 */
function Chart() {

    this.name ="Untitled";
    this.background;
    this.chart;
    this.id;

    /**
     * Sets the chart Name.
     */
    this.setChartName= function (name){
        this.name = name;
    }

    /**
     * @return string chart name
     */
    this.getChartName = function(){
        return this.name;
    }

}