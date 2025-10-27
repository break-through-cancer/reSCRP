//--------------------------------------------------------------//
// filename : degs_query.js
// module   : OvarianMRD
// date     : 2025-10-21
// contributor : Adapted by Renad Al-Ghazawi
// function : Query DEGs and visualize feature/violin plots
//--------------------------------------------------------------//

function updateGene(val, event) {
  $("#gene-selected-input").val(val);
  event.preventDefault();
}

$(document).ready(function () {
  // Initialize DataTable
  var t = $("#tableDEGs").DataTable();
  t.clear().draw();

  // When user selects a dataset (cell type)
  $("#dataset-select").on("change", function () {
    if ($("#dataset-select").val() !== "") {
      $("#dataset-selected-input").val($("#dataset-select").val());
      $("#gene-selected-input").val("");
      t.destroy();

      // Initialize the DEGs DataTable with server-side query
      t = $("#tableDEGs").DataTable({
        scrollY: "450px",
        processing: true,
        serverSide: true,
        ordering: true,
        searching: true,
        paging: true,
        filtering: true,

        ajax: {
          url: "/OvarianMRD/degs",
          type: "GET",
          data: {
            name: "dataset_id",
            dataset_id: $("#dataset-select").val(),
          },
          dataFilter: function (json) {
            return json; // Pass-through for server JSON response
          },
        },

        iDisplayLength: 10,
        retrieve: true,
        pageLength: 10,
        columnDefs: [
          {
            targets: 6,
            render: function (data, type, row, meta) {
              if (type === "display") {
                data =
                  '<a href="#" title="' +
                  data +
                  '" onclick="updateGene(this.title, event);">' +
                  data +
                  "</a>";
              }
              return data;
            },
          },
        ],
        columns: [
          { data: "p_val" },
          { data: "avg_log2FC" },
          { data: "pct1" },
          { data: "pct2" },
          { data: "p_val_adj" },
          { data: "cluster" },
          { data: "gene" },
        ],
      });
    }
  });

  // Submit form → render DEG plots
  $("form").on("submit", function (e) {
    e.preventDefault();

    // Clear old plots
    $("#imgFeaturePlot").find("img").remove();
    $("#imgViolin").find("img").remove();

    var dataset_id_val = $("#dataset-selected-input").val();
    var gene_id_val = $("#gene-selected-input").val();

    if (dataset_id_val && gene_id_val) {
      $.ajax({
        url: "/OvarianMRD/degs",
        type: "get",
        data: {
          name: "submit",
          dataset_id: dataset_id_val,
          gene_id: gene_id_val,
        },
        dataType: "json",
        beforeSend: function () {
          // show loaders
          $("#loader1").removeClass("hidden");
          $("#loader2").removeClass("hidden");
        },
        complete: function () {
          // hide loaders
          $("#loader1").addClass("hidden");
          $("#loader2").addClass("hidden");
        },
        success: function (result) {
          ///////////////////////////////////////////////////////////////
          //         Render FeaturePlot and ViolinPlot from R output   //
          ///////////////////////////////////////////////////////////////
          $("#imgFeaturePlot").prepend(result.FeaturePlot);
          $("#imgViolin").prepend(result.ViolinPlot);
        },
        error: function (xhr, status, err) {
          console.error("Error fetching DEGs visualization:", err);
          alert("Error: Unable to fetch DEG plots.");
        },
      });
    } else {
      alert("Please select a cell type and gene before submitting.");
    }
  });
});
