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

class TaskTextElement extends egret.DisplayObjectContainer{

    _taskid: string;
    _text: egret.TextField = new egret.TextField;

    constructor(id: string, name: string, status: TaskStatus) {
        super();
        this._taskid = id;
        this._text.text = id + "   " + name + "   " + ChineseTaskStatus[status];
        this.addChild(this._text);
    }

    changeText(task:Task){
        this._text.text = task.id + "   " + task.name + "   " + ChineseTaskStatus[task.status];
    }


}

class TaskPanel extends egret.DisplayObjectContainer implements Observer {

    private taskTextList:TaskTextElement[] = [];
    private bg: egret.Bitmap = new egret.Bitmap;

    constructor() {
        super();
        for (var i: number = 0; i < TaskService.taskList.length; i++) {
            var taskText = new TaskTextElement(TaskService.taskList[i].id, TaskService.taskList[i].name, TaskService.taskList[i].status);
            this.taskTextList.push(taskText);
            this.addChild(taskText);
        }
    }

    onChange(task: Task) {
        for(var i:number = 0;i<this.taskTextList.length;i++){
            if(task.id == this.taskTextList[i]._taskid){
                this.taskTextList[i].changeText(task);
            }
        }
    }

}

var ChineseTaskStatus = {
    0: "不可接受",
    1: "可接受",
    2: "进行中",
    3: "可提交",
    4: "已提交"
}

