//--------------------------------------------------------------//
// filename : chart-celltype-pie.js
// module   : OvarianMRD
// date     : 2025-10-21
// contributor : Adapted by Renad Al-Ghazawi
// function : Pie chart of major cell types
//--------------------------------------------------------------//

Chart.defaults.global.defaultFontFamily =
  'Nunito, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

const cellTypeData = {
  B: 2956,
  Epithelial: 1917,
  Myeloid: 31685, // fixed typo from Meyloid
  Stromal: 274,
  TNK: 51869,
};

const totalType = Object.values(cellTypeData).reduce((a, b) => a + b, 0);
const fractions = Object.fromEntries(
  Object.entries(cellTypeData).map(([k, v]) => [k, v / totalType])
);

const ctx = document.getElementById("PieChart3");
const myTypeChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: Object.keys(cellTypeData),
    datasets: [
      {
        data: Object.values(fractions),
        cellnumber: Object.values(cellTypeData),
        backgroundColor: [
          "#00ba38cc", // B
          "#00b4f0cc", // Epithelial
          "#ff6c91cc", // Myeloid
          "#9da700cc", // Stromal
          "#9f8cffcc", // TNK
        ],
        hoverBackgroundColor: [
          "#00ba38",
          "#00b4f0",
          "#ff6c91",
          "#9da700",
          "#9f8cff",
        ],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    rotation: -Math.PI,
    legend: { display: true, position: "right" },
    layout: { padding: 40 },
    plugins: {
      outlabels: {
        text: "%l %p",
        color: "white",
        stretch: 20,
        font: { resizable: true, minSize: 12, maxSize: 18, size: 18 },
      },
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          const idx = tooltipItem.index;
          return [
            `${data.labels[idx]} fraction: ${(data.datasets[0].data[idx] * 100).toFixed(1)}%`,
            `Cell count: ${data.datasets[0].cellnumber[idx]}`,
          ];
        },
      },
    },
  },
});
