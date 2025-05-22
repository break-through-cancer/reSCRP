// Set new default font family and font color to mimic Bootstrap's default styling
var pcolor1 = "#DA291C";
var pcolor2 = "#000000";
var pcolor3 = "#63666A";

var color1 = "#614B79";
var color2 = "#789D4A";
var color3 = "#407EC9";
var color4 = "#CB6015";
var color5 = "#F1B434";
var color6 = "#ED8B00";
var color7 = "#B7BF10";

var color1cc = "#614B79CC";
var color2cc = "#789D4ACC";
var color3cc = "#407EC9CC";
var color4cc = "#CB6015CC";
var color5cc = "#F1B434CC";
var color6cc = "#ED8B00CC";
var color7cc = "#B7BF10CC";

Chart.defaults.global.defaultFontFamily = "Nunito";
Chart.defaults.global.defaultFontColor = pcolor3;

// Pie Chart Example
var ctx = document.getElementById("SubtypeComp");
var myPieChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Naive B", "Memory B", "Plasma", "Plasmablast"],
        datasets: [
            {
                data: [0.07317272, 0.36751457, 0.55325914, 0.00605356],
                cellnumber: [3590, 18031, 27144, 297],
                backgroundColor: [color4, color5, color6, color7],
                hoverBackgroundColor: [
                    color4cc,
                    color5cc,
                    color6cc,
                    color7cc,
                ],
                hoverBorderColor: pcolor3,
            },
        ],
    },
    options: {
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        layout: { padding: 40 },
        plugins: {
            legend: false,
            outlabels: {
                text: "%l %p",
                color: "white",
                stretch: 12,
                font: {
                    resizable: true,
                    minSize: 12,
                    maxSize: 18,
                    size: 18,
                },
            },
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    return [
                        data.labels[tooltipItem.index] +
                            " fraction: " +
                            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index],
                        "Cell number: " +
                            data.datasets[tooltipItem.datasetIndex].cellnumber[
                                tooltipItem.index
                            ],
                    ];
                },
            },
        },
    },
});
