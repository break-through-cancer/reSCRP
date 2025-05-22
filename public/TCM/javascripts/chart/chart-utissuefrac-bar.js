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

var ctx = document.getElementById("UTissueFracBar");
var myCellChart = new Chart(ctx, {
  type: "radar",
  data: {
      labels: ["CD4", "CD8", "MAIT", "NKT", "Proliferative", "Tgd"],
    datasets: [
      {
        label: "Blood",
          data: [0.5407973559181988,      0.33491702816222546,     0.06555119465675135,     0.053363630103973006,       0.0037870963299593747,   0.0015836948288921022],
          cellNumber: [7854,   4864,  952,   775,  55,             23],
        borderColor: color2,
        backgroundColor: color288,
      },
      {
        label: "Brain",
          data: [0.47002854424357754,     0.4652711703139867,      0.04281636536631779,     0.012369172216936251,       0.008563273073263558,    0.00095147478591817324],
          cellNumber: [494,    489,   45,    13,   9,              1],
        borderColor: color3,
        backgroundColor: color388,
      },
      {
        label: "Breast",
          data: [0.6753737214791503,      0.3043273013375295,      0.01856805664830842,     0.0015735641227380016,      0,       0.00015735641227380016],
          cellNumber: [4292,   1934,  118,   10,   0,              1],
        borderColor: color4,
        backgroundColor: color488,
      },
      {
        label: "Colon",
          data: [0.5607476635514018,      0.3829698857736241,      0.037383177570093455,    0.00809968847352025,        0.010799584631360333,    0],
          cellNumber: [2700,   1844,  180,   39,   52,             0],
        borderColor: color5,
        backgroundColor: color588,
      },
      {
        label: "Lung",
          data: [0.5680240064203217,      0.34366167696011723,     0.019295858194633447,    0.031368854461076796,       0.03573048606022541,     0.0019191179036253882],
          cellNumber: [16279,  9849,  553,   899,  1024,           55],
        borderColor: color6,
        backgroundColor: color688,
      },
      {
        label: "Tong/Tonsil",
          data: [0.8761953993279917,      0.11243215301111398,     0.002843111915223572,       0,       0.008529335745670715,    0],
          cellNumber: [3390,   435,   11,    0,    33,             0],
        borderColor: color7,
        backgroundColor: color788,
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
