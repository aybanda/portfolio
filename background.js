import * as THREE from "https://unpkg.com/three@0.157.0/build/three.module.js";

class InteractiveBackground {
  constructor() {
    this.container = document.createElement("div");
    this.container.className = "background-canvas";
    document.body.insertBefore(this.container, document.body.firstChild);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf7f7f7);

    this.setupLines();
    this.setupRenderer();
    this.setupEvents();
    this.animate();
  }

  setupLines() {
    const lineGeometry = new THREE.BufferGeometry();
    const points = [];
    const point = new THREE.Vector3();
    const direction = new THREE.Vector3();

    for (let i = 0; i < 50; i++) {
      direction.x += Math.random() - 0.5;
      direction.y += Math.random() - 0.5;
      direction.z += Math.random() - 0.5;
      direction.normalize().multiplyScalar(10);
      point.add(direction);
      points.push(point.x, point.y, point.z);
    }

    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );

    this.parentTransform = new THREE.Object3D();

    for (let i = 0; i < 30; i++) {
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4a90e2,
        opacity: 0.3,
        transparent: true,
      });

      const line = new THREE.Line(lineGeometry, lineMaterial);

      line.position.x = Math.random() * 400 - 200;
      line.position.y = Math.random() * 400 - 200;
      line.position.z = Math.random() * 400 - 200;

      line.rotation.x = Math.random() * Math.PI;
      line.rotation.y = Math.random() * Math.PI;
      line.rotation.z = Math.random() * Math.PI;

      line.scale.x = line.scale.y = line.scale.z = Math.random() * 0.5 + 0.5;

      this.parentTransform.add(line);
    }

    this.scene.add(this.parentTransform);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
  }

  setupEvents() {
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener("mousemove", (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      this.parentTransform.rotation.y += mouseX * 0.01;
      this.parentTransform.rotation.x += mouseY * 0.01;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.camera.position.z = 400;
    this.parentTransform.rotation.x += 0.001;
    this.parentTransform.rotation.y += 0.002;

    this.renderer.render(this.scene, this.camera);
  }
}

export { InteractiveBackground };
