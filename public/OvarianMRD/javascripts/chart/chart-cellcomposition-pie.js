// ============================================
//  Ovarian MRD — Pie Chart Grid by Timepoint
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("cellcompositionPieGrid");
  if (!grid) {
    console.warn("⚠️ Pie chart grid container not found (#cellcompositionPieGrid)");
    return;
  }

  const timeOrder = ["DL", "C1D15", "C2D1", "C2D8", "C3D1", "C4D1", "ICS", "SLL"];

  // Manual counts from SQL
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

  const cellTypes = ["TNK", "Myeloid", "B", "Epithelial", "Stromal"];
  const palette = ["#4e79a7", "#f28e2b", "#59a14f", "#e15759", "#edc948"];

  // Compute totals per timepoint
  const totals = {};
  data.forEach((d) => {
    totals[d.CellStatus] = (totals[d.CellStatus] || 0) + d.n;
  });

  // Compute percentages for tooltips
  data.forEach((d) => {
    d.pct = (d.n / totals[d.CellStatus]) * 100;
  });

  // Create a grid layout
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  grid.style.gap = "25px";
  grid.style.justifyItems = "center";
  grid.style.alignItems = "center";

  // Generate one pie per timepoint
  timeOrder.forEach((tp) => {
    const div = document.createElement("div");
    div.style.textAlign = "center";
    div.style.padding = "10px";

    const canvas = document.createElement("canvas");
    canvas.id = `pie_${tp}`;
    canvas.style.width = "220px";
    canvas.style.height = "220px";
    div.appendChild(canvas);

    const label = document.createElement("p");
    label.innerHTML = `<strong>${tp}</strong>`;
    label.style.marginTop = "8px";
    div.appendChild(label);

    grid.appendChild(div);

    const subset = data.filter((d) => d.CellStatus === tp);
    const values = cellTypes.map((ct) => {
      const match = subset.find((x) => x.CellType === ct);
      return match ? match.n : 0;
    });

    new Chart(canvas, {
      type: "pie",
      data: {
        labels: cellTypes,
        datasets: [
          {
            data: values,
            backgroundColor: palette,
            borderColor: "#ffffff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: tp === "SLL", // Only show legend on the last chart
            position: "bottom",
          },
          title: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${ctx.label}: ${ctx.formattedValue} cells (${(
                  (ctx.parsed / totals[tp]) *
                  100
                ).toFixed(1)}%)`,
            },
          },
        },
      },
    });
  });

  console.log("✅ OvarianMRD pie grid rendered.");
});
