//--------------------------------------------------------------//
// filename : embedding.js
// Date : 2021-12-02
// contributor : Yanshuo Chu
// function: embedding
//--------------------------------------------------------------//

$(document).ready(function () {
  $("#dataset-select").on("change", function () {
    var dataset_id = this.value;
    // alert('You picked dataset: ' + dataset_id);
    $("#sampletype-select").html("");
    $("#submitbutton").hide();
    $.ajax({
      url: "/GastricTME/embedding",
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
        $("#submitbutton").show();
      },
    });
  });

  $("form").on("submit", function (e) {
    // alert('submit');
    // alert($(this).serialize());
    $("#imgCellType").find("img").remove();
    $("#imgSampleType").find("img").remove();
    e.preventDefault();
    $.ajax({
      url: "/GastricTME/embedding",
      type: "get",
      data: {
        name: "submit",
        dataset_id: $("#dataset-select").val(),
        sampletype_id: $("#sampletype-select").val(),
      },
      dataType: "json",
      beforeSend: function () {
        // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
        $("#loader1").removeClass("hidden");
        $("#loader2").removeClass("hidden");
      },
      success: function (result) {
        $("#imgCellType").prepend(result.CellType);
        $("#imgSampleType").prepend(result.SampleType);
      },
      complete: function () {
        // Set our complete callback, adding the .hidden class and hiding the spinner.
        $("#loader1").addClass("hidden");
        $("#loader2").addClass("hidden");
      },
    });
  });
});
