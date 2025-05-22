// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

var ctx = document.getElementById("TissueFracBar");
var myCellChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "CD4T",
      "CD8T",
      "OtherT",
      "NK",
      "B",
      "Plasma",
      "Mono",
      "Mac",
      "DC",
      "Mast",
      "CAF",
      "Endo",
      "Prolif",
    ],
    datasets: [
      {
        label: "PB",
        data: [
          0.376187856356907, 0.324510876169644, 0.376318998886473,
          0.615511648481274, 0.333307915205124, 0.0740552878518894,
          0.674014508238205, 0.0969271623672231, 0.233557046979866,
          0.012396694214876, 0, 0, 0.164569874192452,
        ],
        cellNumber: [
          15043, 13352, 7097, 10436, 4371, 876, 11986, 1533, 522, 15, 0, 0, 484,
        ],
        backgroundColor: "#F8766Dcc",
      },
      {
        label: "N",
        data: [
          0.10443132939882, 0.131632033053834, 0.1018611803383,
          0.0353288115600118, 0.274592039042245, 0.451517457096965,
          0.0137209694652196, 0.0275037936267071, 0.0393736017897092,
          0.19504132231405, 0.440314510364546, 0.122649223221586,
          0.0751445086705202,
        ],
        cellNumber: [
          4176, 5416, 1921, 599, 3601, 5341, 244, 435, 88, 236, 616, 150, 221,
        ],
        backgroundColor: "#A3A500cc",
      },
      {
        label: "PRI",
        data: [
          0.136966089826948, 0.139822578685138, 0.144970571080121,
          0.097729283397228, 0.122464541711148, 0.376109561247781,
          0.114097733790699, 0.155349013657056, 0.144519015659955,
          0.714049586776859, 0.288777698355969, 0.545380212591987,
          0.255015300918055,
        ],
        cellNumber: [
          5477, 5753, 2734, 1657, 1606, 4449, 2029, 2457, 323, 864, 404, 667,
          750,
        ],
        backgroundColor: "#00BF7Dcc",
      },
      {
        label: "PC",
        data: [
          0.292087626287886, 0.261052375744319, 0.230871202078583,
          0.112533176054261, 0.252478267500381, 0.0574013018851974,
          0.136647359838048, 0.566578148710167, 0.449664429530201,
          0.0297520661157025, 0.093638313080772, 0, 0.230193811628698,
        ],
        cellNumber: [
          11680, 10741, 4354, 1908, 3311, 679, 2430, 8961, 1005, 36, 131, 0,
          677,
        ],
        backgroundColor: "#00B0F6cc",
      },
      {
        label: "LM",
        data: [
          0.0903270981294388, 0.142982136347065, 0.145978047616523,
          0.138897080507225, 0.0171572365411011, 0.0409163919181672,
          0.0615194286678288, 0.153641881638847, 0.132885906040268,
          0.0487603305785124, 0.177269478198713, 0.331970564186427,
          0.275076504590275,
        ],
        cellNumber: [
          3612, 5883, 2753, 2355, 225, 484, 1094, 2430, 297, 59, 248, 406, 809,
        ],
        backgroundColor: "#E76BF3cc",
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
