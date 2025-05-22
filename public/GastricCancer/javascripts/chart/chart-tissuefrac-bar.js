// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

var ctx = document.getElementById("TissueFracBar");
var myCellChart = new Chart(ctx, {
  type: "bar",
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
        label: "PB",
        data: [0.376, 0.325, 0.376, 0.616, 0.333,
            0.074, 0.674, 0.097, 0.234, 0.012, 0.000,
            0.000, 0.165],
        cellNumber: [
            15043, 13352, 7097, 10436, 4371,
            876, 11986, 1533, 522, 15,
            0, 0, 484],
        backgroundColor: "#F8766Dcc",
      },
      {
        label: "N",
        data: [0.104, 0.132, 0.102, 0.035, 0.275, 0.452, 0.014,
            0.028, 0.039, 0.195, 0.440, 0.123, 0.075],
        cellNumber: [4176, 5416, 1921, 599, 3601, 5341,
            244, 435, 88, 236, 616, 150, 221],
        backgroundColor: "#A3A500cc",
      },
      {
        label: "PRI",
        data: [0.137, 0.140, 0.145, 0.098, 0.122, 0.376, 0.114,
            0.155, 0.145, 0.714, 0.289, 0.545, 0.255],
        cellNumber: [5477, 5753, 2734, 1657, 1606, 4449,
            2029, 2457, 323, 864, 404, 667, 750],
        backgroundColor: "#00BF7Dcc",
      },
      {
        label: "PC",
        data: [0.292, 0.261, 0.231, 0.113, 0.252, 0.057, 0.137,
            0.567, 0.450, 0.030, 0.094, 0.000, 0.230],
        cellNumber: [11680, 10741, 4354, 1908, 3311, 679, 2430,
            8961, 1005, 36, 131, 0, 677],
        backgroundColor: "#00B0F6cc",
      },
      {
        label: "LM",
        data: [0.090, 0.143, 0.146, 0.139, 0.017, 0.041, 0.062,
            0.154, 0.133, 0.049, 0.177, 0.332, 0.275],
        cellNumber: [3612, 5883, 2753, 2355, 225, 484, 1094,
            2430, 297, 59, 248, 406, 809],
        backgroundColor: "#E76BF3cc",
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      labels: {
        usePointStyle: false,
        boxWidth: 12,
      },
    },
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true,
            max: 1.0,
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          return [
            data.datasets[tooltipItem.datasetIndex].label +
              " fraction: " +
              data.datasets[tooltipItem.datasetIndex].data[
                tooltipItem.index
              ].toFixed(2),
            "Cell number: " +
              data.datasets[tooltipItem.datasetIndex].cellNumber[
                tooltipItem.index
              ],
          ];
        },
      },
    },
  },
});
