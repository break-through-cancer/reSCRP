// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

var ctx = document.getElementById("PCFracBar");
var myCellChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Pt02_PC",
      "Pt03_PC",
      "Pt04_PC",
      "Pt05_PC",
      "Pt11_PC",
      "Pt13_PC",
      "Pt19_PC",
      "Pt21_PC",
      "Pt22_PC",
      "Pt23_PC",
    ],
    datasets: [
      {
        label: "T",
        data: [
          0.46840328027014, 0.506128550074738, 0.118713017751479,
          0.83254593175853, 0.210413183663721, 0.499905177318415,
          0.444915254237288, 0.681037208812059, 0.671542267154227,
          0.509175607001694,
        ],
        cellNumber: [971, 1693, 321, 1586, 881, 5272, 3150, 6461, 3122, 3607],
        backgroundColor: "#F8766Dcc",
      },
      {
        label: "B/Plasma",
        data: [
          0.0154365653642065, 0.0319880418535127, 0.00739644970414201,
          0.0220472440944882, 0.0212562694053021, 0.0287312725203869,
          0.0806497175141243, 0.155475914409192, 0.111852011185201,
          0.117306606437041,
        ],
        cellNumber: [32, 107, 20, 42, 89, 303, 571, 1475, 520, 831],
        backgroundColor: "#C49A00cc",
      },
      {
        label: "NK",
        data: [
          0.0829715388326097, 0.0633781763826607, 0.00739644970414201,
          0.0708661417322835, 0.0133747313112013, 0.0354636829129528,
          0.018361581920904, 0.0149678507431222, 0.0662508066250807,
          0.0506775832862789,
        ],
        cellNumber: [172, 212, 20, 135, 56, 374, 130, 142, 308, 359],
        backgroundColor: "#53B400cc",
      },
      {
        label: "Myeloid",
        data: [
          0.423540762180415, 0.395515695067265, 0.105399408284024,
          0.0614173228346457, 0.234774301409123, 0.323914280295847,
          0.244632768361582, 0.146410878043639, 0.0907722090772209,
          0.320863918690006,
        ],
        cellNumber: [878, 1323, 285, 117, 983, 3416, 1732, 1389, 422, 2273],
        backgroundColor: "#00C094cc",
      },
      {
        label: "Stromal",
        data: [
          0.00964785335262904, 0.00209267563527653, 0, 0.010498687664042,
          0.00119417243850012, 0.00113787217902522, 0.00127118644067797,
          0.000632444397596711, 0.0111852011185201, 0.000282326369282891,
        ],
        cellNumber: [20, 7, 0, 20, 5, 12, 9, 6, 52, 2],
        backgroundColor: "#00B6EBcc",
      },
      {
        label: "Epithelial",
        data: [
          0, 0, 0.0299556213017751, 0.0005249343832021, 0.0205397659422021,
          0.00625829698463873, 0.00621468926553672, 0.00126488879519342,
          0.00795870079587008, 0.000564652738565782,
        ],
        cellNumber: [0, 0, 81, 1, 86, 66, 44, 12, 37, 4],
        backgroundColor: "#A58AFFcc",
      },
      {
        label: "Malignant",
        data: [
          0, 0.000896860986547085, 0.731139053254438, 0.0020997375328084,
          0.49844757582995, 0.104589417788735, 0.203954802259887,
          0.000210814799198904, 0.0404388040438804, 0.00112930547713156,
        ],
        cellNumber: [0, 3, 1977, 4, 2087, 1103, 1444, 2, 188, 8],
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
