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
    generateImage(selectedObject.house);
    closeNav();

  } else if(object === selectedObject.nature){
    generateImage(selectedObject.nature);
    closeNav();


  } else if(object === selectedObject.barriers){
    generateImage(selectedObject.barriers);
    closeNav();


  } else if(object === selectedObject.cityObject){
    generateImage(selectedObject.cityObject);
    closeNav();

  } else if(object === selectedObject.otherBuilding){
    generateImage(selectedObject.otherBuilding);
    closeNav();

  } else if(object === selectedObject.other){
    generateImage(selectedObject.other);
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

var imgArrayNature = [
  {
    img : '/assets/nature/tree1.png',id: "ele1", alt: 'Tree image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/nature/tree2.png',id: "ele2", alt: 'Tree2 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  }
]
var imgArrayBuildings = [
  {
    img : '/assets/buildings/House_1.png',id: "ele1", alt: 'House image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/buildings/House_2.png',id: "ele2", alt: 'House2 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/buildings/House_3.png',id: "ele3", alt: 'House3 image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  },
  {
    img : '/assets/buildings/Shop_1.png',id: "ele4", alt: 'Shop image', class:'img', draggable: "true" ,ondragstart: "dragElement(event)"
  }
]
let generateImage = (obj) => {
  let htmlOutput = "";
  var div = document.getElementById('imgFiller');
  if(obj === selectedObject.nature){
    for(var i = 0; i < imgArrayNature.length; i++){
      var imageElement = '<img src="#SRC", alt="#ALT", id="#ID", class="#CLASS", draggable="#DRAGGABLE", ondragstart="#ONDRAGSTART" />';
      htmlOutput += imageElement.replace("#SRC", imgArrayNature[i].img).replace("#ALT", imgArrayNature[i].alt).replace("#ID", imgArrayNature[i].id).replace("#CLASS", imgArrayNature[i].class).replace("#DRAGGABLE", imgArrayNature[i].draggable).replace("#ONDRAGSTART", imgArrayNature[i].ondragstart);
    }
    div.innerHTML = htmlOutput;
  } else if(obj === selectedObject.house){
    for(var i = 0; i < imgArrayBuildings.length; i++){
      var imageElement = '<img src="#SRC", alt="#ALT", id="#ID", class="#CLASS", draggable="#DRAGGABLE", ondragstart="#ONDRAGSTART" />';
      htmlOutput += imageElement.replace("#SRC", imgArrayBuildings[i].img).replace("#ALT", imgArrayBuildings[i].alt).replace("#ID", imgArrayBuildings[i].id).replace("#CLASS", imgArrayBuildings[i].class).replace("#DRAGGABLE", imgArrayBuildings[i].draggable).replace("#ONDRAGSTART", imgArrayBuildings[i].ondragstart);
    }
    div.innerHTML = htmlOutput;
  }
}


setEvent(canvas);


