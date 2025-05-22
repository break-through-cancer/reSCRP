//--------------------------------------------------------------//
// filename : degs_query.js
// Date : 2021-12-02
// contributor : Yanshuo Chu
// function: degs_query
//--------------------------------------------------------------//

function updateGene(val, event) {
  $("#gene-selected-input").val(val);
  event.preventDefault();
}

$(document).ready(function () {
  var t = $("#tableDEGs").DataTable();
  t.clear().draw();

    $("#dataset-select").on("change", function () {
        if ($("#dataset-select").val() != '') {

            $("#dataset-selected-input").val($("#dataset-select").val());
            $("#gene-selected-input").val("");
            t.destroy();

            t = $("#tableDEGs").DataTable({
                scrollY: "450px",
                processing: true,
                serverSide: true,
                ordering: true,
                searching: true,
                paging: true,
                filtering: true,

                ajax: {
                    url: "/TCM/degs",
                    type: "GET",
                    data: {
                        name: "dataset_id",
                        dataset_id: $("#dataset-select").val(),
                    },
                    dataFilter: function (json) {
                        // json.data = JSON.stringify(json.data);
                        // console.log(json);
                        return json;
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
                                    '<a href="#" title=' +
                                    data +
                                    ' onclick="updateGene(this.title, event);">' +
                                    data +
                                    "</a>";
                            }
                            return data;
                        },
                    },
                ],
                columns: [
                    { data: "p_val" },
                    { data: "avg_logFC" },
                    { data: "pct1" },
                    { data: "pct2" },
                    { data: "p_val_adj" },
                    { data: "cluster" },
                    { data: "gene" },
                ],
            });
        }
    });

  $("form").on("submit", function (e) {
    // alert('submit');
    // alert($(this).serialize());
    $("#imgFeaturePlot").find("img").remove();
    $("#imgViolin").find("img").remove();
    e.preventDefault();

    var dataset_id_val = $("#dataset-selected-input").val();
    var gene_id_val = $("#gene-selected-input").val();
    if (dataset_id_val && gene_id_val) {
      $.ajax({
        url: "/TCM/degs",
        type: "get",
        data: {
          name: "submit",
          dataset_id: dataset_id_val,
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
          $("#imgFeaturePlot").prepend(result.FeaturePlot);
          $("#imgViolin").prepend(result.ViolinPlot);
        },
      });
    }
  });
});
