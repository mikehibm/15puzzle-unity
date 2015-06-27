#pragma strict

function StartEasy(){
	GetComponent.<AudioSource>().Play();
	GameManager.currentLevel = 0;
	Application.LoadLevel("Game");
}

function StartNormal(){
	GetComponent.<AudioSource>().Play();
	GameManager.currentLevel = 1;
	Application.LoadLevel("Game");
}

function StartHard(){
	GetComponent.<AudioSource>().Play();
	GameManager.currentLevel = 2;
	Application.LoadLevel("Game");
}

