$(document).ready(function () {
    $('#application-progress').slider({
        range: "min",
        value: 10,
        min: 0,
        max: 100,
        animate: true,
        slide: function (event, ui) {
            $("#progress").val(ui.value + "%");
            //$("#progress").html(ui.value + "%");
        }
    });
    $("#progress").val($("#application-progress").slider("value") + "%");
    //$("#progress").html($(".application-progress").slider("value") + "%");
    /*
    $("input, select").change(function () {
        var percentage = 0;
        $('input, select').each(function () {
            if ($.trim(this.value) != "")
                percentage += 10;
        });
        $(".application-progress").slider("value", percentage);

        $("#progress").html(percentage + "%");
    });
    */
});

