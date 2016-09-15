function machineParse(str, machineMap){
	regex = new RegExp(",","ig");
  str = str.replace(regex, " ");
	regex = new RegExp("([A-Za-z0-9]*) to itself", "ig");
	str = str.replace(regex, "$1 to $1");
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

function createHTML(machineMap, template){
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
  	addon = "<div state>" + state.name;
    if(state.start == true){
    	addon = "<div state start>" + state.name;
    }
    if(state.end == true){
    	addon = "<div state end>" + state.name;
    }
      for(j = 0; j < state.points.length; j++){
        pos = stateMap[state.points[j].state].id;
        dir = "";
        if(pos - state.id == 1 ){
					dir = "default";
        }
        if(pos - state.id == -1){
					dir = "right";
        }        
        if(pos - state.id == -1 && pos % 3 == 2){
					dir = "diag default long up";
        }
        if(pos - state.id == 3){
					dir = "default down";
        }
				if(pos - state.id == -3){
					dir = "default down top";
        }
        if(pos - state.id == -2 && pos % 3 != 0){
					dir = "default diag up";
        }
        if(state.points[j].label){
          addon = addon + "<div "+dir+"><span>" + state.points[j].label + "</span></div>";
        } else {
          addon = addon + "<div "+dir+"></div>";
        }
      }
      html = html + addon + "</div>";
  }
  $(template).html($(template).html() + html);
}

var machine = function(str, template){
	mMap = {};
  mMap = machineParse(str, mMap);
  createHTML(mMap, template);
}

var input = "start at C, C to B on 1, B to C on 0, B to Y on X, Y to B on 1, K to C on 0, C to K on 1, K to B on 0, K to Y on 1, end at Y ";

mac = new machine(input, "#testcase");
