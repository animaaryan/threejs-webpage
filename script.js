import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// glTF loader
const loader = new GLTFLoader();

// Create public variables
let model
let torus
let hollow
let icosphere
let small_cylinder
let hemisphere

// Setup a scene for the webpage
const bgScene = new THREE.Scene()
bgScene.background = new THREE.Color( 0xB2A2BB);
const canvas = document.getElementById("experience-canvas");

// Set variables for the sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// Load the GLB model
loader.load('public/models/shapes.glb', function (gltf) {
    model = gltf.scene;

    // Create a torus model
    torus = model.getObjectByName("Donut")

    // Create an icosphere model
    icosphere = model.getObjectByName("Icosphere")

    // Create hollow model
    hollow = model.getObjectByName("Hollow")

    // Create hemisphere
    hemisphere = model.getObjectByName("Hemisphere")

    // Create cylinder
    small_cylinder = model.getObjectByName("Small_Cylinder")

    model.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
    bgScene.add(model);

    // Move child elements

    // Torus
    torus = model.getObjectByName("Donut")
    torus.position.set(-5, 1, 2)
    torus.rotation.set(1, 0, 0)

    // Hollow
    hollow = model.getObjectByName("Hollow")
    hollow.position.set(5, 2, 1)
    hollow.rotation.set(1.6, 1.6, 1.1)

    // Icosphere
    icosphere = model.getObjectByName("Icosphere")
    icosphere.position.set(-1,-2, 4)
    icosphere.rotation.set(1, 0, 12)

    // Hemisphere
    hemisphere = model.getObjectByName("Hemisphere")
    hemisphere.position.set(5, -2, 2)

    // Cylinder
    small_cylinder = model.getObjectByName("Small_Cylinder")
    small_cylinder.position.set(0.2, 2, 1)
    small_cylinder.rotation.set(0.5, 2, 1)

}, undefined, function (error) {

    console.error(error);

});

// Create the renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.gammaFactor = 2.2;
renderer.outputEncoding = THREE.sRGBEncoding;

// Directional Light
const sun = new THREE.DirectionalLight(0xFFFFFF, 3);

// Ambient light
const light = new THREE.AmbientLight( 0x404040, 20); // soft white light
bgScene.add( light );

// Add shadows
sun.castShadow = true;
sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;
sun.shadow.camera.left = -100;
sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -100;
sun.shadow.normalBias = 0.3;

// Set the sun's position
sun.position.set(20, 10, 0);
sun.target.position.set(20, 0, 0);
bgScene.add(sun);

// Create a camera
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    sizes.width / sizes.height, // Camera size
    0.1, // Near clip
    10 // Far clip
);
camera.position.z = 6

// // Add camera controls
// const controls = new OrbitControls(camera, canvas);
// controls.update();

// Change the camera position on the Z axis
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 7;

// Get user scroll
let scrollY = 0

window.addEventListener("scroll", () => {
  const t = window.scrollY * 0.001
  const i = window.scrollY * -0.002
  const h = window.scrollY * 0.002

  torus.rotation.x = t
  torus.material.opacity = THREE.MathUtils.clamp(t, 0, 1)

  icosphere.rotation.x = i
  icosphere.material.opacity = THREE.MathUtils.clamp(i, 0, 1)

  hollow.rotation.x = h;
  hollow.material.opacity = THREE.MathUtils.clamp(h, 0, 1)

  hemisphere.rotation.x = i;
  hemisphere.material.opacity = THREE.MathUtils.clamp(i, 0, 1)

  small_cylinder.rotation.x = h;
  small_cylinder.material.opacity = THREE.MathUtils.clamp(h, 0, 1)

})

// Handle window resize
function handleResize() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener("resize", handleResize);

// Render the scene
function animate() {
    renderer.render(bgScene, camera);
    requestAnimationFrame(animate)
}
requestAnimationFrame(animate)

function render() {
    renderer.render(bgScene, camera);
}

