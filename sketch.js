var canvas = new fabric.Canvas('canvas', {
  backgroundColor: '#fff',
  selection: false
});
let mousePressed = false;
let currentMode;

const modes = {
  draw: 'draw',
}

const openNav = () => {
  document.getElementById("leftSidebar").style.width = "250px";
  document.getElementById("parent").style.marginLeft = "250px";
}
const closeNav = () => {
  document.getElementById("leftSidebar").style.width = "0";
  document.getElementById("parent").style.marginLeft= "0";
}

const selectedObject = {
  house : 'house',
  nature : 'nature',
  barriers : 'barriers',
  cityObject : 'cityObject',
  otherBuilding : 'otherBuilding',
  other: 'other'
}

const changeSelectableCategory = (object) => {
  if(object === selectedObject.house){
    var house = document.getElementById("imgHouse");
    closeNav();
    if(house.style.display === "none") {
      house.style.display = "block";
    } else {
      house.style.display = "none";
    }

  } else if(object === selectedObject.nature){
    var nature = document.getElementById("imgNature");
    closeNav();

  } else if(object === selectedObject.barriers){
    closeNav();


  } else if(object === selectedObject.cityObject){
    closeNav();

  } else if(object === selectedObject.otherBuilding){
    closeNav();

  } else if(object === selectedObject.other){
    closeNav();

  }
}

const togglePen = (mode) => {
  if(mode === modes.draw){
    if(currentMode === modes.draw){
      currentMode = '';
      canvas.isDrawingMode = false;
    }else{
      currentMode = modes.draw;
    }
  }
}
function allowDrop(e) {
  e.preventDefault();
}
// called on ondragstart
function dragElement(e) {
  e.dataTransfer.setData("id", e.target.id); //transfer the "data" i.e. id of the target dragged.
}

function dropElement(e) {
  e.preventDefault();
  var data = e.dataTransfer.getData("id"); //receiving the "data" i.e. id of the target dropped.
  var imag = document.getElementById(data); //getting the target image info through its id.
  var img = new fabric.Image(imag, { //initializing the fabric image.
    left: e.layerX - 80,  //positioning the target on exact position of mouse event drop through event.layerX,Y.
    top: e.layerY - 40,
  });
  img.scaleToWidth(imag.width); //scaling the image height and width with target height and width, scaleToWidth, scaleToHeight fabric inbuilt function.
  img.scaleToHeight(imag.height);
  canvas.add(img);
}

const deleteSelected = (ctx) => {
  canvas.remove(ctx);
}

const setEvent = (canvas) => {
  canvas.on('mouse:move', (event) => {
    if(mousePressed && currentMode === modes.draw){
      canvas.isDrawingMode = true;
      canvas.renderAll();
    }
  });
  canvas.on('mouse:up', (event) => {
    mousePressed = false;

  });
  canvas.on('mouse:down', (event) => {
    mousePressed = true;

  });
}

setEvent(canvas);