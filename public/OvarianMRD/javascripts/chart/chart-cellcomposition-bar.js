// ====================================
//  Ovarian MRD — Stacked Bar Plot
// ====================================

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("cellcompositionBar");
  if (!ctx) {
    console.warn("⚠️ Bar chart canvas not found (#cellcompositionBar)");
    return;
  }

  const timeOrder = ["DL", "C1D15", "C2D1", "C2D8", "C3D1", "C4D1", "ICS", "SLL"];

  // Manually entered counts (from SQL)
  const data = [
    { CellStatus: "DL", CellType: "TNK", n: 8070 },
    { CellStatus: "DL", CellType: "Myeloid", n: 6943 },
    { CellStatus: "DL", CellType: "B", n: 1689 },
    { CellStatus: "DL", CellType: "Epithelial", n: 691 },
    { CellStatus: "DL", CellType: "Stromal", n: 142 },

    { CellStatus: "C1D15", CellType: "TNK", n: 8318 },
    { CellStatus: "C1D15", CellType: "Myeloid", n: 3002 },
    { CellStatus: "C1D15", CellType: "B", n: 797 },
    { CellStatus: "C1D15", CellType: "Epithelial", n: 197 },
    { CellStatus: "C1D15", CellType: "Stromal", n: 24 },

    { CellStatus: "C2D1", CellType: "Myeloid", n: 14259 },
    { CellStatus: "C2D1", CellType: "TNK", n: 3469 },
    { CellStatus: "C2D1", CellType: "B", n: 70 },
    { CellStatus: "C2D1", CellType: "Epithelial", n: 373 },
    { CellStatus: "C2D1", CellType: "Stromal", n: 54 },

    { CellStatus: "C2D8", CellType: "TNK", n: 20003 },
    { CellStatus: "C2D8", CellType: "Myeloid", n: 960 },
    { CellStatus: "C2D8", CellType: "B", n: 248 },
    { CellStatus: "C2D8", CellType: "Epithelial", n: 47 },
    { CellStatus: "C2D8", CellType: "Stromal", n: 10 },

    { CellStatus: "C3D1", CellType: "TNK", n: 3054 },
    { CellStatus: "C3D1", CellType: "Myeloid", n: 4118 },
    { CellStatus: "C3D1", CellType: "B", n: 33 },
    { CellStatus: "C3D1", CellType: "Epithelial", n: 48 },
    { CellStatus: "C3D1", CellType: "Stromal", n: 7 },

    { CellStatus: "C4D1", CellType: "TNK", n: 5609 },
    { CellStatus: "C4D1", CellType: "Myeloid", n: 1851 },
    { CellStatus: "C4D1", CellType: "B", n: 79 },
    { CellStatus: "C4D1", CellType: "Epithelial", n: 107 },
    { CellStatus: "C4D1", CellType: "Stromal", n: 18 },

    { CellStatus: "ICS", CellType: "TNK", n: 1076 },
    { CellStatus: "ICS", CellType: "Myeloid", n: 233 },
    { CellStatus: "ICS", CellType: "B", n: 9 },
    { CellStatus: "ICS", CellType: "Epithelial", n: 17 },
    { CellStatus: "ICS", CellType: "Stromal", n: 4 },

    { CellStatus: "SLL", CellType: "TNK", n: 2270 },
    { CellStatus: "SLL", CellType: "Myeloid", n: 319 },
    { CellStatus: "SLL", CellType: "B", n: 31 },
    { CellStatus: "SLL", CellType: "Epithelial", n: 437 },
    { CellStatus: "SLL", CellType: "Stromal", n: 15 },
  ];

  // Group counts by CellStatus
  const grouped = {};
  data.forEach((d) => {
    if (!grouped[d.CellStatus]) grouped[d.CellStatus] = {};
    grouped[d.CellStatus][d.CellType] = d.n;
  });

  // Consistent colors and cell types
  const cellTypes = ["TNK", "Myeloid", "B", "Epithelial", "Stromal"];
  const palette = ["#4e79a7", "#f28e2b", "#59a14f", "#e15759", "#edc948"];

  // Chart.js dataset structure
  const datasets = cellTypes.map((type, i) => ({
    label: type,
    data: timeOrder.map((tp) => grouped[tp]?.[type] || 0),
    backgroundColor: palette[i % palette.length],
    borderColor: "#ffffff",
    borderWidth: 1,
  }));

  // ✅ Render Chart safely
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: timeOrder,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        title: {
          display: true,
          text: "Major Cell Type Composition Across Treatment Timepoints",
        },
        legend: { position: "right" },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.formattedValue} cells`,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          title: { display: true, text: "Treatment Timepoint" },
        },
        y: {
          stacked: true,
          title: { display: true, text: "Number of Cells" },
          beginAtZero: true,
        },
      },
    },
  });

  console.log("✅ OvarianMRD stacked bar chart rendered.");
});
