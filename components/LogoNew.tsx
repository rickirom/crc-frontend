'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
// Icons
import { Play, Pause, RefreshCcw } from 'lucide-react';

const ASCII_CHARS = ' rrRRRR';

export default function LogoNew() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(true);
  const resetRotationRef = useRef<(() => void) | null>(null);
  const [size, setSize] = useState(400);
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const background_color = '#0a0a0a';
    const foreground_color = '#ffffff';

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    renderer.setClearColor(new THREE.Color(background_color));

    // Right after creating the renderer
    const offscreen = document.createElement('canvas');
    offscreen.width = 800;
    offscreen.height = 600;
    const offscreenCtx = offscreen.getContext('2d');

    let mesh: THREE.Mesh | null = null;
    let autoRotationAngle = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let rotationX = 0;
    let rotationY = 0;
    let needsRender = true;

    // Load STL
    const loader = new STLLoader();
    loader.load('/LogoRR.stl', (geometry) => {
      geometry.rotateX(- Math.PI / 2);
      geometry.center();
      geometry.computeVertexNormals();

      const material = new THREE.MeshPhongMaterial({ 
        color: foreground_color,
        flatShading: false
      });
      
      mesh = new THREE.Mesh(geometry, material);
      
      // Scale to fit in view
      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 8 / maxDim;
      mesh.scale.setScalar(scale);
      
      scene.add(mesh);
      
      // Initial render when mesh loads
      needsRender = true;
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(foreground_color, 250/1000);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(foreground_color, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Initial canvas clear
    ctx.fillStyle = background_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    function renderToASCII() {
      if (!mesh || !ctx || !offscreenCtx) return;

      // Compute grid and font size dynamically from current canvas dimensions.
      // Target cell size (5.714px) and font/cell ratio (1.225) preserve the
      // desktop look exactly while scaling naturally to smaller screens.
      const cols = Math.round(canvas.width / 5.714);
      const rows = Math.round(canvas.height / 5.714);
      const charWidth = canvas.width / cols;
      const charHeight = canvas.height / rows;
      const fontSize = Math.round(charHeight * 1.225);

      // Render 3D scene into WebGL canvas
      renderer.render(scene, camera);

      // Copy WebGL canvas → 2D canvas
      offscreenCtx.drawImage(renderer.domElement, 0, 0);

      // Now safely read pixels
      const imageData = offscreenCtx.getImageData(0, 0, 800, 600);

      ctx.fillStyle = background_color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = foreground_color;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const pixelX = Math.floor((x / cols) * 800);
          const pixelY = Math.floor((y / rows) * 600);
          const pixelIndex = (pixelY * 800 + pixelX) * 4;

          const r = imageData.data[pixelIndex];
          const g = imageData.data[pixelIndex + 1];
          const b = imageData.data[pixelIndex + 2];
          const brightness = (r + g + b) / 3;

          const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
          const char = ASCII_CHARS[charIndex];

          ctx.fillText(char, x * charWidth, (y + 1) * charHeight);
        }
      }
    }

    // Mouse/Touch handlers
    function handleDragStart(clientX: number, clientY: number) {
      isDragging = true;
      lastMouseX = clientX;
      lastMouseY = clientY;
      
    }

    function handleDragMove(clientX: number, clientY: number) {
      if (!isDragging || !mesh) return;

      const deltaX = clientX - lastMouseX;
      const deltaY = clientY - lastMouseY;
      
      // Only update if there's actual movement
      if (deltaX !== 0 || deltaY !== 0) {
        rotationY += deltaX * 0.01;
        rotationX += deltaY * 0.01;
        
        mesh.rotation.y = rotationY;
        mesh.rotation.x = rotationX;
        
        needsRender = true;
      }
      
      lastMouseX = clientX;
      lastMouseY = clientY;
    }

    function handleDragEnd() {
      isDragging = false;
      autoRotationAngle = rotationY
    }

    // Mouse events
    canvas.addEventListener('mousedown', (e) => handleDragStart(e.clientX, e.clientY));
    canvas.addEventListener('mousemove', (e) => handleDragMove(e.clientX, e.clientY));
    canvas.addEventListener('mouseup', handleDragEnd);
    canvas.addEventListener('mouseleave', handleDragEnd);

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY);
    });
    
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    });
    
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleDragEnd();
    }); 

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      if (mesh && !isDragging && isPlayingRef.current) {
        // 2π radians in 30s = π/15 per second we'd have to know how many fps 
        autoRotationAngle += Math.PI / 500;

        rotationY = autoRotationAngle;
        mesh.rotation.y = rotationY;
        mesh.rotation.x = rotationX;
        needsRender = true;
      }

      // Only render if position has changed or initial render
      if (mesh && needsRender) {
        renderToASCII();
        needsRender = false;
      }
    }

    animate();

    // Screen size stuff
    const updateSize = () => {
      setSize(window.innerWidth < 500 ? 300 : 400);
      needsRender = true;
    };

    updateSize(); // run once on mount
    window.addEventListener('resize', updateSize);

    resetRotationRef.current = () => {
      rotationX = 0;
      rotationY = 0;
      autoRotationAngle = 0;
      if (mesh) {
        mesh.rotation.x = 0;
        mesh.rotation.y = 0;
      }
      needsRender = true;
    };
    
    // Cleanup
    return () => {
      renderer.dispose();
      scene.clear();
      window.removeEventListener('resize', updateSize);
    };
  }, []); // Empty dependency array - only run once on mount

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center justify-center gap-4 p-4">
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size}
        className="cursor-grab active:cursor-grabbing"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className='w-full max-w-[700px] flex flex-row items-center justify-center gap-2'>
        <button
          onClick={() => {
            const newValue = !isPlayingRef.current;
            setIsPlaying(newValue);
            isPlayingRef.current = newValue;
          }}
          className="w-8 h-8 pb-[2px] border border-gray-500 rounded hover:bg-gray-400 transition-colors">
          {isPlaying ? <Pause color="#6a7282" strokeWidth={1.5} className="inline-block w-5 h-5" /> : <Play color="#6a7282" strokeWidth={1.5}  className="inline-block w-5 h-5" />}
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