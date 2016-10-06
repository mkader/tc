var currentPage = "#welcomeScreen", prevPage;

/*can set game times here in seconds*/
var gameTime = 60;

var character = ["rocky","jacky","demi","squi","jamesDear"];

var step;

//each level animal speed can set here
var animalSpeed = {
    rocky:{
        Level1:4,
        Level2:4,
        Level3:4
    },
    jacky:{
        Level1:4,
        Level2:4,
        Level3:4
    },
    demi:{
        Level1:4,
        Level2:4,
        Level3:4
    },
    squi:{
        Level1:4,
        Level2:4,
        Level3:4
    },
    jamesDear:{
        Level1:4,
        Level2:4,
        Level3:4
    }
};

//each level car speed can set here
var carSpeed = {
    Level1:{
        car1:4,
        car2:3,
        car3:5
    },
    Level2:{
        car1:4,
        car2:3,
        car3:5,
        car9:7,
        car10:6,
        car11:6
    },
    Level3:{
        car1:4,
        car2:3,
        car3:5,
        car4:5,
        car5:5,
        car6:4,
        car7:5,
        car8:3
    }
};

/*stars*/
var stars = {
    Level1:{
        animalCount:0,
        dammage:0 ,
        totalHit:0
    },
    Level2:{
        animalCount:0,
        dammage:0 ,
        totalHit:0
    },
    Level3:{
        animalCount:0,
        dammage:0 ,
        totalHit:0
    }
};

var selectedAnimal = animalSpeed[character[0]];

$(document).ready(function () {

    /*style font family with cufon font*/
    setPageFontStyle("");
    $(".container").hide();
    $("#welcomeScreen").show();
    /*screen transition*/
    $("a.page").live('click', function () {

        if (!$(this).hasClass("clickDisable")) {
            var link = $(this).addClass("clickDisable");
            prevPage = currentPage;
            currentPage = $(this).attr("href");

            $(currentPage).css({zIndex:2}).show();
            $(prevPage).css({zIndex:1}).hide();

            setTimeout(function(){$(link).removeClass("clickDisable")},500);
        }

    });

    $("a.prev").live('click', function () {

        if (!$(this).hasClass("clickDisable")) {
            var link = $(this).addClass("clickDisable");

            currentPage = prevPage;
            prevPage = "#" + $(this).closest(".container").attr("id");

            $(currentPage).css({zIndex:2}).show();
            $(prevPage).css({zIndex:1}).hide();

            setTimeout(function(){$(link).removeClass("clickDisable")},500);
        }

    });

    /*menu function*/
    $(".gameScreen a.menu, #levelFailed a.menu, #levelComplete a.menu").live('click', function () {
        $(".popup").hide();
        $("#menu").show();
    });
    /*close menu*/
    $(".popup a.close, .popup a.menuItem.back, .popup a.no.menuItem").live('click', function () {
        if(islevelFail){
            initGameLevel();
            islevelFail = false;
        }
        $(".popup").hide();
    });
    /*close menu*/
    $("a.quit").live('click', function () {
        $(".popup").hide();
        $("#quit").show();
    });
    $("a.restart").live('click', function () {
        $(".popup").hide();
        $("#restart").show();
    });
    $("#menu .levelSelect").live('click', function () {
        clearAnimation();
        clearAnimalMove();
        $(".popup").hide();
        $(".container").not(".popup").css({zIndex:1}).hide();
        $("#levelSelect").css({zIndex:2}).show();
        currentPage = "#levelSelect";
    });

    /*restart level*/
    $("#restart a.yes").live('click', function () {
        hitCount=0;
        step=0;
        /*re-initialize current level*/
        clearAnimation();
        initGameLevel();
//        startCarAnimation();
        if (animalMove) {
            clearInterval(animalMove);
        }
        $(".popup").hide();
        $(".container").css({zIndex:1}).hide();
        $(".gameScreen").hide();
        $(".container.popup").css({zIndex:4});

        if (currLevel == "Level1") {
            $("#gameLevel1").css({zIndex:2}).show();
        } else if (currLevel == "Level2") {
            $("#gameLevel2").css({zIndex:2}).show();
            $(".gameScreen .animal").addClass("level2");
        } else if (currLevel == "Level3") {
            $("#gameLevel3").css({zIndex:2}).show();
            $(".gameScreen .animal").removeClass("level2").addClass("level3");
        }

        stars[currLevel].animalCount=0;
        stars[currLevel].dammage=0;
        stars[currLevel].totalHit=0;
    });
    /*quit level*/
    $("#quit a.yes, .menuItem.back").live('click', function () {
        clearAnimation();
        clearAnimalMove();
        $(".popup").hide();
        $(".container").not(".popup").css({zIndex:1}).hide();
        $("#charSelect").css({zIndex:2}).show();
        currentPage = "#charSelect";
    });

    /*char select carousel function*/
    var item = 1;
    $(".charSelect .content .next").click(function () {
        if (item < 5) {
            $('.charSelect .content .charContent .innerContent').animate({marginLeft:eval(-(item * 538))}, 500);
            item += 1;
        }
        if (item == 5) {
            $(this).addClass("disable");
        }
        $(".charSelect .content .prew").removeClass("disable");
    });
    $(".charSelect .content .prew").click(function () {
        if (item > 1) {
            item -= 1;
            $('.charSelect .content .charContent .innerContent').animate({marginLeft:eval(-((item-1) * 538))}, 500);
        }
        if (item == 1) {
            $(this).addClass("disable");
        }
        $(".charSelect .content .next").removeClass("disable");
    });

    /*set selected character*/
    $(".charSelect .playCharacter").click(function () {
        var char = $(".charSelect .content .charContent .innerContent .character:nth-child("+item+")");
        $(char).find("img.select").removeClass("hide");
        $(char).siblings().find("img.select").addClass("hide");
        $(char).find("div.charTitle").addClass("select");
        $(char).siblings().find("div.charTitle").removeClass("select");
        $(".gameScreen .animal").removeClass("rocky jamesDear jacky demi squi").addClass(character[item-1]);
        selectedChar = item;
        selectedAnimal = animalSpeed[character[item-1]];
    });

    $("a").each(function () {
        $(this).attr("hideFocus", "true");
    });

    /*level select function*/
    $(".levelSelect .levelContent .level").click(function () {
        if (!$(this).hasClass("locked")) {
            $(this).addClass("select");
            $(this).siblings().removeClass("select");
            $("#gameStartBtn").attr("href", "#game" + $(this).attr("id"));
            currLevel = $(this).attr("id");
            $(".currentSelectedLevel .levelNum").html(currLevel);
            setPageFontStyle(".currentSelectedLevel")
        }
    });

    $("#gameStartBtn").live('click', function () {
        initGameLevel();
    });
    setCarPosition();
//    currLevel = "Level3";
//    initGameLevel();

});

