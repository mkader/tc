$(document).ready(function () {
    var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
    if (is_safari){
//        $(".stepOne .goodSelect span").width('51px');
    }


    $(".gamesContent .gamesIcon").tap(function(){
        $(this).toggleClass("select");
    });
    $(".stepOne .goodSelect span").tap(function(){
        $(this).addClass("select").siblings().removeClass("select");
    });
    $(".stepSecond .goodSelect span, .stepOne .harasSelect span").tap(function(){
        $(this).addClass("select").siblings().removeClass("select");
    });
    $("#gameCreateContent .upcommingGames .event, #Home .upcommingGames .event").tap(function(){
        $.mobile.changePage("#gameDetail","slide");
    });

    /*create event*/
    $("#minus").tap(function(){
        var val =parseInt($("#incNumber").val());
        if(val>0){
            val = val-1;
        }
        $("#incNumber").val(val);
    });
    $("#plus").tap(function(){
        var val =parseInt($("#incNumber").val());
        if(val<20){
            val = val+1;
        }
        $("#incNumber").val(val);
    });
    /*gameDetail */

    /*initialize page init function*/
    refresh("splashCnt");
    $( '#splash' ).live( 'pageinit',function(event){
        refresh("splashCnt");
    });
    $( '#stepFirst' ).live( 'pageinit',function(event){
        refresh("stepOne");
    });
    $( '#createAccount' ).live( 'pageinit',function(event){
        refresh("createAccountCnt");
    });
    $( '#stepSecond' ).live( 'pageinit',function(event){
        refresh("stepTwo");
    });
    $( '#stepThird' ).live( 'pageinit',function(event){
        refresh("stepThirdContent");
        setTimeout("enableInputs()",2000);
    });
    $( '#gameFlow' ).live( 'pageinit',function(event){
        refresh("gamesContent");
        setTimeout("enableInputs()",2000);
    });
    $( '#gameCreated' ).live( 'pageinit',function(event){
        refresh("createUpcommingGames");
    });
    $( '#Home' ).live( 'pageinit',function(event){
        refresh("dropUpcommingGames");
    });
    $( '#createEvent' ).live( 'pageinit',function(event){
        refresh("createEventContent");
//        $('#who').change(function(){
//            myScroll["createEventContent"].destroy();
//               $("#createEventContent").removeAttr("style");
//            setTimeout(function(){loaded("createEventContent")}, 500);
//            refresh("createEventContent");
//        });
    });
    $( '#gameDetail' ).live( 'pageinit',function(event){
        refresh("gameDetailUserList");
    });
    $( '#gameDetailDrop' ).live( 'pageinit',function(event){
        refresh("dropUpcommingGames");
    });
    $( '#invite' ).live( 'pageinit',function(event){
        refresh("userList");

        setTimeout("initInviteRowClick()",2000);

    });

});

function enableInputs() {
    $("#stepThird input, #stepThird textarea").tap(function(){
        $(this).focus();
    });
}


$(document).bind('mobileinit',function(){
    $.mobile.selectmenu.prototype.options.nativeMenu = false;
});

/*add scroll bar*/
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("splashCnt")}, 200); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("createAccountCnt")}, 200); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("gamesContent")}, 200); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("createEventContent")}, 200); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("createUpcommingGames")}, 200); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("dropUpcommingGames")}, 200); }, false);
//document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("HomeContent")}, 200); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("gameDetailUserList")}, 200); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("gameDetailDropUserList")}, 200); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("userList")}, 200); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("stepThirdContent")}, 200); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("stepOne")}, 200); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){loaded("stepTwo")}, 200); }, false);

var myScroll=[];
function loaded(elem) {
    myScroll[elem] = new iScroll(elem);
}
function refresh(id){
    setTimeout(function(){
        myScroll[id].refresh()
    },1000);
}
function initInviteRowClick(){
    $(".gameDetailContent .bottom .listContainer .usersList .row").tap(function(){
        if($(this).find("span.checkBox").hasClass("checked")){
            $(this).find("span.checkBox").removeClass("checked");
        } else{
            $(this).find("span.checkBox").addClass("checked");
        }
    });

    $(".gameDetailContent .bottom .listContainer .notificatoin span.checkBox").tap(function(e){
        if($(this).hasClass("checked")){
            $(".gameDetailContent .bottom .listContainer span.checkBox").removeClass("checked");
        } else{
            $(".gameDetailContent .bottom .listContainer span.checkBox").addClass("checked");
        }
    });
}

