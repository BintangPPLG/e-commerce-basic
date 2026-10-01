/**
 * SecondStyle Interactive 3D Canvas Visualizer
 * Powered by Three.js with Smooth Damping Orbit Physics & Procedural Luxury Mesh
 */

(function () {
  'use strict';

  // Helper to load Three.js if not already present
  function ensureThreeJs(callback) {
    if (window.THREE) {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = callback;
    script.onerror = () => console.warn('Three.js CDN could not be loaded, using CSS fallback');
    document.head.appendChild(script);
  }

  // --- Hero 3D Interactive Canvas ---
  function initHero3D(containerId = 'hero-3d-canvas') {
    const container = document.getElementById(containerId);
    if (!container) return;

    ensureThreeJs(() => {
      try {
        const width = container.clientWidth || 500;
        const height = container.clientHeight || 500;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 4.2);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        // Lighting Architecture (Studio Luxury Rig)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        // Warm Key Light (Champagne Gold reflection)
        const keyLight = new THREE.DirectionalLight(0xf5eedc, 1.4);
        keyLight.position.set(4, 5, 4);
        scene.add(keyLight);

        // Cool Rim Light
        const rimLight = new THREE.DirectionalLight(0xdbe7ff, 0.8);
        rimLight.position.set(-4, -2, -3);
        scene.add(rimLight);

        // Group container for interactive rotation
        const modelGroup = new THREE.Group();
        scene.add(modelGroup);

        // Procedural Sculpted Fabric / Garment Mesh
        // Using layered TorusKnot + Organic Geometry for avant-garde luxury feel
        const geometry = new THREE.TorusKnotGeometry(1.05, 0.32, 140, 24, 2, 3);
        const material = new THREE.MeshStandardMaterial({
          color: 0x16181d,
          roughness: 0.28,
          metalness: 0.45,
          wireframe: false
        });

        const garmentMesh = new THREE.Mesh(geometry, material);
        modelGroup.add(garmentMesh);

        // Outer Wireframe Accent Ring (Fashion Blueprint)
        const wireGeo = new THREE.TorusKnotGeometry(1.07, 0.322, 50, 8, 2, 3);
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0xc5a880,
          wireframe: true,
          transparent: true,
          opacity: 0.18
        });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);
        modelGroup.add(wireMesh);

        // Ambient Floating Light Particles
        const particleCount = 45;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 6;
          positions[i + 1] = (Math.random() - 0.5) * 6;
          positions[i + 2] = (Math.random() - 0.5) * 6;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
          color: 0xc5a880,
          size: 0.04,
          transparent: true,
          opacity: 0.6
        });
        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        // Mouse & Pointer Interactivity
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        window.addEventListener('mousemove', (e) => {
          const windowHalfX = window.innerWidth / 2;
          const windowHalfY = window.innerHeight / 2;
          mouseX = (e.clientX - windowHalfX) * 0.0005;
          mouseY = (e.clientY - windowHalfY) * 0.0005;
        });

        // Touch & Drag controls
        container.addEventListener('mousedown', (e) => {
          isDragging = true;
          previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
          isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          const deltaX = e.clientX - previousMousePosition.x;
          const deltaY = e.clientY - previousMousePosition.y;
          targetRotationY += deltaX * 0.008;
          targetRotationX += deltaY * 0.008;
          previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        // Touch support for mobile
        container.addEventListener('touchstart', (e) => {
          if (e.touches.length === 1) {
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }
        }, { passive: true });

        window.addEventListener('touchend', () => {
          isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
          if (!isDragging || e.touches.length !== 1) return;
          const deltaX = e.touches[0].clientX - previousMousePosition.x;
          const deltaY = e.touches[0].clientY - previousMousePosition.y;
          targetRotationY += deltaX * 0.008;
          targetRotationX += deltaY * 0.008;
          previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        // Animation Loop with Smooth Inertia
        let clock = new THREE.Clock();

        function animate() {
          requestAnimationFrame(animate);
          const delta = clock.getDelta();
          const elapsedTime = clock.getElapsedTime();

          // Gentle ambient float
          modelGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.12;

          // Continuous gentle idle spin + mouse tracking
          targetRotationY += 0.004;

          modelGroup.rotation.y += (targetRotationY + mouseX - modelGroup.rotation.y) * 0.05;
          modelGroup.rotation.x += (targetRotationX + mouseY - modelGroup.rotation.x) * 0.05;

          // Slowly rotate particles
          particleSystem.rotation.y = elapsedTime * 0.03;

          renderer.render(scene, camera);
        }

        animate();

        // Responsive Resize Handling
        const resizeObserver = new ResizeObserver(() => {
          const newW = container.clientWidth || 400;
          const newH = container.clientHeight || 400;
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        });
        resizeObserver.observe(container);

      } catch (err) {
        console.error('Three.js initialization failed:', err);
      }
    });
  }

  // --- Product Detail 360 Viewer ---
  function initProduct3D(containerId = 'product-3d-canvas') {
    const container = document.getElementById(containerId);
    if (!container) return;

    ensureThreeJs(() => {
      try {
        const width = container.clientWidth || 450;
        const height = container.clientHeight || 450;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 0, 3.8);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        // Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.85);
        scene.add(ambient);

        const key = new THREE.DirectionalLight(0xfff7e8, 1.2);
        key.position.set(3, 4, 3);
        scene.add(key);

        const fill = new THREE.DirectionalLight(0xd9e5ff, 0.7);
        fill.position.set(-3, -2, -2);
        scene.add(fill);

        // Garment Mock Mesh: Boxy Silhouette Hoodie Spec
        const group = new THREE.Group();
        scene.add(group);

        // Body Torso
        const torsoGeo = new THREE.CylinderGeometry(0.78, 0.74, 1.35, 32);
        const garmentMat = new THREE.MeshStandardMaterial({
          color: 0x181a20,
          roughness: 0.38,
          metalness: 0.15
        });
        const torso = new THREE.Mesh(torsoGeo, garmentMat);
        group.add(torso);

        // Hood
        const hoodGeo = new THREE.SphereGeometry(0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6);
        const hood = new THREE.Mesh(hoodGeo, garmentMat);
        hood.position.set(0, 0.65, -0.1);
        hood.rotation.x = 0.2;
        group.add(hood);

        // Left Sleeve
        const sleeveGeo = new THREE.CylinderGeometry(0.26, 0.22, 1.2, 24);
        const leftSleeve = new THREE.Mesh(sleeveGeo, garmentMat);
        leftSleeve.position.set(-0.95, 0.1, 0);
        leftSleeve.rotation.z = 0.45;
        group.add(leftSleeve);

        // Right Sleeve
        const rightSleeve = new THREE.Mesh(sleeveGeo, garmentMat);
        rightSleeve.position.set(0.95, 0.1, 0);
        rightSleeve.rotation.z = -0.45;
        group.add(rightSleeve);

        // Gold Emblem Accent
        const emblemGeo = new THREE.CircleGeometry(0.12, 32);
        const emblemMat = new THREE.MeshBasicMaterial({ color: 0xc5a880 });
        const emblem = new THREE.Mesh(emblemGeo, emblemMat);
        emblem.position.set(0.3, 0.32, 0.79);
        group.add(emblem);

        // Interactive Drag to Spin
        let isDragging = false;
        let prevX = 0;
        let rotationVelocity = 0;

        container.addEventListener('mousedown', (e) => {
          isDragging = true;
          prevX = e.clientX;
        });

        window.addEventListener('mouseup', () => isDragging = false);

        window.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          const deltaX = e.clientX - prevX;
          rotationVelocity = deltaX * 0.01;
          group.rotation.y += rotationVelocity;
          prevX = e.clientX;
        });

        // Touch events
        container.addEventListener('touchstart', (e) => {
          if (e.touches.length === 1) {
            isDragging = true;
            prevX = e.touches[0].clientX;
          }
        }, { passive: true });

        window.addEventListener('touchend', () => isDragging = false);

        window.addEventListener('touchmove', (e) => {
          if (!isDragging || e.touches.length !== 1) return;
          const deltaX = e.touches[0].clientX - prevX;
          rotationVelocity = deltaX * 0.01;
          group.rotation.y += rotationVelocity;
          prevX = e.touches[0].clientX;
        }, { passive: true });

        function animate() {
          requestAnimationFrame(animate);
          if (!isDragging) {
            rotationVelocity *= 0.94; // damping
            group.rotation.y += 0.003 + rotationVelocity;
          }
          renderer.render(scene, camera);
        }
        animate();

        const ro = new ResizeObserver(() => {
          const nw = container.clientWidth || 300;
          const nh = container.clientHeight || 300;
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        });
        ro.observe(container);

      } catch (e) {
        console.error('Product 3D Viewer error:', e);
      }
    });
  }

  window.SecondStyle3D = {
    initHero3D,
    initProduct3D
  };
})();
