class AStar {

    private _startPoint: Point;
    private _endPoint: Point;
    private _openList: Point[];
    private _closeList: Point[];
    private _grid: Grid;
    private _path: Point[];
    private _heuristic: Function = this.euclidian;
    private _straightCost: number = 1;
    private _diagCost: number = Math.SQRT2;
    //private searchpoint:Point;

    constructor() {
        //this._startPoint = origin;
        //this._endPoint = end;
        //this.findPath(this._startPoint, this._endPoint);
    }

    public findPath(grid: Grid): boolean {
        this._grid = grid;
        this._openList = new Array();
        this._closeList = new Array();

        this._startPoint = this._grid.getStartPoint();
        //this.searchpoint = this._startPoint;
        this._endPoint = this._grid.getEndPoint();

        this._startPoint.g = 0;
        this._startPoint.h = this._heuristic(this._startPoint);
        this._startPoint.f = this._startPoint.g + this._startPoint.h;
        //console.log("findpath");
        return this.search();
    }

    public search(): boolean {
        var searchpoint: Point = this._startPoint;
        //console.log("search");
        //this.searchpoint = this._startPoint;
        //console.log(this._startPoint);
        //console.log(point);
        //console.log(point.x);
        //point = this._startPoint;
        while (searchpoint != this._endPoint) {
            console.log(searchpoint);
            var startX: number = Math.max(0, searchpoint.x - 1);
            
            var endX: number = Math.min(this._grid.getNumCols() - 1, searchpoint.x + 1);
            var startY: number = Math.max(0, searchpoint.y - 1);
            var endY: number = Math.min(this._grid.getNumRows() - 1, searchpoint.y + 1);
            for (var i: number = startX; i <= endX; i++) {
                for (var j: number = startY; j <= endY; j++) {

                    var test: Point = this._grid.getPoint(i, j);

                    if (test == searchpoint || !test.walkable) { continue; }
                    var cost: number = this._straightCost;
                    if (!((searchpoint.x == test.x) || (searchpoint.y == test.y))) {
                        cost = this._diagCost;
                    }
                    var g: number = searchpoint.g + cost;
                    var h: number = this._heuristic(test);
                    var f: number = g + h;
                    if (this.isOpen(test) || this.isClosed(test)) {
                        if (test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = searchpoint;
                        }
                    }
                    else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = searchpoint;
                        this._openList.push(test);
                    }
                }
            }
            this._closeList.push(searchpoint);
            if (this._openList.length == 0) {
                alert("no path found");
                return false;
            }
            this._openList.sort(function (a, b) {
                return a.f - b.f;
            });
            searchpoint = this._openList.shift() as Point;
        }
        this.buildPath();
        console.log("buildpath");
        return true;
    }

    private buildPath(): void {

        this._path = new Array();
        var point: Point = this._endPoint;
        this._path.push(point);
        while (point != this._startPoint) {
            point = point.parent;
            this._path.unshift(point);

        }
        console.log(point);
    }

    public getPath(): Point[] {
        return this._path;
    }

    private isOpen(point: Point): boolean {
        for (var i: number = 0; i < this._openList.length; i++) {
            if (this._openList[i] == point) {
                return true;
            }
        }
        return false;
    }

    private isClosed(point: Point): boolean {
        for (var i: number = 0; i < this._closeList.length; i++) {
            if (this._closeList[i] == point) {
                return true;
            }
        }
        return false;
    }

    private euclidian(point: Point): number {
        var result: number = Math.sqrt(Math.pow(point.x - this._endPoint.x, 2) + Math.pow(point.y - this._endPoint.y, 2));
        return result;
    }

    public visited(): Point[] {
        return this._closeList.concat(this._openList);
    }

}

