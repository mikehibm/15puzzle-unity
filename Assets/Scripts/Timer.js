#pragma strict

private var startTime : float = 0;
private var textMesh : TextMesh;
private var gameManager : GameManager;
private var stage : Stage;
private var timeBar: GameObject;

public var time: float = 0;
public var is_stopped : boolean = false;

function Start () {
	startTime = Time.realtimeSinceStartup;
	textMesh = GetComponent.<TextMesh>();
	
	var gameObj = GameObject.Find("Game");
	gameManager = gameObj.GetComponent.<GameManager>();
	stage = gameObj.GetComponent.<Stage>();
	timeBar = GameObject.Find("timebar");
}

function Update () {
	if (is_stopped) return;

	time = Time.realtimeSinceStartup - startTime;
	textMesh.text = time.ToString("0.00");
	
	var scaleX = (stage.timeLimit - time) / stage.timeLimit;
	timeBar.transform.localScale.x = scaleX;
	
	if (time >= stage.timeLimit){
		Stop();
		time = stage.timeLimit;
		textMesh.text = time.ToString("0.00");
		gameManager.OnTimeUp();
	}
	
}

function Stop(){
	is_stopped = true;
}