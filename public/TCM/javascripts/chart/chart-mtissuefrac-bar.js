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
Chart.defaults.global.defaultFontColor = "#858796";

var ctx = document.getElementById("MTissueFracBar");
var myCellChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "HNSC_LN",
      "NSCLC_Adrenal gland",
      "NSCLC_Bone",
      "NSCLC_Brain",
      "NSCLC_Kidney",
      "NSCLC_LN",
      "OV_Peritoneal cavity",
      "SKCM_Adrenal gland",
      "SKCM_Bone",
      "SKCM_Bowel",
      "SKCM_Liver",
      "SKCM_LN",
      "SKCM_Muscular",
      "SKCM_Pelvis",
      "SKCM_Skin",
      "SKCM_Soft tissue",
      "SKCM_Spleen",
      "STAD_Peritoneal cavity",
    ],
    datasets: [
      {
        label: "CD4",
        data: [
            0.366197183,	0.262594458,	0.43,	0.84,	0.773897059,	0.76039783,	0.599309154,	0.689655172,	0.401174168,	0.373205742,	0.33511206,	0.464646465,	0.391984569,	0.595744681,	0.282608696,	0.379664074,	0.306238185,	0.564516129,	0.455237243
        ],
        cellNumber: [
            78,	417,	43,	210,	842,	841,	1041,	20,	205,	78,	314,	46,	1829,	112,	65,	3368,	162,	35,	1017
        ],
        backgroundColor: color2cc,
      },
      {
        label: "CD8",
        data: [
            0.633802817,	0.685768262,	0.42,	0.048,	0.196691176,	0.236889693,	0.310880829,	0.275862069,	0.440313112,	0.574162679,	0.585912487,	0.525252525,	0.481783112,	0.287234043,	0.665217391,	0.503099989,	0.627599244,	0.338709677,	0.483885407
        ],
        cellNumber: [
            135,	1089,	42,	12,	214,	262,	540,	8,	225,	120,	549,	52,	2248,	54,	153,	4463,	332,	21,	1081
        ],
        backgroundColor: color3cc,
      },
      {
        label: "MAIT",
        data: [
            0,	0.003778338,	0.02,	0.004,	0.029411765,	0.002712477,	0.088082902,	0.034482759,	0,	0,	0.008537887,	0,	0.006000857,	0,	0,	0.008567242,	0.001890359,	0.096774194,	0.034019696
        ],
        cellNumber: [
            0,	6,	2,	1,	32,	3,	153,	1,	0,	0,	8,	0,	28,	0,	0,	76,	1,	6,	76
        ],
        backgroundColor: color4cc,
      },
      {
        label: "NKT",
        data: [
            0,	0.006926952,	0.09,	0.004,	0,	0,	0.001727116,	0,	0.135029354,	0.033492823,	0.027748132,	0,	0.02743249,	0,	0.017391304,	0.019276294,	0.024574669,	0,	0.026410027
        ],
        cellNumber: [
            0,	11,	9,	1,	0,	0,	3,	0,	69,	7,	26,	0,	128,	0,	4,	171,	13,	0,	59
        ],
        backgroundColor: color5cc,
      },
      {
        label: "Proliferative",
        data: [
            0,	0.04093199,	0.04,	0.104,	0,	0,	0,	0,	0.021526419,	0.019138756,	0.042689434,	0.01010101,	0.092584655,	0.117021277,	0.034782609,	0.088603314,	0.037807183,	0,	0
        ],
        cellNumber: [
            0,	65,	4,	26,	0,	0,	0,	0,	11,	4,	40,	1,	432,	22,	8,	786,	20,	0,	0
        ],
        backgroundColor: color6cc,
      },
        {
            label: "Tgd",
            data: [
                0,	0,	0,	0,	0,	0,	0,	0,	0.001956947,	0,	0,	0,	0.000214,	0,	0,	0.000789,	0.001890359,	0,	0.000448
            ],
            cellNumber: [
                0,	0,	0,	0,	0,	0,	0,	0,	1,	0,	0,	0,	1,	0,	0,	7,	1,	0,	1
            ],
            backgroundColor: color7cc,
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