/*set car position*/
function setCarPosition(){
    $(".gameScreen").show();
    $(".gameScreen .car").each(function () {
        var position = $(this).position();
        var pos = position.left + "|" + position.top;
        $(this).attr("pos", pos);
    });

    setTimeout(function(){$(".gamescreen").hide()},200);
}

var currLevel = "Level1";
var selectedChar = 1;
var hitCount=0;
var hitCountTotal=0;

var hitTime = 0,hitted=false;
var hitTime1 = 0,hitted1=false;
var hitTime2 = 0,hitted2=false;

var animalClicked,targetClick = false;
var animalMove;

var carAnim, timeCount, remainTime;

/*init game levels*/
function initGameLevel() {
    hitted = 0;
    hitted1 = 0;
    hitted2 = 0;
    hitCount=0;
    hitCountTotal=0;

    /*set hitted and damage to 0*/
    $("#game" + currLevel + " .hitted .value").html(0);
    $("#game" + currLevel + " .damage .value").html(0);
    setPageFontStyle("#game" + currLevel + " .topBar");

    /*re-positioning cars and animal*/
    $(".gameScreen .animal").removeAttr("style").removeClass("moving hit clicked level2 level3").addClass("stopped ready").addClass(currLevel.toLowerCase());
    $(".gameScreen .car").removeAttr("style").show();
    $(".gameScreen .target").removeAttr("style");

    /*init car animation*/
    clearInterval(carAnim);
    clearInterval(animalMove);
    clearInterval(timeCount);
    carAnim = setInterval(function () {
        carAnimation("#game" + currLevel);
    }, 100);
    remainTime = gameTime;

    /*init remaining time time*/
    $("#game" + currLevel + " .time .value").html(gameTime);
    setPageFontStyle("#game" + currLevel + " .time");
    timeCount = setInterval(function () {
        timeCountDown("#game" + currLevel);
    }, 1000);
    animalClicked = false;

    /*animal move*/
    $("*", document.body).click(function(e){
        var className= $(this).get(0).className;
        var animal = $("#game" + currLevel + " .parent");
        if($(this).get(0).tagName == "A"){
            stopAnimal(animal);
            animalClicked = false;
        }else if( className.indexOf("grass") != -1 || className.indexOf("tree") != -1){
            stopAnimal(animal);
            return false;
        }else if(animalClicked /*&& !targetClick*/){

            targetClick =true;
            var animalHeight = $(animal).outerHeight();
            var animalWidth = $(animal).outerWidth();
            var curPos = $(animal).position();
            var ofset =$("#game"+currLevel).offset();
            var targetLeft = e.pageX - ofset.left-animalWidth/2;
            var targetTop = e.pageY - ofset.top-animalHeight/2;

            $("#game" + currLevel + " .target").css({left:targetLeft+animalWidth/4,top:targetTop+animalHeight/4}).show();

            var curLeft = curPos.left;
            var curTop = curPos.top;

            var pos = curLeft + "|" + curTop;
            $(animal).attr("pos",pos);
            if($(animal).siblings(".children1").length>0){
                var child1Pos = $("#game" + currLevel + " .children1").position().left+"|"+$("#game" + currLevel + " .children1").position().top;
            }
            if($(animal).siblings(".children2").length>0){
                var child2Pos = $("#game" + currLevel + " .children2").position().left+"|"+$("#game" + currLevel + " .children2").position().top;
            }
            $("#game" + currLevel + " .children1").attr("pos",child1Pos);
            $("#game" + currLevel + " .children2").attr("pos",child2Pos);

            clearInterval(animalMove);
            jungle = false;
            if(curTop<targetTop+20){
                $("#game" + currLevel + " .animal.parent").css({zIndex:5});
                $("#game" + currLevel + " .animal.children1").css({zIndex:4});
                $("#game" + currLevel + " .animal.children2").css({zIndex:3});
            }else{
                $("#game" + currLevel + " .animal.parent").css({zIndex:5});
                $("#game" + currLevel + " .animal.children1").css({zIndex:6});
                $("#game" + currLevel + " .animal.children2").css({zIndex:7});
            }
            animalMove = setInterval(function(){        

				moveAnimal(animal,targetLeft,targetTop,curLeft,curTop);}, 100);

        }









    });

    /*animal set to run*/
    $("#game" + currLevel + " .animal.parent.stopped").die('click').live('click', function () {
        $(this).removeClass("stopped ready").addClass("clicked");
        setTimeout(function(){
            animalClicked = true;
//            targetClick = false;
        },300);
    });

}
var jungle = false;
var parentPrevPosition, children1PrevPosition, children2PrevPosition;
/*level two animal move*/
var bbb=false;
function moveAnimal(animal, targetLeft, targetTop, curLeft, curTop) {
	bbb=true;
    
//	$(animal).removeClass("stopped");
    var speed = selectedAnimal[currLevel];

    if(speed==undefined){
        speed =1;
    }
    if($(animal).siblings(".children1").length>0){
        children1PrevPosition = $(animal).siblings(".children1").attr("pos").split("|");
    }

    if($(animal).siblings(".children2").length>0){
        children2PrevPosition = $(animal).siblings(".children2").attr("pos").split("|");
    }
    parentPrevPosition = $(animal).attr("pos").split("|");
    var left = parseFloat(parentPrevPosition[0]), top = parseFloat(parentPrevPosition[1]), pos;

    var end,start;

    if(targetLeft>curLeft){
        end =targetLeft;
        start = left;
    }else{
        end = left;
        start =targetLeft;
    }

    var point1=new Object(),point2= new Object();

    point1.x=targetLeft;point1.y=targetTop;
    point2.x=curLeft;point2.y=curTop;

    if (end > start && !(left==targetLeft && top == targetTop)) {
        if(!jungle){
            if(Math.abs(targetTop - curTop) > Math.abs(targetLeft - curLeft)){
                if(top<targetTop){
                    top += 5 * speed;
                    left += 5 * speed * (targetLeft - curLeft)/ (targetTop - curTop) ;
                }else{
                    top -= 5 * speed;
                    left -= 5 * speed * (targetLeft - curLeft)/ (targetTop - curTop) ;
                }
            } else{
                if(left < targetLeft){
                    left += 5 * speed;
                    top += 5 * speed * (targetTop - curTop) / (targetLeft - curLeft);
                }else{
                    left -= 5 * speed;
                    top -= 5 * speed * (targetTop - curTop) / (targetLeft - curLeft);
                }
            }
            pos = left + "|" + top;
            $(animal).css({left:left});
            $(animal).css({top:top});

            if($(animal).siblings(".children1").length>0){
                $(animal).siblings(".children1").css({left:eval(parentPrevPosition[0]),top:eval(parentPrevPosition[1])});
                $(animal).siblings(".children1").attr("pos", parentPrevPosition[0]+"|"+parentPrevPosition[1]);
            }

            if($(animal).siblings(".children2").length>0){
                $(animal).siblings(".children2").css({left:eval(children1PrevPosition[0]),top:eval(children1PrevPosition[1])});
                $(animal).siblings(".children2").attr("pos", children1PrevPosition[0]+"|"+children1PrevPosition[1]);
            }

            $(animal).attr("pos", pos);
            $(animal).toggleClass("moving").removeClass("stopped").addClass("clicked");
			$(animal).siblings(".children1").toggleClass("moving2");
			$(animal).siblings(".children2").toggleClass("moving2");
           if(overlaps(animal,$("#game" + currLevel + " .destination"))){
                stopAnimal(animal);
                stopAnimal($(animal).siblings(".children1"));
                stopAnimal($(animal).siblings(".children2"));
                clearInterval(animalMove);
                levelSuccess();
            }
        }

    } else {
        $(animal).css({left:targetLeft});
        $(animal).css({top:targetTop});
        stopAnimal(animal);
        stopAnimal($(animal).siblings(".children1"));
        stopAnimal($(animal).siblings(".children2"))
    }

    /*calculate hitting*/
    calculateHitting(animal);

    checkPathIsOnTreeOrGrass(animal);

}

