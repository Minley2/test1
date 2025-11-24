// Инициализация сцены Three.js
let scene, camera, renderer;
let aircraftModel;
let mixer; // для анимации
let clock = new THREE.Clock();
let animationSpeed = 1;

document.addEventListener('DOMContentLoaded', () => {
    init3DScene();
    setupModelSelector();
    setupAnimationControls();
});

function init3DScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('model-container').appendChild(renderer.domElement);

    // Добавляем свет
    let light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    // Камера
    camera.position.z = 5;

    // Анимация сцены
    animate();
}

function loadModel(modelName) {
    // Загружаем 3D модель в зависимости от выбранного самолёта
    let loader = new THREE.GLTFLoader();
    loader.load(`models/${modelName}.glb`, (gltf) => {
        if (aircraftModel) {
            scene.remove(aircraftModel);
        }
        aircraftModel = gltf.scene;
        scene.add(aircraftModel);

        // Анимация модели
        if (gltf.animations.length) {
            mixer = new THREE.AnimationMixer(aircraftModel);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        }
    });
}

function setupModelSelector() {
    const select = document.getElementById('aircraft-select');
    select.addEventListener('change', (event) => {
        loadModel(event.target.value);
    });

    loadModel(select.value); // Загружаем модель по умолчанию
}

function setupAnimationControls() {
    const speedControl = document.getElementById('animation-speed');
    speedControl.addEventListener('input', (event) => {
        animationSpeed = event.target.value / 50; // Масштабируем скорость
    });

    document.getElementById('start-animation').addEventListener('click', () => {
        if (mixer) {
            mixer.timeScale = animationSpeed;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        mixer.update(clock.getDelta());
    }

    renderer.render(scene, camera);
}
