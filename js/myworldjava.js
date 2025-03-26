const media = [
  { type: "image", src: "/assets/maekoblack.jpeg" },
  { type: "image", src: "/assets/maekoblackglow.jpeg" },
  { type: "image", src: "/assets/maekogreensit.jpeg" },
  { type: "image", src: "/assets/maekogreenstand.jpeg" },
  { type: "image", src: "/assets/maekomuazi.jpg" },
  { type: "image", src: "/assets/maekored.jpeg" },
  { type: "image", src: "/assets/Nkunku.jpg" },
  { type: "image", src: "/assets/Not You.png" },
  { type: "image", src: "/assets/PRPoster.png" },
  { type: "image", src: "/assets/Unstable.jpg" },
];

const params = {
  rows: 5,
  columns: 5,
  curvature: 5,
  spacing: 10,
  imageWidth: 6,
  imageHeight: 6,
  depth: 7.5,
  elevation: 0,
  lookAtRange: 20,
  verticalCurvature: 0.5,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

const header = document.querySelector(".header") || document.createElement("div");
let headerRotationX = 0;
let headerRotationY = 0;
let headerTranslateZ = 0;

let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
const lookAtTarget = new THREE.Vector3(0, 0, 0);

const modal = document.createElement("div");
modal.style.position = "fixed";
modal.style.top = 0;
modal.style.left = 0;
modal.style.width = "100vw";
modal.style.height = "100vh";
modal.style.background = "rgba(0,0,0,0.85)";
modal.style.display = "none";
modal.style.alignItems = "center";
modal.style.justifyContent = "center";
modal.style.zIndex = 999;
modal.innerHTML = '<img id="modal-img" style="max-width:90vw; max-height:90vh; border-radius:12px" />';
document.body.appendChild(modal);
modal.addEventListener("click", () => (modal.style.display = "none"));

function createMediaTexture(item) {
  const loader = new THREE.TextureLoader();
  const texture = loader.load(item.src);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.encoding = THREE.sRGBEncoding;
  return { texture, fullSrc: item.src };
}

function calculateRotations(x, y) {
  const a = 1 / (params.depth * params.curvature);
  const slopeY = -2 * a * x;
  const rotationY = Math.atan(slopeY);
  const maxYDistance = (params.rows * params.spacing) / 2;
  const normalizedY = y / maxYDistance;
  const rotationX = normalizedY * params.verticalCurvature;
  return { rotationX, rotationY };
}

function calculatePosition(row, col) {
  let x = (col - params.columns / 2) * params.spacing;
  let y = (row - params.rows / 2) * params.spacing;
  let z = (x * x) / (params.depth * params.curvature);
  const normalizedY = y / ((params.rows * params.spacing) / 2);
  z += Math.abs(normalizedY) * normalizedY * params.verticalCurvature * 5;
  y += params.elevation;
  const { rotationX, rotationY } = calculateRotations(x, y);
  return { x, y, z, rotationX, rotationY };
}

let images = [];
function createImagePlane(row, col) {
  const item = media[Math.floor(Math.random() * media.length)];
  const geometry = new THREE.PlaneGeometry(params.imageWidth, params.imageHeight);
  const { texture, fullSrc } = createMediaTexture(item);
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  const { x, y, z, rotationX, rotationY } = calculatePosition(row, col);
  plane.position.set(x, y, z);
  plane.rotation.set(rotationX, rotationY, 0);
  plane.userData = {
    basePosition: { x, y, z },
    baseRotation: { x: rotationX, y: rotationY },
    parallaxFactor: Math.random() * 0.5 + 0.5,
    randomOffset: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1 },
    rotationModifier: { x: Math.random() * 0.15 - 0.075, y: Math.random() * 0.15 - 0.075, z: Math.random() * 0.2 - 0.1 },
    phaseOffset: Math.random() * Math.PI * 2,
    src: fullSrc,
  };
  plane.callback = () => {
    const modalImg = document.getElementById("modal-img");
    if (modalImg && fullSrc) {
      modalImg.src = fullSrc;
      modal.style.display = "flex";
    }
  };
  return plane;
}

