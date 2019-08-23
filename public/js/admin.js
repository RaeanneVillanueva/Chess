$(document).ready(() => {
    $("button.delete").click(function () {
        let id = $(this).attr("data-id");
        $.ajax({
            url: "delete",
            method: "POST",
            data: {
                id: $(this).attr("data-id")
            },
            success: function (result) {
                if (result.ok == 1) {
                    //remove row
                    $("div[data-id='" + id + "']").remove()
                } else {
                    alert("something went wrong")
                }
            }
        })
    })
})