#pragma strict

public var level: int = 0;
public var rows: int = 3;
public var cols: int = 3;
public var shuffleCount: int = 30;
public var timeLimit: int = 60;

public var pieceNum: int;
private var pieces : Array; 

function initialize(
			level: int, 
			rows: int, 
			cols: int,
			shuffleCount: int,
			timeLimit: int
			) : void {
    this.level = level || 0;
    this.rows = rows || 3;
    this.cols = cols || 3;
    this.shuffleCount = shuffleCount || 30;
    this.pieceNum = rows * cols;
    this.pieces =  new Array();
    this.timeLimit = timeLimit || 60;

    //連番を生成。
    var nums = new Array();
    var i = 0;
    for (i = 1; i < this.pieceNum+1;i++){
        nums.Push(i);
    }

    //各ピースの配置を配列に格納。
    for (i = 0; i < this.rows; ++i) {
    	var arr = new Array();
        pieces.Push(arr);
        
        for (var j = 0; j < this.cols; ++j) {
            var number = nums[ i * this.cols + j ];
            arr.Push(number);
        }
    }        
};

function getNumber(row, col): int {
	var arr: Array = this.pieces[row];
    return arr[col];
};

function setNumber(row, col, num): void{
	var arr: Array = this.pieces[row];
    arr[col] = num;
};

function isBlank(row, col) : boolean {
    var n: int = getNumber(row, col);
    return (n == pieceNum);
};

function locateBlank(): Vector2{
    return locateNumber(pieceNum);
};

function locateNumber(num): Vector2 {
    for (var i = 0; i < this.rows; ++i) {
        for (var j = 0; j < this.cols; ++j) {
            if (getNumber(i, j) == num){
                return new Vector2(j, i);
            }
        }
    }        
};

function swapPieces(num: int): boolean {
    var piecePos: Vector2 = this.locateNumber(num);
    var blankPos: Vector2 = this.locateBlank();
    if ((piecePos.x != blankPos.x && piecePos.y != blankPos.y)
        || (num == this.pieceNum)){
        return false;       //動かせないピースがタップされた時はfalseを返す。
    }
    
    var stop_flag = false;  //再帰呼び出しするかどうか。
    var dx = piecePos.x - blankPos.x;   //空白ピースまでのx距離。
    if (dx == 1 || dx == -1) stop_flag = true;  //空白ピースが隣なら再帰呼び出しをストップ。
    if (dx != 0) dx = dx / Mathf.Abs(dx);
    var dy = piecePos.y - blankPos.y;   //空白ピースまでのy距離。
    if (dy == 1 || dy == -1) stop_flag = true;  //空白ピースが隣なら再帰呼び出しをストップ。
    if (dy != 0) dy = dy / Mathf.Abs(dy);
    
    var next_row = blankPos.y + dy;
    var next_col = blankPos.x + dx;
    
    //空白ピースの隣のピースの番号を得る。
    var nextNum = this.getNumber(next_row, next_col);
    
    //空白ピースとその隣のピースを入れ替える。
    setNumber(blankPos.y, blankPos.x, nextNum);
    setNumber(next_row, next_col, this.pieceNum);
    
    //空白ピースまでまだ距離があれば再帰呼び出し。
    if (!stop_flag) this.swapPieces(num);
    
    return true;
};

function randint(min: int, max: int): int{
    var floatValue = Random.Range(min, max+1);
    var intValue: int = Mathf.Floor(floatValue);
    return intValue;
};

function shufflePieces(): void {
    for (var i = 0; i < this.shuffleCount; ++i){
        var blankPos = this.locateBlank();
        
        while(true){
            var dx: int = this.randint(0, this.cols-1) - blankPos.x;
            var dy: int = this.randint(0, this.rows-1) - blankPos.y;
            if ((dx != 0 || dy != 0) && (dx == 0 || dy == 0)) break;
        }
        
        var num = this.getNumber(blankPos.y + dy, blankPos.x + dx);
        this.swapPieces(num);
    }
};

function checkClear(): boolean {
    var cnt = 1;
    for (var i = 0; i < this.rows; ++i) {
        for (var j = 0; j < this.cols; ++j) {
            var num = getNumber(i, j);
            if (num != cnt) return false;
            cnt++;
        }
    }        
    return true;
};


