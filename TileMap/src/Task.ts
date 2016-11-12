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

    static initTask() {
        var data = RES.getRes("gameconfig_json");
        for (var i = 0; i < data.tasks.length; i++) {
            var task: Task = new Task(data.tasks[i].id, data.tasks[i].name, data.tasks[i].status, data.tasks[i].desc, data.tasks[i].fromNpcId, data.tasks[i].toNpcId);
            this.taskList.push(task);
        }
    }

    static addObserver(o:Observer) {

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
        console.log(task.status);
        console.log(TaskStatus.DURING);
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

class TaskPanel implements Observer {

    onChange(task: Task) {

    }

}

class NPC extends egret.DisplayObjectContainer implements Observer {

    private _id: string;
    private _name: string;
    private _bitmap: egret.Bitmap = new egret.Bitmap;
    private _emoji: egret.Bitmap = new egret.Bitmap;
    private _taskList: Task[];

    constructor(id: string, name: string, bitmap: string, emoji: EmojiStatus) {
        super();
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


    onChange(task: Task) {
        if (this._taskList.length > 0) {
            for (var i: number = 0; i < this._taskList.length; i++) {
                if (task == this._taskList[i]) {
                    if (task.fromNpcId == this._id && task.status == TaskStatus.DURING) {
                        this.changeEmoji(EmojiStatus.EMPTY);
                    } else if (task.toNpcId == this._id && task.status == TaskStatus.DURING) {
                        this.changeEmoji(EmojiStatus.QUESTION);
                    } else if (task.toNpcId == this._id && task.status == TaskStatus.SUBMITTED) {
                        this.changeEmoji(EmojiStatus.EMPTY);
                    }
                }
            }
        }
    }

    private changeEmoji(status: EmojiStatus): void {
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
    }

}

enum EmojiStatus {

    EMPTY,
    QUESTION,
    EXCLAMATION

}