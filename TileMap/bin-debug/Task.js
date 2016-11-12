var Task = (function () {
    function Task(id, name, status, desc, fromNpcId, toNpcId) {
        this._id = id;
        this._name = name;
        this._status = status;
        this._desc = desc;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;
    }
    var d = __define,c=Task,p=c.prototype;
    d(p, "id"
        ,function () {
            return this._id;
        }
    );
    d(p, "name"
        ,function () {
            return this._name;
        }
    );
    d(p, "status"
        ,function () {
            return this._status;
        }
        ,function (status) {
            this._status = status;
        }
    );
    d(p, "desc"
        ,function () {
            return this._desc;
        }
    );
    return Task;
}());
egret.registerClass(Task,'Task');
var TaskService = (function () {
    function TaskService() {
    }
    var d = __define,c=TaskService,p=c.prototype;
    TaskService.initTask = function () {
        var data = RES.getRes("gameconfig_json");
        for (var i = 0; i < data.tasks.length; i++) {
            var task = new Task(data.tasks[i].id, data.tasks[i].name, data.tasks[i].status, data.tasks[i].desc, data.tasks[i].fromNpcId, data.tasks[i].toNpcId);
            this.taskList.push(task);
        }
    };
    TaskService.addObserver = function (o) {
        this.observerList.push(o);
    };
    TaskService.notify = function (task) {
        for (var i = 0; i < TaskService.observerList.length; i++) {
            this.observerList[i].onChange(task);
        }
    };
    TaskService.accept = function (id) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        //console.log(this.taskList[id]);
        var task = this.taskList[id];
        if (!task) {
            return ErrorCode.MISSING_TASK;
        }
        console.log(task.status);
        console.log(TaskStatus.DURING);
        if (task.status == TaskStatus.ACCEPTABLE) {
            task.status = TaskStatus.DURING;
            console.log('accept:' + id);
        }
        this.notify(task);
    };
    TaskService.complete = function (id) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        var task = this.taskList[id];
        if (!task) {
            return ErrorCode.MISSING_TASK;
        }
        if (task.status == TaskStatus.DURING) {
            task.status = TaskStatus.CAN_SUMBIT;
            console.log('complete:' + id);
        }
        this.notify(task);
    };
    TaskService.submit = function (id) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        var task = this.taskList[id];
        if (!task) {
            return ErrorCode.MISSING_TASK;
        }
        //console.log('finish:' + id);
        if (task.status == TaskStatus.CAN_SUMBIT) {
            task.status = TaskStatus.SUBMITTED;
            console.log('submit:' + id);
        }
        this.notify(task);
    };
    TaskService.getTaskByCustomRole = function (npcId) {
        var task = [];
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].fromNpcId == npcId || this.taskList[i].toNpcId == npcId) {
                task.push(this.taskList[i]);
            }
        }
        return task;
    };
    TaskService.observerList = [];
    TaskService.taskList = [];
    return TaskService;
}());
egret.registerClass(TaskService,'TaskService');
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["SUCCESS"] = 0] = "SUCCESS";
    ErrorCode[ErrorCode["MISSING_TASK"] = 1] = "MISSING_TASK";
})(ErrorCode || (ErrorCode = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["UNACCEPTABLE"] = 0] = "UNACCEPTABLE";
    TaskStatus[TaskStatus["ACCEPTABLE"] = 1] = "ACCEPTABLE";
    TaskStatus[TaskStatus["DURING"] = 2] = "DURING";
    TaskStatus[TaskStatus["CAN_SUMBIT"] = 3] = "CAN_SUMBIT";
    TaskStatus[TaskStatus["SUBMITTED"] = 4] = "SUBMITTED";
})(TaskStatus || (TaskStatus = {}));
var TaskPanel = (function () {
    function TaskPanel() {
    }
    var d = __define,c=TaskPanel,p=c.prototype;
    p.onChange = function (task) {
    };
    return TaskPanel;
}());
egret.registerClass(TaskPanel,'TaskPanel',["Observer"]);
var NPC = (function (_super) {
    __extends(NPC, _super);
    function NPC(id, name, bitmap, emoji) {
        _super.call(this);
        this._bitmap = new egret.Bitmap;
        this._emoji = new egret.Bitmap;
        this._id = id;
        this._name = name;
        this._bitmap.texture = RES.getRes(bitmap);
        this.changeEmoji(emoji);
        this._emoji.x = this._bitmap.x - (this._bitmap.width - this._emoji.width) / 2;
        this._emoji.y = this._bitmap.y + this._emoji.height;
        this._taskList = TaskService.getTaskByCustomRole(this._id);
        this.addChild(this._bitmap);
        this.addChild(this._emoji);
    }
    var d = __define,c=NPC,p=c.prototype;
    p.onChange = function (task) {
        if (this._taskList.length > 0) {
            for (var i = 0; i < this._taskList.length; i++) {
                if (task == this._taskList[i]) {
                    if (task.fromNpcId == this._id && task.status == TaskStatus.DURING) {
                        this.changeEmoji(EmojiStatus.EMPTY);
                    }
                    else if (task.toNpcId == this._id && task.status == TaskStatus.DURING) {
                        this.changeEmoji(EmojiStatus.QUESTION);
                    }
                    else if (task.toNpcId == this._id && task.status == TaskStatus.SUBMITTED) {
                        this.changeEmoji(EmojiStatus.EMPTY);
                    }
                }
            }
        }
    };
    p.changeEmoji = function (status) {
        switch (status) {
            case EmojiStatus.EMPTY:
                this._emoji.texture = null;
                break;
            case EmojiStatus.QUESTION:
                this._emoji.texture = RES.getRes("question_jpg");
                break;
            case EmojiStatus.EXCLAMATION:
                this._emoji.texture = RES.getRes("exclamation_jpg");
                break;
            default:
                break;
        }
    };
    return NPC;
}(egret.DisplayObjectContainer));
egret.registerClass(NPC,'NPC',["Observer"]);
var EmojiStatus;
(function (EmojiStatus) {
    EmojiStatus[EmojiStatus["EMPTY"] = 0] = "EMPTY";
    EmojiStatus[EmojiStatus["QUESTION"] = 1] = "QUESTION";
    EmojiStatus[EmojiStatus["EXCLAMATION"] = 2] = "EXCLAMATION";
})(EmojiStatus || (EmojiStatus = {}));
//# sourceMappingURL=Task.js.map