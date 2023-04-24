import * as THREE from "./modules/three.module.js";
import { OrbitControls } from "./modules/OrbitControls.js";
import { FBXLoader } from "./modules/FBXLoader.js";

//Scene
THREE.ColorManagement.enabled = true;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#34495E");
//Camera-Camara
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight
);
camera.position.set(0, 95, 110);
camera.lookAt(0, 0, 0);

//actuizado conforme se mueve la ventana
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.shadowMap.enabled=true;
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffbb, 2);
directionalLight.position.set(10, 1, 8);
// directionalLight.castShadow = true;
scene.add(directionalLight);

const HemisphereLight = new THREE.HemisphereLight(0xffffff,1);
scene.add(HemisphereLight);

// const directionalLight2 = new THREE.DirectionalLight(0xffffbb, 2);
// directionalLight2.position.set(-10, 1, -8);
// scene.add(directionalLight2);

//OrbitControls
//const cameraControl = new OrbitControls(camera, renderer.domElement);

//Cubo
// const cube1Geometry = new THREE.BoxGeometry(1, 1, 1);
// const cube1Material = new THREE.MeshBasicMaterial({ color: "aqua" });
// const cube1 = new THREE.Mesh(cube1Geometry, cube1Material);
// scene.add(cube1);

//Escenario



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
    console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
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
    // pusher2object.castShadow=true;
    scene.add(pusher2object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
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
    // puckObject.castShadow=true;
    scene.add(puckObject);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
  },
  function (error) {
    console.error("Error al cargar el archivo FBX", error);
  }
);

const escenario = new FBXLoader();
let escenarioObject;
escenario.load(
  "./Recursos/Modelos/escenario.fbx",
  function (object) {
    // El objeto FBX se ha cargado exitosamente
    // Puedes agregarlo a tu escena Three.js aquí
    escenarioObject = object;
    escenarioObject.receiveShadow =true;
    scene.add(escenarioObject);
  },
  function (xhr) {
    // Función de progreso opcional
    console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
  },
  function (error) {
    // Función de manejo de errores opcional
    console.error("Error al cargar el archivo FBX", error);
  }
);

document.onkeydown = function (e) {
  //console.log(e);

  if (e.code == "KeyP") {
    let cube1pos = new THREE.Vector3();
    pusher1object.getWorldPosition(cube1pos);
    console.log(cube1pos);
  }

  if (e.code == "KeyC") {
    console.log(camera.position);
  }

  if (e.code == "ArrowRight") {
    pusher1object.position.x += 2;
  }
  if (e.code == "ArrowLeft") {
    pusher1object.position.x -= 2;
  }
  if (e.code == "ArrowUp") {
    pusher1object.position.z -= 2;
  }
  if (e.code == "ArrowDown") {
    pusher1object.position.z += 2;
  }

  if (e.code == "KeyW") {
    pusher2object.position.z -= 2;
  }
  if (e.code == "KeyS") {
    pusher2object.position.z += 2;
  }
  if (e.code == "KeyA") {
    pusher2object.position.x -= 2;
  }
  if (e.code == "KeyD") {
    pusher2object.position.x += 2;
  }
};

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
