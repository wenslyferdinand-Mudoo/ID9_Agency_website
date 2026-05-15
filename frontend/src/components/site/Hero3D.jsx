import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Subtle premium 3D background — animated displaced sphere + ambient particles.
 * - Auto-rotates slowly
 * - Reacts to cursor parallax (desktop)
 * - GPU-accelerated WebGL
 * - Mobile-optimized (lower poly + smaller canvas)
 * - Lazy-mounts after first paint to avoid blocking LCP
 */
export default function Hero3D({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const w = container.clientWidth;
    const h = container.clientHeight;

    // Scene + camera + renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 6.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.pointerEvents = "none";

    // ---------- Displaced sphere (signature 3D object) ----------
    const segments = isMobile ? 64 : 96;
    const sphereGeo = new THREE.IcosahedronGeometry(1.7, segments / 16);

    // Custom shader material — soft gradient + animated noise displacement on rim
    const sphereMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(0xffa500) }, // orange_impact
        uColorB: { value: new THREE.Color(0x7a3076) }, // violet
        uColorC: { value: new THREE.Color(0x0a0a0c) }, // ink
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float uTime;
        // 3D simplex noise — simplified
        float n3(vec3 p) {
          return sin(p.x*1.7 + uTime*0.4) * cos(p.y*2.1 + uTime*0.3) * sin(p.z*1.5 + uTime*0.5);
        }
        void main() {
          vNormal = normalize(normalMatrix * normal);
          float d = n3(position * 1.2);
          vec3 displaced = position + normal * d * 0.18;
          vPos = displaced;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        uniform float uTime;
        void main() {
          // Fresnel rim
          vec3 viewDir = normalize(cameraPosition - vPos);
          float fres = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.2);

          // Vertical gradient
          float t = (vNormal.y + 1.0) * 0.5;
          vec3 base = mix(uColorB, uColorA, t);
          base = mix(base, uColorC, 0.55); // darken into ink

          // Rim glow
          vec3 col = mix(base, uColorA, fres * 0.85);
          // Soft pulse
          col += uColorA * 0.06 * sin(uTime * 0.9);

          // Soft edge fade — premium look
          float alpha = 0.55 + fres * 0.35;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // ---------- Ambient depth particles ----------
    const pCount = isMobile ? 160 : 360;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    const speeds = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      speeds[i] = 0.08 + Math.random() * 0.18;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffcb60,
      size: 0.018,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // ---------- Lighting (subtle key + rim) ----------
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);
    const key = new THREE.PointLight(0xffa500, 1.4, 18);
    key.position.set(4, 3, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x7a3076, 1.1, 18);
    rim.position.set(-4, -2, 4);
    scene.add(rim);

    // ---------- Interaction state ----------
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      target.x = x * 0.25;
      target.y = -y * 0.18;
    };
    if (!isMobile) window.addEventListener("mousemove", onMove, { passive: true });

    // ---------- Resize ----------
    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // ---------- Animate ----------
    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      const t = clock.getElapsedTime();
      sphereMat.uniforms.uTime.value = t;

      // smooth parallax
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;

      // base slow auto-rotation + interaction
      sphere.rotation.y = t * 0.12 + current.x;
      sphere.rotation.x = Math.sin(t * 0.18) * 0.15 + current.y;
      sphere.position.x = current.x * 0.4;
      sphere.position.y = current.y * 0.3;

      // particles slow drift upward
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        pos[i * 3 + 1] += speeds[i] * 0.005;
        if (pos[i * 3 + 1] > 4.5) pos[i * 3 + 1] = -4.5;
      }
      pGeo.attributes.position.needsUpdate = true;
      points.rotation.y = t * 0.02 + current.x * 0.3;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    // Lazy start on next frame to avoid blocking initial paint
    raf = requestAnimationFrame(tick);

    // Pause when tab hidden
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        clock.start();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      sphereGeo.dispose();
      sphereMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={`absolute inset-0 ${className}`}
      data-testid="hero-3d"
    />
  );
}
