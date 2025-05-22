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
    $("#tissuetype-select").html("");
    $("#cancertype-select").html("");
    $("#submitbutton").hide();
    $.ajax({
      url: "/GastricCancer/embedding",
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
          '<option value="">All tissue type</option>'
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
          '<option value="">All cancer type</option>'
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
        $("#submitbutton").show();
      },
    });
  });

  $("#tissuetype-select").on("change", function () {
    var tissuetype_id = this.value;
    // alert('You picked tissuetype: ' + tissuetype_id);
    // alert('current dataset id: ' + $("#dataset-select").val());
    $("#cancertype-select").html("");

    $.ajax({
      url: "/GastricCancer/embedding",
      type: "get",
      data: {
        name: "tissuetype_id",
        tissuetype_id: tissuetype_id,
        dataset_id: $("#dataset-select").val(),
      },
      dataType: "json",
      success: function (result) {
        $("#cancertype-select").html(
          '<option value="">All cancer type</option>'
        );
        console.log(JSON.stringify(result));
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

    $("#imgCellType").find("img").remove();
    $("#imgTissueType").find("img").remove();
    $("#imgCancerType").find("img").remove();

    e.preventDefault();
    $.ajax({
      url: "/GastricCancer/embedding",
      type: "get",
      data: {
        name: "submit",
        dataset_id: $("#dataset-select").val(),
        tissuetype_id: $("#tissuetype-select").val(),
        cancertype_id: $("#cancertype-select").val(),
      },
      dataType: "json",
      beforeSend: function () {
        // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
        $("#loader1").removeClass("hidden");
        $("#loader2").removeClass("hidden");
        $("#loader3").removeClass("hidden");
      },
      success: function (result) {
        ///////////////////////////////////////////////////////////////
        //                  show img get from server                 //
        ///////////////////////////////////////////////////////////////
        // console.log(result);
        $("#imgCellType").prepend(result.CellType);
        $("#imgTissueType").prepend(result.TissueType);
        $("#imgCancerType").prepend(result.CancerType);
      },
      complete: function () {
        // Set our complete callback, adding the .hidden class and hiding the spinner.
        $("#loader1").addClass("hidden");
        $("#loader2").addClass("hidden");
        $("#loader3").addClass("hidden");
      },
    });
  });
});
