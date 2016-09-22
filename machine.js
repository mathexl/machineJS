function canvas_arrow(canvas, cir1, cir2, txt, color="#888"){
		 context = canvas.getContext('2d');
		 headlen = 10;   // length of head in pixels
		 fromx = cir1.X;
		 fromy = cir1.Y;
		 tox = cir2.X;
		 toy = cir2.Y;
		 txtadjust = 0;
		 if(cir1.X > cir2.X){
			 fromx = fromx - 35;
			 tox = tox + 35;
			 fromy = fromy - 8;
			 toy = toy - 8;
		 }
		 else if(cir2.X > cir1.X){
			 fromx = fromx + 35;
			 tox = tox - 35;
			 fromy = fromy + 8;
			 toy = toy + 8;
			 txtadjust = 12;
		 } else {
			 if(cir1.Y > cir2.Y){
				 fromy = fromy - 35;
				 toy = toy + 35;
				 fromx = fromx - 8;
				 tox = tox - 8;
				 txtadjust = 12;
			 }
			 if(cir2.Y > cir1.Y){
				 fromy = fromy + 35;
				 toy = toy - 35;
				 fromx = fromx + 8;
				 tox = tox + 8;
				 txtadjust = -12;
			 }
	 	 }
		 angle = Math.atan2(toy-fromy,tox-fromx);
		 context.moveTo(fromx, fromy);
		 context.lineTo(tox, toy);
		 context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
		 context.moveTo(tox, toy);
		 context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
		 context.lineWidth = 2;
		 context.strokeStyle = color;
		 context.stroke();

		 ctx = canvas.getContext('2d');
		 ctx.font = "12px Lato";
		 ctx.fillStyle = "black";
		 ctx.fillText(txt,fromx -(fromx - tox)/2 - txtadjust,fromy - (fromy - toy)/2 - 3 + txtadjust);
 }

	var canvas = document.getElementById('myCanvas');

	circle = function(canvas,X,Y, name, color="black"){
		context = canvas.getContext('2d');
		context.beginPath();
		context.arc(X, Y, 30, 0, 2 * Math.PI, false);
		this.X = X;
		this.Y = Y;
		this.radius = 30;
		context.fillStyle = 'transparent';
		context.fill();
		context.lineWidth = 3;
		context.strokeStyle = color;
		context.stroke();


		ctx = canvas.getContext('2d');
		ctx.font = "12px Lato";
		ctx.fillStyle = color;
		ctx.fillText(name, this.X - 3, this.Y + 3);
	}
	/*
	circle1 = new circle(canvas, 100, 100, "A");
	circle2 = new circle(canvas, 300, 100, "B");

	canvas_arrow(canvas, circle1, circle2, "0");
	canvas_arrow(canvas, circle2, circle1, "1");
	*/
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
	countX = 100;
	countY = 100;
  for(var propertyName in machineMap) {
  	state = {"id" : stateCount};
    stateCount++;
    state.name = propertyName;
    state.start = machineMap[propertyName].start;
    state.end = machineMap[propertyName].end;
    state.points = machineMap[propertyName].points;
		if(state.start == true){
			state.obj = new circle(canvas, countX, countY, state.name, "blue");
		}
		else if(state.end == true){
			state.obj = new circle(canvas, countX, countY, state.name, "red");
		} else {
		state.obj = new circle(canvas, countX, countY, state.name);
		}
    stateMap[propertyName] = state;
		console.log(Object.keys(machineMap).length);
		root = Math.ceil(Math.sqrt(Object.keys(machineMap).length));
		console.log(root)
		if(stateCount % root == 0){
			countX = -100;
			countY = countY + 200;
		}
		countX = (countX + 200);
		if(countX > 800){
			countX = countX % 800;
			countY = countY + 200;
		}

	}

  html = "";

	function getRandom(min, max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}

  for(var propertyName in stateMap){
  	state = stateMap[propertyName];
  	addon = "<div state>" + state.name;
    if(state.start == true){
    	addon = "<div state start>" + state.name; //tobuild
    }
    if(state.end == true){
    	addon = "<div state end>" + state.name; //tobuild
    }
      for(j = 0; j < state.points.length; j++){
        goingto = stateMap[state.points[j].state];
				canvas_arrow(canvas, state.obj, goingto.obj, state.points[j].label);
				pos = 0;
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
  //$(template).html(html);
}

var machine = function(str, template){
	mMap = {};
  mMap = machineParse(str, mMap);
	ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
  createHTML(mMap, template);
}

var input = "start at C, C to B on 1, B to C on 0, B to Y on X, Y to B on 1, K to C on 0, C to K on 1, K to B on 0, K to Y on 1, end at Y ";
$(document).ready(function(){
mac = new machine(input, "#testcase");
});
