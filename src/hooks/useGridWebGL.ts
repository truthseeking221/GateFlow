import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useGridWebGL() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const resizeRendererToDisplaySize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const width = parent.clientWidth;
            const height = parent.clientHeight;
            if (canvas.width !== width || canvas.height !== height) {
                renderer.setSize(width, height, false);
            }
        };
        resizeRendererToDisplaySize();

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.05);

        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        camera.position.set(0, 5, 20);
        camera.lookAt(0, 0, 0);

        const gridGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);

        const gridMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.03
        });

        const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
        gridMesh.rotation.x = -Math.PI / 2;
        scene.add(gridMesh);

        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            resizeRendererToDisplaySize();
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

            const time = performance.now() * 0.001;

            gridMesh.position.z = (time * 0.5) % 2; // subtle panning

            // camera subtle sway
            camera.position.x = Math.sin(time * 0.1) * 2;
            camera.position.y = 5 + Math.cos(time * 0.2) * 1;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            scene.clear();
            renderer.dispose();
            gridGeometry.dispose();
            gridMaterial.dispose();
        };
    }, []);

    return canvasRef;
}