/*stop animal animation*/
function stopAnimal(animal){
    $(animal).removeClass("moving clicked moving2").addClass("stopped");
//    animalClicked = false;
    $("#game" + currLevel + " .target").hide();
    targetClick = false;
//    clearInterval(animalMove);
}

/*car animation*/
function carAnimation(level) {
$(".car").each(function(){
	try{
		  var carTop=$(this).css("top");
		  var y1=	parseInt( carTop.substr(0,carTop.length-2));
		  var carLeft=$(this).css("left");
		  var x1=	parseInt(carLeft.substr(0,carLeft.length-2));
		  var y2=parseInt( carTop.substr(0,carTop.length-2))+ 144;
 		  var x2=parseInt( carLeft.substr(0,carLeft.length-2))+174;
		  
		  var anTop=$("#game"+currLevel+" .animal.parent").css("top");
		  var anY=parseInt(anTop.substr(0, anTop.length-2))+  $("#game"+currLevel+" .animal.parent").height();
		  var anLeft= $("#game"+currLevel+" .animal.parent").css("left");
		if (anY<y1+ 72){y1+=60;y2-=60;}else{y1+=50;y2-=50;}
		  var anX=parseInt(anLeft.substr(0, anLeft.length-2));

      if ($(this).hasClass("car1")||$(this).hasClass("car2")||$(this).hasClass("car3")){

		if ((anX-x1)*(y2-y1)-(anY-y1)*(x2-x1)>0){
			$(this).css({"z-index":"6"});
		}
		else
		{
			$(this).css({"z-index":"0"});
		}
}
else{

	var y2=	parseInt( carTop.substr(0,carTop.length-2))+10;
	var x1=	parseInt(carLeft.substr(0,carLeft.length-2));
	var y1=parseInt(carTop.substr(0,carTop.length-2))+144-10;
	var x2=parseInt(carLeft.substr(0,carLeft.length-2))- 174;
	var anY=parseInt( anTop.substr(0,anTop.length-2))  +71;
	var anX=parseInt( anLeft.substr(0,anLeft.length-2))+56;
	if ($(this).hasClass("car8")){ y1+=5;y2+=10;}else{
	if (anY<=y1-52){y1-=80;y2+=80;}else{y1-=10;y2+=10;};}
		if ((anX-x1)*(y2-y1)+(anY-y1)*(x2-x1)>0){
			$(this).css({"z-index":"6"});
			}
		else{			
			$(this).css({"z-index":"0"});
		}
}
	}catch(e){console.log(e);}}
);

    var levelCarSpeed = carSpeed[currLevel];
	$(level + " .car1").each(function () {
        var position = $(this).attr("pos").split("|");
        if (parseInt(position[1]) > 460) {
            position[1] = 15;
            position[0] = -155;
        }
        $(this).css({left:eval(parseFloat(position[0]) + levelCarSpeed["car1"]), top:eval(parseFloat(position[1]) + (levelCarSpeed["car1"] * 360 / 730))});
        var pos = eval(parseFloat(position[0]) + levelCarSpeed["car1"]) + "|" + eval(parseFloat(position[1]) + (levelCarSpeed["car1"] * 360 / 730));
        $(this).attr("pos", pos);
    });

    $(level + " .car2").each(function () {
        var position = $(this).attr("pos").split("|");
        if (parseInt(position[1]) > 460) {
            position[1] = -30;
            position[0] = -155;
        }
        $(this).css({left:eval(parseFloat(position[0]) + levelCarSpeed["car2"]), top:eval(parseFloat(position[1]) + (levelCarSpeed["car2"] * 360 / 730))});
        var pos = eval(parseFloat(position[0]) + levelCarSpeed["car2"]) + "|" + eval(parseFloat(position[1]) + (levelCarSpeed["car2"] * 360 / 730));
        $(this).attr("pos", pos);

    });

    $(level + " .car3").each(function () {
        var position = $(this).attr("pos").split("|");
        if (parseInt(position[1]) < 5) {
            position[1] = 460;
            position[0] = 860;
        }
        $(this).css({left:eval(parseFloat(position[0]) - levelCarSpeed["car3"]), top:eval(parseFloat(position[1]) - (levelCarSpeed["car3"] * 360 / 730))});
        var pos = eval(parseFloat(position[0]) - levelCarSpeed["car3"]) + "|" + eval(parseFloat(position[1]) - (levelCarSpeed["car3"] * 360 / 730));
        $(this).attr("pos", pos);
    });

    $(level + " .car4").each(function () {
        var position = $(this).attr("pos").split("|");
        if (parseInt(position[1]) > 340) {
            position[1] = -75;
            position[0] = 700;
        }
        if(parseInt(position[1])>100 && parseInt(position[1])<230){
            $(this).addClass("hide");
        }else{
            $(this).removeClass("hide");
        }
        $(this).css({left:eval(parseFloat(position[0]) - levelCarSpeed["car4"]), top:eval(parseFloat(position[1]) + (levelCarSpeed["car4"] * 42 / 83))});
        var pos = eval(parseFloat(position[0]) - levelCarSpeed["car4"]) + "|" + eval(parseFloat(position[1]) + (levelCarSpeed["car4"] * 42 / 83));
        $(this).attr("pos", pos);
    });

    $(level + " .car5").each(function () {
        var position = $(this).attr("pos").split("|");
        if (parseInt(position[0]) > 860) {
            position[1] = 404;
            position[0] = -130;
        }
        if(parseInt(position[0])>130 && parseInt(position[0])<350){
            $(this).addClass("hide");
        }else{
            $(this).removeClass("hide");
        }
        $(this).css({left:eval(parseFloat(position[0]) + levelCarSpeed["car5"]), top:eval(parseFloat(position[1]) - (levelCarSpeed["car5"] * 42 / 83))});
        var pos = eval(parseFloat(position[0]) + levelCarSpeed["car5"]) + "|" + eval(parseFloat(position[1]) - (levelCarSpeed["car5"] * 42 / 83));
        $(this).attr("pos", pos);
    });

    $(level + " .car6").each(function () {
        var position = $(this).attr("pos").split("|");
        if (parseInt(position[0]) > 860) {
            position[1] = 374;
            position[0] = -130;
        }
        if(parseInt(position[0])>120 && parseInt(position[0])<350){
            $(this).addClass("hide");
        }else{
            $(this).removeClass("hide");
        }
        $(this).css({left:eval(parseFloat(position[0]) + levelCarSpeed["car6"]), top:eval(parseFloat(position[1]) - (levelCarSpeed["car6"] * 42 / 83))});
        var pos = eval(parseFloat(position[0]) + levelCarSpeed["car6"]) + "|" + eval(parseFloat(position[1]) - (levelCarSpeed["car6"] * 42 / 83));
        $(this).attr("pos", pos);
    });

    $(level + " .car7").each(function () {
        var position = $(this).attr("pos").split("|");
        if (parseInt(position[0]) > 860) {
            position[1] = 400;
            position[0] = -130;
        }
        if(parseInt(position[0])>130 && parseInt(position[0])<350){
            $(this).addClass("hide");
        }else{
            $(this).removeClass("hide");
        }
        $(this).css({left:eval(parseFloat(position[0]) + levelCarSpeed["car7"]), top:eval(parseFloat(position[1]) - (levelCarSpeed["car7"] * 42 / 83))});
        var pos = eval(parseFloat(position[0]) + levelCarSpeed["car7"]) + "|" + eval(parseFloat(position[1]) - (levelCarSpeed["car7"] * 42 / 83));
        $(this).attr("pos", pos);
    });

    $(level + " .car8").each(function () {
        var position = $(this).attr("pos").split("|");
        if (parseInt(position[1]) > 340) {
            position[1] = -115;
            position[0] = 700;
        }
        if(parseInt(position[1])>90 && parseInt(position[1])<220){
            $(this).addClass("hide");
        }else{
            $(this).removeClass("hide");
        }
        $(this).css({left:eval(parseFloat(position[0]) - levelCarSpeed["car8"]), top:eval(parseFloat(position[1]) + (levelCarSpeed["car8"] * 42 / 83))});
        var pos = eval(parseFloat(position[0]) - levelCarSpeed["car8"]) + "|" + eval(parseFloat(position[1]) + (levelCarSpeed["car8"] * 42 / 83));
        $(this).attr("pos", pos);
    });

    $(level + " .car9").each(function () {
        var position = $(this).attr("pos").split("|");
        if (parseInt(position[0]) > 820) {
            position[1] = 214;
            position[0] = 90;
        }
        if(parseInt(position[0])<280){
            $(this).addClass("hide");
        }else{
            $(this).removeClass("hide");
        }
        $(this).css({left:eval(parseFloat(position[0]) + levelCarSpeed["car9"]), top:eval(parseFloat(position[1]) - (levelCarSpeed["car9"] * 42 / 83))});
        var pos = eval(parseFloat(position[0]) + levelCarSpeed["car9"]) + "|" + eval(parseFloat(position[1]) - (levelCarSpeed["car9"] * 42 / 83));
        $(this).attr("pos", pos);
    });

    $(level + " .car10").each(function () {
        var position = $(this).attr("pos").split("|");
        if (parseInt(position[0]) > 820) {
            position[1] = 154;
            position[0] = 90;
        }
        if(parseInt(position[0])<280){
            $(this).addClass("hide");
        }else{
            $(this).removeClass("hide");
        }
        $(this).css({left:eval(parseFloat(position[0]) + levelCarSpeed["car10"]), top:eval(parseFloat(position[1]) - (levelCarSpeed["car10"] * 42 / 83))});
        var pos = eval(parseFloat(position[0]) + levelCarSpeed["car11"]) + "|" + eval(parseFloat(position[1]) - (levelCarSpeed["car10"] * 42 / 83));
        $(this).attr("pos", pos);
    });

    $(level + " .car11").each(function () {
        var position = $(this).attr("pos").split("|");
        if (parseInt(position[0]) > 820) {
            position[1] = 164;
            position[0] = 90;
        }
        if(parseInt(position[0])<280){
            $(this).addClass("hide");
        }else{
            $(this).removeClass("hide");
        }
        $(this).css({left:eval(parseFloat(position[0]) + levelCarSpeed["car11"]), top:eval(parseFloat(position[1]) - (levelCarSpeed["car11"] * 42 / 83))});
        var pos = eval(parseFloat(position[0]) + levelCarSpeed["car11"]) + "|" + eval(parseFloat(position[1]) - (levelCarSpeed["car11"] * 42 / 83));
        $(this).attr("pos", pos);
    });
}

