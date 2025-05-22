// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

var ctx = document.getElementById("PBFracBar");
var myCellChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
        "Pt02_PBMC",
        "Pt05_PBMC",
        "Pt10_PB",
        "Pt10_PBMC",
        "Pt11_PB",
        "Pt11_PBMC",
        "Pt13_PBMC",
        "Pt14_PBMC",
        "Pt18_PBMC",
        "Pt19_PBMC",
        "Pt20_PBMC",
        "Pt21_PBMC",
        "Pt22_PBMC",
        "Pt23_PBMC"
    ],
    datasets: [
      {
        label: "T",
        data: [
            0.762,
            0.439,
            0.325,
            0.303,
            0.454,
            0.380,
            0.453,
            0.455,
            0.612,
            0.480,
            0.676,
            0.536,
            0.616,
            0.718
        ],
        cellNumber: [
            1503,
            835,
            387,
            1287,
            915,
            1905,
            2858,
            3674,
            5034,
            2587,
            4769,
            3966,
            4467,
            1760
        ],
        backgroundColor: "#F8766Dcc",
      },
      {
        label: "NK",
        data: [
            0.128,
            0.241,
            0.055,
            0.047,
            0.059,
            0.044,
            0.072,
            0.274,
            0.232,
            0.146,
            0.186,
            0.058,
            0.238,
            0.117
        ],
        cellNumber: [
            252,
            458,
            66,
            198,
            118,
            223,
            453,
            2214,
            1910,
            788,
            1309,
            432,
            1728,
            287
        ],
        backgroundColor: "#A3A500cc",
      },
      {
        label: "B/Plasma",
        data: [
            0.034,
            0.063,
            0.077,
            0.066,
            0.049,
            0.035,
            0.096,
            0.077,
            0.070,
            0.140,
            0.040,
            0.125,
            0.066,
            0.073
        ],
        cellNumber: [
            67,
            119,
            92,
            280,
            98,
            176,
            604,
            621,
            574,
            757,
            280,
            922,
            478,
            179
        ],
        backgroundColor: "#00BF7Dcc",
      },
      {
        label: "Myeloid",
        data: [
            0.025,
            0.208,
            0.478,
            0.525,
            0.414,
            0.524,
            0.321,
            0.150,
            0.076,
            0.078,
            0.097,
            0.234,
            0.073,
            0.064
        ],
        cellNumber: [
            50,
            396,
            569,
            2226,
            836,
            2628,
            2027,
            1207,
            623,
            423,
            682,
            1735,
            527,
            156
        ],
        backgroundColor: "#00B0F6cc",
      },
      {
        label: "Other",
        data: [
            0.051,
            0.050,
            0.065,
            0.059,
            0.025,
            0.017,
            0.059,
            0.044,
            0.010,
            0.155,
            0.002,
            0.047,
            0.007,
            0.028
        ],
        cellNumber: [
            101,
            95,
            77,
            250,
            50,
            84,
            373,
            353,
            81,
            838,
            11,
            350,
            50,
            69
        ],
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
