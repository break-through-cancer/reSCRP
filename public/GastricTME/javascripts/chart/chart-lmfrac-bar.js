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
          0.562415196743555, 0.658550083010515, 0.443147116939105,
          0.697877289909858, 0.177005789909016, 0.71771978021978,
          0.457322987390883,
        ],
        cellNumber: [829, 1190, 2467, 4800, 642, 2090, 943],
        backgroundColor: "#F8766Dcc",
      },
      {
        label: "B/Plasma",
        data: [
          0.0515603799185889, 0.018262313226342, 0.0201185557751033,
          0.0145391102064554, 0.039426523297491, 0.0182005494505495,
          0.0931134820562561,
        ],
        cellNumber: [76, 33, 112, 100, 143, 53, 192],
        backgroundColor: "#C49A00cc",
      },
      {
        label: "NK",
        data: [
          0.0902306648575305, 0.120641947980077, 0.0698760553260284,
          0.170107589415528, 0.043010752688172, 0.0583791208791209,
          0.0577109602327837,
        ],
        cellNumber: [133, 218, 389, 1170, 156, 170, 119],
        backgroundColor: "#53B400cc",
      },
      {
        label: "Myeloid",
        data: [
          0.116010854816825, 0.0226895406751522, 0.315430213759655,
          0.021808665309683, 0.306038047973532, 0.0521978021978022,
          0.270126091173618,
        ],
        cellNumber: [171, 41, 1756, 150, 1110, 152, 557],
        backgroundColor: "#00C094cc",
      },
      {
        label: "Stromal",
        data: [
          0.0183175033921303, 0.00442722744881018, 0.0389797018142626,
          0.0129398080837453, 0.00303280948442239, 0.151442307692308,
          0.0193986420950533,
        ],
        cellNumber: [27, 8, 217, 89, 11, 441, 40],
        backgroundColor: "#00B6EBcc",
      },
      {
        label: "Epithelial",
        data: [
          0.0122116689280868, 0.000553403431101273, 0.102389078498294,
          0.00726955510322768, 0.0181968569065343, 0.00206043956043956,
          0.0252182347235693,
        ],
        cellNumber: [18, 1, 570, 50, 66, 6, 52],
        backgroundColor: "#A58AFFcc",
      },
      {
        label: "Malignant",
        data: [
          0.149253731343284, 0.174875484228002, 0.0100592778875516,
          0.0754579819715033, 0.413289219740833, 0, 0.077109602327837,
        ],
        cellNumber: [220, 316, 56, 519, 1499, 0, 159],
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
