//--------------------------------------------------------------//
// filename : expression_query.js
// module   : OvarianMRD
// date     : 2025-10-21
// contributor : Adapted by Renad Al-Ghazawi
// function : expression_query (bubble + heatmap visualization)
//--------------------------------------------------------------//

$(document).ready(function () {
  ///////////////////////////////////////////////////////////////
  //      Populate dropdowns based on selected cell type       //
  ///////////////////////////////////////////////////////////////
  $("#dataset-select").on("change", function () {
    var dataset_id = this.value;
    $("#sample-select").html("");
    $("#cellstatus-select").html("");

    if (dataset_id === "") return;

    $.ajax({
      url: "/OvarianMRD/expression",
      type: "GET",
      data: {
        name: "dataset_id",
        dataset_id: dataset_id,
      },
      dataType: "json",
      success: function (result) {
        console.log("DEBUG: Expression metadata payload →", result);

        // ✅ result[0] = SampleID list
        // ✅ result[1] = CellType list
        // ✅ result[2] = CellStatus list

        $("#sample-select").html('<option value="">All samples</option>');
        $.each(result[0], function (key, value) {
          const sample =
            value.SampleID || value.sample_id || value.value || value.label;
          if (sample) {
            $("#sample-select").append(
              `<option value="${sample}">${sample}</option>`
            );
          }
        });

        // ✅ Now use result[2] for CellStatus
        $("#cellstatus-select").html('<option value="">All statuses</option>');
        if (result[2]) {
          $.each(result[2], function (key, value) {
            const status =
              value.value ||
              value.label ||
              value.CellStatus ||
              value.cellstatus ||
              "undefined";
            $("#cellstatus-select").append(
              `<option value="${status}">${status}</option>`
            );
          });
        } else {
          console.warn("⚠️ No CellStatus data found in result[2]");
        }
      },
      error: function (xhr, status, err) {
        console.error("Error loading metadata:", err);
        alert("Failed to load metadata for the selected dataset.");
      },
    });
  });

  ///////////////////////////////////////////////////////////////
  //      On sample change → refine cell status if needed       //
  ///////////////////////////////////////////////////////////////
  $("#sample-select").on("change", function () {
    var sample_id = this.value;
    $("#cellstatus-select").html("");

    $.ajax({
      url: "/OvarianMRD/expression",
      type: "GET",
      data: {
        name: "sample_id",
        dataset_id: $("#dataset-select").val(),
        sample_id: sample_id,
      },
      dataType: "json",
      success: function (result) {
        $("#cellstatus-select").html('<option value="">All statuses</option>');
        $.each(result, function (key, value) {
          const status =
            value.CellStatus ||
            value.cellstatus ||
            value.value ||
            value.label ||
            "undefined";
          $("#cellstatus-select").append(
            `<option value="${status}">${status}</option>`
          );
        });
      },
    });
  });

  ///////////////////////////////////////////////////////////////
  //             Submit form to render expression plots         //
  ///////////////////////////////////////////////////////////////
  $("form").on("submit", function (e) {
    e.preventDefault();

    $("#imgBubblePlot").find("img").remove();
    $("#imgHeatmapPlot").find("img").remove();

    var dataset_id_val = $("#dataset-select").val();
    var sample_id_val = $("#sample-select").val();
    var cellstatus_val = $("#cellstatus-select").val();
    var gene_id_val_str = $("#markers-input").val().trim();

    if (!dataset_id_val) {
      alert("Please select a dataset (cell type).");
      return;
    }
    if (gene_id_val_str.length <= 0) {
      alert("Please input at least one marker gene!");
      return;
    }

    var gene_id_val = gene_id_val_str.split(/\s+/);

    $.ajax({
      url: "/OvarianMRD/expression",
      type: "get",
      data: {
        name: "submit",
        dataset_id: dataset_id_val,
        sample_id: sample_id_val,
        cellstatus_id: cellstatus_val,
        gene_id: gene_id_val,
      },
      dataType: "json",
      beforeSend: function () {
        $("#loader1").removeClass("hidden");
        $("#loader2").removeClass("hidden");
      },
      complete: function () {
        $("#loader1").addClass("hidden");
        $("#loader2").addClass("hidden");
      },
      success: function (result) {
        ///////////////////////////////////////////////////////////////
        //                 show plots returned from R                //
        ///////////////////////////////////////////////////////////////
        if (result.missed && result.missed.length > 0) {
          alert("Genes not found in dataset: " + result.missed.join(", "));
        }
        $("#imgBubblePlot").prepend(result.BubblePlot);
        $("#imgHeatmapPlot").prepend(result.HeatmapPlot);
      },
      error: function (xhr, status, err) {
        console.error("Error fetching expression plots:", err);
        alert("Error: Could not load expression visualization.");
      },
    });
  });
});
