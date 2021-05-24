import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import frankUrl from './assets/franklyn.jpg'
import spaceUrl from './assets/space.jpg'
import moonUrl from './assets/moon.jpg'
import normalUrl from './assets/normal.jpg'
import cloudsImage from './assets/2_no_clouds_4k.jpg'
import elev from './assets/elev_bump_4k.jpg'
import water from './assets/water_4k.png'
import fairClouds from './assets/fair_clouds_4k.png'

/*
To work with three.js you need 3 things:
1. Scene
2. Camera
3. Renderer
*/

const pageWidth = window.innerWidth
const pageHeight = window.innerHeight
const radius   = 2,
		segments = 64,
		rotation = 6;   

const scene = new THREE.Scene()

// This receive the radio tha can see base on 360º, the aspect ration and the near view and far view
const camera = new THREE.PerspectiveCamera(75, pageWidth / pageHeight, 0.1, 1000)


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( pageWidth, pageHeight )

camera.position.setZ(30)
camera.position.setX(-3)

renderer.render(scene, camera);

/*
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
// const material =  new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true })
const material =  new THREE.MeshStandardMaterial({ color: 0xFF6347 })
const torus = new THREE.Mesh( geometry, material )

scene.add(torus)
*/

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight(0xffffff)

scene.add(pointLight, ambientLight)
/*
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lightHelper, gridHelper)
*/

const controls = new OrbitControls(camera, renderer.domElement)

// Starts

function addStar() {
  const startGeometry = new THREE.SphereGeometry(0.25, 24, 24)
  const startMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const start = new THREE.Mesh(startGeometry, startMaterial)

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  start.position.set(x, y, z)
  scene.add(start)
}

Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load(spaceUrl)
scene.background = spaceTexture

// Avatar

const frankTexture = new THREE.TextureLoader().load(frankUrl)
const frank = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({ map: frankTexture })
)

frank.position.z = -5;
frank.position.x = 2;

scene.add(frank)

// Moon

const moonTexture = new THREE.TextureLoader().load(moonUrl);
const normalTexture = new THREE.TextureLoader().load(normalUrl);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 20;
moon.position.setX(0);

// Earth

function createSphere() {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, segments),
    new THREE.MeshPhongMaterial({
      map:         new THREE.TextureLoader().load(cloudsImage),
      bumpMap:     new THREE.TextureLoader().load(elev),
      bumpScale:   0.005,
      specularMap: new THREE.TextureLoader().load(water),
      specular:    new THREE.Color('grey')								
    })
  );
}

function createClouds() {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius + 0.003, segments, segments),			
    new THREE.MeshPhongMaterial({
      map:         new THREE.TextureLoader().load(fairClouds),
      transparent: true
    })
  );		
}

const sphere = createSphere();
sphere.rotation.y = rotation
sphere.position.x = 10
sphere.position.z = 5
scene.add(sphere)

const clouds = createClouds();
clouds.rotation.y = rotation
clouds.position.x = 10
clouds.position.z = 5
scene.add(clouds)



// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  frank.rotation.y += 0.01;
  frank.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation loop


function animate () {
  requestAnimationFrame( animate )
  sphere.rotation.y += 0.05;
  clouds.rotation.y += 0.05;
  /*
  torus.rotation.x += 0.01
  torus.rotation.y += 0.005
  torus.rotation.z += 0.01
  */

  controls.update()

  renderer.render(scene, camera)
}

animate()
