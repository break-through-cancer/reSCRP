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

var ctx = document.getElementById("PTissueFracBar");
var myCellChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "AML_BM",
      "BCC_Skin",
      "BRCA_Breast",
      "CRC_colon",
      "DLBCL_LN",
      "FL_LN",
      "GBM_Brain",
      "HCC_Liver",
      "HNSC_Tongue/Tonsil",
      "LGG_Brain",
      "NSCLC_Lung",
      "PDAC_Pancreas",
      "SKCM_Skin",
      "STAD_Stomach",
    ],
    datasets: [
      {
        label: "CD4",
        data: [
            0.416826757,	0.605790733,	0.531611754,	0.564071309,	0.394897688,	0.687497405,	0.392547093,	0.655904467,	0.603409376,	0.337220296,	0.606529681,	0.569248826,	0.558718861,	0.502360718
        ],
        cellNumber: [
            8462, 15441, 1791, 3702, 4458, 16557, 4793, 1483, 12035, 2140, 28721,
            485, 157, 532
        ],
        backgroundColor: color2cc,
      },
      {
        label: "CD8",
        data: [
            0.431604354,	0.335556515,	0.455624814,	0.370866982,	0.325360971,	0.220155296,	0.55970516,	0.226006192,	0.342140887,	0.55609833,	0.349375964,	0.149061033,	0.395017794,	0.466477809
        ],
        cellNumber: [
            8762,	8553,	1535,	2434,	3673,	5302,	6834,	511,	6824,	3529,	16544,	127,	111,	494],
        backgroundColor: color3cc,
      },
      {
        label: "MAIT",
        data: [
            0.055366731,	0.008827337,	0.008607896,	0.025293311,	0.000531,	0.001453307,	0.014496314,	0.011057054,	0.019553773,	0.051843681,	0.010347813,	0.037558685,	0.007117438,	0.020774315
        ],
        cellNumber: [
            1124,	225,	29,	166,	6,	35,	177,	25,	390,	329,	490,	32,	2,	22
        ],
        backgroundColor: color4cc,
      },
      {
        label: "NKT",
        data: [
            0.014285011,	0.006002589,	0.004155536,	0.008685053,	0.000266,	0.0000830,	0.002866503,	0.00619195,	0.001203309,	0.024424835,	0.002132917,	0.003521127,	0,	0.006610009
        ],
          cellNumber: [290,	153,	14,	57,	3,	2,	35,	14,	24,	155,	101,	3,	0,	7],
        backgroundColor: color5cc,
      },
      {
        label: "Proliferative",
        data: [
            0,	0.043665895,	0,	0.030930977,	0.278944105,	0.090810945,	0.029484029,	0.100840336,	0.033692655,	0.030255279,	0.031550271,	0.23943662,	0.039145907,	0
        ],
        cellNumber: [
            0,	1113,	0,	203,	3149,	2187,	360,	228,	672,	192,	1494,	204,	11,	0
        ],
        backgroundColor: color6cc,
      },
        {
            label: "Tgd",
            data: [
                0.081917147,	0.000157,	0,	0.000152,	0,	0,	0.00090,	0,	0,	0.000158,	0.0000634,	0.001173709,	0,	0.003777148
            ],
            cellNumber: [
                1663,	4,	0,	1,	0,	0,	11,	0,	0,	1,	3,	1,	0,	4
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
