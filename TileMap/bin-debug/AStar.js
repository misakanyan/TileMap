var AStar = (function () {
    //private searchpoint:Point;
    function AStar() {
        this._heuristic = this.euclidian;
        this._straightCost = 1;
        this._diagCost = Math.SQRT2;
        //this._startPoint = origin;
        //this._endPoint = end;
        //this.findPath(this._startPoint, this._endPoint);
    }
    var d = __define,c=AStar,p=c.prototype;
    p.findPath = function (grid) {
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
    };
    p.search = function () {
        var searchpoint = this._startPoint;
        //console.log("search");
        //this.searchpoint = this._startPoint;
        //console.log(this._startPoint);
        //console.log(point);
        //console.log(point.x);
        //point = this._startPoint;
        while (searchpoint != this._endPoint) {
            //console.log(searchpoint);
            var startX = Math.max(0, searchpoint.x - 1);
            var endX = Math.min(this._grid.getNumCols() - 1, searchpoint.x + 1);
            var startY = Math.max(0, searchpoint.y - 1);
            var endY = Math.min(this._grid.getNumRows() - 1, searchpoint.y + 1);
            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    var test = this._grid.getPoint(i, j);
                    if (test == searchpoint || !test.walkable || Math.abs(i - searchpoint.x) + Math.abs(j - searchpoint.y) == 2) {
                        continue;
                    }
                    var cost = this._straightCost;
                    if (!((searchpoint.x == test.x) || (searchpoint.y == test.y))) {
                        cost = this._diagCost;
                    }
                    var g = searchpoint.g + cost;
                    var h = this._heuristic(test);
                    var f = g + h;
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
            searchpoint = this._openList.shift();
        }
        this.buildPath();
        //console.log("buildpath");
        return true;
    };
    p.buildPath = function () {
        this._path = new Array();
        var point = this._endPoint;
        this._path.push(point);
        while (point != this._startPoint) {
            point = point.parent;
            this._path.unshift(point);
        }
        //console.log(point);
    };
    p.getPath = function () {
        return this._path;
    };
    p.isOpen = function (point) {
        for (var i = 0; i < this._openList.length; i++) {
            if (this._openList[i] == point) {
                return true;
            }
        }
        return false;
    };
    p.isClosed = function (point) {
        for (var i = 0; i < this._closeList.length; i++) {
            if (this._closeList[i] == point) {
                return true;
            }
        }
        return false;
    };
    p.euclidian = function (point) {
        var result = Math.sqrt(Math.pow(point.x - this._endPoint.x, 2) + Math.pow(point.y - this._endPoint.y, 2));
        return result;
    };
    p.visited = function () {
        return this._closeList.concat(this._openList);
    };
    return AStar;
}());
egret.registerClass(AStar,'AStar');
//# sourceMappingURL=AStar.js.map