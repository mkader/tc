// JavaScript Document
var Zeepl = function(container){
    this.container = container;
    this.gender = "boy";
    this.body = 1;
    this.skinTone = 0;
    this.skinToneInit = false;
    this.hair = 0;
    this.hairInit = false;
    this.emotion = 2;
    this.emotionInit = false;
    this.clothes = 0;
    this.clothesInit = false;
    this.background = 0; 
    this.accessories = {
        "ears":0,
        "eyes":0,
        "face":0,
        "head":0,
        "mouth":0,
        "neck":0,
        "nose":0,   
        "assorted_back":0, 
		"assorted_front":0
    };
    this.accessoriesInit = false;
    this.canvas = container.find(".canvas");
    this.pixel = "asset/pixel.png";
    this.init();
}

var cnv_w = 274;
var cnv_h = 253;

function changeCanvasContent(cnv, src) {
	var canvas	= $("#cnv_"+cnv);
	var ctx		= canvas.get(0).getContext("2d");
	var img 	= new Image();
	img.src 	= src;
	img.onload 	= function(){ 
		ctx.clearRect(0,0,cnv_w,cnv_h);	
		ctx.drawImage(img,0,0);  
	}; 
	
}
function clearCanvasContent(cnv) {
	var canvas	= $("#cnv_"+cnv);
	var ctx		= canvas.get(0).getContext("2d");
	ctx.clearRect(0,0,cnv_w,cnv_h);		
}



/* Body number */
Zeepl.Avatar = {
    "boy":{
        "body":[4,9,3],  // body init png
        "skinTone":[ "Victorious Vanilla","Pretty Pink","Alluring Apricot","Cool Cashew","Peaceful Peach",
                        "Bright Burlywood","Brave Butterscotch","Happy Honey","Powerful Pistachio",
                        "Talented Taupe","Clever Caramel","Cheerful Chocolate","Courageous Cobalt","Punctual Peas",
                        "Proud Panda","Thoughtful Tomato","Enchanting Eggplant","Friendly Flax","Outstanading Olive",
                        "Gentle Goliath","Talented Tangerine"
         ],      // the number of skin tone for each body
        "emotion":["Happy","Relaxed","Overjoyed","Upset","Furious","lrritated","Blissful","Surprised","Bored","Shy","Grieving","Enraged","Sleepy"],       // the number of emotion for each emotion
        "hair":[6,13,11],           // the number of hair style for hair
        "clothes":[14,20,17],               // the number of clothes
        "background":65,            // the number if background
        "accessories":{             // the accessories 
            "ears":[2,3,2],
            "eyes":[6,12,15],
            "face":[5,5,7],
            "head":[31,33,31],
            "mouth":[1,0,0],
            "neck":[2,12,3],
            "nose":[1,0,1], 
			"front":[5],
			"back":[3]
        }
    },
    "girl":{
        "body":[4,4,7,4],  // body init png
        "skinTone":[ "Victorious Vanilla","Pretty Pink","Alluring Apricot","Cool Cashew","Peaceful Peach",
                        "Bright Burlywood","Brave Butterscotch","Happy Honey","Powerful Pistachio",
                        "Talented Taupe","Clever Caramel","Cheerful Chocolate","Courageous Cobalt","Punctual Peas",
                        "Proud Panda","Thoughtful Tomato","Enchanting Eggplant","Friendly Flax","Outstanading Olive",
                        "Gentle Goliath","Talented Tangerine"
         ],      // the number of skin tone for each body
        "emotion":["Happy","Relaxed","Overjoyed","Upset","Furious","lrritated","Blissful","Surprised","Bored","Shy","Grieving","Enraged","Sleepy"],       // the number of emotion for each emotion
        "hair":[3,6,2,6],           // the number of hair style for hair
        "clothes":[8,9,5,15],               // the number of clothes
        "background":65,            // the number if background
        "accessories":{             // the accessories
            "ears":[2,2,1,0],
            "eyes":[5,7,0,11],
            "face":[3,3,2,2],
            "head":[36,37,20,47],
            "mouth":[0,1,0,0],
            "neck":[9,7,4,9],
            "nose":[0,0,0,0],
			"front":[5],
			"back":[3]
        }
    }
} 

