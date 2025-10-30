//--------------------------------------------------------------//
// filename : embedding_query.js
// module   : OvarianMRD
// date     : 2025-10-21
// contributor : Adapted by Renad Al-Ghazawi
// function : Embedding visualization (UMAPs by cell/tissue/status)
//--------------------------------------------------------------//

$(document).ready(function () {
  ///////////////////////////////////////////////////////////////
  //        Populate Sample and CellStatus dropdowns           //
  ///////////////////////////////////////////////////////////////
  $("#dataset-select").on("change", function () {
    var dataset_id = this.value;
    $("#sample-select").html("");
    $("#cellstatus-select").html("");
    $("#submitbutton").hide();

    if (dataset_id === "") return;

    $.ajax({
      url: "/OvarianMRD/embedding",
      type: "GET",
      data: {
        name: "dataset_id",
        dataset_id: dataset_id,
      },
      dataType: "json",
      success: function (result) {
        // result[0] → SampleIDs
        // result[1] → CellTypes
        // result[2] → CellStatus (now normalized with 'value'/'label')
        $("#sample-select").html('<option value="">All samples</option>');
        $.each(result[0], function (key, value) {
          $("#sample-select").append(
            '<option value="' + value.SampleID + '">' + value.SampleID + "</option>"
          );
        });

        $("#cellstatus-select").html('<option value="">All statuses</option>');
        $.each(result[2], function (key, value) {
          // ✅ FIX: use 'value.value' and 'value.label' from backend normalization
          $("#cellstatus-select").append(
            '<option value="' + value.value + '">' + value.label + "</option>"
          );
        });

        $("#submitbutton").show();
      },
      error: function (xhr, status, err) {
        console.error("Error fetching embedding metadata:", err);
        alert("Failed to load metadata for the selected dataset.");
      },
    });
  });

  ///////////////////////////////////////////////////////////////
  //      On Sample change → refine CellStatus if needed        //
  ///////////////////////////////////////////////////////////////
  $("#sample-select").on("change", function () {
    var sample_id = this.value;
    $("#cellstatus-select").html("");

    $.ajax({
      url: "/OvarianMRD/embedding",
      type: "GET",
      data: {
        name: "tissuetype_id", // analogous role — filtering by sample
        dataset_id: $("#dataset-select").val(),
        sample_id: sample_id,
      },
      dataType: "json",
      success: function (result) {
        // result[0] → CellTypes
        // result[1] → CellStatuses (normalized with 'value'/'label')
        $("#cellstatus-select").html('<option value="">All statuses</option>');
        $.each(result[1], function (key, value) {
          // ✅ FIX: use result[1] for CellStatuses and access 'value'/'label' properties
          $("#cellstatus-select").append(
            '<option value="' + value.value + '">' + value.label + "</option>"
          );
        });
      },
    });
  });

  ///////////////////////////////////////////////////////////////
  //                     Submit query                          //
  ///////////////////////////////////////////////////////////////
  $("form").on("submit", function (e) {
    e.preventDefault();

    $("#imgCellType").find("img").remove();
    $("#imgCellStatus").find("img").remove();
    $("#imgSampleView").find("img").remove();

    $.ajax({
      url: "/OvarianMRD/embedding",
      type: "get",
      data: {
        name: "submit",
        dataset_id: $("#dataset-select").val(),
        sample_id: $("#sample-select").val(),
        cellstatus_id: $("#cellstatus-select").val(),
      },
      dataType: "json",
      beforeSend: function () {
        $("#loader1").removeClass("hidden");
        $("#loader2").removeClass("hidden");
        $("#loader3").removeClass("hidden");
      },
      success: function (result) {
        ///////////////////////////////////////////////////////////////
        //             Render UMAP plots from backend (R)             //
        ///////////////////////////////////////////////////////////////
        $("#imgCellType").prepend(result.CellType);
        $("#imgCellStatus").prepend(result.CellStatus);
        $("#imgSampleView").prepend(result.SampleID);
      },
      complete: function () {
        $("#loader1").addClass("hidden");
        $("#loader2").addClass("hidden");
        $("#loader3").addClass("hidden");
      },
      error: function (xhr, status, err) {
        console.error("Error loading embedding plots:", err);
        alert("Error: Could not generate embedding visualizations.");
        $("#loader1").addClass("hidden");
        $("#loader2").addClass("hidden");
        $("#loader3").addClass("hidden");
      },
    });
  });
});
