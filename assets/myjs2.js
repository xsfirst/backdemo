$(document).ready(function(){
    tcsGame.init();
});

var tcsGame ={
    wid:$(window).width(),
    hei:$(window).height(),
    canvas:null,
    size:0,//移动距离
    widmax:10,//横向格数
    heimax:0,
    snake:{"snakePoint":[],"frog":null,"minus":null,"rotnum":0},//当前蛇数组
    score:{"hz":0,"sp":0,"bx":0,"zz":0,"yp":0},
    direct:2,//方向
    stage:null,
    x:0,//当前坐标
    y:0,
    slength:1,//当前长度
    touchFlag:0,
    cavwid:0,
    cavhei:0,
    randx:0,//食物位置
    randy:0,
    randPosition:{},
    randdot:{},
    minusflag:false,
    ischangeflag:true,
    nowtype:0,
    nowrot:0,
    crazytime:0,
    addcount:0,//crazy添加次数
    dangerhint:true,
    life:3,//剩余生命
    nowdirect:2,
    init:function(){
        var self = this;
        this.pageClick();
        this.pageAni();
        this.myPress();
        self.myCanvas();
    },
    pageClick:function(){
        var self = this;
        $('.start').click(function(){
            $('.idpage').hide();
            $('.intro').show();
        });
        $('.intro-btn').click(function(){
            $('.intro').hide();
            $('.game').show();
            self.myCanvas();
        });
        $('.close').click(function(){
            $('.intro').hide();
            $('.idpage').show();
        });
        $('.die-again').click(function(){
            self.life--;
            $('.game .bar span').html(self.life);
            $('.die-havelife').hide();
            $('.touchpart').show();
            self.cavReset();
        });
        $('.gg').click(function(){
            $('.game').hide();
            $('.gg').hide();
            self.scorePage();
            $('.score').show();
        });
        $('.die-next').click(function(){
            $('.game').hide();
            $('.die-havelife').hide();
            self.scorePage();
            $('.score').show();
        });
        $('.sc-next').click(function(){
            $('.score').hide();
            $('.info').show();
        })
    },
    scorePage:function(){
        var self = this;
        $('.score td .hz').html(self.score.hz);
        $('.score td .sp').html(self.score.sp);
        $('.score td .bx').html(self.score.bx);
        $('.score td .zz').html(self.score.zz);
        $('.score td .yp').html(self.score.yp);
        $('.sc-btn').click(function(){
            var plus = $(this).attr("data-score");
            var num = parseInt($(this).parent().siblings().find('span').html());
            var now = parseInt($('.total span').html());
            if(!($(this).hasClass('gray'))){
                $(this).addClass('gray');
                $(this).attr("src","images/res-btngray.png");
                now = now+(num*plus);
                $('.total span').html(now);
            }
        })
    },
    cavReset:function(){
        var self = this;
        self.touchFlag = 0;
        self.snake={"snakePoint":[],"frog":null,"minus":null,"rotnum":0};
        self.direct = 2;//方向
        self.x = 0;//当前坐标
        self.y = 0;
        self.slength = 1;//当前长度
        self.randx = 0;//食物位置
        self.randy = 0;
        self.randPosition = {};
        self.randdot = {};
        self.minusflag = false;
        self.ischangeflag = true;
        self.nowtype = 0;
        self.nowrot = 0;
        self.crazytime = 0;
        self.addcount = 0;//crazy添加次数
        self.dangerhint = true;
        self.nowdirect = 2;
        self.myCanvas();
    },
    pageAni:function(){
        var self = this;
        startani();
        function startani(){
            $('.start').transition({bottom:"45px"},1000,function(){
                $('.start').transition({bottom:"55px"},1000);
                startani();
            })
        }
    },
    myPress:function(){
        var self = this;
        var nowdirect = 2;
        touch.on('#touchpart', 'touchstart', function(ev){
            ev.preventDefault();
        });
        var target = document.getElementById("touchpart");
        touch.on(target, 'swipeup', function(ev){
            if(self.ischangeflag){
                self.ischangeflag = false;
                nowdirect = self.direct;
                if(nowdirect == 3){
                    self.direct = 3;
                }
                else{
                    self.direct = 1;
                    if(nowdirect == 0){
                        self.nowrot = 90
                    }
                    else if(nowdirect == 2){
                        self.nowrot = -90;
                    }
                    self.snake.rotnum = 0;
                }
            }

        });
        touch.on(target, 'swiperight', function(ev){
            if(self.ischangeflag){
                self.ischangeflag = false;
                nowdirect = self.direct;
                if(nowdirect == 0){
                    self.direct = 0;
                }
                else{
                    self.direct = 2;
                    if(nowdirect == 1){
                        self.nowrot = 90
                    }
                    else if(nowdirect == 3){
                        self.nowrot = -90;
                    }
                    self.snake.rotnum = 0;
                }
            }

        });
        touch.on(target, 'swipedown', function(ev){
            if(self.ischangeflag){
                self.ischangeflag = false;
                nowdirect = self.direct;
                if(nowdirect == 1){
                    self.direct = 1;
                }
                else{
                    self.direct = 3;
                    if(nowdirect == 2){
                        self.nowrot = 90
                    }
                    else if(nowdirect == 0){
                        self.nowrot = -90;
                    }
                    self.snake.rotnum = 0;
                }
            }

        });
        touch.on(target, 'swipeleft', function(ev){
            if(self.ischangeflag){
                self.ischangeflag = false;
                nowdirect = self.direct;
                if(nowdirect == 2){
                    self.direct = 2;
                }
                else{
                    self.direct = 0;
                    if(nowdirect == 3){
                        self.nowrot = 90
                    }
                    else if(nowdirect == 1){
                        self.nowrot = -90;
                    }
                    self.snake.rotnum = 0;
                }
            }

        });
    },
    myCanvas:function(){
        var self = this;

        $('.touchpart').show();
        self.canvas = document.getElementById('tcs');
        self.stage = new createjs.Stage(self.canvas);
        self.size = Math.floor(self.wid*0.86/self.widmax);
        self.x = self.y = Math.floor(self.size/2);
        self.canvas.width = self.size*self.widmax-1;
        self.canvas.height = (Math.floor((self.hei-105)/self.size))*self.size-1;

        self.cavwid = self.canvas.width;
        self.cavhei = self.canvas.height;

        self.heimax = Math.floor((self.hei-105)/self.size);
        createjs.Touch.enable(self.stage);
        self.handleImageLoad();
    },
    handleImageLoad:function(){
        var self = this;
        var bg = new createjs.Shape();
        var bgctx = bg.graphics;
        for(var i=1;i<=self.widmax;i++){
            bgctx.setStrokeStyle(1);
            bgctx.beginStroke("#fddbca");
            bgctx.moveTo(i*self.size,0);
            bgctx.lineTo(i*self.size,self.heimax*self.size);
        }
        for(var j=1;j<=self.heimax;j++){
            bgctx.setStrokeStyle(1);
            bgctx.beginStroke("#fddbca");
            bgctx.moveTo(0,j*self.size);
            bgctx.lineTo(self.size*10+1,j*self.size);
        }
        self.stage.addChild(bg);

        var container = new createjs.Container();
        self.stage.addChild(container);

        var dot = new createjs.Bitmap("images/head.png");
        dot.x = Math.floor(self.size/2);
        dot.y = Math.floor(self.size/2);
        dot.regX = 43;
        dot.regY = 43;
        dot.scaleX = self.size/70;
        dot.scaleY = self.size/70;
        container.addChild(dot);
        self.snake.snakePoint.push({'x':Math.floor(self.size/2),'y':Math.floor(self.size/2),'obj':dot,'rot':0});

        //预置car,dot
        var car1 = new createjs.Bitmap("images/train1.png");
        var car2 = new createjs.Bitmap("images/train2.png");
        var car3 = new createjs.Bitmap("images/train3.png");
        var car4 = new createjs.Bitmap("images/train4.png");
        var car5 = new createjs.Bitmap("images/train5.png");
        var dot1 = new createjs.Bitmap("images/icon1.png");
        var dot2 = new createjs.Bitmap("images/icon2.png");
        var dot3 = new createjs.Bitmap("images/icon3.png");
        var dot4 = new createjs.Bitmap("images/icon4.png");
        var dot5 = new createjs.Bitmap("images/icon5.png");

        createjs.Ticker.addEventListener("tick", tick);
        createjs.Ticker.setFPS(60);
        function tick(event){
            if(self.touchFlag == 0){
                tcsMove();
            }

            self.stage.update(event);
        }

        function tcsMove(){
            console.log(self.size)
            var snakeList = self.snake.snakePoint;
            for(var i=0;i<snakeList.length;i++){
                switch (self.direct){

                }
                snakeList[i].obj.x++;
            }
        }

    }

};