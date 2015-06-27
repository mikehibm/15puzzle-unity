#pragma strict

public static var currentLevel: int = 0;

private var mikan: GameObject;
private var TimeUp: GameObject;
private var is_playing : boolean = true;

private var stage: Stage;
private var screenWidth: float;
private var screenHeight: float;
private var rectWidth: float;
private var rectHeight: float;
private var piece_w: float;
private var piece_h: float;

function Start () {
	Debug.Log("currentLevel=" + currentLevel);
	
	is_playing = true;
	mikan = GameObject.Find("mikan");
	TimeUp = GameObject.Find("TimeUp");
	TimeUp.SetActive(false);
	
	var rows = 3 + currentLevel;
	var cols = 3 + currentLevel;
	
	this.stage = GetComponent.<Stage>();
	this.stage.initialize(
				currentLevel,
				rows,
				cols,
				30 + currentLevel*20,		//shuffleCount
				40 + currentLevel*10		//timeLimit
				);
				
				
	var vec = new Vector3(Screen.width, Screen.height, 0);
	var vec2 = Camera.main.ScreenToWorldPoint(vec);
	Debug.Log("Point=" + vec2.x + ", " + vec2.y);	
	screenWidth = vec2.x * 2;
	screenHeight = vec2.y * 2;
	rectWidth = screenWidth * 0.9;
	rectHeight = rectWidth;

	piece_w = parseFloat(rectWidth) / parseFloat(cols);
	piece_h = parseFloat(rectHeight) / parseFloat(rows);
				
				
	InitPanel();
	StartShuffle();
}

function StartShuffle(){
	this.stage.shufflePieces();
	UpdatePieces();
}

function UpdatePieces(){
	var piece: GameObject;
	for (var i = 0; i < this.stage.rows; ++i) {
		for (var j = 0; j < this.stage.cols; ++j) {
		
			var num = this.stage.getNumber(i, j);
			piece = this.FindPieceByNum(num);
			
//			if (piece.getNumberOfRunningActions() > 0){
//				piece.stopActionByTag(ACTION_TAG);
//			}
			
			var new_pos: Vector3 = CalcPiecePos(i, j);
			if (Mathf.Abs(piece.transform.position.x - new_pos.x) > 0.01 
				|| Mathf.Abs(piece.transform.position.y - new_pos.y) > 0.01){
				LeanTween.move(piece, new_pos, 0.28f).setEase( LeanTweenType.easeOutQuad );
			}
		}
	}        
}

function CalcPiecePos(row: int, col: int): Vector3 {
	var pos = new Vector3(piece_w * col- rectWidth / 2.0 + piece_w / 2.0, 
						  piece_h * (this.stage.rows - row) - rectHeight / 2.0 - piece_h / 2.0,
						  0);
	return pos;
}

function FindPieceByNum (num: int){
	return GameObject.FindWithTag("P" + num);
}

function Update () {
	if (Input.GetMouseButtonDown (0) && is_playing) {
        var tapPoint = Camera.main.ScreenToWorldPoint (Input.mousePosition);
        var collider : Collider2D = Physics2D.OverlapPoint (tapPoint);
        if (collider != null) {
            var piece : GameObject = collider.transform.gameObject;
        	MovePiece(piece);
        }
    }
}

function MovePiece(piece : GameObject){
	var pieceScript = piece.GetComponent.<Piece>();
	var num = pieceScript.Num;
	if (num == this.stage.pieceNum) return;
	
	var se: GameObject;
	if (this.stage.swapPieces(num)){
		se = GameObject.Find("SE_ok");
		se.GetComponent.<AudioSource>().Play();
		
		UpdatePieces();
		
		//クリア判定
		if (this.stage.checkClear()){
			OnClear();
		}		
	} else {
		se = GameObject.Find("SE_miss");
		se.GetComponent.<AudioSource>().Play();
		
		var loc = this.stage.locateNumber(num);
		var pos = CalcPiecePos(loc.y, loc.x);
		pieceScript.AnimateMiss(pos);
		//piece.SendMessage("AnimateMiss");
	}

}

function InitPanel(){
	var rows = this.stage.rows;
	var cols = this.stage.cols;
	
	var mw = this.mikan.GetComponent.<SpriteRenderer>().bounds.size.x;
	//Debug.Log("InitPanel: mikan.width=" + mw + ", sizeWidth=" + sizeWidth + ", rectWidth=" + rectWidth);
	var scale = (rectWidth*0.95 / parseFloat(cols)) / mw;
	
	for (var r = 0; r < rows; r++){
		for (var c = 0; c < rows; c++){
            var n = (r * cols + c) + 1;
            
			var piece : GameObject = Instantiate(this.mikan);
			piece.SendMessage("SetNumber", n);
            piece.transform.position = CalcPiecePos(r, c);
            piece.transform.localScale.x = scale;
            piece.transform.localScale.y = scale;
		}
	}
}