function updateGallery() {
  images.forEach((p) => scene.remove(p));
  images = [];
  for (let row = 0; row < params.rows; row++) {
    for (let col = 0; col < params.columns; col++) {
      const plane = createImagePlane(row, col);
      images.push(plane);
      scene.add(plane);
    }
  }
}

renderer.domElement.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
  mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
});

renderer.domElement.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  mouseX = (t.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
  mouseY = (t.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
});

renderer.domElement.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  mouseX = (t.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
  mouseY = (t.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
});

renderer.domElement.addEventListener("click", (event) => {
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(images);
  if (intersects.length && intersects[0].object.callback) {
    intersects[0].object.callback();
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  header.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${headerRotationX}deg) rotateY(${headerRotationY}deg) translateZ(${headerTranslateZ}px)`;
  header.style.transition = "transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)";

  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;
  lookAtTarget.set(
    targetX * params.lookAtRange,
    -targetY * params.lookAtRange,
    (targetX * targetX) / (params.depth * params.curvature)
  );

  const time = performance.now() * 0.001;
  images.forEach((plane) => {
    const u = plane.userData;
    const dist = Math.sqrt(targetX * targetX + targetY * targetY);
    const osc = Math.sin(time + u.phaseOffset) * dist * 0.1;

    plane.position.x = u.basePosition.x + targetX * u.parallaxFactor * 3 * u.randomOffset.x + osc * u.randomOffset.x;
    plane.position.y = u.basePosition.y + targetY * u.parallaxFactor * 3 * u.randomOffset.y + osc * u.randomOffset.y;
    plane.position.z = u.basePosition.z + osc * u.randomOffset.z * u.parallaxFactor;

    plane.rotation.x = u.baseRotation.x + targetY * u.rotationModifier.x * dist + osc * u.rotationModifier.x * 0.2;
    plane.rotation.y = u.baseRotation.y + targetX * u.rotationModifier.y * dist + osc * u.rotationModifier.y * 0.2;
    plane.rotation.z = targetX * targetY * u.rotationModifier.z * 2 + osc * u.rotationModifier.z * 0.3;
  });

  camera.lookAt(lookAtTarget);
  renderer.render(scene, camera);
}

updateGallery();
animate();

const preloadImages = (media) => {
  media.forEach((item) => {
    if (item.type === "image") {
      const img = new Image();
      img.src = item.src;
    } else if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.src;
      video.preload = "auto";
    }
  });
};

preloadImages(media);

const ambientAudio = document.createElement("audio");
ambientAudio.src = "/songs/Lofi Beat.mp3";
ambientAudio.loop = true;
ambientAudio.volume = 0.7;
ambientAudio.autoplay = true;
ambientAudio.setAttribute("playsinline", "true");
ambientAudio.setAttribute("preload", "auto");
document.body.appendChild(ambientAudio);

const resumeAudio = () => {
  ambientAudio.play().catch(() => {});
  document.removeEventListener("click", resumeAudio);
  document.removeEventListener("touchstart", resumeAudio);
};
document.addEventListener("click", resumeAudio);
document.addEventListener("touchstart", resumeAudio);

const audioToggle = document.createElement("button");
audioToggle.innerText = "Audio On";
audioToggle.style.position = "fixed";
audioToggle.style.bottom = "20px";
audioToggle.style.right = "20px";
audioToggle.style.padding = "0.5rem 1rem";
audioToggle.style.fontSize = "1rem";
audioToggle.style.border = "none";
audioToggle.style.borderRadius = "8px";
audioToggle.style.backgroundColor = "#0D1B2A";
audioToggle.style.color = "#FAF4EF";
audioToggle.style.zIndex = 1000;
audioToggle.style.cursor = "pointer";
audioToggle.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";

document.body.appendChild(audioToggle);

let isAudioPlaying = true;
audioToggle.addEventListener("click", () => {
  if (isAudioPlaying) {
    ambientAudio.pause();
    audioToggle.innerText = "Audio Off";
  } else {
    ambientAudio.play();
    audioToggle.innerText = "Audio On";
  }
  isAudioPlaying = !isAudioPlaying;
});