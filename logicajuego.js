import * as THREE from "./modules/three.module.js";
import { OrbitControls } from "./modules/OrbitControls.js";

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#34495E");

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight
);
camera.position.set(0, 0, 12);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//OrbitControls
const cameraControl = new OrbitControls(camera, renderer.domElement);

//LuzDierccional
const light = new THREE.HemisphereLight(0xffffbb, 1);
light.position.set(10, 1, 8);
scene.add(light);

//Pusher1
let cube1 = addCube(0, -5, 4, 1, "aqua");
//Pusher2
let cube2 = addCube(0, 5, 4, 1, "coral");
//Puck
let cube3 = addCube(0, 0, 0.5, 0.5, "red");

//Cubos 4-5-6-7 Paredes
let cube4TopWall = addCube(0, 6, 11, 1, "gray");
let cube5BotWall = addCube(0, -6, 11, 1, "gray");
let cube6RWall = addCube(6, 0, 1, 13, "gray");
let cube7LWall = addCube(-6, 0, 1, 13, "gray");

//BoundingBoxCubo1
const bbcube1 = new THREE.Box3();
bbcube1.setFromObject(cube1);

//BoundingBoxCubo2
const bbcube2 = new THREE.Box3();
bbcube2.setFromObject(cube2);

//Movimiento
document.onkeydown = function (e) {

  if (e.code == "ArrowRight") {
    cube1.position.x += 0.5;
  }
  if (e.code == "ArrowLeft") {
    cube1.position.x -= 0.5;
  }
  if (e.code == "ArrowUp") {
    cube1.position.y += 0.5;
  }
  if (e.code == "ArrowDown") {
    cube1.position.y -= 0.5;
  }

  if (e.code == "KeyW") {
    cube2.position.y += 0.5;
  }
  if (e.code == "KeyS") {
    cube2.position.y -= 0.5;
  }
  if (e.code == "KeyA") {
    cube2.position.x -= 0.5;
  }
  if (e.code == "KeyD") {
    cube2.position.x += 0.5;
  }
};

function addCube(x, y, w, h, colorM) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: colorM });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, 0);
  cube.scale.set(w, h, 1);
  scene.add(cube);
  return cube;
}

function animateBall() {
  cube3.position.y -= 0.2;
}

// function chechkCollisionWith(element: THREE.Mesh<THREE.BoxGeometry,THREE.MeshPhongMaterial>) {
// }

function update() {
  animateBall();
  setTimeout(update,100);
}update();

function animate() {
  requestAnimationFrame(animate);
  cameraControl.update();
  renderer.render(scene, camera);
}
animate();