/*time countDown*/
function timeCountDown(screen) {
    remainTime--;
    $(screen + " .time .value").html(remainTime);
    setPageFontStyle(screen + " .time");
    if (remainTime <= 0) {
        levelFail();
        clearAnimation();
    }
}

/*clear animation*/
function clearAnimation() {
    clearInterval(carAnim);
    clearInterval(timeCount);
}
function clearAnimalMove() {
    if (animalMove) {
        clearInterval(animalMove);
    }
}

var score= 0,damage= 0,completeTime= 0,highScore= 0,title;
var star =["three","two","one",""];
var levelOneStar,levelTwoStar,levelThreeStar;

var islevelFail =false;
/*level fail*/
function levelFail(){
    islevelFail = true;
    clearAnimation();
    clearAnimalMove();
    $("#levelFailed").show();

    damage = hitCountTotal * 10;
    score = remainTime*50 - damage - hitCountTotal*10;
    if(score<=0){
        score=0;
    }

    $("#levelFailed .highScore .value.score").html(highScore+ "(username)");
    $("#levelFailed .score .value").html(score);
    $("#levelFailed .totalHitted .value").html(hitCountTotal+"x");
    $("#levelFailed .damage .value").html("$"+damage);

    if(currLevel == "Level1"){
        title = "Level 1 Failed";
    }else if(currLevel == "Level2"){
        title = "Level 2 Failed";
    }else if(currLevel == "Level3"){
        title = "Level 3 Failed";
    }

    $("#levelFailed .title").html(title);

    setPageFontStyle("#levelFailed");
    hitCount=0;
    hitCountTotal=0;
    initGameLevel();
}

