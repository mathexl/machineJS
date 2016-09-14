var input = "C to B labelled T and Y to B labelled X";

function machineParse(str, machineMap){
	ptr = 0;
	ctr = 0;
	while(str.indexOf(" to ", ptr) != -1){

  	ctr++;
  	idx = str.indexOf(" to ", ptr);
    spacebefore = str.lastIndexOf(" ", idx-1);
    if(spacebefore == -1){spacebefore = 0;}
    spaceafter = str.indexOf(" ", idx + 4);
    if(spaceafter == -1){spaceafter = str.length};
    term1 = str.substring(spacebefore, idx);
    term2 = str.substring(idx + 4, spaceafter);

    if(!machineMap[term1]){
    machineMap[term1] = {};
      machineMap[term1].points = [];
    }
    if(!machineMap[term2]){
	    machineMap[term2] = {};
      machineMap[term2].points = [];
    }
    machineMap[term1].points.push({"state" : term2});
    label = str.indexOf(" labelled ");
    check = str.indexOf(" to ", spaceafter);
    if(check == -1){check = str.length;}
		if(label != -1 && label < check){
    	spcafter = str.indexOf(" ", label + 10);
      if(spcafter == -1){spcafter = str.length};
      lbl = str.substring(label + 10, spcafter);
      machineMap[term1].points[machineMap[term1].points.length - 1].label = lbl;
    }
    ptr = spaceafter;
    if(ctr > 100){break}
  }
    	$("#testcase").html(JSON.stringify(machineMap));

  return machineMap;
}

function createHTML(machineMap){
	stateMap = {};
  stateCount = 0;
  for(var propertyName in machineMap) {
  	state = {"id" : stateCount};
    stateCount++;
    state.name = propertyName;
    state.points = machineMap[propertyName].points;
    stateMap[propertyName] = state;
	}

  html = "";

  for(var propertyName in stateMap){
  	state = stateMap[propertyName];
  	addon = "<div machine>" + state.name;
      for(j = 0; j < state.points.length; j++){
        pos = stateMap[state.points[j].state].id;
        dir = "";
        if(pos - state.id == 1){
					dir = "left";
        }
        if(pos - state.id == -1){
					dir = "right";
        }
        if(state.points[j].label){
          addon = addon + "<div "+dir+">" + state.points[j].label + "</div>";
        } else {
          addon = addon + "<div "+dir+"></div>";
        }
      }
      html = html + addon + "</div>";
  }
  $("#testcase").html(html);
}

mMap = {};
mMap = machineParse(input, mMap);
createHTML(mMap);
