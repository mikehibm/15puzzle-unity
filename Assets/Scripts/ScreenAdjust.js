#pragma strict

var aspectWH: float = 0.6666;
var aspectAdd: float = 0.05;
var StartScreenAdjust = true;
var UpdateScreenAdjust = false;
var localScale:Vector3;

function Start () {
	localScale = transform.localScale;
	if (StartScreenAdjust){
		ScreenAdjust();
	}
}

function Update () {
	if (UpdateScreenAdjust){
		ScreenAdjust();
	}
}

function ScreenAdjust(){
	var wh:float = parseFloat(Screen.width) / parseFloat(Screen.height);
	Debug.Log("Screen.width=" + Screen.width + ", Screen.height=" + Screen.height + ", wh=" + wh);
		transform.localScale = new Vector3(
			(wh / aspectWH) + aspectAdd,
			localScale.y, localScale.z);
}