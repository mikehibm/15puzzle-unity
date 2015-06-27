#pragma strict

var speed: float = 0.02;

function Start () {
}

function Update () {
	if (this.transform.position.x > 10){
		this.transform.Translate(new Vector3(-20,0,0));
	}
	this.transform.Translate(new Vector3(speed,0,0));
}