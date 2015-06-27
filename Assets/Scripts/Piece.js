#pragma strict

public var Num: int;

function Start () {
}


public function SetNumber(n: int){
	Num = n;
	this.tag = "P" + n;
	
	var stage = GameObject.Find("Game").GetComponent.<Stage>();

	if (Num == stage.pieceNum){
		var spRender: SpriteRenderer = GetComponent.<SpriteRenderer>();
		var color = spRender.color;
		color.a = 0;
		spRender.color = color;
	} else {
		var letter_space = 0.36;
        var n1 = Num % 10;
		var org1 = GameObject.Find("num_" + n1);
		var num1 : GameObject = Instantiate(org1);
		num1.transform.position = this.transform.position;
		num1.transform.position.x += Num >= 10 ? letter_space : 0;
        num1.transform.localScale.x = this.transform.localScale.x * 4.4;
        num1.transform.localScale.y = this.transform.localScale.y * 4.4;
		num1.transform.parent = this.transform;
		
		if (Num >= 10){
			var n2 = Num / 10;
			var org2 = GameObject.Find("num_" + n2);
			var num2 : GameObject = Instantiate(org2);
			num2.transform.position = this.transform.position;
			num2.transform.position.x -= letter_space;
            num2.transform.localScale.x = this.transform.localScale.x * 4.4;
            num2.transform.localScale.y = this.transform.localScale.y * 4.4;
			num2.transform.parent = this.transform;
		}
	}
}

function AnimateMiss(pos : Vector3){
	var pos1 = new Vector3(pos.x-0.1, pos.y, pos.z);
	var pos2 = new Vector3(pos.x+0.1, pos.y, pos.z);
	
	LeanTween.cancel(gameObject);
	transform.position = pos;
	
	LeanTween.move(gameObject, pos1, 0.12f).setEase( LeanTweenType.easeInQuad ).setOnComplete(function(p){
		LeanTween.move(gameObject, pos2, 0.12f).setEase( LeanTweenType.easeInQuad ).setOnComplete(function(p){
			LeanTween.move(gameObject, pos, 0.12f).setEase( LeanTweenType.easeInQuad );
		});
	});
}




