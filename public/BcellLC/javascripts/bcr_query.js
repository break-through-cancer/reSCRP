//--------------------------------------------------------------//
// filename : degs_query.js
// Date : 2021-12-02
// contributor : Yanshuo Chu
// function: degs_query
//--------------------------------------------------------------//

function OnChangeFunc(){
    var field_id = $("#field-select").val();
    var gender_id = $("#gender-select").val();
    var stage_id = $("#stage-select").val();
    var smoking_id = $("#smoking-select").val();
    var mut_id = $("#mut-select").val();

    $("#field-select").attr("disabled", "disabled");
    $("#gender-select").attr("disabled", "disabled");
    $("#stage-select").attr("disabled", "disabled");
    $("#smoking-select").attr("disabled", "disabled");
    $("#mut-select").attr("disabled", "disabled");

    $.ajax({
        url: "/BcellLC/bcr",
        type: "GET",
        data: {
            name: "options",
            field_id: field_id,
            gender_id: gender_id,
            stage_id: stage_id,
            smoking_id: smoking_id,
            mut_id: mut_id,
        },
        dataType: "json",
        success: function (result) {
            // console.log(result);

            $("#field-select").html(
                '<option value="ALL">All tissue types</option>'
            );
            result.Field.forEach((item) => {
                $("#field-select").append(
                    '<option value="' + item + '">' + item + "</option>"
                );
            });
            $("#field-select").val(field_id);

            $("#gender-select").html(
                '<option value="ALL">All gender types</option>'
            );
            result.Gender.forEach((item) => {
                $("#gender-select").append(
                    '<option value="' + item + '">' + item + "</option>"
                );
            });
            $("#gender-select").val(gender_id);

            $("#stage-select").html(
                '<option value="ALL">All stages</option>'
            );
            result.Stage.forEach((item) => {
                $("#stage-select").append(
                    '<option value="' + item + '">' + item + "</option>"
                );
            });
            $("#stage-select").val(stage_id);

            $("#smoking-select").html(
                '<option value="ALL">All smoking statuses</option>'
            );
            result.Smoking.forEach((item) => {
                $("#smoking-select").append(
                    '<option value="' + item + '">' + item + "</option>"
                );
            });
            $("#smoking-select").val(smoking_id);


            $("#mut-select").html(
                '<option value="ALL">All mut statuses</option>'
            );
            result.Mut.forEach((item) => {
                $("#mut-select").append(
                    '<option value="' + item + '">' + item + "</option>"
                );
            });
            $("#mut-select").val(mut_id);

            $("#field-select").removeAttr("disabled");
            $("#gender-select").removeAttr("disabled");
            $("#stage-select").removeAttr("disabled");
            $("#smoking-select").removeAttr("disabled");
            $("#mut-select").removeAttr("disabled");

            $("#field-select option:not(:selected)").attr("enabled", "enabled");
            $("#gender-select option:not(:selected)").attr("enabled", "enabled");
            $("#stage-select option:not(:selected)").attr("enabled", "enabled");
            $("#smoking-select option:not(:selected)").attr("enabled", "enabled");
            $("#mut-select option:not(:selected)").attr("enabled", "enabled");
        },
    });
}

