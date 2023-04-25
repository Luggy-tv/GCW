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
      if (currentUser) {
        const object = scene.getObjectByName(currentUser.uid);

        scene.remove(object);
        object.geometry.dispose();
        object.material.dispose();

        deleteObject(currentUser.uid);

        currentUser = null;
      }
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
      // console.log(user.uid);
      //console.log("Sign-in successful welcome " + currentUser.displayName);
      writeNewObject(
        user.uid,
        { x: 85, z: 0 },
        { l: 15, w: 15 },
        { color: "aqua" }
      );
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

    //console.log(`${key} ${value.x}`);

    if (!jugador) {
      addObject(value.x, value.z, value.w, value.l, value.color, key);
    }
    scene.getObjectByName(key).position.x = value.x;
    scene.getObjectByName(key).position.z = value.z;
  });
});

function writeUserData(userId, position) {
  set(ref(db, "Jugadores/" + userId), {
    x: position.x,
    z: position.z,
  });
}

function writeNewObject(userId, position, scale, Mcolor) {
  set(ref(db, "Jugadores/" + userId), {
    color: Mcolor.color,
    x: position.x,
    z: position.z,
    w: scale.w,
    l: scale.l,
  });
}

function deleteObject(userID) {
  const objectref = ref(db, "Jugadores/" + userID);
  console.log(objectref);
  objectref
    .remove()
    .then(() => {
      console.log("Object removed from Firebase!");
    })
    .catch((error) => {
      console.error("Error removing object from Firebase:", error);
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

const pusherRojo = scene.getObjectByName("PusherRojo");

document.onkeydown = function (e) {
  if (currentUser) {
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
      x: jugadorActual.position.x,
      z: jugadorActual.position.z,
    });
  }

  // console.log(pusherRojo);
  if (pusherRojo) {
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
    //     x: PusherRojo.position.x,
    //     z: PusherRojo.position.z,
    //   });
    // }
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

function addObject(x, z, w, l, colorM, key) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: colorM });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.position.set(x, 0, z);
  mesh.scale.set(w, 1, l);
  mesh.name = key;
  scene.add(mesh);
}

function checkCollisionwith() {}

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
