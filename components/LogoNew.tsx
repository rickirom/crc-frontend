'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// Icons
import { Play, Pause, RefreshCcw } from 'lucide-react';

const ASCII_CHARS = ' .:+*rR%@#';
const MODEL_ROTATION_SPEED = 0.377; // radians/sec, matches the previous per-frame speed at ~60fps

export default function LogoNew() {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(true);
  const resetRotationRef = useRef<(() => void) | null>(null);
  const [size, setSize] = useState(400);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const background_color = '#0a0a0a';
    const foreground_color = '#ffffff';

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(background_color));

    // ASCII effect renders into its own DOM element (a <table>), which we
    // mount in place of a plain canvas. It downsamples the WebGL frame with
    // drawImage (proper area-averaging) instead of nearest-neighbor pixel
    // picking, which is what made the old renderer look noisy/blocky.

    const reso = window.innerWidth < 500 ? 0.35 : 0.25;

    const effect = new AsciiEffect(renderer, ASCII_CHARS, { resolution: reso, invert: true });
    effect.domElement.style.color = foreground_color;
    effect.domElement.style.backgroundColor = background_color;

    // AsciiEffect hardcodes text-align:left on its internal <table> inside
    // setSize(), and at this resolution the character grid ends up narrower
    // than the declared cell width, so the left alignment reads as a shift.
    // Re-center it after every setSize() call.
    function centerAsciiTable() {
      const table = effect.domElement.querySelector('table');
      if (table) table.style.textAlign = 'center';
    }

    effect.setSize(size, size);
    centerAsciiTable();
    mount.appendChild(effect.domElement);

    // Orbit controls drive mouse-drag / touch-drag rotation around the model.
    const controls = new OrbitControls(camera, effect.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.5;

    let mesh: THREE.Mesh | null = null;
    let isDragging = false;
    let needsRender = true;
    const clock = new THREE.Clock();

    function requestRender() {
      needsRender = true;
    }

    controls.addEventListener('change', requestRender);
    controls.addEventListener('start', () => {
      isDragging = true;
    });
    controls.addEventListener('end', () => {
      isDragging = false;
    });

    // Lighting: a single point light + flat shading gives each STL facet its
    // own brightness, which is what produces good contrast between ASCII
    // characters instead of the old smooth-shaded gradient look.
    const pointLight = new THREE.PointLight(0xffffff, 1, 0, 0);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    // Load STL
    const loader = new STLLoader();
    loader.load('/LogoRR.stl', (geometry) => {
      geometry.rotateX(-Math.PI / 2);
      geometry.center();
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        color: foreground_color,
        flatShading: true,
        side: THREE.DoubleSide,
      });

      mesh = new THREE.Mesh(geometry, material);

      // Scale to fit in view
      const box = new THREE.Box3().setFromObject(mesh);
      const boxSize = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
      const scale = 8 / maxDim;
      mesh.scale.setScalar(scale);

      scene.add(mesh);
      requestRender();
    });

    // Animation loop
    let rafId: number;
    function animate() {
      rafId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);

      if (mesh && !isDragging && isPlayingRef.current) {
        mesh.rotation.y += MODEL_ROTATION_SPEED * delta;
        requestRender();
      }

      if (controls.update()) {
        requestRender();
      }

      if (needsRender) {
        needsRender = false;
        effect.render(scene, camera);
      }
    }

    animate();

    // Screen size stuff
    const updateSize = () => {
      const newSize = window.innerWidth < 500 ? 300 : 450;
      setSize(newSize);
      effect.setSize(newSize, newSize);
      centerAsciiTable();
      requestRender();
    };

    updateSize(); // run once on mount
    window.addEventListener('resize', updateSize);

    resetRotationRef.current = () => {
      mesh?.rotation.set(0, 0, 0);
      camera.position.set(0, 0, 10);
      controls.target.set(0, 0, 0);
      controls.update();
      requestRender();
    };

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateSize);
      controls.dispose();
      renderer.dispose();
      scene.clear();
      mount.removeChild(effect.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center justify-center gap-4 p-4">
      <div
        ref={mountRef}
        style={{ width: size, height: size }}
        className="cursor-grab active:cursor-grabbing"
      />
      <div className="w-full max-w-[700px] flex flex-row items-center justify-center gap-2">
        <button
          onClick={() => {
            const newValue = !isPlayingRef.current;
            setIsPlaying(newValue);
            isPlayingRef.current = newValue;
          }}
          className="w-8 h-8 pb-[2px] border border-gray-500 rounded hover:bg-gray-400 transition-colors">
          {isPlaying ? <Pause color="#6a7282" strokeWidth={1.5} className="inline-block w-5 h-5" /> : <Play color="#6a7282" strokeWidth={1.5} className="inline-block w-5 h-5" />}
        </button>
        <button
          onClick={() => {
            // reset rotation
            isPlayingRef.current = false;
            setIsPlaying(false);
            resetRotationRef.current?.();
          }}
          className="w-8 h-8 pb-[2px] border border-gray-500 rounded hover:bg-gray-400 transition-colors">
          {<RefreshCcw color="#6a7282" strokeWidth={1.5} className="inline-block w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