$(document).ready(function () {
    $("#field-select").on("change", OnChangeFunc);
    $("#gender-select").on("change", OnChangeFunc);
    $("#stage-select").on("change", OnChangeFunc);
    $("#smoking-select").on("change", OnChangeFunc);
    $("#mut-select").on("change", OnChangeFunc);

    $("form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            url: "/BcellLC/bcr",
            type: "get",
            data: {
                name: "submit",
                field_id : $("#field-select").val(),
                gender_id : $("#gender-select").val(),
                stage_id : $("#stage-select").val(),
                smoking_id : $("#smoking-select").val(),
                mut_id : $("#mut-select").val(),
            },
            dataType: "json",
            beforeSend: function () {
                $("#imgBCR").find(".plot-container").css("display", "none");
                $("#imgBCRR").find(".plot-container").css("display", "none");
                $("#imgBCRJI").find(".plot-container").css("display", "none");
                $("#loader1").removeClass("hidden");
                $("#loader2").removeClass("hidden");
                $("#loader3").removeClass("hidden");
            },
            complete: function () {
                $("#loader1").addClass("hidden");
                $("#loader2").addClass("hidden");
                $("#loader3").addClass("hidden");
                $("#imgBCR").find(".plot-container").css("display", "unset");
                $("#imgBCRR").find(".plot-container").css("display", "unset");
                $("#imgBCRJI").find(".plot-container").css("display", "unset");
            },
            success: function (result) {
                ///////////////////////////////////////////////////////////////
                //                  show img get from server                 //
                ///////////////////////////////////////////////////////////////
                console.log(result);
                var ccDmap = {};
                var bcrDmap = {};
                var bcrRDmap = {};

                result[0].forEach(function(val){
                    if(val["CellClusterType"] in ccDmap){
                        ccDmap[val["CellClusterType"]].x.push(val["UMAP1"]);
                        ccDmap[val["CellClusterType"]].y.push(val["UMAP2"]);
                        ccDmap[val["CellClusterType"]].z.push(0);
                    }else{
                        ccDmap[val["CellClusterType"]] = {
	                          x: [val["UMAP1"]],
                            y: [val["UMAP2"]],
                            z: [0],
                            name: val["CellClusterType"],
                            legendgroup: "CellClusterType",
                            legendgrouptitle: {
                                text: "Cell type/state",
                            },
	                          mode: 'markers',
	                          marker: {
		                            size: 1,
		                            opacity: 0.8},
	                          type: 'scatter3d'
                        };
                    }

                    if(val["isTop10"]){
                        if(val["clone_id"] in bcrDmap){
                            bcrDmap[val["clone_id"]].x.push(val["UMAP1"]);
                            bcrDmap[val["clone_id"]].y.push(val["UMAP2"]);
                            bcrDmap[val["clone_id"]].z.push(1);
                            bcrDmap[val["clone_id"]].text.push(val["CellClusterType"]);
                        }else{
                            bcrDmap[val["clone_id"]] = {
                                x: [val["UMAP1"]],
                                y: [val["UMAP2"]],
                                z: [1],
                                text: [val["CellClusterType"]],
                                name: val["clone_id"],
                                legendgroup: "bcr",
                                legendgrouptitle: {
                                    text: "Clone id",
                                },
                                mode: 'markers',
                                marker: {
                                    size: 5,
                                    opacity: 0.8},
                                type: 'scatter3d'
                            };
                        }
                    }

                    if(val["clone_id"]){
                        if(val["rl10n"] in bcrRDmap){
                            bcrRDmap[val["rl10n"]].x.push(val["UMAP1"]);
                            bcrRDmap[val["rl10n"]].y.push(val["UMAP2"]);
                            bcrRDmap[val["rl10n"]].z.push(1);
                            bcrRDmap[val["rl10n"]].text.push(val["CellClusterType"]);
                        }else{
                            bcrRDmap[val["rl10n"]] = {
                                x: [val["UMAP1"]],
                                y: [val["UMAP2"]],
                                z: [1],
                                text: [val["CellClusterType"]],
                                name: val["rl10n"],
                                legendgroup: "bcrR",
                                legendgrouptitle: {
                                    text: "Clone size",
                                },
                                mode: 'markers',
                                marker: {
                                    size: 2,
                                    opacity: 0.8},
                                type: 'scatter3d'
                            };
                        }
                    }
                });

                var layout = {
                    margin: {l: 0, r: 0, b: 0, t: 0},
                    scene: {
                        xaxis: {
                            title: 'UMAP1',
                        },
                        yaxis: {
                            title: 'UMAP2',
                        },
                        zaxis: {
                            title: '',
                            tickmode: "array",
                            tickvals: [0, 1],
                            ticktext: ['Cell type/state', 'Clone id'],
                            range: [-1, 2],
                        },
                    },
                    legend: {
                        x: 1,
                        y: 0.5,
                        itemsizing: "constant",
                        groupclick: "toggleitem",
                    },
                };
                var data = Object.keys(ccDmap).map(key => ccDmap[key]).concat(Object.keys(bcrDmap).map(key => bcrDmap[key]));
                Plotly.react('imgBCR', data, layout);

                layout = {
                    margin: {l: 0, r: 0, b: 0, t: 0},
                    scene: {
                        xaxis: {
                            title: 'UMAP1',
                        },
                        yaxis: {
                            title: 'UMAP2',
                        },
                        zaxis: {
                            title: '',
                            tickmode: "array",
                            tickvals: [0, 1],
                            ticktext: ['Cell type/state', 'Clone size'],
                            range: [-1, 2],
                        },
                    },
                    legend: {
                        x: 1,
                        y: 0.5,
                        itemsizing: "constant",
                        groupclick: "toggleitem",
                    },
                };
                data = Object.keys(ccDmap).map(key => ccDmap[key]).concat(Object.keys(bcrRDmap).map(key => bcrRDmap[key]));
                Plotly.react('imgBCRR', data, layout);

                var data = [{z: result[1], x: result[2], y: result[2], type: 'heatmap', hoverongaps: false}];
                Plotly.newPlot('imgBCRJI', data);
            },
        });
    });
});
