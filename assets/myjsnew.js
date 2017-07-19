Array.prototype.remove=function(obj){
    for(var i =0;i <this.length;i++){
        var temp = this[i];
        if(!isNaN(obj)){
            temp=i;
        }
        if(temp == obj){
            for(var j = i;j <this.length;j++){
                this[j]=this[j+1];
            }
            this.length = this.length-1;
        }
    }
}

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
    snake:{"snakePoint":[],"frog":[],"minus":null,"rotnum":0,"temp":[]},//当前蛇数组
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
    fps:50,
    headrot:0,
    fpstime:0,
    percent:0,
    canvasFlag:true,
    addNum:0,
    rotFlag:false,
    olddirect:2,
    eatself:false,
    eatSize:0,
    currentdot:[],
    crazySize:0,
    currentCrazydot:[],
    stopCrazyAdd:false,
    crazylenght:0,
    init:function(){
        var self = this;
        this.pageClick();
        this.pageAni();
        this.myPress();
        $('.bg1').css({marginTop:-self.wid*1334/750/2});
        var per = $('.json').html();
        self.percent = $.parseJSON(per);
    },
    pageClick:function(){
        var self = this;
        $('.start').click(function(){
            $('.idpage').hide();
            $('.intro').show();
            $('.game').show();
            $('.introbg').show()
        });
        $('.intro-btn').click(function(){
            $('.intro').hide();
            $('.game').show();
            $('.introbg').hide();
            if(self.canvasFlag){
                self.canvasFlag = false;
                self.myCanvas();
            }
        });
        $('.close').click(function(){
            $('.intro').hide();
            $('.game').show();
            $('.introbg').hide();
            if(self.canvasFlag){
                self.canvasFlag = false;
                self.myCanvas();
            }
        });
        $('.die-again').click(function(){
            self.life--;

            $('.die-havelife').hide();
            $('.touchpart').show();
            $('.black').hide();
            self.cavReset();
        });
        $('.die-next').click(function(){
            $('.game').hide();
            $('.die-havelife').hide();
            $('.black').hide();
            $('.bank').hide();
            self.scorePage();
            $('.score').show();
        });
        $('.sc-next').click(function(){
            $('.score').hide();
            $('.info').show();
        });
        $('.pop-btn').click(function(){
            $('.pop').hide();
            $('.popbg').hide();
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
                var type = $(this).attr("data-name");
                $('.pop>img').hide();
                $('.'+type).show();
                $('.pop').show();
                $('.popbg').show();
            }

        })
    },
    cavReset:function(){
        var self = this;
        self.touchFlag = 0;
        self.snake={"snakePoint":[],"frog":[],"minus":null,"rotnum":0,"temp":[]};
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
        self.fpstime = 0;
        self.fps = 50;
        self.headrot = 0;
        self.addNum = 0;
        self.rotFlag = false;
        self.olddirect = 2;
        self.eatself = false;
        self.eatSize = 0;
        self.currentdot = [];
        self.crazySize = 0;
        self.currentCrazydot = [];
        self.stopCrazyAdd = false;
        self.crazylenght = 0;
        $('.bank').hide();
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

        idrot();
        crazyrot();
        function idrot(){
            $('.idtit').transition({rotate:"2deg"},50,function(){
                $('.idtit').transition({rotate:"-2deg"},50,function(){
                    $('.idtit').transition({rotate:"2deg"},50,function(){
                        $('.idtit').transition({rotate:"-2deg"},50,function(){
                            $('.idtit').transition({rotate:"0deg"},50);
                            setTimeout(function(){
                                idrot();
                            },1400)
                        })
                    })
                })
            })
        }
        function crazyrot(){
            $('.crazy-tit').transition({rotate:"2deg"},50,function(){
                $('.crazy-tit').transition({rotate:"-2deg"},50,function(){
                    $('.crazy-tit').transition({rotate:"2deg"},50,function(){
                        $('.crazy-tit').transition({rotate:"-2deg"},50,function(){
                            setTimeout(function(){
                                crazyrot();
                            },700)
                        })
                    })
                })
            })
        }



    },
    myPress:function(){
        var self = this;
        touch.on('#touchpart', 'touchstart', function(ev){
            ev.preventDefault();
        });
        var target = document.getElementById("touchpart");
        touch.on(target, 'swipeup', function(ev){
            if(self.ischangeflag){
                self.ischangeflag = false;
                self.olddirect = self.direct;
                if(self.olddirect == 3){
                    self.direct = 3;
                }
                else{
                    self.direct = 1;
                    if(self.olddirect == 0){
                        self.nowrot = 90
                    }
                    else if(self.olddirect == 2){
                        self.nowrot = -90;
                    }
                    self.snake.rotnum = 0;
                }
            }

        });
        touch.on(target, 'swiperight', function(ev){
            if(self.ischangeflag){
                self.ischangeflag = false;
                self.olddirect = self.direct;
                if(self.olddirect == 0){
                    self.direct = 0;
                }
                else{
                    self.direct = 2;
                    if(self.olddirect == 1){
                        self.nowrot = 90
                    }
                    else if(self.olddirect == 3){
                        self.nowrot = -90;
                    }
                    self.snake.rotnum = 0;
                }
            }

        });
        touch.on(target, 'swipedown', function(ev){
            if(self.ischangeflag){
                self.ischangeflag = false;
                self.olddirect = self.direct;
                if(self.olddirect == 1){
                    self.direct = 1;
                }
                else{
                    self.direct = 3;
                    if(self.olddirect == 2){
                        self.nowrot = 90
                    }
                    else if(self.olddirect == 0){
                        self.nowrot = -90;
                    }
                    self.snake.rotnum = 0;
                }
            }

        });
        touch.on(target, 'swipeleft', function(ev){
            if(self.ischangeflag){
                self.ischangeflag = false;
                self.olddirect = self.direct;
                if(self.olddirect == 2){
                    self.direct = 2;
                }
                else{
                    self.direct = 0;
                    if(self.olddirect == 3){
                        self.nowrot = 90
                    }
                    else if(self.olddirect == 1){
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
        countdown();
        function countdown(){
            $('.count-down').show();
            $('.dj3').show();
            setTimeout(function(){
                $('.dj3').hide();
                $('.dj2').show();
            },1000);
            setTimeout(function(){
                $('.dj2').hide();
                $('.dj1').show();
            },2000);
            setTimeout(function(){
                $('.dj1').hide();
                $('.count-down').hide();
                $('.game .bar ul li').eq(self.life-1).remove();
                dot.x = Math.floor(self.size/2);
                dot.y = Math.floor(self.size/2);
                dot.regX = 43;
                dot.regY = 43;
                dot.scaleX = self.size/70;
                dot.scaleY = self.size/70;
                container.addChild(dot);
                self.snake.snakePoint.push({'obj':dot,'rot':0,'dire':2});
                self.addNum =Math.ceil(Math.random()*4)+2;
                for(var i=0;i<self.addNum;i++){
                    addFrog();
                }
                createjs.Ticker.addEventListener("tick", tick);
                createjs.Ticker.setFPS(self.fps);

            },3000)
        }

        function crazyCountdown(){
            self.snake.temp = self.snake.frog;
            $('.crazy').show();
            $('.cjdj3').show();
            setTimeout(function(){
                $('.cjdj3').hide();
                $('.cjdj2').show();
            },1000);
            setTimeout(function(){
                $('.cjdj2').hide();
                $('.cjdj1').show();
            },2000);
            setTimeout(function(){
                $('.cjdj1').hide();
                $('.crazy').hide();
                self.addcount = self.snake.frog.length;
                self.crazylenght = self.snake.frog.length;
                createjs.Ticker.addEventListener("tick", tick);
                for(var i=0;i<self.snake.frog.length;i++){
                    container.removeChild(self.snake.frog[i].obj);
                }
                self.snake.frog = [];
                if(self.snake.frog.length == 0){
                    var randnum = Math.ceil(Math.random()*4)+2;
                    for(var j=0;j<randnum;j++){
                        addFrog();
                    }
                }
            },3000)
        }

        function dd(){
            dot.rotation+=7;
            self.stage.update(event);
            setTimeout(function(){
                dot.rotation-=7;
                self.stage.update(event);
            },50);
            setTimeout(function(){
                dot.rotation+=7;
                self.stage.update(event);
            },100);
            setTimeout(function(){
                dot.rotation-=7;
                self.stage.update(event);
            },150);
        }

        self.stage.update(event);

        function tick(event){
            if(self.touchFlag == 0){
                tcsMove();
//                crazyMode();
            }


            self.fpstime++;
            if(self.fpstime>50*30 && self.fps==50){
                self.fps = 70;
                createjs.Ticker.setFPS(self.fps);
            }
            else if(self.fpstime>70*30 && self.fps==70){
                self.fps = 90;
                createjs.Ticker.setFPS(self.fps);
            }
            else if(self.fpstime>90*30 && self.fps==90){
                self.fps = 110;
                createjs.Ticker.setFPS(self.fps);
            }
            else if(self.fpstime>110*30 && self.fps==110){
                self.fps = 150;
                createjs.Ticker.setFPS(self.fps);
            }

            self.stage.update(event);
        }

        //疯狂模式
        function crazyMode(){
            var snakeList = self.snake.snakePoint;
            //100步crazymode
            if(self.crazytime>100 && snakeList.length<=15 && snakeList.length>1){
                self.crazytime = 0;
                createjs.Ticker.removeEventListener("tick", tick);
                crazyCountdown();
            }
            else{
                self.crazytime++;
            }
        }

        function tcsMove(){
            var snakeList = self.snake.snakePoint;

            //碰到墙壁死掉了
            if(snakeList[0].obj.x>self.cavwid+1-Math.floor(self.size/2) || snakeList[0].obj.y>self.cavhei+1-Math.floor(self.size/2) || snakeList[0].obj.x<Math.floor(self.size/2) || snakeList[0].obj.y<Math.floor(self.size/2)){
                self.touchFlag = 1;
                $('.touchpart').hide();
                if(self.life>1){
                    $('.die-havelife').show();
                    $('.black').show();
                    createjs.Ticker.removeEventListener("tick", tick);
                }
                else{
                    $('.gg').show();
                    $('.black').show();
                    setTimeout(function(){
                        $('.game').hide();
                        $('.bank').hide();
                        $('.black').hide();
                        $('.gg').hide();
                        self.scorePage();
                        $('.score').show();
                    },2000)
                }
            }
            //碰到自己死掉了
            if(snakeList.length>=4){
                for(var i=3;i<snakeList.length;i++){
                    switch (self.direct){
                        case 3:
                            if(snakeList[0].obj.y+self.size == snakeList[i].obj.y && Math.abs(snakeList[i].obj.x-snakeList[0].obj.x)<self.size){
                                self.eatself = true;
                            }
                            break;
                        case 1:
                            if(snakeList[0].obj.y-self.size == snakeList[i].obj.y && Math.abs(snakeList[i].obj.x-snakeList[0].obj.x)<self.size){
                                self.eatself = true;
                            }
                            break;
                        case 2:
                            if(snakeList[0].obj.x+self.size == snakeList[i].obj.x && Math.abs(snakeList[i].obj.y-snakeList[0].obj.y)<self.size){
                                self.eatself = true;
                            }
                            break;
                        case 0:
                            if(snakeList[0].obj.x-self.size == snakeList[i].obj.x && Math.abs(snakeList[i].obj.y-snakeList[0].obj.y)<self.size){
                                self.eatself = true;
                            }
                            break;
                    }
                }
                if(self.eatself){
                    self.touchFlag = 2;
                    $('.touchpart').hide();
                    if(self.life>1){
                        $('.die-havelife').show();
                        $('.black').show();
                        createjs.Ticker.removeEventListener("tick", tick);
                    }
                    else{
                        $('.gg').show();
                        $('.black').show();
                        setTimeout(function(){
                            $('.game').hide();
                            $('.bank').hide();
                            $('.black').hide();
                            $('.gg').hide();
                            self.scorePage();
                            $('.score').show();
                        },2000)
                    }
                }
            }


            function crazyAdd(k){
                switch (self.snake.temp[k].type){
                    case 1:
                        self.score.bx++;
                        break;
                    case 2:
                        self.score.yp++;
                        break;
                    case 3:
                        self.score.zz++;
                        break;
                    case 4:
                        self.score.sp++;
                        break;
                    case 5:
                        self.score.hz++;
                        break;
                }

                var adddot = new createjs.Bitmap("images/train" + self.snake.temp[k].type + ".png");
                adddot.x = snakeList[snakeList.length-1].obj.x;
                adddot.y = snakeList[snakeList.length-1].obj.y;
                adddot.regX = 31;
                adddot.regY = 31;
                adddot.scaleX = self.size/62;
                adddot.scaleY = self.size/62;
                adddot.alpha = 1;
                adddot.rotation = snakeList[snakeList.length-1].obj.rotation;
                var lastrot = snakeList[snakeList.length-1].obj.rotation;
                var lastdire = snakeList[snakeList.length-1].dire;
                self.crazySize = self.size;
                self.currentCrazydot.push({'obj':adddot,'rot':lastrot,'dire':lastdire});
                dd();
            }

            addList();
            //正着来
            if(self.touchFlag == 0){
                if((snakeList[0].obj.x+Math.floor(self.size/2))%self.size == 0 && (snakeList[0].obj.y+Math.floor(self.size/2))%self.size == 0){
                    crazyMode();
//                    if(self.addcount>0){
//                        self.addcount--;
//                        crazyAdd(self.addcount);
//                    }
                    for(self.addcount;self.addcount>0;self.addcount--){
                        crazyAdd(self.addcount-1);
                    }
                }
                if(self.direct == 2 || self.direct == 0){
                    if((snakeList[0].obj.y+Math.floor(self.size/2))%self.size == 0){
                        snakeList[0].obj.rotation += self.nowrot;
                        self.nowrot = 0;
                        moveCase(0,self.direct);
                        snakeList[0].dire = self.direct;
                        self.ischangeflag = true;
                    }
                    else{
                        moveCase(0,self.olddirect)
                    }
                }
                else if(self.direct == 1 || self.direct == 3){
                    if((snakeList[0].obj.x+Math.floor(self.size/2))%self.size == 0){
                        snakeList[0].obj.rotation += self.nowrot;
                        self.nowrot = 0;
                        moveCase(0,self.direct);
                        snakeList[0].dire = self.direct;
                        self.ischangeflag = true;


                    }
                    else{
                        moveCase(0,self.olddirect)
                    }
                }

                if(snakeList.length>1){
                    for(var i=1;i<snakeList.length;i++){
                        if(snakeList[i].dire!=snakeList[i-1].dire){
                            switch (snakeList[i-1].dire){
                                case 1:
                                    if(snakeList[i].obj.x == snakeList[i-1].obj.x){
                                        snakeList[i].dire = snakeList[i-1].dire;
                                        snakeList[i].obj.rotation = snakeList[i-1].obj.rotation;
                                    }
                                    break;
                                case 2:
                                    if(snakeList[i].obj.y == snakeList[i-1].obj.y){
                                        snakeList[i].dire = snakeList[i-1].dire;
                                        snakeList[i].obj.rotation = snakeList[i-1].obj.rotation;
                                    }
                                    break;
                                case 3:
                                    if(snakeList[i].obj.x == snakeList[i-1].obj.x){
                                        snakeList[i].dire = snakeList[i-1].dire;
                                        snakeList[i].obj.rotation = snakeList[i-1].obj.rotation;
                                    }
                                    break;
                                case 0:
                                    if(snakeList[i].obj.y == snakeList[i-1].obj.y){
                                        snakeList[i].dire = snakeList[i-1].dire;
                                        snakeList[i].obj.rotation = snakeList[i-1].obj.rotation;
                                    }
                                    break;
                            }
                        }
                    }
                    for(var j=1;j<snakeList.length;j++){
                        moveCase(j,snakeList[j].dire);
                    }
                }

            }

            function moveCase(i,dire){
                switch (dire){
                    case 1:
                        snakeList[i].obj.y--;
                        break;
                    case 2:
                        snakeList[i].obj.x++;
                        break;
                    case 3:
                        snakeList[i].obj.y++;
                        break;
                    case 0:
                        snakeList[i].obj.x--;
                        break;
                }
            }




            //吃到了
            for(var k=0;k<self.snake.frog.length;k++){
                if(snakeList[0].obj.x >= (self.snake.frog[k].obj.x-1) && snakeList[0].obj.x <= (self.snake.frog[k].obj.x+1) && snakeList[0].obj.y >= (self.snake.frog[k].obj.y-1) && snakeList[0].obj.y <= (self.snake.frog[k].obj.y+1)){
                    eatFrog(k);
                }
            }

            function eatFrog(k){
                switch (self.snake.frog[k].type){
                    case 1:
                        self.score.bx++;
                        break;
                    case 2:
                        self.score.yp++;
                        break;
                    case 3:
                        self.score.zz++;
                        break;
                    case 4:
                        self.score.sp++;
                        break;
                    case 5:
                        self.score.hz++;
                        break;
                }
                var adddot = new createjs.Bitmap("images/train" + self.snake.frog[k].type + ".png");
                adddot.x = snakeList[snakeList.length-1].obj.x;
                adddot.y = snakeList[snakeList.length-1].obj.y;
                adddot.regX = 31;
                adddot.regY = 31;
                adddot.scaleX = self.size/62;
                adddot.scaleY = self.size/62;
                adddot.alpha = 1;
                adddot.rotation = snakeList[snakeList.length-1].obj.rotation; var lastrot = snakeList[snakeList.length-1].obj.rotation;
                var lastdire = snakeList[snakeList.length-1].dire;
                container.removeChild(self.snake.frog[k].obj);
                self.snake.frog.remove(k);
                self.eatSize = self.size;
                self.currentdot.push({'obj':adddot,'rot':lastrot,'dire':lastdire});
//                setTimeout(function(){
//                    container.addChild(adddot);
//
//                },1000/self.fps*self.size);



                if(self.snake.frog.length<=2){
                    var randnum = Math.ceil(Math.random()*6);
                    for(var j=0;j<randnum;j++){
                        addFrog();
                    }
                }

                if(snakeList.length>10){
                    var mrand = Math.ceil(Math.random()*7);
                    if(mrand == 6){
                        if(self.snake.minus==null){
                            self.minusflag = true;
                            addFrog();
                            $('.danger').fadeIn(500,function(){
                                $('.danger').fadeOut(1500)
                            });
                        }
                    }
                }
            }

            function addList(){
                if(self.currentCrazydot.length>0 && self.currentdot.length==0){
                    if(self.crazySize>3){
                        self.crazySize--;
                    }
                    else{
                        if(self.crazylenght>0){
                            self.crazySize = self.size;
                            container.addChild(self.currentCrazydot[self.crazylenght-1].obj);
                            self.snake.snakePoint.push({'obj':self.currentCrazydot[self.crazylenght-1].obj,'rot':self.currentCrazydot[self.crazylenght-1].rot,'dire':self.currentCrazydot[self.crazylenght-1].dire});
                            self.crazylenght--;
                        }
                        else{
                            self.currentCrazydot = [];
                        }
                    }
                }
                else{
                    if(self.currentdot.length>0){
                        if(self.currentCrazydot.length>0){
                            if(self.eatSize>2){
                                self.eatSize--;
                            }
                            else{
                                self.stopCrazyAdd = false;
                                container.addChild(self.currentdot[0].obj);
                                self.snake.snakePoint.push({'obj':self.currentdot[0].obj,'rot':self.currentdot[0].rot,'dire':self.currentdot[0].dire});
                                self.currentdot = [];
                            }
                        }
                        else{
                            if(self.eatSize>1){
                                self.eatSize--;
                            }
                            else{
                                self.stopCrazyAdd = false;
                                container.addChild(self.currentdot[0].obj);
                                self.snake.snakePoint.push({'obj':self.currentdot[0].obj,'rot':self.currentdot[0].rot,'dire':self.currentdot[0].dire});
                                self.currentdot = [];
                            }
                        }
                    }
                }
            }


            if(self.snake.minus!=null){
                if(snakeList[0].obj.x  == self.snake.minus.x && snakeList[0].obj.y == self.snake.minus.y){
                    $('.bank').hide();
                    $('.bank-tip').css({left:self.snake.minus.x-self.wid/5,top:self.snake.minus.y-self.wid/5});
                    $('.bank-tip').fadeIn(1000,function(){
                        $('.bank-tip').fadeOut(1000)
                    });
                    for(var x=snakeList.length-1;x>snakeList.length-9;x--){
                        container.removeChild(snakeList[x].obj)
                    }
                    snakeList.splice(snakeList.length-8,8);
                    container.removeChild(self.snake.minus);
                    self.snake.minus = null;
                }
            }




            //反着来
//            if(self.touchFlag == 0){
//                self.ischangeflag = true;
//                for(var j=snakeList.length-1;j>=0;j--){
//                    if(j==0){
//                        snakeList[j].x = self.x;
//                        snakeList[j].y = self.y;
//                        snakeList[j].obj.x = self.x;
//                        snakeList[j].obj.y = self.y;
//                    }
//                    else{
//                        snakeList[j].x = snakeList[j-1].x;
//                        snakeList[j].y = snakeList[j-1].y;
//                        snakeList[j].obj.x = snakeList[j-1].x;
//                        snakeList[j].obj.y = snakeList[j-1].y
//                    }
//                }
//            }


        }
        function rand_frog(){
            var snakeList = self.snake.snakePoint;
            var crandx = Math.ceil(Math.random()*self.widmax)*self.size-Math.floor(self.size/2);
            var crandy = Math.ceil(Math.random()*self.heimax)*self.size-Math.floor(self.size/2);

            var isok = true;
            for(var i=0;i<snakeList.length;i++){
//                if(crandx >= (snakeList[i].obj.x-1) && crandx <= (snakeList[i].obj.x+1) && crandy >= (snakeList[i].obj.y-1) && crandy <= (snakeList[i].obj.y+1)){
//                    isok = false;
//                }
                if(Math.abs(snakeList[i].obj.x-crandx)<self.size && Math.abs(snakeList[i].obj.y-crandy)<self.size){
                    isok = false;
                }
            }

            if(self.snake.frog.length>1){
                for(var j=0;j<self.snake.frog.length;j++){
//                    if(crandx >= (self.snake.frog[j].obj.x-1) && crandx <= (self.snake.frog[j].obj.x+1) && crandy >= (self.snake.frog[j].obj.y-1) && crandy <= (self.snake.frog[j].obj.y+1)){
//                        isok = false;
//                    }
                    if(Math.abs(self.snake.frog[j].obj.x-crandx)<self.size && Math.abs(self.snake.frog[j].obj.y-crandy)<self.size){
                        isok = false;
                    }
                }
            }

            if(self.minusflag == true){
                for(var k=0;k<self.snake.frog.length;k++){
//                    if(crandx >= (self.snake.frog[k].obj.x-1) && crandx <= (self.snake.frog[k].obj.x+1) && crandy >= (self.snake.frog[k].obj.y-1) && crandy <= (self.snake.frog[k].obj.y+1)){
//                        isok = false;
//                    }
                    if(Math.abs(self.snake.frog[k].obj.x-crandx)<self.size && Math.abs(self.snake.frog[k].obj.x-crandy)<self.size){
                        isok = false;
                    }
                }
            }

            if(!isok){
                var newrand = rand_frog();
                crandx = newrand.randx;
                crandy = newrand.randy;
            }

            return {"randx":crandx,"randy":crandy} ;
        }

        function createFrog(){
            if(self.minusflag){
                var dotFrog;
                dotFrog = new createjs.Bitmap("images/bank2.png");
                dotFrog.regX = 68;
                dotFrog.regY = 68;
                dotFrog.scaleX = self.size/100;
                dotFrog.scaleY = self.size/100;
                dotFrog.x = self.randPosition.randx;
                dotFrog.y = self.randPosition.randy;

                $('.bank').css({left:self.randPosition.randx+5,top:self.randPosition.randy+10});
                $('.bank').show();
                $('.bank').fadeOut(300,function(){
                    $('.bank').fadeIn(300)
                });
                return dotFrog;

            }
            else{
                var rand = Math.ceil(Math.random()*100);
                var hzrd = self.percent.hz;
                var sprd = hzrd+self.percent.sp;
                var bxrd = sprd+self.percent.bx;
                var zzrd = bxrd+self.percent.zz;
                var yprd = 100;
                if(rand<=hzrd && rand>0){
                    rand = 5;
                }
                else if(rand<=sprd && rand>hzrd){
                    rand = 4;
                }
                else if(rand<=bxrd && rand>sprd){
                    rand = 1;
                }
                else if(rand<=zzrd && rand>bxrd){
                    rand = 3;
                }
                else if(rand<=yprd && rand>zzrd){
                    rand = 2;
                }
                self.nowtype = rand;
                var dotFrog;
                dotFrog = new createjs.Bitmap("images/icon" + rand + ".png");
                dotFrog.regX = 28;
                dotFrog.regY = 28;
                dotFrog.scaleX = self.size/60;
                dotFrog.scaleY = self.size/60;
                dotFrog.x = self.randPosition.randx;
                dotFrog.y = self.randPosition.randy;
                return dotFrog;

            }


        }

        function addFrog(){
            self.randPosition = rand_frog();
            var frogObj = createFrog();
            if(self.minusflag){
                self.snake.minus = frogObj;
                container.addChild(self.snake.minus);
                self.minusflag = false;
            }
            else{
                self.snake.frog.push({'obj':frogObj,'type':self.nowtype});
                container.addChild(frogObj);
            }
        }
    }
};