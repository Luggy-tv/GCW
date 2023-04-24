import * as THREE from "./modules/three.module.js";
import { OrbitControls } from "./modules/OrbitControls.js";
import { FBXLoader } from "./modules/FBXLoader.js";

//Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-0yh7vHHd2ylEYROoa8X6f4LuUMoMWJE",
  authDomain: "puckeydome.firebaseapp.com",
  databaseURL: "https://puckeydome-default-rtdb.firebaseio.com",
  projectId: "puckeydome",
  storageBucket: "puckeydome.appspot.com",
  messagingSenderId: "285067212238",
  appId: "1:285067212238:web:21dd49e836b5509a6d279f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const db = getDatabase();
const auth = getAuth();
auth.languageCode = "es";

//Buttons
const buttonLogin = document.getElementById("button-login");
const buttonLogout = document.getElementById("button-logout");

buttonLogin.addEventListener("click", () => {
  login();
});

buttonLogout.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("Sign-out successful");
    })
    .catch((error) => {
      // An error happened.
      console.log("An error happened");
    });
});

let currentUser;
async function login() {
  await signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      currentUser = result.user;
      console.log(currentUser);
      writeUserData(user.uid, { x: 0, z: 0 });
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

const starCountRef = ref(db, "jugadores/");

onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);

  Object.entries(data).forEach(([key, value]) => {
    const jugador = scene.getObjectByName(key);
    if (!jugador) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.position.set(value.x, 0, value.z);
      mesh.name = key;
      mesh.material.color = new THREE.Color(Math.random() * 0xffffff);
      scene.add(mesh);
    }
    scene.getObjectByName(key).position.x = value.x;
    scene.getObjectByName(key).position.z = value.z;
  });
});

function writeUserData(userId, position) {
  set(ref(db, "jugadores/" + userId), {
    x: position.x,
    z: position.z,
  });
}

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#34495E");

//Camara
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight
);
camera.position.set(0, 95, 110);
camera.lookAt(0, 0, 0);

//Canvas
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
//const cameraControl = new OrbitControls(camera, renderer.domElement);

//LuzDireccional
const directionalLight = new THREE.DirectionalLight(0xffffbb, 2);
directionalLight.position.set(10, 1, 8);
scene.add(directionalLight);

//Luz otra
const HemisphereLight = new THREE.HemisphereLight(0xffffff, 1);
scene.add(HemisphereLight);

//Pusher1
let cube1 = addCube(86, 0, 16, 16, "aqua");
//Pusher2
let cube2 = addCube(-86, 0, 16, 16, "coral");
//Puck
let cube3 = addCube(0, 0, 15, 15, "red");

// //Cubos 4-5-6-7 Paredes
let cube4TopWall = addCube(100, 0, 9, 127, "gray");
let cube5BotWall = addCube(-100, 0, 9, 127, "gray");
let cube6RWall = addCube(0, 59, 200, 9, "gray");
let cube7LWall = addCube(0, -59, 200, 9, "gray");

//BoundingBoxCubo1
const bbcube1 = new THREE.Box3();
bbcube1.setFromObject(cube1);

//BoundingBoxCubo2
const bbcube2 = new THREE.Box3();
bbcube2.setFromObject(cube2);

// //Pusher1
// const pusher1 = new FBXLoader();
// let pusher1object;
// pusher1.load(
//   "./Recursos/Modelos/pusher1.fbx",
//   function (object) {
//     pusher1object = object;
//     pusher1object.position.set(86, 0, 0);
//     // pusher1object.castShadow=true;
//     scene.add(pusher1object);
//   },
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
//   },
//   function (error) {
//     console.error("Error al cargar el archivo FBX", error);
//   }
// );

// //Pusher2
// const pusher2 = new FBXLoader();
// let pusher2object;
// pusher2.load(
//   "./Recursos/Modelos/pusher2.fbx",
//   function (object) {
//     pusher2object = object;
//     pusher2object.position.set(-86, 0, 0);
//     // pusher2object.castShadow=true;
//     scene.add(pusher2object);
//   },
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
//   },
//   function (error) {
//     console.error("Error al cargar el archivo FBX", error);
//   }
// );

// //Puck
// const puck = new FBXLoader();
// let puckObject;
// puck.load(
//   "./Recursos/Modelos/puck.fbx",
//   function (object) {
//     puckObject = object;
//     // puckObject.castShadow=true;
//     scene.add(puckObject);
//   },
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
//   },
//   function (error) {
//     console.error("Error al cargar el archivo FBX", error);
//   }
// );

// //Escenario
// const escenario = new FBXLoader();
// let escenarioObject;
// escenario.load(
//   "./Recursos/Modelos/escenario.fbx",
//   function (object) {
//     // El objeto FBX se ha cargado exitosamente
//     // Puedes agregarlo a tu escena Three.js aquí
//     escenarioObject = object;
//     escenarioObject.receiveShadow =true;
//     scene.add(escenarioObject);
//   },
//   function (xhr) {
//     // Función de progreso opcional
//     console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
//   },
//   function (error) {
//     // Función de manejo de errores opcional
//     console.error("Error al cargar el archivo FBX", error);
//   }
// );

//Movimiento
document.onkeydown = function (e) {
  if (e.code == "KeyC") {
    console.log(camera.position);
  }
  if (e.code == "ArrowRight") {
    cube1.position.x += 4;
  }
  if (e.code == "ArrowLeft") {
    cube1.position.x -= 4;
  }
  if (e.code == "ArrowUp") {
    cube1.position.z -= 4;
  }
  if (e.code == "ArrowDown") {
    cube1.position.z += 4;
  }

  if (e.code == "KeyW") {
    cube2.position.z -= 4;
  }
  if (e.code == "KeyS") {
    cube2.position.z += 4;
  }
  if (e.code == "KeyA") {
    cube2.position.x -= 4;
  }
  if (e.code == "KeyD") {
    cube2.position.x += 4;
  }
};

function addCube(x, z, w, h, colorM) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: colorM });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, 1, z);
  cube.scale.set(w, 1, h);

  scene.add(cube);
  return cube;
}

function animateBall() {
  cube3.position.x -= 2;
}

function checkCollisionWith() {}

function update() {
  //animateBall();
  setTimeout(update, 100);
}
update();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