function StopPlaying(){
	var bgm = GameObject.Find("BGM");
	bgm.GetComponent.<AudioSource>().Stop();

	var se = GameObject.Find("SE_clear");
	se.GetComponent.<AudioSource>().Play();

	is_playing = false;
}

function OnClear(){
	StopPlaying();	
	
	var timerObj = GameObject.Find("Time");
	var timerComp = timerObj.GetComponent.<Timer>();
	timerComp.Stop();
	var time = timerComp.time;
	Debug.Log("time=" + time.ToString("0.00"));
	
	ShowScores(time);
}

public function OnTimeUp(){
	StopPlaying();	
	TimeUp.SetActive(true);
	
	LeanTween.scale(TimeUp, new Vector3(1.4, 1.4, 1), 3.2).setEase(LeanTweenType.easeOutBounce);
}

function ShowScores(score: float){
	var ranking = GameObject.Find("Game").GetComponent.<Ranking>();
	var rank = ranking.Submit(stage.level, score);

	var subCamera = GameObject.Find("SubCamera");
	var cam = subCamera.GetComponent.<Camera>();
	var sizeHeight = cam.orthographicSize;
	var sizeWidth = sizeHeight * cam.aspect;
	var camPos : Vector3 = subCamera.transform.position;
	var x: float;
	var y: float;
	
	//Debug.Log("sizeHeight=" + sizeHeight + ", sizeWidth=" + sizeWidth + ", aspect=" + cam.aspect);
	
	var black = GameObject.Find("black");
	black.transform.localPosition = new Vector3(0, 0, 0);
	LeanTween.alpha(black, 0.8f, 1f).setEase(LeanTweenType.easeInQuad);

	for (var i = 0; i < 10; i++){
		var lbl = Instantiate(GameObject.Find("Label"));
		lbl.GetComponent.<TextMesh>().text = (i+1) + ".";
	
		x = camPos.x - sizeWidth*0.7 + (i > 4 ? sizeWidth*0.98 : 0);
		y = camPos.y + sizeHeight*0.5 - sizeHeight * (parseFloat(i) * 0.2) + (i > 4 ? sizeHeight : 0);
		lbl.transform.localPosition = new Vector3(x, y, 0);

		if (ranking.top10[i] > 0){
			var sc = Instantiate(GameObject.Find("Score"));
			sc.GetComponent.<TextMesh>().text = ranking.top10[i].ToString("0.00");
			sc.transform.localPosition = new Vector3(x+1.8, y, 0);
			
			if (i == rank -1){
				lbl.GetComponent.<TextMesh>().color = new Color(1, 0, 0.5, 1);
				LeanTween.alpha(lbl, 0.2f, 1f).setEase(LeanTweenType.easeInQuad).setLoopPingPong(-1);

				sc.GetComponent.<TextMesh>().color = new Color(1, 0, 0.5, 1);
				LeanTween.alpha(sc, 0.2f, 1f).setEase(LeanTweenType.easeInQuad).setLoopPingPong(-1);
			}
		}
	}
	
	if (rank == 1){
		var hiscore = Instantiate(GameObject.Find("HiScore"));
		y = camPos.y + sizeHeight*0.66;
		var pos0 = new Vector3(camPos.x + sizeWidth*2.0, y, 0);
		var pos1 = new Vector3(camPos.x, y, 0);
		var pos2 = new Vector3(camPos.x - sizeWidth*2.0, y, 0);
		animateHiScore(hiscore, pos0, pos1, pos2);
	}
}

function animateHiScore(hiscore: GameObject, pos0: Vector3, pos1: Vector3, pos2: Vector3){
	hiscore.transform.localPosition = pos0;	
	
	LeanTween.move(hiscore, pos1, 0.6f).setEase( LeanTweenType.easeOutQuad ).setDelay(0.5).setOnComplete(function(p){
		LeanTween.move(hiscore, pos2, 0.6f).setEase( LeanTweenType.easeInQuad ).setDelay(1.0).setOnComplete(function(p){
			animateHiScore(hiscore, pos0, pos1, pos2);
		});
	});
}



