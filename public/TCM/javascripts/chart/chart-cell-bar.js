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

var ctx = document.getElementById("CellNumberBar");

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
      "Liver",
      "LN",
      "Lung",
      "Others",
      "Pancreas",
      "Peritoneal cavity",
      "Skin",
      "Soft tissue",
      "Stomach",
      "Tongue/Tonsil",
    ],
    datasets: [
      {
        label: "Cell number",
        data: [
          2099, 22869, 45641, 309, 937, 19857, 9724, 11378, 2360, 50357, 76041,
          1568, 859, 3971, 34641, 529, 1094, 23814,
        ],
        backgroundColor: color1cc,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Cell number:",
      },
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          type: "logarithmic",
          ticks: {
            autoSkip: false,
            min: 100,
            max: 100000,
          },
        },
      ],
    },
    legend: { display: false },
  },
});