/*level fail*/
function levelSuccess(){
    islevelFail =true;
    clearAnimation();
    clearAnimalMove();
    $(".gameScreen").css({zIndex:1}).hide();
    $("#levelComplete").css({zIndex:2}).show();
    currentPage = "#levelComplete";

    damage = hitCountTotal * 10;
    score = remainTime*50 - damage - hitCountTotal*10;
    if(score<=0){
        score=0;
    }
    var scoreLabel ="High Score:";
    if(score>highScore){
        highScore = score;
        scoreLabel = "New High Score:";
    }

    completeTime = gameTime -remainTime;

    stars[currLevel].animalCount++;
    stars[currLevel].dammage += damage;
    stars[currLevel].totalHit += hitCountTotal;

    $("#levelComplete .highScore .value.score").html(highScore+ "(username)");
    $("#levelComplete .highScore .label").html(scoreLabel);
    $("#levelComplete .score .value").html(score);
    $("#levelComplete .completeTime .value").html(completeTime);
    $("#levelComplete .totalHitted .value").html(stars[currLevel].totalHit+"x");
    $("#levelComplete .damage .value").html("$"+stars[currLevel].dammage);



    if(currLevel == "Level1"){
        title = "Level 1 Complete";
        if(stars[currLevel].animalCount==1 || stars[currLevel].animalCount==2 ){
            levelOneStar=star[2];
        }
        if(stars[currLevel].animalCount==3 && stars[currLevel].dammage < 30){
            levelOneStar=star[1];
        }else{
            levelOneStar=star[2];
        }
        if(stars[currLevel].animalCount==3 && stars[currLevel].dammage == 0){
            levelOneStar=star[0];
        }
        $("#Level1 span.star:last").addClass(levelOneStar);
        $("#levelComplete .stars").removeClass("one two three").addClass(levelOneStar);

    }else if(currLevel == "Level2"){
        title = "Level 2 Complete";
        if(stars[currLevel].animalCount==1 || stars[currLevel].animalCount==2 ){
            levelTwoStar=star[2];
        }
        if(stars[currLevel].animalCount==3 && stars[currLevel].dammage < 30){
            levelTwoStar=star[1];
        }else{
            levelTwoStar=star[2];
        }
        if(stars[currLevel].animalCount==3 && stars[currLevel].dammage == 0){
            levelTwoStar=star[0];
        }
        $("#Level2 span.star:last").addClass(levelTwoStar);
        $("#levelComplete .stars").removeClass("one two three").addClass(levelTwoStar);

    }else if(currLevel == "Level3"){
        title = "Level 3 Complete";

        if(stars[currLevel].animalCount==1 || stars[currLevel].animalCount==2 ){
            levelThreeStar=star[2];
        }
        if(stars[currLevel].animalCount==3 && stars[currLevel].dammage < 30){
            levelThreeStar=star[1];
        }else{
            levelThreeStar=star[2];
        }
        if(stars[currLevel].animalCount==3 && stars[currLevel].dammage == 0){
            levelThreeStar=star[0];
        }

        $("#Level3 span.star:last").addClass(levelThreeStar);
        $("#levelComplete .stars").removeClass("one two three").addClass(levelThreeStar);
    }

    $("#levelComplete .title").html(title);

    setPageFontStyle("#levelComplete");
    hitCount=0;
}

