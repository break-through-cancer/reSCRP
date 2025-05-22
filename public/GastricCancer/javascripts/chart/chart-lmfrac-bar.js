// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

var ctx = document.getElementById("LMFracBar");
var myCellChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Pt09_LM",
      "Pt10_LM",
      "Pt12_LM",
      "Pt14_LM",
      "Pt17_LM",
      "Pt18_LM",
      "Pt20_LM",
    ],
    datasets: [
      {
        label: "T",
        data: [
            0.562,
            0.659,
            0.443,
            0.698,
            0.177,
            0.718,
            0.457,
        ],
        cellNumber: [
            829,
            1190,
            2467,
            4800,
            642,
            2090,
            943,
        ],
        backgroundColor: "#F8766Dcc",
      },
      {
        label: "B/Plasma",
        data: [
            0.052,
            0.018,
            0.020,
            0.015,
            0.039,
            0.018,
            0.093,
        ],
        cellNumber: [
            76,
            33,
            112,
            100,
            143,
            53,
            192,
        ],
        backgroundColor: "#C49A00cc",
      },
      {
        label: "NK",
        data: [
            0.090,
            0.121,
            0.070,
            0.170,
            0.043,
            0.058,
            0.058,
        ],
        cellNumber: [
            133,
            218,
            389,
            1170,
            156,
            170,
            119,
        ],
        backgroundColor: "#53B400cc",
      },
      {
        label: "Myeloid",
        data: [
            0.116,
            0.023,
            0.315,
            0.022,
            0.306,
            0.052,
            0.270,
        ],
        cellNumber: [
            171,
            41,
            1756,
            150,
            1110,
            152,
            557,
        ],
        backgroundColor: "#00C094cc",
      },
      {
        label: "Stromal",
        data: [
            0.018,
            0.004,
            0.039,
            0.013,
            0.003,
            0.151,
            0.019,
        ],
        cellNumber: [
            27,
            8,
            217,
            89,
            11,
            441,
            40,
        ],
        backgroundColor: "#00B6EBcc",
      },
      {
        label: "Epithelial",
        data: [
            0.012,
            0.001,
            0.102,
            0.007,
            0.018,
            0.002,
            0.025,
        ],
        cellNumber: [
            18,
            1,
            570,
            50,
            66,
            6,
            52,
        ],
        backgroundColor: "#A58AFFcc",
      },
      {
        label: "Malignant",
        data: [
            0.149,
            0.175,
            0.010,
            0.075,
            0.413,
            0.000,
            0.077,
        ],
        cellNumber: [
            220,
            316,
            56,
            519,
            1499,
            0,
            159,
        ],
        backgroundColor: "#FB61D7cc",
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
