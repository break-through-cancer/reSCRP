// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

// Pie Chart Example
var ctx = document.getElementById("PieChart2");
var myPieChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: [
      "T cell",
      "NK cell",
      "B/Plasma cell",
      "Myeloid cell",
      "Stromal cell",
      "Epithelial cell",
      "Other cell",
      "Malignant cell",
    ],
    datasets: [
      {
        data: [0.468, 0.078, 0.112, 0.171, 0.019, 0.072, 0.013, 0.067],
        cellnumber: [103965, 17318, 24965, 38077, 4298, 16055, 2782, 14780],
        backgroundColor: [
          "#00ba38cc",
          "#00c1a9cc",
          "#00b4f0cc",
          "#ff6c91cc",
          "#de8c00cc",
          "#9da700cc",
          "#9f8cffcc",
          "#f564e3cc",
        ],
        hoverBackgroundColor: [
          "#00ba38",
          "#00c1a9",
          "#00b4f0",
          "#ff6c91",
          "#de8c00",
          "#9da700",
          "#9f8cff",
          "#f564e3",
        ],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    rotation: -Math.PI,
    legend: {
      display: false,
    },
    layout: { padding: 60 },
    plugins: {
      legend: false,
      outlabels: {
        text: "%l %p",
        color: "white",
        stretch: 12,
        font: {
          resizable: true,
          minSize: 12,
          maxSize: 18,
          size: 18,
        },
      },
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          return [
            data.labels[tooltipItem.index] +
              " fraction: " +
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index],
            "Cell number: " +
              data.datasets[tooltipItem.datasetIndex].cellnumber[
                tooltipItem.index
              ],
          ];
        },
      },
    },
  },
});
