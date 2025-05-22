// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

var ctx = document.getElementById("MultipleBarPlot1");
var myCellChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "P01",
      "P02",
      "P03",
      "P04",
      "P05",
      "P09",
      "P10",
      "P11",
      "P12",
      "P13",
      "P14",
      "P15",
      "P16",
      "P17",
      "P18",
      "P19",
      "P20",
      "P21",
      "P22",
      "P23",
    ],
    datasets: [
      {
        label: "GEX",
        data: [
          1082, 5358, 4537, 4526, 7092, 3467, 13070, 13677, 9798, 21355, 21428,
          10088, 5246, 6985, 13727, 14301, 13246, 22556, 17125, 13576,
        ],
        backgroundColor: "#F8766Dcc",
      },
      {
        label: "TCR",
        data: [
          275, 2211, 1832, 411, 2677, 1625, 5082, 4282, 3963, 7036, 7414, 3405,
          1039, 1891, 6262, 5233, 4140, 11078, 7995, 5523,
        ],
        backgroundColor: "#00BA38cc",
      },
      {
        label: "BCR",
        data: [
          529, 1919, 560, 434, 1928, 1673, 2205, 424, 1978, 2153, 2466, 3141,
          2350, 680, 2244, 1959, 2024, 4825, 3323, 5621,
        ],
        backgroundColor: "#619CFFcc",
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
        },
      ],
    },
  },
});
