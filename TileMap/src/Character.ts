class Character extends egret.DisplayObjectContainer {

    _main: Main;
    _stateMachine: StateMachine;
    _body: egret.Bitmap;
    _ifidle: boolean;
    _ifmove: boolean;
    _idleState: CharacterIdleState = new CharacterIdleState(this);
    _moveState: CharacterMoveState = new CharacterMoveState(this);

    constructor(main: Main) {
        super();
        this._main = main;
        this._body = new egret.Bitmap;
        this._body.texture = RES.getRes("chara1_png");
        this._main.addChild(this._body);
        this._body.anchorOffsetX = this._body.width / 3.5;
        this._body.anchorOffsetY = this._body.width * 0.95;
        this._stateMachine = new StateMachine();
        this._body.x = this._main.stage.stageWidth * 0;
        this._body.y = this._main.stage.stageHeight * 1;
        this._ifidle = true;
        this._ifmove = false;
    }

    public move(targetX: number, targetY: number, path: Point[]) {

        //中止缓动动画，达到实现运动中更换目标点的目的
        egret.Tween.removeTweens(this._body);

        //触发状态机
        this._stateMachine.setState(this._moveState);

        //如果状态机将_ifwalk变量调整为true,则进入运动状态
        if (this._ifmove) {
            console.log("move");
            if (targetX > this._body.x) {
                this._body.skewY = 0;
            }
            else {
                this._body.skewY = 180;
            }
            this.startMove();
            //egret.Tween.get(this._body).to({ x: targetX, y: targetY }, 2000, egret.Ease.sineInOut).call(function () { this.idle() }, this);
            var timer: egret.Timer = new egret.Timer(500, path.length);
            timer.addEventListener(egret.TimerEvent.TIMER, function (e: egret.TimerEvent): void {
                egret.Tween.get(this._body).to({ x: path[timer.currentCount].x * 100, y: path[timer.currentCount].y * 100 },400,egret.Ease.sineInOut).call(function(){this.idle()},this);
            }, this);
        }
    }


    public idle() {

        this._stateMachine.setState(this._idleState);

        //如果状态机将_ifidle变量调整为true,则进入停止状态
        if (this._ifidle) {
            console.log("idle");
            this.startidle();
        }
    }

    //播放运动动画
    public startMove() {
        var list = ["chara1_png", "chara2_png", "chara3_png", "chara4_png", "chara5_png", 
        "chara6_png", "chara7_png", "chara8_png", "chara9_png", "chara10_png", "chara11_png", 
        "chara12_png", "chara13_png", "chara14_png", "chara15_png", "chara16_png", "chara17_png", 
        "chara18_png", "chara19_png", "chara20_png", "chara21_png", "chara22_png", "chara23_png", 
        "chara24_png", "chara25_png", "chara26_png"];
        var count = -1;

        //循环执行
        egret.Ticker.getInstance().register(() => {

            if (this._ifmove) {
                count = count + 0.5;
                if (count >= list.length) {
                    count = 0;
                }

                this._body.texture = RES.getRes(list[Math.floor(count)]);
            }

        }, this);

    }

    public startidle() {

        this._body.texture = RES.getRes("1_png");

    }

}