$(function(){
    $('.ui-page-footer-fixed').css("padding-bottom","0");
});
$('.mediaPlayerPage').live('pageinit', function(event){
    var calcTime = function(value) {
        value = parseInt(value);
        var mins = Math.floor(value/60);
        var secs = value - 60*mins;
        return mins + ":" + secs;
    };
    $('audio').bind('timeupdate', function() {
        var audio = $(this).get(0);
        var seekBar = $(this).closest('.audioContainer').find('.seekBar');
        var pos = (audio.currentTime / audio.duration) * (seekBar[0].max);
        seekBar.val(pos);
        seekBar.slider('refresh');
        var timeDisplay = calcTime(audio.currentTime) + "/" + calcTime(audio.duration);
        $(this).closest('.audioContainer').find('.timeDisplay').text(timeDisplay);
    });
    $('audio').bind('play', function() {
        $(this).closest('.audioContainer').find('.playBtn').addClass("pauseBtn");
    });
    $('audio').bind('pause ended', function() {
        $(this).closest('.audioContainer').find('.playBtn').removeClass("pauseBtn");
    });
    $('.audioVolume').bind("change", function(event, ui) {
        var volume = $(this).get(0);
        $(this).closest('.audioContainer').find('audio')[0].volume = volume.value / volume.max;
    });
    $('.playBtn').bind("click", function(event, ui) {
        var audio = $(this).closest('.audioContainer').find('audio')[0];
        if ($(this).hasClass("pauseBtn")) {
            audio.pause();
        } else {
            audio.play();
        }
    });
    $('.prevBtn').bind("click", function(event, ui) {
        $(this).closest('.audioContainer').find('audio').get(0).pause();
    });
    $('.nextBtn').bind("click", function(event, ui) {
        $(this).closest('.audioContainer').find('audio').get(0).pause();
    });
});
