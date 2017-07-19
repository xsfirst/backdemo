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
    fps:2,
    headrot:0,
    fpstime:0,
    percent:0,
    canvasFlag:true,
    init:function(){
        var self = this;
        this.pageClick();
        this.pageAni();
        this.myPress();
        $('.bg1').css({marginTop:-self.wid*1334/750/2})
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
            $('.idpage').show();
            $('.introbg').hide();
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
        self.fpstime = 0;
        self.fps = 2;
        self.headrot = 0;
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
                self.snake.snakePoint.push({'x':Math.floor(self.size/2),'y':Math.floor(self.size/2),'obj':dot,'rot':0});
                addFrog();
                createjs.Ticker.addEventListener("tick", tick);
                createjs.Ticker.setFPS(self.fps);

            },3000)
        }

        function crazyCountdown(){
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
                self.addcount = 5;
                createjs.Ticker.addEventListener("tick", tick);
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
                crazyMode();
            }


            self.fpstime++;
            if(self.fpstime>2*30 && self.fps==2){
                self.fps = 3;
                createjs.Ticker.setFPS(self.fps);
            }
            else if(self.fpstime>3*30 && self.fps==3){
                self.fps = 4;
                createjs.Ticker.setFPS(self.fps);
            }
            else if(self.fpstime>4*30 && self.fps==4){
                self.fps = 5;
                createjs.Ticker.setFPS(self.fps);
            }
            else if(self.fpstime>5*30 && self.fps==5){
                self.fps = 6;
                createjs.Ticker.setFPS(self.fps);
            }

            self.stage.update(event);
        }

        //疯狂模式
        function crazyMode(){
            var snakeList = self.snake.snakePoint;
            //30秒crazymode
            if(self.crazytime>30*self.fps && snakeList.length<=15){
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
            switch(self.direct){
                case 1:
                    self.y = self.y-self.size;
                    break;
                case 2:
                    self.x = self.x+self.size;
                    break;
                case 3:
                    self.y = self.y+self.size;
                    break;
                case 0:
                    self.x = self.x-self.size;
                    break;
            }

            //碰到墙壁死掉了
            if(self.x>self.cavwid+1-Math.floor(self.size/2) || self.y>self.cavhei+1-Math.floor(self.size/2) || self.x<Math.floor(self.size/2) || self.y<Math.floor(self.size/2)){
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
            for(var i=0;i<snakeList.length;i++){
                if (parseFloat(snakeList[i].x).toFixed(1) == self.x && parseFloat(snakeList[i].y).toFixed(1) == self.y) {
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

            function crazyAdd(){
                var rand = Math.ceil(Math.random()*100);
                var hzrd = self.percent.hz;
                var sprd = hzrd+self.percent.sp;
                var bxrd = sprd+self.percent.bx;
                var zzrd = bxrd+self.percent.zz;
                var yprd = zzrd+self.percent.yp;
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
                switch (rand){
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
                dd();
                var crazydot = new createjs.Bitmap("images/train" + rand + ".png");
                crazydot.x = -200;
                crazydot.y = -200;
                crazydot.regX = 31;
                crazydot.regY = 31;
                crazydot.scaleX = self.size/62;
                crazydot.scaleY = self.size/62;
                crazydot.rotation = snakeList[snakeList.length-1].obj.rotation;
                container.addChild(crazydot);

                var lastrot = snakeList[snakeList.length-1].obj.rotation;
                self.snake.snakePoint.push({'x':snakeList[snakeList.length-1].x,'y':snakeList[snakeList.length-1].y,'obj':crazydot,'rot':lastrot});
            }


            //正着来
            if(self.touchFlag == 0){

                var prex = snakeList[0].x;
                var prey = snakeList[0].y;
                snakeList[0].x = self.x;
                snakeList[0].y = self.y;
//                switch (self.direct){
//                    case 1:
//                        if(snakeList[0].obj.y>self.y){
//                            snakeList[0].obj.y--;
//                        }
//                        break;
//                    case 2:
//                        if(snakeList[0].obj.x<self.x){
//                            snakeList[0].obj.x++;
//                        }
//                        break;
//                    case 3:
//                        if(snakeList[0].obj.y<self.y){
//                            snakeList[0].obj.y++;
//                        }
//                        break;
//                    case 4:
//                        if(snakeList[0].obj.x>self.x){
//                            snakeList[0].obj.x--;
//                        }
//                        break;
//                }
                snakeList[0].obj.x = self.x;
                snakeList[0].obj.y = self.y;
                snakeList[0].obj.rotation += self.nowrot;
                self.headrot+=self.nowrot;
                var prerot = self.headrot;
                self.nowrot = 0;
                for(var j=1;j<snakeList.length;j++) {
                    var prexTemp = snakeList[j].x;
                    var preyTemp = snakeList[j].y;
                    var prerotTemp = snakeList[j].rot;
                    snakeList[j].x = prex;
                    snakeList[j].y = prey;
                    snakeList[j].obj.x = prex;
                    snakeList[j].obj.y = prey;
                    snakeList[j].obj.rotation = snakeList[j].rot;
                    snakeList[j].rot = prerot;

                    prex = prexTemp;
                    prey = preyTemp;
                    prerot = prerotTemp;
                }

                if(self.addcount>0){
                    self.addcount--;
                    crazyAdd();
                }

                self.ischangeflag = true;
            }


            //吃到了
            if(self.x == self.snake.frog.x && self.y == self.snake.frog.y){
                switch (self.nowtype){
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
                var adddot = new createjs.Bitmap("images/train" + self.nowtype + ".png");
                adddot.x = -200;
                adddot.y = -200;
                adddot.regX = 31;
                adddot.regY = 31;
                adddot.scaleX = self.size/62;
                adddot.scaleY = self.size/62;
                adddot.rotation = snakeList[snakeList.length-1].obj.rotation;
                container.addChild(adddot);
                container.removeChild(self.snake.frog);

                var lastrot = snakeList[snakeList.length-1].obj.rotation;
                self.snake.snakePoint.push({'x':snakeList[snakeList.length-1].x,'y':snakeList[snakeList.length-1].y,'obj':adddot,'rot':lastrot});
                addFrog();

                if(snakeList.length>8){
                    var mrand = Math.ceil(Math.random()*5);
                    if(mrand == 4){
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

            if(self.snake.minus!=null){
                if(snakeList[1].x == self.snake.minus.x && snakeList[1].y == self.snake.minus.y){
                    $('.bank').hide();
                    $('.bank-tip').css({left:self.snake.minus.x-self.wid/5,top:self.snake.minus.y-self.wid/5});
                    $('.bank-tip').fadeIn(1000,function(){
                        $('.bank-tip').fadeOut(1000)
                    });
                    for(var x=snakeList.length-1;x>snakeList.length-6;x--){
                        container.removeChild(snakeList[x].obj)
                    }
                    snakeList.splice(snakeList.length-5,5);
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
            var crandx = Math.ceil(Math.random()*self.widmax)*self.size-Math.ceil(self.size/2);
            var crandy = Math.ceil(Math.random()*self.heimax)*self.size-Math.ceil(self.size/2);

            var isok = true;
            for(var i=0;i<snakeList.length;i++){
                if (snakeList[i].x == crandx && snakeList[i].y == crandy) {
                    isok = false;
                }
            }

            if(self.minusflag == true){
                if(crandx == self.snake.frog.x && crandy == self.snake.frog.y){
                    isok = false;
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
                self.snake.frog=frogObj;
                container.addChild(self.snake.frog);
            }
        }
    }

};