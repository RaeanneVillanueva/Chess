$(document).ready(function(){
    $(".loginbtn").click(alert("heya"));

    $(document).keypress(function(event){
        if(event.keyCode == '13'){
            alert("heya");
        }
    })
})