/*calculate hitting*/
function calculateHitting(animal){
    $("#game" + currLevel + " .car:visible").die().each(function(){

        if(overlaps(animal,$(this)) && !hitted){
            $(this).hide();
            $(animal).addClass("hit");
            hitCount++;
            hitCountTotal++;
            hitted = true;
            $("#game" + currLevel + " .hitted .value").html(hitCountTotal);
            $("#game" + currLevel + " .damage .value").html("$"+hitCountTotal*10);
            setPageFontStyle("#game" + currLevel + " .topBar");
            showDamage();
        }
        if(hitCount==3){
//            if($(animal).hasClass("level3")){
//                $(animal).removeClass("level3").addClass("level2");
//                hitCount = 0;
//            } else if($(animal).hasClass("level2")){
//                $(animal).removeClass("level2");
//                hitCount = 0;
//            } else{
                clearInterval(animalMove);
                setTimeout('levelFail()',500);
                $(animal).removeClass("hit");
                hitCount = 0;
                animalClicked = false;
//            }
        }
        if(hitted){
            hitTime++;
        }
        if(hitTime==20){
            $(animal).removeClass("hit");
            hitted = false;
            hitTime = 0;
        }






		animal1="#game" + currLevel + " .children1";
		if (!$(animal1).is(":visible"))return;
        if(overlaps(animal1,$(this)) && !hitted1){
            $(this).hide();
            $(animal1).addClass("hit");
            hitCount++;
            hitCountTotal++;
            hitted1 = true;
            $("#game" + currLevel + " .hitted .value").html(hitCountTotal);
            $("#game" + currLevel + " .damage .value").html("$"+hitCountTotal*10);
            setPageFontStyle("#game" + currLevel + " .topBar");
            showDamage();
        }
        if(hitCount==3){
//            if($(animal).hasClass("level3")){
//                $(animal).removeClass("level3").addClass("level2");
//                hitCount = 0;
//            } else if($(animal).hasClass("level2")){
//                $(animal).removeClass("level2");
//                hitCount = 0;
//            } else{
                clearInterval(animalMove);
                setTimeout('levelFail()',500);
               $(animal1).removeClass("hit");
                hitCount = 0;
                animalClicked = false;
//            }
        }
        if(hitted1){
            hitTime1++;
        }
        if(hitTime1==20){
            $(animal1).removeClass("hit");
            hitted1 = false;
            hitTime1 = 0;
        }







        animal2="#game" + currLevel + " .children2";
		if (!$(animal2).is(":visible"))return;
        if(overlaps(animal2,$(this)) && !hitted2){
            $(this).hide();
            $(animal2).addClass("hit");
            hitCount++;
            hitCountTotal++;
            hitted2 = true;
            $("#game" + currLevel + " .hitted .value").html(hitCountTotal);
            $("#game" + currLevel + " .damage .value").html("$"+hitCountTotal*10);
            setPageFontStyle("#game" + currLevel + " .topBar");
            showDamage();
        }
        if(hitCount==3){
//            if($(animal).hasClass("level3")){
//                $(animal).removeClass("level3").addClass("level2");
//                hitCount = 0;
//            } else if($(animal).hasClass("level2")){
//                $(animal).removeClass("level2");
//                hitCount = 0;
//            } else{
                clearInterval(animalMove);
                setTimeout('levelFail()',500);
                $(animal2).removeClass("hit");
                hitCount = 0;
                animalClicked = false;
//            }
        }
        if(hitted2){
            hitTime2++;
        }
        if(hitTime2==20){
          $(animal2).removeClass("hit");
            hitted2 = false;
            hitTime2 = 0;
        }


		
    })
}

