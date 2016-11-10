class Task{

    private _id:string;

    private name:string;

    public status:TaskStatus;

    public desc:string;

    constructor(id:string,name:string){
        this._id = id;
        this.name = name;
    }

    public get id():string{
        return this._id;
    }

    public getName():string{
        return this.name;
    }
}

class TaskService{

    private observerList:Observer[] = [];

    private taskList:{
        [index:string]:Task
    } = {};

    public addTask(task:Task){
        this.taskList[task.id] = task;
    }

    addObserver(o:Observer){
        this.observerList.push(o);
    }

    finish(id:string){
        if(!id){
            return ErrorCode.MISSING_TASK;
        }
        console.log('finish:'+id);
        let task = this.taskList[id];
        if(!task){
            return ErrorCode.MISSING_TASK;
        }
        console.log('finish:'+id);
        if(task.status == TaskStatus.CAN_SUMBIT){
            task.status = TaskStatus.SUBMITTED;
        }
    }
}

enum ErrorCode{

    SUCCESS,
    MISSING_TASK

}

enum TaskStatus{

    UNACCEPTABLE,
    ACCEPTABLE,
    DURING,
    CAN_SUMBIT,
    SUBMITTED

}

interface Observer{

    onChange(task:Task);

}

interface Strategy{

    selector:Function;

}

class TaskPanel implements Observer{

    onChange(task:Task){

    }

}

class NPC implements Observer{

    onChange(task:Task){
        
    }

    
}