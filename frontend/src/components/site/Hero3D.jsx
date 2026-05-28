import { useEffect, useRef, useState, lazy, Suspense } from "react";
import * as THREE from "three";

// Optional: Spline scene (if user publishes a custom scene, drop URL in env)
const SPLINE_SCENE_URL = process.env.REACT_APP_SPLINE_SCENE_URL || "";
const SplineScene = lazy(() => import("@splinetool/react-spline"));

/**
 * Subtle premium 3D background.
 * - If REACT_APP_SPLINE_SCENE_URL is set, loads a Spline scene
 * - Otherwise renders a custom Three.js shader sphere + ambient particles
 * - Lazy-mounted, mobile-aware, reduced-motion aware
 */
export default function Hero3D({ className = "" }) {
  const mountRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // ---------- Three.js fallback scene ----------
  useEffect(() => {
    if (SPLINE_SCENE_URL || reduced) return;
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const w = container.clientWidth;
    const h = container.clientHeight;

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

    // Distorted signature sphere
    const sphereGeo = new THREE.IcosahedronGeometry(1.75, isMobile ? 4 : 6);
    const sphereMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(0xffa500) },
        uColorB: { value: new THREE.Color(0x7a3076) },
        uColorC: { value: new THREE.Color(0x0a0a0c) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float uTime;
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
          vec3 viewDir = normalize(cameraPosition - vPos);
          float fres = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.2);
          float t = (vNormal.y + 1.0) * 0.5;
          vec3 base = mix(uColorB, uColorA, t);
          base = mix(base, uColorC, 0.55);
          vec3 col = mix(base, uColorA, fres * 0.85);
          col += uColorA * 0.06 * sin(uTime * 0.9);
          float alpha = 0.55 + fres * 0.35;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Ambient particles
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

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.PointLight(0xffa500, 1.4, 18);
    key.position.set(4, 3, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x7a3076, 1.1, 18);
    rim.position.set(-4, -2, 4);
    scene.add(rim);

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      target.x = x * 0.25;
      target.y = -y * 0.18;
    };
    if (!isMobile) window.addEventListener("mousemove", onMove, { passive: true });

    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      const t = clock.getElapsedTime();
      sphereMat.uniforms.uTime.value = t;
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;
      sphere.rotation.y = t * 0.12 + current.x;
      sphere.rotation.x = Math.sin(t * 0.18) * 0.15 + current.y;
      sphere.position.x = current.x * 0.4;
      sphere.position.y = current.y * 0.3;
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
    raf = requestAnimationFrame(tick);

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
  }, [reduced]);

  if (reduced) return null;

  // Spline branch
  if (SPLINE_SCENE_URL) {
    return (
      <div
        aria-hidden
        className={`absolute inset-0 overflow-hidden ${className}`}
        data-testid="hero-3d"
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <SplineScene scene={SPLINE_SCENE_URL} style={{ width: "100%", height: "100%" }} />
        </Suspense>
      </div>
    );
  }

  // Three.js branch
  return (
    <div
      ref={mountRef}
      aria-hidden
      className={`absolute inset-0 ${className}`}
      data-testid="hero-3d"
    />
  );
}
