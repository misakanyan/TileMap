class Task {

    private _id: string;
    private _name: string;
    private _status: TaskStatus;
    private _desc: string;
    public fromNpcId: string;
    public toNpcId: string;

    constructor(id: string, name: string, status: TaskStatus, desc: string, fromNpcId: string, toNpcId: string) {
        this._id = id;
        this._name = name;
        this._status = status;
        this._desc = desc;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get status(): TaskStatus {
        return this._status;
    }

    public set status(status: TaskStatus) {
        this._status = status;
    }

    public get desc(): string {
        return this._desc;
    }

}

class TaskService {

    private static observerList: Observer[] = [];

    public static taskList: Task[] = [];

    static init() {
        this.initTask();
        this.initObserver();
    }

    private static initTask() {
        var data = RES.getRes("gameconfig_json");
        for (var i = 0; i < data.tasks.length; i++) {
            var task: Task = new Task(data.tasks[i].id, data.tasks[i].name, data.tasks[i].status, data.tasks[i].desc, data.tasks[i].fromNpcId, data.tasks[i].toNpcId);
            this.taskList.push(task);
        }
    }

    private static initObserver() {

        NPCManager.init();
        for (var i: number = 1; i < NPCManager.NPCList.length; i++) {
            this.observerList.push(NPCManager.NPCList[i]);
        }

    }

    static addObserver(o: Observer) {
        this.observerList.push(o);
    }

    static notify(task: Task) {
        for (var i: number = 0; i < TaskService.observerList.length; i++) {
            this.observerList[i].onChange(task);
        }
    }


    static accept(id: string) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        //console.log(this.taskList[id]);
        let task = this.taskList[id];
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
    }

    static complete(id: string) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }

        let task = this.taskList[id];
        if (!task) {
            return ErrorCode.MISSING_TASK;
        }
        if (task.status == TaskStatus.DURING) {
            task.status = TaskStatus.CAN_SUMBIT;
            console.log('complete:' + id);
        }
        this.notify(task);
    }

    static submit(id: string) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }

        let task = this.taskList[id];
        if (!task) {
            return ErrorCode.MISSING_TASK;
        }
        //console.log('finish:' + id);
        if (task.status == TaskStatus.CAN_SUMBIT) {
            task.status = TaskStatus.SUBMITTED;
            console.log('submit:' + id);
        }
        this.notify(task);
    }

    static getTaskByCustomRole(npcId: string): Task[] {
        var task: Task[] = [];
        for (var i: number = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].fromNpcId == npcId || this.taskList[i].toNpcId == npcId) {
                task.push(this.taskList[i]);
            }
        }
        return task;
    }
}

enum ErrorCode {

    SUCCESS,
    MISSING_TASK

}

enum TaskStatus {

    UNACCEPTABLE,
    ACCEPTABLE,
    DURING,
    CAN_SUMBIT,
    SUBMITTED

}

interface Observer {

    onChange(task: Task);

}

interface Strategy {

    selector: Function;

}

class TaskTextElement extends egret.DisplayObjectContainer {

    private _taskid: string;
    taskNameText: egret.TextField = new egret.TextField;
    taskStatusText: egret.TextField = new egret.TextField;
    taskDescText: egret.TextField = new egret.TextField;

    constructor(id: string, name: string, status: TaskStatus, desc: string) {
        super();
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

    changeText(task: Task) {
        this.taskNameText.text = "任务 : " + task.name;
        this.taskStatusText.text = "当前状态 : " + ChineseTaskStatus[task.status];
        this.taskDescText.text = task.desc;
        console.log("panel taskinfo change success");
    }

    public get taskId(): string {
        return this._taskid;
    }


}

class TaskPanel extends egret.DisplayObjectContainer implements Observer {

    private taskTextList: TaskTextElement[] = [];
    private bg: egret.Bitmap = new egret.Bitmap;
    private bgShape: egret.Shape = new egret.Shape;

    constructor() {
        super();
        this.bgShape.x = 0;
        this.bgShape.y = 0;
        this.bgShape.graphics.clear();
        this.bgShape.graphics.beginFill(0x000000, .5);
        this.bgShape.graphics.drawRect(0, 0, 200, 200);
        this.bgShape.graphics.endFill();
        this.addChild(this.bgShape);
        for (var i: number = 0; i < TaskService.taskList.length; i++) {
            var taskText = new TaskTextElement(TaskService.taskList[i].id, TaskService.taskList[i].name, TaskService.taskList[i].status, TaskService.taskList[i].desc);
            this.taskTextList.push(taskText);
            this.addChild(taskText);
        }
    }

    onChange(task: Task) {
        for (var i: number = 0; i < this.taskTextList.length; i++) {
            if (task.id == this.taskTextList[i].taskId) {
                this.taskTextList[i].changeText(task);
            }
        }
    }

}

class DialogPanel extends egret.DisplayObjectContainer{

    private dialog:egret.TextField = new egret.TextField;

    constructor(){
        super();
        
    }
}

var ChineseTaskStatus = {
    0: "不可接受",
    1: "可接受",
    2: "进行中",
    3: "可提交",
    4: "已提交"
}

