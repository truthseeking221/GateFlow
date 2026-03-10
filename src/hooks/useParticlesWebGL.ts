import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useParticlesWebGL() {
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
        scene.fog = new THREE.FogExp2(0x000000, 0.002);

        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.z = 50;

        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities: { x: number, y: number, z: number }[] = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

            velocities.push({
                x: (Math.random() - 0.5) * 0.05,
                y: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.05
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.15,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            resizeRendererToDisplaySize();
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

            const pCount = particleCount;
            const pPositions = particles.geometry.attributes.position.array;

            for (let i = 0; i < pCount; i++) {
                pPositions[i * 3] += velocities[i].x;
                pPositions[i * 3 + 1] += velocities[i].y;
                pPositions[i * 3 + 2] += velocities[i].z;

                if (pPositions[i * 3] > 100 || pPositions[i * 3] < -100) velocities[i].x *= -1;
                if (pPositions[i * 3 + 1] > 100 || pPositions[i * 3 + 1] < -100) velocities[i].y *= -1;
                if (pPositions[i * 3 + 2] > 50 || pPositions[i * 3 + 2] < -50) velocities[i].z *= -1;
            }

            particles.geometry.attributes.position.needsUpdate = true;

            particles.rotation.y += 0.0005;
            particles.rotation.x += 0.0002;

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            scene.clear();
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return canvasRef;
}
