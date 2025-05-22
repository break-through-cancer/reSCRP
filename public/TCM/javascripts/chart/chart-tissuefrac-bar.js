// Set new default font family and font color to mimic Bootstrap's default styling
var pcolor1 = "#DA291C";
var pcolor2 = "#000000";
var pcolor3 = "#63666A";

var color1 = "#614B79";
var color2 = "#789D4A";
var color3 = "#407EC9";
var color4 = "#CB6015";
var color5 = "#F1B434";
var color6 = "#ED8B00";
var color7 = "#B7BF10";

var color1cc = "#614B79CC";
var color2cc = "#789D4ACC";
var color3cc = "#407EC9CC";
var color4cc = "#CB6015CC";
var color5cc = "#F1B434CC";
var color6cc = "#ED8B00CC";
var color7cc = "#B7BF10CC";

(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = pcolor3;

var ctx = document.getElementById("TissueFracBar");
var myCellChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Adrenal gland",
      "Blood",
      "BM",
      "Bone",
      "Bowel",
      "Brain",
      "Breast",
      "colon",
      "Kidney",
      "Liver",
      "LN",
      "Lung",
      "Pancreas",
      "Pelvis",
      "Peritoneal cavity",
      "Skin",
      "Soft tissue",
      "Stomach",
      "Tongue/Tonsil",
    ],
    datasets: [
      {
        label: "Healthy donor",
        data: [
          0, 0.364948183, 0.555202559, 0, 0, 0, 0, 0, 0, 0, 0.178723911, 0, 0,
          0, 0, 0, 0, 0, 0,
        ],
        cellNumber: [
          0, 8346, 25340, 0, 0, 0, 0, 0, 0, 0, 9000, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        backgroundColor: color2cc,
      },
      {
        label: "Uninvolved normal",
        data: [
          0, 0.635051817, 0, 0, 0, 0.052928438, 0.653537639, 0.423185094, 0, 0,
          0, 0.314948515, 0.00814901, 0, 0, 0, 0, 0.031992687, 0.162467456,
        ],
        cellNumber: [
          0, 14523, 0, 0, 0, 1051, 6355, 4815, 0, 0, 0, 23949, 7, 0, 0, 0, 0,
          35, 3869,
        ],
        backgroundColor: color3cc,
      },
      {
        label: "Primary tumor",
        data: [
          0, 0, 0.444797441, 0, 0, 0.934481543, 0.346462361, 0.576814906, 0,
          0.958050847, 0.702424688, 0.685051485, 0.99185099, 0, 0, 0.743916169,
          0, 0.968007313, 0.837532544,
        ],
        cellNumber: [
          0, 0, 20301, 0, 0, 18556, 3369, 6563, 0, 2261, 35372, 52092, 852, 0,
          0, 25770, 0, 1059, 19945,
        ],
        backgroundColor: color4cc,
      },
      {
        label: "Metastatic tumor",
        data: [
          1, 0, 0, 1, 1, 0.012590019, 0, 0, 1, 0.041949153, 0.118851401, 0, 0,
          1, 1, 0.256083831, 1, 0, 0,
        ],
        cellNumber: [
          2099, 0, 0, 309, 937, 250, 0, 0, 1088, 99, 5985, 0, 0, 230, 3971,
          8871, 529, 0, 0,
        ],
        backgroundColor: color5cc,
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
      yAxes: [{ stacked: true }],
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
