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
    $("#tissuetype-select").html("");
    $("#cancertype-select").html("");
    $.ajax({
      url: "/TCM/expression",
      type: "GET",
      data: {
        // here, at backend server side, need to identify data type
        name: "dataset_id",
        dataset_id: dataset_id,
      },
      dataType: "json",
      success: function (result) {
        // console.log(result);
        // console.log(JSON.stringify(result[0]));
        $("#tissuetype-select").html(
          '<option value="">All tissue types</option>'
        );
        $.each(result[0], function (key, value) {
          $("#tissuetype-select").append(
            '<option value="' +
              value.TissueType +
              '">' +
              value.TissueType +
              "</option>"
          );
        });
        // console.log(JSON.stringify(result[1]));
        $("#cancertype-select").html(
          '<option value="">All cancer types</option>'
        );
        $.each(result[1], function (key, value) {
          $("#cancertype-select").append(
            '<option value="' +
              value.CancerType +
              '">' +
              value.CancerType +
              "</option>"
          );
        });
      },
    });
  });

  $("#tissuetype-select").on("change", function () {
    var tissuetype_id = this.value;
    // alert('You picked tissuetype: ' + tissuetype_id);
    // alert('current dataset id: ' + $("#dataset-select").val());
    $("#cancertype-select").html("");

    $.ajax({
      url: "/TCM/expression",
      type: "get",
      data: {
        name: "tissuetype_id",
        tissuetype_id: tissuetype_id,
        dataset_id: $("#dataset-select").val(),
      },
      dataType: "json",
      success: function (result) {
        $("#cancertype-select").html(
          '<option value="">All cancer types</option>'
        );
        // console.log(JSON.stringify(result));
        $.each(result, function (key, value) {
          $("#cancertype-select").append(
            '<option value="' +
              value.CancerType +
              '">' +
              value.CancerType +
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
    var tissuetype_id_val = $("#tissuetype-select").val();
    var cancertype_id_val = $("#cancertype-select").val();
    var gene_id_val_str = $("#markers-input").val().trim();
    if (gene_id_val_str.length <= 0) {
      alert("Please input markers!");
    } else if (gene_id_val_str.split(/\s+/).length > 10) {
      alert("Please input less than 10 markers, otherwise, it will be very slow...");
    } else {
      var gene_id_val = gene_id_val_str.split(/\s+/);
      if (dataset_id_val) {
        $.ajax({
          url: "/TCM/expression",
          type: "get",
          data: {
            name: "submit",
            dataset_id: dataset_id_val,
            tissuetype_id: tissuetype_id_val,
            cancertype_id: cancertype_id_val,
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
            // console.log(result);
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
