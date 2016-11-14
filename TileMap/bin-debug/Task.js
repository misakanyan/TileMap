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
    TaskService.init = function () {
        this.initTask();
        this.initObserver();
    };
    TaskService.initTask = function () {
        var data = RES.getRes("gameconfig_json");
        for (var i = 0; i < data.tasks.length; i++) {
            var task = new Task(data.tasks[i].id, data.tasks[i].name, data.tasks[i].status, data.tasks[i].desc, data.tasks[i].fromNpcId, data.tasks[i].toNpcId);
            this.taskList.push(task);
        }
    };
    TaskService.initObserver = function () {
        NPCManager.init();
        for (var i = 1; i < NPCManager.NPCList.length; i++) {
            this.observerList.push(NPCManager.NPCList[i]);
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
        //console.log(task.status);
        //console.log(TaskStatus.DURING);
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
var TaskTextElement = (function (_super) {
    __extends(TaskTextElement, _super);
    function TaskTextElement(id, name, status, desc) {
        _super.call(this);
        this.taskNameText = new egret.TextField;
        this.taskStatusText = new egret.TextField;
        this.taskDescText = new egret.TextField;
        this._taskid = id;
        this.taskNameText.text = "任务 : " + name;
        this.taskNameText.size = 14;
        this.taskNameText.fontFamily = "微软雅黑";
        this.taskNameText.textColor = 0xffff00;
        this.taskNameText.textAlign = egret.HorizontalAlign.LEFT;
        this.taskNameText.type = egret.TextFieldType.DYNAMIC;
        this.taskNameText.x = 0;
        this.taskNameText.y = 0;
        this.taskNameText.width = 200;
        this.taskNameText.height = 20;
        this.taskNameText.lineSpacing = 6;
        this.taskNameText.multiline = true;
        this.taskDescText.text = desc;
        this.taskDescText.size = 14;
        this.taskDescText.fontFamily = "微软雅黑";
        this.taskDescText.textAlign = egret.HorizontalAlign.LEFT;
        this.taskDescText.type = egret.TextFieldType.DYNAMIC;
        this.taskDescText.x = 0;
        this.taskDescText.y = 20;
        this.taskDescText.width = 200;
        this.taskDescText.height = 20;
        this.taskDescText.lineSpacing = 6;
        this.taskDescText.multiline = true;
        this.taskStatusText.text = "当前状态 : " + ChineseTaskStatus[status];
        this.taskStatusText.size = 14;
        this.taskStatusText.fontFamily = "微软雅黑";
        this.taskStatusText.textAlign = egret.HorizontalAlign.LEFT;
        this.taskStatusText.type = egret.TextFieldType.DYNAMIC;
        this.taskStatusText.x = 0;
        this.taskStatusText.y = 40;
        this.taskStatusText.width = 200;
        this.taskStatusText.height = 50;
        this.taskStatusText.lineSpacing = 6;
        this.taskStatusText.multiline = true;
        this.addChild(this.taskNameText);
        this.addChild(this.taskDescText);
        this.addChild(this.taskStatusText);
    }
    var d = __define,c=TaskTextElement,p=c.prototype;
    p.changeText = function (task) {
        this.taskNameText.text = "任务 : " + task.name;
        this.taskStatusText.text = "当前状态 : " + ChineseTaskStatus[task.status];
        this.taskDescText.text = task.desc;
        console.log("panel taskinfo change success");
    };
    d(p, "taskId"
        ,function () {
            return this._taskid;
        }
    );
    return TaskTextElement;
}(egret.DisplayObjectContainer));
egret.registerClass(TaskTextElement,'TaskTextElement');
var TaskPanel = (function (_super) {
    __extends(TaskPanel, _super);
    function TaskPanel() {
        _super.call(this);
        this.taskTextList = [];
        this.bg = new egret.Bitmap;
        this.bgShape = new egret.Shape;
        this.bgShape.x = 0;
        this.bgShape.y = 0;
        this.bgShape.graphics.clear();
        this.bgShape.graphics.beginFill(0x000000, .5);
        this.bgShape.graphics.drawRect(0, 0, 200, 200);
        this.bgShape.graphics.endFill();
        this.addChild(this.bgShape);
        for (var i = 0; i < TaskService.taskList.length; i++) {
            var taskText = new TaskTextElement(TaskService.taskList[i].id, TaskService.taskList[i].name, TaskService.taskList[i].status, TaskService.taskList[i].desc);
            this.taskTextList.push(taskText);
            this.addChild(taskText);
        }
    }
    var d = __define,c=TaskPanel,p=c.prototype;
    p.onChange = function (task) {
        for (var i = 0; i < this.taskTextList.length; i++) {
            if (task.id == this.taskTextList[i].taskId) {
                this.taskTextList[i].changeText(task);
            }
        }
    };
    return TaskPanel;
}(egret.DisplayObjectContainer));
egret.registerClass(TaskPanel,'TaskPanel',["Observer"]);
var DialogPanel = (function (_super) {
    __extends(DialogPanel, _super);
    function DialogPanel() {
        _super.call(this);
        this.dialog = new egret.TextField;
    }
    var d = __define,c=DialogPanel,p=c.prototype;
    return DialogPanel;
}(egret.DisplayObjectContainer));
egret.registerClass(DialogPanel,'DialogPanel');
var ChineseTaskStatus = {
    0: "不可接受",
    1: "可接受",
    2: "进行中",
    3: "可提交",
    4: "已提交"
};
//# sourceMappingURL=Task.js.map