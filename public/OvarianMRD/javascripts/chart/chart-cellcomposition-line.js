// ====================================
//  Ovarian MRD — Line Chart (% composition)
// ====================================

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("cellcompositionLine");
  if (!ctx) {
    console.warn("⚠️ Line chart canvas not found (#cellcompositionLine)");
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

  // Compute total per timepoint
  const totals = {};
  data.forEach((d) => {
    totals[d.CellStatus] = (totals[d.CellStatus] || 0) + d.n;
  });

  // Convert to percentages
  data.forEach((d) => {
    d.pct = (d.n / totals[d.CellStatus]) * 100;
  });

  // Group by cell type
  const grouped = {};
  data.forEach((d) => {
    if (!grouped[d.CellType]) grouped[d.CellType] = {};
    grouped[d.CellType][d.CellStatus] = d.pct;
  });

  const cellTypes = ["TNK", "Myeloid", "B", "Epithelial", "Stromal"];
  const palette = ["#4e79a7", "#f28e2b", "#59a14f", "#e15759", "#edc948"];

  const datasets = cellTypes.map((type, i) => ({
    label: type,
    data: timeOrder.map((tp) => grouped[type]?.[tp] || 0),
    borderColor: palette[i],
    backgroundColor: palette[i],
    fill: false,
    tension: 0, // 🔹 Straight lines (no smoothing)
    borderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6,
  }));

  // ✅ Render Chart
  new Chart(ctx, {
    type: "line",
    data: {
      labels: timeOrder,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        title: {
          display: true,
          text: "Temporal Dynamics of Major Cell Types (% of Total Cells)",
        },
        legend: { position: "right" },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${context.formattedValue.toFixed(1)}%`,
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Treatment Timepoint" },
        },
        y: {
          title: { display: true, text: "Percent of Total Cells" },
          beginAtZero: true,
          max: 100,
          ticks: { callback: (v) => `${v}%` },
        },
      },
      elements: {
        line: { tension: 0 }, // ensures straight line globally
      },
    },
  });

  console.log("✅ OvarianMRD line chart rendered.");
});
