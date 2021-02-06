/**
 * Handlea activities for chart inspector
 */
var chartInspector = (function () {

  let chart = document.getElementById('chart-name');
  let displayId = document.getElementById('display-chart-name');
  let chartObject;

  /**
   * Sets the chart objec here
   */
  function setChartObject(object) {
    chartObject = object;
  }

  /**
   * Sets the chart Name
   */
  function setChartName() {
    let value = chart.value;
    chartObject.setChartName(value)
    displayId.value = value;

    mainModule.updateChart();
  }


  return {
    setChartObject: setChartObject,
    setChartName: setChartName,
  }
})();