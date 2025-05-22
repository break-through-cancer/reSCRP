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

var ctx = document.getElementById("SamplePatientBar");
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
        label: "Sample number",
        data: [5, 22, 30, 2, 9, 20, 8, 15, 19, 77, 95, 4, 27, 5, 98, 4, 5, 27],
        backgroundColor: color2cc,
      },
      {
        label: "Patient/Subject number",
        data: [5, 22, 16, 2, 8, 20, 8, 15, 19, 71, 40, 4, 27, 4, 56, 4, 4, 23],
        backgroundColor: color3cc,
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
    legend: {
      labels: {
        usePointStyle: false,
        boxWidth: 12,
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
            min: 1,
            max: 100,
          },
        },
      ],
    },
  },
});
