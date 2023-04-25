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
      console.log(user.uid);
      //console.log("Sign-in successful welcome " + currentUser.displayName);
      writeUserData(user.uid, { L: 15 , W: 15 , X: -85 , Z: 0 , color: "aqua" });
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      console.log("Hubo Un error");
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      //const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

const starCountRef = ref(db, "Jugadores/");
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  // console.log(data);

  Object.entries(data).forEach(([key, value]) => {
    
    const jugador = scene.getObjectByName(key);

    //console.log(`${key} ${value.X}`); 

    if (!jugador) {
      addObject(value.X,value.Z,value.W,value.L,value.color,key)
    }
     scene.getObjectByName(key).position.x = value.X;
     scene.getObjectByName(key).position.z = value.Z;

  });
});

function writeUserData(userId, position) {
  set(ref(db, "Jugadores/" + userId), {
    X: position.x,
    Z: position.z,
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

// //Cubos 4-5-6-7 Paredes
let cube4TopWall = addCube(100, 0, 9, 127, "gray");
let cube5BotWall = addCube(-100, 0, 9, 127, "gray");
let cube6RWall = addCube(0, 59, 200, 9, "gray");
let cube7LWall = addCube(0, -59, 200, 9, "gray");

//Movimiento
document.onkeydown = function (e) {


if(currentUser){
  const jugadorActual = scene.getObjectByName(currentUser.uid);
    if (e.code == "ArrowRight") {
    jugadorActual.position.x += 4;
  }
  if (e.code == "ArrowLeft") {
    jugadorActual.position.x -= 4;
  }
  if (e.code == "ArrowUp") {
    jugadorActual.position.z -= 4;
  }
  if (e.code == "ArrowDown") {
    jugadorActual.position.z += 4;
  }
  writeUserData(currentUser.uid, {
    X: jugadorActual.position.x,
    Z: jugadorActual.position.z,
  });
}  


    if (e.code == "KeyW") {
    // PusherRojo.position.z -= 4;
  }
  if (e.code == "KeyS") {
    // PusherRojo.position.z += 4;
  }
  if (e.code == "KeyA") {
    // PusherRojo.position.x -= 4;
  }
  if (e.code == "KeyD") {
    // PusherRojo.position.x += 4;
  }

//   writeUserData(PusherRojo.name, {
//     X: PusherRojo.position.x,
//     Z: PusherRojo.position.z,
//   });
// }

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

function addObject(X,Z,W,L,color,key){
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.position.set(X, 0, Z);
  mesh.scale.set(W, 1, L);
  mesh.name = key;
  scene.add(mesh);
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
