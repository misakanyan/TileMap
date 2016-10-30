var Point = (function () {
    function Point(x, y, f) {
        this.x = x;
        this.y = y;
        this.f = f;
    }
    var d = __define,c=Point,p=c.prototype;
    return Point;
}());
egret.registerClass(Point,'Point');
var AStar = (function () {
    function AStar(origin, end) {
        this.origin = new Point(0, 0, 0);
        this.openList = new Array();
        this.closeList = new Array();
        this.origin = origin;
        this.findRoute(origin, end);
    }
    var d = __define,c=AStar,p=c.prototype;
    p.findRoute = function (begin, end) {
        begin.f = this.calF(begin, end);
        this.openList.push(begin);
        console.log(begin.f);
    };
    p.calF = function (begin, end) {
        var result = 0;
        result = Math.abs(this.origin.x - begin.x)
            + Math.abs(this.origin.y - begin.y)
            + this.pythagorean(begin, end)
            + 1;
        return result;
    };
    p.pythagorean = function (begin, end) {
        var result = 0;
        result = Math.sqrt(Math.pow(Math.abs(begin.x - end.x), 2) + Math.pow(Math.abs(begin.y - end.y), 2));
        return result;
    };
    return AStar;
}());
egret.registerClass(AStar,'AStar');
//# sourceMappingURL=AStar.js.map