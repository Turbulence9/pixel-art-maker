
//change color option borders
function setClBorder(cl){
  for(let i = 0; i < colorArr.length; i++){
    if(cl == "--"+colorArr[i]){
      outer.style.setProperty(cl, "4px dashed #434d56");
    }
    else{
      outer.style.setProperty("--"+colorArr[i], "4px solid #434d56");
    }
  }
}
//change tool option borders
function setToolBorder(tl){
  for(let i = 0; i < toolArr.length; i++){
    if(tl == "--"+toolArr[i]){
      outer.style.setProperty(tl, "4px dashed black");
    }
    else{
      outer.style.setProperty("--"+toolArr[i], "4px solid #434d56");
    }
  }
}
//color whell setup
let colorWell = document.getElementById('colorWell');
colorWell.addEventListener("click", function(){
        currentCl = colorWell.value;
        setClBorder("--newCl");
      });
colorWell.addEventListener("change", function(){
        currentCl = colorWell.value;
        setClBorder("--newCl");
      });


let mDown = false;
let currentCl = "";
let colorArr = ["red","darkred","green","blue","purple","pink","yellow","lightgreen","lightblue",
"mediumpurple","darkorange","peachpuff","saddlebrown","black","newCl"];

let currentTool = "pencil";
let toolArr = ["pencil","paint","eraser"];

let upWait = true;
let maxUndoLen = 5;

let rightWall = [];
for(let i = 0; i < 40; i++){
  rightWall.push(79 + i * 80);
}

let leftWall = [];
for(let i = 0; i < 40; i++){
  leftWall.push(i * 80);
}

const objTo = document.getElementById('container');
const outer = document.getElementById('outer');
for(let x = 0; x < 80; x++){
  for(let y = 0; y < 40; y++){
    let newBox = document.createElement('div');
    newBox.className = 'unit';
    //listener for click
    newBox.addEventListener("click", function(){
      if(currentTool == "pencil"){
        newBox.style.setProperty("--gridColor", currentCl);
        newBox.style.setProperty("--borderColor", currentCl);
      }
      if(currentTool == "eraser"){
        newBox.style.setProperty("--gridColor", "#ffffff");
        newBox.style.setProperty("--borderColor", "LightSlateGray");
      }
      if(currentTool == "paint"){
        let localGridCl = getComputedStyle(newBox).getPropertyValue('--gridColor');
        let localBorderColor = getComputedStyle(newBox).getPropertyValue('--borderColor');
        let startPos = Array.from(newBox.parentNode.children).indexOf(newBox);
        function dive(pos){
          let posGridCl = getComputedStyle(newBox.parentNode.childNodes[pos]).getPropertyValue('--gridColor');
          let posBorderColor = getComputedStyle(newBox.parentNode.childNodes[pos]).getPropertyValue('--borderColor')
          if(posGridCl == currentCl && posBorderColor == currentCl){
            return;
          }
          if(posGridCl != localGridCl && posBorderColor != localBorderColor){
            return;
          }
          newBox.parentNode.childNodes[pos].style.setProperty("--gridColor", currentCl);
          newBox.parentNode.childNodes[pos].style.setProperty("--borderColor", currentCl);
          //dive up
          if(pos - 80 > 0){
            dive(pos-80);
          }
          //dive left
          if(leftWall.indexOf(pos) == -1){
            dive(pos-1);
          }
          //dive down
          if(pos + 80 < 3199){
            dive(pos+80);
          }
          //dive right
          if(rightWall.indexOf(pos) == -1){
            dive(pos+1);
          }
          return;
        }
        dive(startPos);
      }
      });
    //listener for mouse up and down
    newBox.addEventListener("mousedown", function(){
        mDown = true;
        if(upWait){
          upWait = false;
          let tempArr = [];
          for(let i = 0; i < objTo.childNodes.length; i++){
            tempArr.push([getComputedStyle(objTo.childNodes[i]).getPropertyValue('--gridColor'),getComputedStyle(objTo.childNodes[i]).getPropertyValue('--borderColor')]);
          }
          undoRecord.unshift(tempArr);
          if(undoRecord.length > maxUndoLen){
            undoRecord.pop();
          }
        }
      });
    newBox.addEventListener("mouseup", function(){
        mDown = false;
        upWait = true;
      });
    newBox.addEventListener("mousemove", function(){
      if(mDown && currentTool == "pencil"){
        newBox.style.setProperty("--gridColor", currentCl);
        newBox.style.setProperty("--borderColor", currentCl);
      }
      if(mDown && currentTool == "eraser"){
        newBox.style.setProperty("--gridColor", "#ffffff");
        newBox.style.setProperty("--borderColor", "LightSlateGray");
      }
    });
    outer.addEventListener("mouseup", function(){ mDown = false; });
    objTo.appendChild(newBox);
  }
}
//color pallet onClickListener setup
for(let i = 0; i < colorArr.length; i++){
  if(colorArr[i] != "newCl"){
  let tempCl = document.getElementById(colorArr[i]);
  tempCl.addEventListener("click", function(){
          currentCl = colorArr[i];
          setClBorder("--" + colorArr[i]);
        });
  }
}
//tool pallet onClickListener setup
for(let i = 0; i < toolArr.length; i++){
  let tempTool = document.getElementById(toolArr[i]);
  tempTool.addEventListener("click", function(){
          currentTool = toolArr[i];
          setToolBorder("--" + toolArr[i]);
        });
}

let undoRecord = [];
const undo = document.getElementById('undo');
undo.addEventListener("click", function(){

  for(let i = 0; i < objTo.childNodes.length; i++){
    objTo.childNodes[i].style.setProperty("--gridColor", undoRecord[0][i][0]);
    objTo.childNodes[i].style.setProperty("--borderColor", undoRecord[0][i][1]);
  }
  undoRecord.shift();
  //location.reload();
});

const clear = document.getElementById('clear');
clear.addEventListener("click", function(){
  location.reload();
});
