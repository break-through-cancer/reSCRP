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

var color188 = "#614B7988";
var color288 = "#789D4A88";
var color388 = "#407EC988";
var color488 = "#CB601588";
var color588 = "#F1B43488";
var color688 = "#ED8B0088";
var color788 = "#B7BF1088";

(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = pcolor3;

var ctx = document.getElementById("HTissueFracBar");
var myCellChart = new Chart(ctx, {
  type: "radar",
  data: {
      labels: ["CD4", "CD8", "MAIT", "NKT", "Proliferative", "Tgd"],
    datasets: [
      {
        label: "Blood",
          data: [0.6657081236520489,      0.24119338605319915,     0.06865564342199856,     0.021087946321591180,       0.0033549005511622335],
          cellNumber: [5556,   2013,  573,   176,  0,              28],
        borderColor: color6,
        backgroundColor: color688,
      },
      {
        label: "BM",
          data: [0.5593133385951066,      0.3923835832675612,      0.02399368587213891,     0.023677979479084450,       0.0006314127861089187],
          cellNumber: [14173,  9943,  608,   600,  0,              16],
        borderColor: color1,
        backgroundColor: color188,
      },
      {
        label: "LN",
          data: [0.6138888888888889,      0.22144444444444444,     0.005,   0.00044444444444444447,   0.1592222222222222, 0],
          cellNumber: [5525,   1993,  45,    4,    1433,           0],
        borderColor: color2,
        backgroundColor: color288,
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
        title: function () {},
      },
    },
  },
});
