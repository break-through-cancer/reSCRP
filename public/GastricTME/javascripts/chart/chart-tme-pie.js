// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

// Pie Chart Example
var ctx = document.getElementById("PieChart3");
var myPieChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: [
      "CD4T",
      "CD8T",
      "OtherT",
      "NK",
      "B",
      "Plasma",
      "Mono",
      "Mac",
      "DC",
      "Mast",
      "CAF",
      "Endo",
      "Prolif",
    ],
    datasets: [
      {
        data: [
          0.215, 0.223, 0.102, 0.092, 0.07, 0.063, 0.096, 0.085, 0.012, 0.006,
          0.012, 0.01, 0.016,
        ],
        cellnumber: [
          40505, 42023, 19180, 17318, 13122, 11843, 18015, 15962, 2273, 1212,
          2333, 1846, 2991,
        ],
        backgroundColor: [
          "#F8766Dcc",
          "#E18A00cc",
          "#BE9C00cc",
          "#8CAB00cc",
          "#24B700cc",
          "#00BE70cc",
          "#00C1ABcc",
          "#00BBDAcc",
          "#00ACFCcc",
          "#8B93FFcc",
          "#D575FEcc",
          "#F962DDcc",
          "#FF65ACcc",
        ],
        hoverBackgroundColor: [
          "#F8766D",
          "#E18A00",
          "#BE9C00",
          "#8CAB00",
          "#24B700",
          "#00BE70",
          "#00C1AB",
          "#00BBDA",
          "#00ACFC",
          "#8B93FF",
          "#D575FE",
          "#F962DD",
          "#FF65AC",
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