$.extend(Zeepl.prototype, {
 
     init : function(){
         var _this = this;  

        this.container.find(".gender a").click(function(){
            _this.gender = $(this).attr("name");
            _this.container.find(".gender").hide();
            _this.container.find(".features").show();
            _this.container.find(".secondBg").addClass("featureBg");
            _this.clean();
            _this.initBody(true);
            return false;
        });

         function select(trigger,component){
             trigger.parents(".tabContent").find("li a").removeClass("selected");
             trigger.addClass("selected");
             _this.canvas.find("." + component).attr("src",trigger.attr("rel")); 
         }
         
         function selectAccessory(trigger){
            var type = trigger.attr("type");
             _this.accessories[type] = parseInt(trigger.attr("index"));              
			
			 if (type=='assorted_front') {
				 changeCanvasContent(type, "asset/accessories/front/" + _this.accessories[type] +'.png');
			 } else if (type=='assorted_back') {
				 changeCanvasContent(type, "asset/accessories/back/" + _this.accessories[type] +'.png');
			 } else {
				 changeCanvasContent(type, "asset/" + _this.gender + "/accessories/" + type + "/" + _this.body + "/" + _this.accessories[type] +'.png');				
			 }
			 
			 trigger.parents(".tabContent").find("a." + type + "Link").removeClass("selected");
			 trigger.addClass("selected");
             
         }
         function unselectAccessory(trigger){
            var a = trigger.parent();
            var type = a.attr("type");
            _this.accessories[type] = 0; 
            a.removeClass("selected");
            _this.canvas.find("." + type).attr("src",_this.pixel);
			clearCanvasContent(type);
         }
		 
        this.container.find(".bodySelector li a").live("click",function(){
            _this.body = parseInt($(this).attr("index")); 
            _this.clean(); 
            $(this).parents(".tabContent").find("li a").removeClass("selected");
            $(this).addClass("selected");		
			
			var srcBody = _this.skinTone>0 ? "asset/" + _this.gender + "/skinTone/" + _this.body + "/"+_this.skinTone+'.png' : $(this).attr("rel");
			_this.emotion = $('.emotionSelector a.selected').attr('index')!=undefined ? $('.emotionSelector a.selected').attr('index') : _this.emotion;
						
			changeCanvasContent('body', srcBody);
			changeCanvasContent('emotion', "asset/" + _this.gender + "/emotion/" + _this.body + "/"+_this.emotion+'.png');
			clearCanvasContent('hair'); // clear the selected hair for the meantime
			clearCanvasContent('clothes'); // clear the selected clothes for the meantime
			
            return false;
        });
        this.container.find(".skinToneSelector li a").live("click",function(){
            _this.skinTone = parseInt($(this).attr("index")); 
            $(this).addClass("selected"); 
            select($(this),"body");
			
			changeCanvasContent('body', "asset/" + _this.gender + "/skinTone/" + _this.body + "/" + _this.skinTone + ".png");
			
            return false;
        });
        this.container.find(".skinToneSelector li a,.emotionSelector li a").live("mouseenter",function(){
            if($(".tooltip").is(":visible")){
                return false;
            }
            $(".tooltip").remove();
            var tooltip = $("<div class='tooltip'><p class='tipBox'><span class='boxR'><span class='boxM'>" + $(this).attr("desc") + "</span></span></p><span class='arrow'></span></div>").appendTo($("body"));
            tooltip.css({  
                "left":$(this).offset().left -(tooltip.width()-50)/2 + "px",
                "top":$(this).parents(".tabContent").offset().top -17 + "px"
            }); 
            tooltip.show();
        });
        this.container.find(".skinToneSelector li a,.emotionSelector li a").live("mouseleave",function(){
            $(".tooltip").remove();
        });
        this.container.find(".hairSelector li a").live("click",function(){
            _this.hair = parseInt($(this).attr("index"));
            select($(this),"hair");
			changeCanvasContent('hair', "asset/" + _this.gender + "/hair/" + _this.body + "/" + _this.hair + ".png");
            return false;
        });
        this.container.find(".emotionSelector li a").live("click",function(){
            _this.emotion = parseInt($(this).attr("index")); 
            select($(this),"emotion");
			changeCanvasContent('emotion', "asset/" + _this.gender + "/emotion/" + _this.body + "/" + _this.emotion + ".png");
            return false;
        });
        this.container.find(".clothesSelector li a").live("click",function(){
            _this.clothes = parseInt($(this).attr("index")); 
            select($(this),"clothes");
			changeCanvasContent('clothes', "asset/" + _this.gender + "/clothes/" + _this.body + "/" + _this.clothes + ".png");
            return false;
        });
        this.container.find(".accessorySelector li a").live("click",function(){ 
			selectAccessory($(this));
            return false;
        });
        this.container.find(".accessorySelector li a span.remove").live("click",function(event){
            unselectAccessory($(this));
            event.stopPropagation();
            return false;
        });
        this.container.find(".backgroundSelector li a").live("click",function(){
            _this.background = parseInt($(this).attr("index"));
            select($(this),"bg");
			changeCanvasContent('bg', "asset/bg/" + _this.background + ".png");
            return false;
        });
        this.container.find(".tabs a.body").click(function(){
            _this.container.find(".tabContent").hide();
            _this.container.find(".bodySelector").show();
            _this.container.find(".tabs a").removeClass("active");
            $(this).addClass("active");
            return false;
        });
        this.container.find(".tabs a.skinTone").click(function(){
            _this.container.find(".tabContent").hide();
            _this.container.find(".tabs a").removeClass("active");
            $(this).addClass("active");
            _this.initSkinTone();
            return false;
        });
        this.container.find(".tabs a.hair").click(function(){
            _this.container.find(".tabContent").hide();
            _this.container.find(".tabs a").removeClass("active");
            $(this).addClass("active");
            _this.initHairSelector();
            return false;
        });
        this.container.find(".tabs a.emotion").click(function(){
            _this.container.find(".tabContent").hide();
            _this.container.find(".tabs a").removeClass("active");
            $(this).addClass("active");
            _this.initEmotionSelector();
            return false;
        });
        this.container.find(".tabs a.clothes").click(function(){
            _this.container.find(".tabContent").hide();
            _this.container.find(".tabs a").removeClass("active");
            $(this).addClass("active");
            _this.initClothes();
            return false;
        });
        this.container.find(".tabs a.accessory").click(function(){
            _this.container.find(".tabContent").hide();
            _this.container.find(".tabs a").removeClass("active");
            $(this).addClass("active");
            _this.initAccessory();
            return false;
        });
        this.container.find(".tabs a.bg").click(function(){
            _this.container.find(".tabContent").hide();
            _this.container.find(".tabs a").removeClass("active");
            $(this).addClass("active");
            _this.initBg();
            return false;
        });
     },

    destroySelector : function(selector){
        var slider = selector.data("slider");
        if(slider){
            slider.destroyShow();
        }
        selector.find("ul").remove();
        selector.removeClass("hasSlider");
    },
    initSelector : function(selector){
        selector.show();
        if(selector.find("li").length>13){
            selector.addClass("hasSlider");
            var _slider = selector.find("ul").bxSlider({
                displaySlideQty:13,
                moveSlideQty:13,
                speed:500,
                infiniteLoop:false,
                hideControlOnEnd:true,
                pager: false
            });
            selector.data("slider",_slider); 
        }
    },

    initBody : function(isStartOver){
        var _this = this;
        var _bodySelector = this.container.find(".bodySelector");
        this.container.find(".tabContent").hide();
        var _bodies = Zeepl.Avatar[this.gender]["body"];
        var _path = "asset/" + this.gender + "/skinTone/";
        if(isStartOver){ 
            this.destroySelector(_bodySelector);
            _bodySelector.find("ul").remove();  
            var _ul = $("<ul/>");
            $.each(_bodies,function(index,body){
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "index":index+1,
                        "class":index+1 == _this.body?"selected":"",
                        "rel":_path + (index+1) +  "/" +  body + ".png"
                    }).append(
                        $("<img/>",{
                            "src":_path + (index+1) +  "/" +  body + ".png"
                        })
                    )
                ).appendTo(_ul);
            });
            _ul.appendTo(_bodySelector); 
            this.initSelector(_bodySelector);
        }	
		changeCanvasContent('body', _path + '1/'+_this.body+'.png');
		changeCanvasContent('emotion', "asset/" + this.gender + "/emotion/1/"+_this.emotion+'.png');
		
        _bodySelector.show();
    }, 
    initSkinTone : function(){
        var _this = this;
        var _selector = this.container.find(".skinToneSelector"); 
        var components = Zeepl.Avatar[this.gender]["skinTone"];
        var _path = "asset/" + this.gender + "/skinTone/" + this.body + "/";
        
        if(!this.skinToneInit){
            this.skinToneInit = true;
            this.destroySelector(_selector);
            var _ul = $("<ul/>");
            $.each(components,function(index,component){
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "desc":component,
                        "class":index+1==_this.skinTone?"selected":"",
                        "index":index+1,
                        "rel":_path + (index+1) + ".png" 
                    }).append(
                        $("<img/>",{
                            "src":"asset/skin/" + (index+1) + "-icon.png"
                        })
                    )
                ).appendTo(_ul);
            });
            _ul.appendTo(_selector);
            this.initSelector(_selector);
        }

        _selector.show();
    },
 
    initHairSelector : function(){
        var _this = this;
        var _selector = this.container.find(".hairSelector");
        var components = Zeepl.Avatar[this.gender]["hair"][this.body-1];
        var _path = "asset/" + this.gender + "/hair/" + this.body + "/";

        if(!this.hairInit){
            this.hairInit = true;
            this.destroySelector(_selector);
            var _ul = $("<ul/>");
            for(var index=0;index<components;index++){
                
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "index":index + 1,
                        "class":index+1==_this.hair?"selected":"",
                        "rel":_path + (index+1) + ".png"
                    }).append(
                        $("<img/>",{
                            "src":_path + (index+1) + ".png"
                        })
                    )
                ).appendTo(_ul);
            }
            _ul.appendTo(_selector);
            this.initSelector(_selector);
        }
        _selector.show();
    },
                                
    initEmotionSelector : function(){
		var _this = this;
        var _selector = this.container.find(".emotionSelector");
        var components = Zeepl.Avatar[this.gender]["emotion"];
        var _path = "asset/" + this.gender + "/emotion/" + this.body + "/";		

        if(!this.emotionInit){
            this.emotionInit=true;
            this.destroySelector(_selector);
            var _ul = $("<ul/>");
            $.each(components,function(index,component){
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "desc":component,
                        "index":index+1,
                        "class":index+1==_this.emotion?"selected":"",
                        "rel":_path + (index+1) + ".png"
                    }).append(
                        $("<img/>",{
                            "src":_path + (index+1) + ".png"
                        })
                    )
                ).appendTo(_ul);
            });
            _ul.appendTo(_selector);
            this.initSelector(_selector);
        }
		
        _selector.show();
    },
 
    initClothes : function(){
        var _this = this;
        var _selector = this.container.find(".clothesSelector");
        var components = Zeepl.Avatar[this.gender]["clothes"][this.body-1];
        var _path = "asset/" + this.gender + "/clothes/" + this.body + "/";

         if(!this.clothesInit){
             this.clothesInit = true;
            this.destroySelector(_selector);
            var _ul = $("<ul/>");
            for(var index=1;index<=components;index++){ 
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "index":index,
                        "class":index==_this.clothes?"selected":"",
                        "rel":_path + index + ".png"
                    }).append(
                        $("<img/>",{
                            "src":_path + index + ".png"
                        })
                    )
                ).appendTo(_ul);
            }
            _ul.appendTo(_selector);
            this.initSelector(_selector);
        }
        _selector.show();
    },
 
    initAccessory : function(){
        var _this = this;
        var _selector = this.container.find(".accessorySelector");
        var components = Zeepl.Avatar[this.gender]["accessories"];
        var _path = "asset/" + this.gender + "/accessories/";
 

        if(!this.accessoriesInit){
           this.accessoriesInit = true; 
           this.destroySelector(_selector);

            var _ul = $("<ul/>");
            
            for(var i=1;i<=components["ears"][this.body-1];i++){ 
                var name = i + ".png";
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "class":"earsLink",
                        "type":"ears",
                        "index":i,
                        "rel":_path + "ears/" + _this.body + "/" + name
                    }).append(
                        $("<img/>",{
                            "src":_path + "ears/" + _this.body + "/" + name
                        }),
                        $("<span/>",{
                            "class":"remove"
                        })
                    )
                ).appendTo(_ul);
            }
            
            for(var i=1;i<=components["eyes"][this.body-1];i++){ 
                var name = i + ".png";
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "class":"eyesLink",
                        "type":"eyes",
                        "index":i,
                        "rel":_path + "eyes/" + _this.body + "/" + name
                    }).append(
                        $("<img/>",{
                            "src":_path + "eyes/" + _this.body + "/" + name
                        }),
                        $("<span/>",{
                            "class":"remove"
                        })
                    )
                ).appendTo(_ul);
            }

            for(var i=1;i<=components["face"][this.body-1];i++){
                var name = i + ".png";
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "class":"faceLink",
                        "type":"face",
                        "index":i,
                        "rel":_path + "face/" + _this.body + "/" + name
                    }).append(
                        $("<img/>",{
                            "src":_path + "face/" + _this.body + "/" + name
                        }),
                        $("<span/>",{
                            "class":"remove"
                        })
                    )
                ).appendTo(_ul);
            }

            for(var i=1;i<=components["head"][this.body-1];i++){
                var name = i + ".png";
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "class":"headLink",
                        "type":"head",
                        "index":i,
                        "rel":_path + "head/" + _this.body + "/" + name
                    }).append(
                        $("<img/>",{
                            "src":_path + "head/" + _this.body + "/" + name
                        }),
                        $("<span/>",{
                            "class":"remove"
                        })
                    )
                ).appendTo(_ul);
            }

            for(var i=1;i<=components["mouth"][this.body-1];i++){
                var name = i + ".png";
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "class":"mouthLink",
                        "type":"mouth",
                        "index":i,
                        "rel":_path + "mouth/" + _this.body + "/" + name
                    }).append(
                        $("<img/>",{
                            "src":_path + "mouth/" + _this.body + "/" + name
                        }),
                        $("<span/>",{
                            "class":"remove"
                        })
                    )
                ).appendTo(_ul);
            }

            for(var i=1;i<=components["neck"][this.body-1];i++){
                var name = i + ".png";
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "class":"neckLink",
                        "type":"neck",
                        "index":i,
                        "rel":_path + "neck/" + _this.body + "/" + name
                    }).append(
                        $("<img/>",{
                            "src":_path + "neck/" + _this.body + "/" + name
                        }),
                        $("<span/>",{
                            "class":"remove"
                        })
                    )
                ).appendTo(_ul);
            }

            for(var i=1;i<=components["nose"][this.body-1];i++){ 
                var name = i + ".png";
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "type":"nose",
                        "class":"noseLink",
                        "index":i,
                        "rel":_path + "nose/" + _this.body + "/" + name
                    }).append(
                        $("<img/>",{
                            "src":_path + "nose/" + _this.body + "/" + name
                        }),
                        $("<span/>",{
                            "class":"remove"
                        })
                    )
                ).appendTo(_ul);
            }

            for(var i=1;i<=components["front"];i++){
                var name = i + ".png";
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "type":"assorted_front",
                        "class":"assorted_frontLink", 
                        "index":i,
                        "rel": "asset/accessories/front/"  + name
                    }).append(
                        $("<img/>",{
                            "src":"asset/accessories/front/"  + name
                        }),
                        $("<span/>",{
                            "class":"remove"
                        })
                    )
                ).appendTo(_ul);
            }
            for(var i=1;i<=components["back"];i++){
                var name = i + ".png";
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "type":"assorted_back",
                        "class":"assorted_backLink", 
                        "index":i,
                        "rel": "asset/accessories/back/"  + name
                    }).append(
                        $("<img/>",{
                            "src":"asset/accessories/back/"  + name
                        }),
                        $("<span/>",{
                            "class":"remove"
                        })
                    )
                ).appendTo(_ul);
            }
			
			
            _ul.appendTo(_selector);
            this.initSelector(_selector);
        }
        _selector.show();
    },
 
    initBg : function(){
        var _this = this;
        var _selector = this.container.find(".backgroundSelector");
        var components = Zeepl.Avatar[this.gender]["background"];
        var _path = "asset/bg/";

        if(_selector.find("ul").length==0){

            var _ul = $("<ul/>");
            for(var i=1;i<=components;i++){
                var name = i + ".png";
                $("<li/>").append(
                    $("<a/>",{
                        "href":"javascript:;",
                        "index":i,
                        "rel":_path + name
                    }).append(
                        $("<img/>",{
                            "src":_path + name
                        })
                    )
                ).appendTo(_ul);
            }
            _ul.appendTo(_selector);
            this.initSelector(_selector);
        }
        _selector.show();
    },
    
    clean : function(){
        this.skinToneInit=false;
        this.hair = 0;
        this.hairInit= false;
        this.emotion = 2;
        this.emotionInit=false;
        this.clothes = 0;
        this.clothesInit=false;
        this.accessories = {
            "ears":0,
            "eyes":0,
            "face":0,
            "head":0,
            "mouth":0,
            "neck":0,
            "nose":0,
            "assorted_front":0, 
			"assorted_back":0
        };
        this.accessoriesInit = false; 
        
        this.canvas.find("img").attr("src",this.pixel);
        if(this.skinTone){
            this.canvas.find(".body").attr("src","asset/" + this.gender + "/skinTone/" + this.body + "/" + this.skinTone + ".png");
        }else{
            this.canvas.find(".body").attr("src","asset/" + this.gender + "/skinTone/" + this.body + "/" + Zeepl.Avatar[this.gender]["body"][this.body-1] + ".png");       
        }
        
        this.canvas.find(".emotion").attr("src","asset/" + this.gender + "/emotion/" + this.body + "/" + this.emotion + ".png");
        if(this.background){
            this.canvas.find(".bg").attr("src","asset/bg/" + this.background + ".png"); 
        }

    },
    
    cleanAll : function(){
        this.gender = "boy";
        this.body = 1; 
        this.skinTone = 0;
        this.skinToneInit=false;
        this.hair = 0;
        this.hairInit= false;
        this.emotion = 2;
        this.emotionInit=false;
        this.clothes = 0;
        this.clothesInit=false;
        this.background = 0;
        this.accessories = {
            "ears":0,
            "eyes":0,
            "face":0,
            "head":0,
            "mouth":0,
            "neck":0,
            "nose":0,
            "assorted_front":0, 
			"assorted_back":0
        };
        this.canvas.find("img").attr("src",this.pixel);
        this.canvas.find(".body").attr("src","asset/" + this.gender + "/skinTone/" + this.body + "/" + Zeepl.Avatar[this.gender]["body"][this.body-1] + ".png");
        this.canvas.find(".emotion").attr("src","asset/" + this.gender + "/emotion/" + this.body + "/" + this.emotion + ".png");
    
    },
    
    startOver : function(){
        this.container.find(".gender").show();
        this.container.find(".features").hide();
        this.container.find(".secondBg").removeClass("featureBg");
        $(".zeeplCreate .features .top .tabs a").removeClass("active");
        $(".zeeplCreate .features .top .tabs a.body").addClass("active");
        this.cleanAll();
    },

    random : function(){
        
        var bg = Math.floor((Math.random() * Zeepl.Avatar[this.gender]["background"]));
        if(bg>0){
            this.canvas.find(".bg").attr("src","asset/bg/" + bg + ".png");
            this.background = bg;
        }
        
        var skinTone = Math.floor((Math.random() * Zeepl.Avatar[this.gender]["skinTone"].length));
        if(skinTone>0){
            this.canvas.find(".body").attr("src","asset/" + this.gender + "/skinTone/" +  this.body + "/" + skinTone + ".png");
            this.skinTone = skinTone;
        }

        var emotion = Math.floor((Math.random() * Zeepl.Avatar[this.gender]["emotion"].length));
        if(emotion>0){
            this.canvas.find(".emotion").attr("src","asset/" + this.gender + "/emotion/" +  this.body + "/" + emotion + ".png");
            this.emotion = emotion;
        }
        
        var hair = Math.floor((Math.random() * Zeepl.Avatar[this.gender]["hair"][this.body-1]));
        if(hair>0){
            this.canvas.find(".hair").attr("src","asset/" + this.gender + "/hair/" +  this.body + "/" + hair + ".png");
            this.hair = hair;
        }
        
        var clothes = Math.floor((Math.random() * Zeepl.Avatar[this.gender]["clothes"][this.body-1]));
        if(clothes>0){
            this.canvas.find(".clothes").attr("src","asset/" + this.gender + "/clothes/" +  this.body + "/" + clothes + ".png");
            this.clothes = clothes;
        }

        
    }

    
})




