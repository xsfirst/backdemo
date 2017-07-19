$(document).ready(function(){
    tcsGame.init();
});

var tcsGame ={
    wid:$(window).width(),
    hei:$(window).height(),
    init:function(){
        var self = this;
        this.pageClick();
        setTimeout(function(){
            self.myScroll();
            setTimeout(function(){
                $('.rulemask').hide();
            },100)
        },1000)
    },
    pageClick:function(){
        var self = this;

    },
    myScroll:function(){
        var myScroll = new iScroll('wrapper', {
            scrollbarClass: 'myScrollbar',
            fadeScrollbar:false,
            hideScrollbar:false
        });
        function GetWinWidth()
        {
            var width=$(window).width();
            if(width>640){
                var fg=(640-width)/640;
            }else{
                var fg=(640-width)/640;
            }
            return fg;
        }
        var fgg=GetWinWidth();

        $(".myScrollbarV > div").css({"width":(30-30*fgg)+"px","height":(300-300*fgg)+"px"});
    }
};
