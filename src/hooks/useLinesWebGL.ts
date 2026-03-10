import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useLinesWebGL() {
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
        scene.fog = new THREE.FogExp2(0x000000, 0.01);

        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        camera.position.set(0, 5, 20);
        camera.lookAt(0, 5, 0);

        const linesGroup = new THREE.Group();
        scene.add(linesGroup);

        const numLines = 50;
        const lineGeo = new THREE.CylinderGeometry(0.01, 0.01, 1, 4);
        lineGeo.rotateX(Math.PI / 2); // align Z

        const lineMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#4ade80'),
            transparent: true,
            opacity: 0.2, // Subtle
            blending: THREE.AdditiveBlending
        });

        const linesData: { mesh: THREE.Mesh, speed: number, length: number }[] = [];

        for (let i = 0; i < numLines; i++) {
            const mesh = new THREE.Mesh(lineGeo, lineMat);

            const x = (Math.random() - 0.5) * 80;
            const y = (Math.random() - 0.5) * 40 + 5;
            const z = (Math.random() - 0.5) * 40;
            const length = 5 + Math.random() * 20;

            mesh.position.set(x, y, z);
            mesh.scale.set(1, 1, length);

            linesGroup.add(mesh);
            linesData.push({ mesh, speed: 0.5 + Math.random() * 1.5, length });
        }

        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            resizeRendererToDisplaySize();
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

            for (let i = 0; i < numLines; i++) {
                const data = linesData[i];
                // fall downwards vertically
                data.mesh.position.y -= data.speed * 0.1;
                data.mesh.rotation.x = -Math.PI / 2; // Look down

                if (data.mesh.position.y < -20) {
                    data.mesh.position.y = 30 + Math.random() * 20;
                    data.mesh.position.x = (Math.random() - 0.5) * 80;
                    data.mesh.position.z = (Math.random() - 0.5) * 40;
                }
            }

            const time = performance.now() * 0.001;
            camera.position.x = Math.sin(time * 0.05) * 2;
            camera.lookAt(0, 5, 0);

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            scene.clear();
            renderer.dispose();
            lineGeo.dispose();
            lineMat.dispose();
        };
    }, []);

    return canvasRef;
}
