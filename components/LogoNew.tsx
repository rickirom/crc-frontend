'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
// Icons
import { Play, Pause } from 'lucide-react';

const ASCII_CHARS = ' .:-+=*rR';

export default function LogoNew() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(true);
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    renderer.setClearColor(0x000000);

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
        color: 0xffffff,
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // ASCII rendering
    const asciiWidth = 75;
    const asciiHeight = 75;
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '7px monospace';
    ctx.fillStyle = 'white';

    function renderToASCII() {
      if (!mesh || !ctx || !offscreenCtx) return;
  
      // Render 3D scene into WebGL canvas
      renderer.render(scene, camera);
  
      // Copy WebGL canvas → 2D canvas
      offscreenCtx.drawImage(renderer.domElement, 0, 0);
  
      // Now safely read pixels
      const imageData = offscreenCtx.getImageData(0, 0, 800, 600);
  
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
  
      const charWidth = canvas.width / asciiWidth;
      const charHeight = canvas.height / asciiHeight;
  
      for (let y = 0; y < asciiHeight; y++) {
        for (let x = 0; x < asciiWidth; x++) {
          const pixelX = Math.floor((x / asciiWidth) * 800);
          const pixelY = Math.floor((y / asciiHeight) * 600);
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
        // Complete rotation in 30 seconds (2π radians in 30s = π/15 per second)
        // At 60fps, that's π/900 per frame
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
    
    // Cleanup
    return () => {
      renderer.dispose();
      scene.clear();
    };
  }, []); // Empty dependency array - only run once on mount

  return (
    <div ref={containerRef} className="bg-black w-full flex flex-col items-center justify-center gap-4 p-4">
      <div className='w-[50%] min-w-[300px]'>
        <button
          onClick={() => {
            const newValue = !isPlayingRef.current;
            setIsPlaying(newValue);
            isPlayingRef.current = newValue;
          }}
          className="w-8 h-8 pb-[2px] bg-black text-white border border-gray-500 rounded hover:bg-gray-400 hover:text-black transition-colors">
          {isPlaying ? <Pause color="#6a7282" strokeWidth={1.5} className="inline-block w-5 h-5" /> : <Play color="#6a7282" strokeWidth={1.5}  className="inline-block w-5 h-5" />}
        </button>
      </div>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400}
        className="bg-black cursor-grab active:cursor-grabbing"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}