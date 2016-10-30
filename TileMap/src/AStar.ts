class Point {
    public x: number;
    public y: number;
    public f: number;

    constructor(x: number, y: number, f: number) {
        this.x = x;
        this.y = y;
        this.f = f;
    }

    /*public setF(f:number){
        this.f = f;
    }

    public getF(){
        return this.f;
    }*/
}




class AStar {

    private origin: Point = new Point(0, 0, 0);
    private end: Point = new Point(0, 0, 0);
    private openList: Array<Point> = new Array<Point>();
    private closeList: Array<Point> = new Array<Point>();

    constructor(origin: Point, end: Point) {
        this.origin = origin;
        this.end = end;
        this.findRoute(this.origin, this.end);
    }

    private findRoute(begin: Point, end: Point): void {
        begin.f = this.calF(begin, end);
        this.openList.push(begin);
    }

    private calAroundF(p: Point) {
        var aroundPoint: Point[];
        aroundPoint.push(new Point(p.x, p.y - 1, 0));
        aroundPoint.push(new Point(p.x, p.y + 1, 0));
        aroundPoint.push(new Point(p.x - 1, p.y, 0));
        aroundPoint.push(new Point(p.x + 1, p.y, 0));

        for (var a: number = 0; a < aroundPoint.length; a++) {
            if (aroundPoint[i].x < 1 || aroundPoint[i].y < 1) {
                aroundPoint.splice(i, 1);
            }
        }
        for (var i: number = 0; i < aroundPoint.length; i++) {
            aroundPoint[i].f = this.calF(aroundPoint[i], this.end);
        }
        for (var j: number = 0; j < aroundPoint.length; j++) {
            if (this.ifExists(this.openList,aroundPoint[i])) {

            }
        }

    }

    private calF(begin: Point, end: Point): number {
        var result: number = 0;
        result = Math.abs(this.origin.x - begin.x)
            + Math.abs(this.origin.y - begin.y)
            + this.pythagorean(begin, end)
            + 1;
        return result;
    }


    private pythagorean(begin: Point, end: Point): number {
        var result: number = 0;
        result = Math.sqrt(Math.pow(Math.abs(begin.x - end.x), 2) + Math.pow(Math.abs(begin.y - end.y), 2));
        return result;
    }

    private ifExists(array: Point[], element: Point): boolean {
        var exist: boolean = false;
        for (var i: number = 0; i < array.length; i++) {
            if (element == array[i]) {  //不知道这玩意能不能判断相等
                exist = true;
                break;
            }
        }
        return exist;
    }

}

