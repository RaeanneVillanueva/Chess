$(document).ready(() => {
    $("button.edit").click(function () {
        $("#editid").val($(this).attr("data-id"))
        $("form#edit").submit()
    })

    $("button.delete").click(function () {
        let id = $(this).attr("data-id");
        $.ajax({
            url: "/user/deleteuser",
            method: "POST",
            data: {
                id: $(this).attr("data-id")
            },
            success: function (result) {
                if (result.ok == 1) {
                    //remove row
                    $("tr#" + id ).remove()
                } else {
                    alert("something went wrong")
                }
            }
        })
    })

    $("button.deletePuzzle").click(function () {
        let id = $(this).attr("data-id");
        $.ajax({
            url: "deletepuzzle",
            method: "POST",
            data: {
                id: $(this).attr("data-id")
            },
            success: function (result) {
                if (result.ok == 1) {
                    //remove row
                    $("tr#" + id ).remove()
                } else {
                    alert("something went wrong")
                }
            }
        })
    })
})