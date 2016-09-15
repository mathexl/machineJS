

var input = "start at C and C to B on 1 and B to C on 0 and B to Y on X and Y to B on 1 and K to C on 0 and C to K on 1 and K to B on 0 and K to Y on 1 ";

function machineParse(str, machineMap){
	ptr = 0;
	ctr = 0;
  while(str.indexOf("start at ",ptr) != -1){
    ctr++;
    ptr = str.indexOf("start at ");
    spaceafter = str.indexOf(" ",ptr+9);
    if(spaceafter == -1){spaceafter = str.length};
    val = str.substring(ptr+9,spaceafter);
    if(!machineMap[val]){
    	machineMap[val] = {};
      machineMap[val].points = [];
      machineMap[val].start = true;
      machineMap[val].end = false;
    } else {
    	machineMap[val].start = true;
    }
    ptr = ptr + 9;
    if(ctr > 100){break}
  }
  


  ptr = 0;
	ctr = 0;
	while(str.indexOf(" to ", ptr) != -1){
  	ctr++;
  	idx = str.indexOf(" to ", ptr);
    spacebefore = str.lastIndexOf(" ", idx-1);
    if(spacebefore == -1){spacebefore = -1;}
    spaceafter = str.indexOf(" ", idx + 4);
    if(spaceafter == -1){spaceafter = str.length};
    term1 = str.substring(spacebefore + 1, idx);
    term2 = str.substring(idx + 4, spaceafter);
    if(!machineMap[term1]){
    	machineMap[term1] = {};
      machineMap[term1].points = [];
      machineMap[term1].start = false;
      machineMap[term1].end = false;
	}
    if(!machineMap[term2]){
	    machineMap[term2] = {};
      machineMap[term2].points = [];
      machineMap[term2].start = false;
      machineMap[term2].end = false;
    }
    machineMap[term1].points.push({"state" : term2});
    label = str.indexOf(" on ",idx);
    check = str.indexOf(" to ", spaceafter);
    
    if(check == -1){check = str.length;}
		if(label != -1 && label < check){
    	spcafter = str.indexOf(" ", label + 4);
      if(spcafter == -1){spcafter = str.length};
      lbl = str.substring(label + 4, spcafter);
      machineMap[term1].points[machineMap[term1].points.length - 1].label = lbl;
    }
    ptr = spaceafter;
    if(ctr > 100){break}
  }
  
    ptr = 0;
	ctr = 0;
  while(str.indexOf("end at ",ptr) != -1){
    ctr++;
    ptr = str.indexOf("end at ");
    spaceafter = str.indexOf(" ",ptr+7);
    if(spaceafter == -1){spaceafter = str.length};
    val = str.substring(ptr+7,spaceafter);
    if(!machineMap[val]){
    	machineMap[val] = {};
      machineMap[val].points = [];
      machineMap[val].start = false;
      machineMap[val].end = true;
    } else {
    	machineMap[val].end = true;
    }
    ptr = ptr + 7;
    if(ctr > 100){break}
  }

  return machineMap;
}

function createHTML(machineMap){
	stateMap = {};
  stateCount = 0;
  for(var propertyName in machineMap) {
  	state = {"id" : stateCount};
    stateCount++;
    state.name = propertyName;
    state.start = machineMap[propertyName].start;
    state.end = machineMap[propertyName].end;
    state.points = machineMap[propertyName].points;
    stateMap[propertyName] = state;
	}

  html = "";
  for(var propertyName in stateMap){
  	state = stateMap[propertyName]; 
  	addon = "<div machine>" + state.name;
    if(state.start == true){
    	addon = "<div machine start>" + state.name;
    }
    if(state.end == true){
    	addon = "<div machine end>" + state.name;
    }
      for(j = 0; j < state.points.length; j++){
        pos = stateMap[state.points[j].state].id;
        dir = "";
        if(pos - state.id == 1 ){
					dir = "left";
        }
 
        if(pos - state.id == -1){
					dir = "right";
        }
        
        if(pos - state.id == -1 && pos % 3 == 2){
					dir = "diag left long up";
        }

        if(pos - state.id == 3){
					dir = "left down";
        }
				if(pos - state.id == -3){
					dir = "left down top";
        }
        if(pos - state.id == -2 && pos % 3 != 0){
					dir = "left diag up";
        }
        if(state.points[j].label){
          addon = addon + "<div "+dir+"><span>" + state.points[j].label + "</span></div>";
        } else {
          addon = addon + "<div "+dir+"></div>";
        }
      }
      html = html + addon + "</div>";
  }
  $("#testcase").html($("#testcase").html() + html);
}

mMap = {};
mMap = machineParse(input, mMap);
createHTML(mMap);
