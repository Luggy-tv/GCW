import * as THREE from "./modules/three.module.js";
import { FBXLoader } from "./modules/FBXLoader.js";
import { OrbitControls } from "./modules/OrbitControls.js";

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#34495E");

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight
);

camera.position.set(0, 80, 80);
camera.lookAt(0, 0, 0);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//OrbitControls
const cameraControl = new OrbitControls(camera, renderer.domElement);
cameraControl.autoRotate = true;
cameraControl.enabled=false;

//Canvas para fondo en html
const canvas = document.createElement("canvas");
const container = document.getElementById("canvas-container");
container.appendChild(canvas);

//LuzDireccional
const directionalLight = new THREE.DirectionalLight(0xffffbb, 2);
directionalLight.position.set(10, 1, 8);
scene.add(directionalLight);

//Luz otra
const HemisphereLight = new THREE.HemisphereLight(0xffffff, 1);
scene.add(HemisphereLight);

//Pusher1
const pusher1 = new FBXLoader();
let pusher1object;
pusher1.load(
  "./Recursos/Modelos/pusher1.fbx",
  function (object) {
    pusher1object = object;
    pusher1object.position.set(86, 0, 0);
    // pusher1object.castShadow=true;
    scene.add(pusher1object);
  },
  function (xhr) {
    // console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
  },
  function (error) {
    console.error("Error al cargar el archivo FBX", error);
  }
);

//Pusher2
const pusher2 = new FBXLoader();
let pusher2object;
pusher2.load(
  "./Recursos/Modelos/pusher2.fbx",
  function (object) {
    pusher2object = object;
    pusher2object.position.set(-86, 0, 0);
    scene.add(pusher2object);
  },
  function (xhr) {
    // console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
  },
  function (error) {
    console.error("Error al cargar el archivo FBX", error);
  }
);

//Puck
const puck = new FBXLoader();
let puckObject;
puck.load(
  "./Recursos/Modelos/puck.fbx",
  function (object) {
    puckObject = object;
    scene.add(puckObject);
  },
  function (xhr) {
    // console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
  },
  function (error) {
    console.error("Error al cargar el archivo FBX", error);
  }
);

//Escenario
const escenario = new FBXLoader();
let escenarioObject;
escenario.load(
  "./Recursos/Modelos/escenario.fbx",
  function (object) {
    escenarioObject = object;
    escenarioObject.receiveShadow = true;
    scene.add(escenarioObject);
  },
  function (xhr) {
    // console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
  },
  function (error) {
    console.error("Error al cargar el archivo FBX", error);
  }
);

function animate() {
  // angle += 0.01;

  // const radius = 5;
  // const x = radius * Math.sin(angle);
  // const z = radius * Math.cos(angle);

  // camera.position.set(x, 0, z);
  // camera.lookAt(0, 0, 0);

  // cameraControl.rotateAround(new THREE.Vector3(0, 0, 0), 0.01);
    cameraControl.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
