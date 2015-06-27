#pragma strict

public var top10 = new float[10];

public function Submit(level: int, score: float) : int{
	Load(level);
  
    for (var i = 9; i >= 0; i--){
        var old_score = top10[i];
        if (old_score != 0f && (score > old_score)){
            break;
        }
    }
    var rank = i+2;

    if (rank <= 10){
        var index = rank - 1;
        //index番目に追加して後の要素を後ろにずらす。
        for (i = 9; i >= 0; i--){
        	if (i >= index){
        		if (i+1 < 10){
        			top10[i+1] = top10[i];
        		}
        	}
        }
        top10[index] = score;
    }

	Save(level);
    return rank;
};

public function Load(level: int){
	//PlayerPrefs.DeleteAll();  //For debug.
	
	top10 = new float[10];
	for (var i = 0; i < 10; i++){
		top10[i] = PlayerPrefs.GetFloat("level" + level + "-top" + (i+1), 0f);
	}
}

function Save(level: int){
	for (var i = 0; i < 10; i++){
		PlayerPrefs.SetFloat("level" + level + "-top" + (i+1), top10[i]);
	}
	PlayerPrefs.Save();
}







