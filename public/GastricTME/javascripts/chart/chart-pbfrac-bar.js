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
      "Pt23_PBMC",
    ],
    datasets: [
      {
        label: "T",
        data: [
          0.761784085149518, 0.438780872306884, 0.324937027707809,
          0.303466163640651, 0.453644025780863, 0.379784688995215,
          0.452573238321457, 0.455322840500682, 0.612259790805157,
          0.479695902095309, 0.676357963409445, 0.535584064821067,
          0.616137931034483, 0.718074255405957,
        ],
        cellNumber: [
          1503, 835, 387, 1287, 915, 1905, 2858, 3674, 5034, 2587, 4769, 3966,
          4467, 1760,
        ],
        backgroundColor: "#F8766Dcc",
      },
      {
        label: "NK",
        data: [
          0.12772427774962, 0.240672622175512, 0.0554156171284635,
          0.0466871020985617, 0.0585027268220129, 0.0444577352472089,
          0.0717339667458432, 0.2743834428058, 0.232303575772318,
          0.146115334693121, 0.185647425897036, 0.0583389601620527,
          0.238344827586207, 0.117095063239494,
        ],
        cellNumber: [
          252, 458, 66, 198, 118, 223, 453, 2214, 1910, 788, 1309, 432, 1728,
          287,
        ],
        backgroundColor: "#A3A500cc",
      },
      {
        label: "B/Plasma",
        data: [
          0.0339584389254942, 0.0625328428796637, 0.0772460117548279,
          0.0660221645838246, 0.0485870104115022, 0.0350877192982456,
          0.0956452889944576, 0.0769612095674805, 0.0698126976404768,
          0.140367142592249, 0.0397106793362644, 0.124510465901418,
          0.0659310344827586, 0.073031415748674,
        ],
        cellNumber: [
          67, 119, 92, 280, 98, 176, 604, 621, 574, 757, 280, 922, 478, 179,
        ],
        backgroundColor: "#00BF7Dcc",
      },
      {
        label: "Myeloid",
        data: [
          0.0253421186011151, 0.208092485549133, 0.477749790092359,
          0.524876208441405, 0.414476945959346, 0.523923444976077,
          0.32098178939034, 0.149584830834056, 0.0757723181707614,
          0.0784350083441498, 0.0967238689547582, 0.234301147873059,
          0.0726896551724138, 0.0636474908200734,
        ],
        cellNumber: [
          50, 396, 569, 2226, 836, 2628, 2027, 1207, 623, 423, 682, 1735, 527,
          156,
        ],
        backgroundColor: "#00B0F6cc",
      },
      {
        label: "Blood",
        data: [
          0.0511910795742524, 0.0499211770888071, 0.0646515533165407,
          0.0589483612355577, 0.0247892910262766, 0.0167464114832536,
          0.0590657165479018, 0.0437476762919817, 0.00985161761128679,
          0.155386612275172, 0.0015600624024961, 0.0472653612424038,
          0.00689655172413793, 0.0281517747858017,
        ],
        cellNumber: [
          101, 95, 77, 250, 50, 84, 373, 353, 81, 838, 11, 350, 50, 69,
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