function getURLParam(strParamName){
      var strReturn = "";
      var strHref = window.location.href;
      var bFound=false;

      var cmpstring = strParamName + "=";
      var cmplen = cmpstring.length;

      if ( strHref.indexOf("?") > -1 ){
        var strQueryString = strHref.substr(strHref.indexOf("?")+1);
        var aQueryString = strQueryString.split("&");
        for ( var iParam = 0; iParam < aQueryString.length; iParam++ ){
          if (aQueryString[iParam].substr(0,cmplen)==cmpstring){
            var aParam = aQueryString[iParam].split("=");
            strReturn = aParam[1];
            bFound=true;
            break;
          }

        }
      }
      if (bFound==false) return null;
      return strReturn;
    }


$(document).ready(function(){
    
    if($(".zeeplCreate").length>0){
		
		var zeepl = new Zeepl($(".zeeplCreate"));
        if(getURLParam("tab") == "body"){
			$(".zeeplCreate .gender a:eq(0)").trigger("click");        
        }
        $(".zeeplCreate a.startover").click(function(){
            zeepl.startOver();
            return false;
        })
        $(".zeeplCreate a.random").click(function(){
            zeepl.random();
            return false;
        })
    }

    if($.fn.bxSlider){
        $("#content .zeeplWorld .carousel ul").bxSlider({
            auto: true,
            pause:10000,
            controls:false,
            pager: true
        });

    }

    if($.fn.jScrollPane){
        $(".zeeplList.scrollIt .scrollMask").each(function(){
            $(this).find(".list").css("width",(198 * $(this).find("li").length) - 35 + "px");
        })
        $('.zeeplList.scrollIt .scrollMask').jScrollPane({showArrows: false}); 
    }

    $("#header a.loginLink").click(function(){
        $(this).toggleClass("expand");
        if($(this).hasClass("expand")){
            $("#header .loginBox").slideDown();
        }else{
            $("#header .loginBox").slideUp();    
        }
        return false;
    })
    $("#header .loginBox a.greenBtn3").click(function(){
        var name = $("#header .loginBox input[type='text']");
        var password = $("#header .loginBox input[type='password']");
         $("#header .loginBox .error").remove();
        var valid = true;
        if(name.val()==""){
            name.parent().find("label").before($("<p/>",{
                "class":"error",
                "text" :"Username can not be empty."
            }))
            valid = false;
        }else if(name.val() == "invalid"){
            name.parent().find("label").before($("<p/>",{
                "class":"error",
                "text" :"Username is invalid."
            }))
            valid = false; 
        }
        if(password.val()==""){
            name.parent().find("label").before($("<p/>",{
                "class":"error",
                "text" :"Password can not be empty."
            }))
            valid = false;
        } else if(password.val() == "invalid"){
            name.parent().find("label").before($("<p/>",{
                "class":"error",
                "text" :"Password is invalid."
            }))
            valid = false;
        }
        
        if(valid){
            $("#header .loginBox").hide();
            $("#header .loginMask .welcome").show();
            $("#header .loginMask .login").hide();   
        }
        return false;
    })
    $("#header .loginBox a.blueBtn").click(function(){
        $("#header .loginBox input").val("");
        $("#header .loginBox #remmberMe").attr("checked",false);
        $("#header .loginBox .error").remove();
        return false;
    })

    $("#content .zeeplList.scrollIt .list li a").hover(function(){
        $(this).parent().addClass("hover");    
    },function(){
        $(this).parent().removeClass("hover");   
    })
    $("#content .zeeplList.gallery .list li .zeeplBox").hover(function(){
        $(this).addClass("hover");
    },function(){
        $(this).removeClass("hover");
    })
    $("#content .zeeplList.gallery .list li .zeeplBox").click(function(){
        $(this).parents("ul.list").find("li").removeClass("selected");
        $(this).parent().addClass("selected");
        $("#content .zeeplList .actions a.disabled").removeClass("disabled");
    })


    if($(".zeeplDetail .comments ul").length>0){ 
        var commentsSlider = $(".zeeplDetail .comments ul").bxSlider({
            mode: "vertical",
            infiniteLoop:false,
            displaySlideQty:3,
            moveSlideQty:3,
            controls:false,
            pagerSelector:"#pagers",
            pager: true
        });

        $(".zeeplDetail .comments .topLine a").click(function(){
             $(".zeeplDetail .comments .submitLine,.zeeplDetail .comments .bx-pager").show();
            return false;
        })
        
        $(".zeeplDetail .comments .submitLine a.blueBtn").click(function(){
            var dd = $(this).parents(".submitLine");
            if(dd.find("textarea").val() == ""){
                dd.find(".content p").addClass("error");
                return false;
            }
            commentsSlider.destroyShow();
            $("#pagers a").remove();
            var clone = $(".zeeplDetail .comments li").last();
            clone.before(clone.clone());
            commentsSlider = $(".zeeplDetail .comments ul").bxSlider({
                mode: "vertical",
                infiniteLoop:false,
                displaySlideQty:3,
                moveSlideQty:3,
                controls:false,
                pagerSelector:"#pagers",
                pager: true
            });
            $(".zeeplDetail .comments .submitLine").hide();
        })

        $(".zeeplDetail .comments .submitLine textarea").focus(function(){
             var dd = $(this).parents(".submitLine");
              dd.find(".content p").removeClass("error");
        })
        $(".zeeplDetail .comments .submitLine a.close").click(function(){
             $(this).parents(".submitLine").hide(); 
            return false;
        })  
    }
 

 
      /* Modal function */
    var modalTrigger;
    loadModal = function(trigger,fixed){
        modalTrigger = trigger;
        var iWidth = $(document).width();
		var iHeight = $(document).height();
        var iHeight1 = $(window).height();
        var dialog = $(trigger.attr("rel"));
        $('#modalBg').css({
            'height':iHeight + "px",
            'opacity':'0.6'
         }).show();
        dialog.show(); 
        if(fixed){
             $("#modalContent").css({
                "position":"fixed",
                 "top": (iHeight1 - dialog.height())/2 + "px"
             });
        }else{
            $("#modalContent").css({
                "position":"absolute",
                 "top": "60px"
            });
            $(document).scrollTop(0);
        }
    }
    closeModal = function(trigger){
         trigger.parents(".modalBox").hide();
         $('#modalBg').hide(); 
    }
     $(".modalBox .closeModal").on("click",function(){
         closeModal($(this));
         return false;
     })

     $(".modalTrigger").on("click",function(){
         loadModal($(this));
         return false;
     })

     $(".modalFixedTrigger").on("click",function(){		
         loadModal($(this),true); 
         return false;
     })

     $(".modalBtn").on("click",function(){
         closeModal($(this));
         loadModal($(this));
         return false;
     })

     $(".modalFixedBtn").on("click",function(){
         closeModal($(this));
         loadModal($(this),true);
         return false;
     });  
	 
	 $("#btnSaveAvatar").live('click', function(){
		 
			// create the avatar in 1 canvas
			var canvas		= $("#canvas");
			var context		= canvas.get(0).getContext("2d");
			context.clearRect(0,0,cnv_w,cnv_h);
			
				// background
				var cnv_bg = $("#cnv_bg");
				context.drawImage(cnv_bg.get(0), 0, 0);
				
				// accessories back of body
				var cnv_assorted_back = $("#cnv_assorted_back");
				context.drawImage(cnv_assorted_back.get(0), 0, 0);
				
				// body
				var cnv_body = $("#cnv_body");
				context.drawImage(cnv_body.get(0), 0, 0);

				// emotion
				var cnv_emotion = $("#cnv_emotion");
				context.drawImage(cnv_emotion.get(0), 0, 0);

				// hair
				var cnv_hair = $("#cnv_hair");
				context.drawImage(cnv_hair.get(0), 0, 0);

				// clothes
				var cnv_clothes = $("#cnv_clothes");
				context.drawImage(cnv_clothes.get(0), 0, 0);

				// accessories - ears
				var cnv_ears = $("#cnv_ears");
				context.drawImage(cnv_ears.get(0), 0, 0);

				// accessories - eyes
				var cnv_eyes = $("#cnv_eyes");
				context.drawImage(cnv_eyes.get(0), 0, 0);

				// accessories - face
				var cnv_face = $("#cnv_face");
				context.drawImage(cnv_face.get(0), 0, 0);

				// accessories - head
				var cnv_head = $("#cnv_head");
				context.drawImage(cnv_head.get(0), 0, 0);

				// accessories - mouth
				var cnv_mouth = $("#cnv_mouth");
				context.drawImage(cnv_mouth.get(0), 0, 0);

				// accessories - neck
				var cnv_neck = $("#cnv_neck");
				context.drawImage(cnv_neck.get(0), 0, 0);

				// accessories - nose
				var cnv_nose = $("#cnv_nose");
				context.drawImage(cnv_nose.get(0), 0, 0);

				// accessories - front
				var cnv_assorted_front = $("#cnv_assorted_front");
				context.drawImage(cnv_assorted_front.get(0), 0, 0);
							
			// get the canvas base64 data
			var imgData = canvas.get(0).toDataURL();
			
			// do server post here
			
			// close modal
			closeModal($(this));
			
			return false;
	 });
    
});
 










