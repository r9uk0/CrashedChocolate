import * as THREE from "https://r9uk0.github.io/Crashedchocolate/build/three.module.js";
import { OrbitControls } from "https://r9uk0.github.io/Crashedchocolate/controls/OrbitControls.js";
import { FontLoader } from "https://r9uk0.github.io/Crashedchocolate/loaders/FontLoader.js";

let camera, scene, renderer;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  const setPositionNum = window.innerWidth >= 480 ? window.innerWidth : window.innerWidth + 2000;
  camera.position.set(0, - 100, setPositionNum);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x64544e);

  let loader = new FontLoader();
  loader.load('https://r9uk0.github.io/Crashedchocolate/fonts/helvetiker_regular.typeface.json', function (font) {
    let xMid, text;
    let color = 0xfcd4c4;
    let matDark = new THREE.LineBasicMaterial({
      color: color,
      side: THREE.DoubleSide
    });
    let matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    let message = "Crushed\nchocolate";
    let shapes = font.generateShapes(message, 100);
    let geometry = new THREE.ShapeBufferGeometry(shapes);
    geometry.computeBoundingBox();
    xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 50, 0);
    text = new THREE.Mesh(geometry, matLite);
    text.position.z = - 150;
    scene.add(text);

    let holeShapes = [];
    for (let i = 0; i < shapes.length; i++) {
      let shape = shapes[i];
      if (shape.holes && shape.holes.length > 0) {
        for (let j = 0; j < shape.holes.length; j++) {
          let hole = shape.holes[j];
          holeShapes.push(hole);
        }
      }
    }

    shapes.push.apply(shapes, holeShapes);
    let lineText = new THREE.Object3D();
    for (let i = 0; i < shapes.length; i++) {
      let shape = shapes[i];
      let points = shape.getPoints();
      let geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.translate(xMid, 0, 0);
      let lineMesh = new THREE.Line(geometry, matDark);
      lineText.add(lineMesh);
    }
    scene.add(lineText);

    const boxGeometry = new THREE.BoxGeometry(20, 30, 40);
    const boxMaterial = new THREE.MeshLambertMaterial();

    for (let i = 0; i < 1000; i++) {
      const box = new THREE.Mesh(boxGeometry, boxMaterial);

      box.position.x = (Math.random() - .5) * 2000;
      box.position.y = (Math.random() - .5) * 2000;
      box.position.z = (Math.random() - .5) * 2000;

      box.rotation.x = Math.random() * Math.PI;
      box.rotation.y = Math.random() * Math.PI;

      const scale = Math.random();
      box.scale.set(scale, scale, scale);

      scene.add(box);
    }
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}