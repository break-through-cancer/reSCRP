//--------------------------------------------------------------//
// filename : chart-multiplebarplot1-bar.js
// module   : OvarianMRD
// date     : 2025-10-21
// contributor : Adapted by Renad Al-Ghazawi
// function : Bar chart of total cell counts per cell type
//--------------------------------------------------------------//

Chart.defaults.global.defaultFontFamily =
  'Nunito, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

// Data from ovmrd database
const cellCounts = {
  CD4T: 18440,
  CD8T: 20242,
  BPlasma: 2956,
  Myeloid: 31685,
  NK: 6355,
  TNK: 51869,
};

const ctx = document.getElementById("MultipleBarPlot1");
const myCellChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: Object.keys(cellCounts),
    datasets: [
      {
        label: "Cell Count",
        data: Object.values(cellCounts),
        backgroundColor: [
          "#00ba38cc", // CD4T
          "#00c1a9cc", // CD8T
          "#00b4f0cc", // B/Plasma
          "#ff6c91cc", // Myeloid
          "#de8c00cc", // NK
          "#9f8cffcc", // TNK
        ],
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      position: "top",
      labels: {
        usePointStyle: false,
        boxWidth: 12,
      },
    },
    scales: {
      xAxes: [
        {
          gridLines: { display: false },
          ticks: { fontSize: 13 },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: function (value) {
              if (value >= 1000) return value / 1000 + "k";
              return value;
            },
          },
          scaleLabel: {
            display: true,
            labelString: "Number of Cells",
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          return (
            data.labels[tooltipItem.index] +
            ": " +
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString() +
            " cells"
          );
        },
      },
    },
  },
});
