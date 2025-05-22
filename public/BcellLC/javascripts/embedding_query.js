//--------------------------------------------------------------//
// filename : embedding.js
// Date : 2021-12-02
// contributor : Yanshuo Chu
// function: embedding
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
        url: "/BcellLC/embedding",
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
        $("#imgCellType").find("img").remove();
        $("#imgFieldType").find("img").remove();
        $("#imgGenderType").find("img").remove();
        $("#imgStageType").find("img").remove();
        $("#imgSmokingType").find("img").remove();
        $("#imgMutType").find("img").remove();
        e.preventDefault();
        $.ajax({
            url: "/BcellLC/embedding",
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
                // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
                $("#loader1").removeClass("hidden");
                $("#loader2").removeClass("hidden");
                $("#loader3").removeClass("hidden");
                $("#loader4").removeClass("hidden");
                $("#loader5").removeClass("hidden");
                $("#loader6").removeClass("hidden");
            },
            complete: function () {
                // Set our complete callback, adding the .hidden class and hiding the spinner.
                $("#loader1").addClass("hidden");
                $("#loader2").addClass("hidden");
                $("#loader3").addClass("hidden");
                $("#loader4").addClass("hidden");
                $("#loader5").addClass("hidden");
                $("#loader6").addClass("hidden");
            },
            success: function (result) {
                ///////////////////////////////////////////////////////////////
                //                  show img get from server                 //
                ///////////////////////////////////////////////////////////////
                // console.log(result);
                $("#imgCellType").prepend(result.CellClusterType);
                $("#imgFieldType").prepend(result.Field);
                $("#imgGenderType").prepend(result.Gender);
                $("#imgStageType").prepend(result.Stage);
                $("#imgSmokingType").prepend(result.Smoking);
                $("#imgMutType").prepend(result.Mut);
            },
        });
    });
});
