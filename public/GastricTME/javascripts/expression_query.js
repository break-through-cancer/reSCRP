//--------------------------------------------------------------//
// filename : expression_query.js
// Date : 2021-12-03
// contributor : Yanshuo Chu
// function: expression_query
//--------------------------------------------------------------//

$(document).ready(function () {
  $("#dataset-select").on("change", function () {
    var dataset_id = this.value;
    // alert('You picked dataset: ' + dataset_id);
    $("#sampletype-select").html("");
    $.ajax({
      url: "/GastricTME/expression",
      type: "GET",
      data: {
        // here, at backend server side, need to identify data type
        name: "dataset_id",
        dataset_id: dataset_id,
      },
      dataType: "json",
      success: function (result) {
        $("#sampletype-select").html(
          '<option value="">All sample type</option>'
        );
        $.each(result[0], function (key, value) {
          $("#sampletype-select").append(
            '<option value="' +
              value.SampleType +
              '">' +
              value.SampleType +
              "</option>"
          );
        });
      },
    });
  });

  $("form").on("submit", function (e) {
    // alert('submit');
    // alert($(this).serialize());
    $("#imgBubblePlot").find("img").remove();
    $("#imgHeatmapPlot").find("img").remove();
    e.preventDefault();

    var dataset_id_val = $("#dataset-select").val();
    var sampletype_id_val = $("#sampletype-select").val();
    var gene_id_val_str = $("#markers-input").val().trim();

    if (gene_id_val_str.length <= 0) {
      alert("Please input markers!");
    } else {
      var gene_id_val = gene_id_val_str.split(/\s+/);
      if (dataset_id_val) {
        $.ajax({
          url: "/GastricTME/expression",
          type: "get",
          data: {
            name: "submit",
            dataset_id: dataset_id_val,
            sampletype_id: sampletype_id_val,
            gene_id: gene_id_val,
          },
          dataType: "json",
          beforeSend: function () {
            // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
            $("#loader1").removeClass("hidden");
            $("#loader2").removeClass("hidden");
          },
          complete: function () {
            // Set our complete callback, adding the .hidden class and hiding the spinner.
            $("#loader1").addClass("hidden");
            $("#loader2").addClass("hidden");
          },
          success: function (result) {
            ///////////////////////////////////////////////////////////////
            //                  show img get from server                 //
            ///////////////////////////////////////////////////////////////
            if (result.missed.length > 0) {
              alert("missed: " + result.missed);
            }
            $("#imgBubblePlot").prepend(result.BubblePlot);
            $("#imgHeatmapPlot").prepend(result.HeatmapPlot);
          },
        });
      }
    }
  });
});