/*calculate hitting*/
function checkPathIsOnTreeOrGrass(animal){
    $("#game" + currLevel + " .tree, #game" + currLevel + " .grass").die().each(function(){
        if(overlaps(animal,$(this))){
            stopAnimal("#game" + currLevel + " .animal");
            $(animal).css({left:eval(parentPrevPosition[0]),top:eval(parentPrevPosition[1])});

            if($(animal).siblings(".children1").length>0){
                $(animal).siblings(".children1").css({left:eval(children1PrevPosition[0]),top:eval(children1PrevPosition[1])});
            }

            if($(animal).siblings(".children2").length>0){
                $(animal).siblings(".children2").css({left:eval(children2PrevPosition[0]),top:eval(children2PrevPosition[1])});
            }
            jungle = true;
        }
    })
}

/*find overlapping cars and animal*/
var overlaps = (function () {
    function getPositions( elem ) {
        var pos, width, height,paddingLeft,paddingTop;
        pos = $( elem ).position();
        width = $( elem ).width();
        height = $( elem ).height();
        paddingLeft = parseInt($( elem ).css("padding-left").replace("px", ""));
        paddingTop = parseInt($( elem ).css("padding-top").replace("px", ""));

        return [ [ pos.left+paddingLeft, pos.left+paddingLeft + width ], [ pos.top+paddingTop, pos.top+paddingTop + height ] ];
    }

    function comparePositions( p1, p2 ) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }
    function oldOverlaps( a, b ) {
		var pos1 = getPositions( a ),
            pos2 = getPositions( b );
		
			return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
    }
    return function ( a, b ) {
		if ($(a).hasClass("car")&& $(b).hasClass("animal")||$(b).hasClass("car")&& $(a).hasClass("animal")){
			if (!oldOverlaps(a,b)){
				return false;
			}
			if ($(a).hasClass("car")&& $(b).hasClass("animal")){
				var c=b;
				b=a;
				a=c;
			}
			var carTop=$(b).css("top");
			var y1=	parseInt( carTop.substr(0,carTop.length-2));
			var carLeft=$(b).css("left");
			var x1=	parseInt(carLeft.substr(0,carLeft.length-2));
			var y2=parseInt( carTop.substr(0,carTop.length-2))+ 144;
 			var x2=parseInt( carLeft.substr(0,carLeft.length-2))+174;
		  
			var anTop=$(a).css("top");
			var anY=parseInt(anTop.substr(0, anTop.length-2))+  $(a).height();
			var anLeft= $(a).css("left");
			var anX=parseInt(anLeft.substr(0, anLeft.length-2));
		/*	if ($(a).hasClass("jamesDear")){
				anY-= $(a).height()/2;
				anX+= $(a).width()/2;
			}*/
			if ($(b).hasClass("car1")||$(b).hasClass("car2")||$(b).hasClass("car3")){
				
				if (Math.abs((anX-x1)*(y2-y1)-(anY-y1)*(x2-x1))/Math.sqrt((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1))<10){
					return true;
				}
			}
			else{
				
				var y2=	parseInt( carTop.substr(0,carTop.length-2))+10;
				var x1=	parseInt(carLeft.substr(0,carLeft.length-2));
				var y1=parseInt(carTop.substr(0,carTop.length-2))+144-10;
				var x2=parseInt(carLeft.substr(0,carLeft.length-2))- 174;
				var anY=parseInt( anTop.substr(0,anTop.length-2))  +71;
				var anX=parseInt( anLeft.substr(0,anLeft.length-2))+56;
		/*	if ($(a).hasClass("jamesDear")){
				anY-= 35;
				anX-=25;
			}*/
				if ($(b).hasClass("car8"))
				{
					
					y2+=35;
					y1+=35;
				}
				var vids=((anX-x1)*(y2-y1)+(anY-y1)*(x2-x1))/Math.sqrt((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1));
				if ((vids>0&&vids<10)||(vids<0&&vids>-30)){
					return true;
				}
			}
			return false;
		}
		else{
			var pos1 = getPositions( a ),
            pos2 = getPositions( b );
		
			return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
		}
    };
})();

function showDamage(){
    $("#game"+currLevel+ " .hitValue").css({left:eval(parentPrevPosition[0]),top:eval(parentPrevPosition[1]-50)}).show();
    setTimeout(function(){
        $(".gameScreen .hitValue").hide();
    },1000);
}

/*set page font style*/
function setPageFontStyle(contianer) {
    Cufon.now();
    Cufon.replace(contianer + ' .text', {textShadow:'rgba(50 ,50 ,50 , 0.3) 1px 1px, rgba(60 ,60 ,60 , 0.2) 2px 2px, rgba(60 ,60 ,60 , 0.1) 4px 4px'});
    Cufon.replace(contianer + ' .textNoShadow');
    Cufon.replace(contianer + ' .menuItem',
        {
            hover:{
                textShadow:'5px 5px rgba(60,23,97, .3),-5px -5px rgba(60,23,97, .3),-5px 5px rgba(60,23,97, .3),5px -5px rgba(60,23,97, .3)',
                color:'#ffff00'
            }
        }
    );
}
