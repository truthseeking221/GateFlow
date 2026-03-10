import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function usePipelineWebGL() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
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

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.015);

        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
        camera.position.set(0, 0, 40);

        const particleCount = 400;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const speeds: number[] = [];

        const colorEmerald = new THREE.Color('#4ade80');
        const colorWhite = new THREE.Color('#ffffff');

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            const yOffset = (Math.random() - 0.5);
            positions[i * 3 + 1] = yOffset * 15 * (Math.random() * 0.5 + 0.5);
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

            speeds.push(0.1 + Math.random() * 0.4);

            const mixedColor = Math.random() > 0.5 ? colorEmerald : colorWhite;
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create a circular texture for particles programmatically
        const createCircleTexture = () => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 64;
            tempCanvas.height = 64;
            const context = tempCanvas.getContext('2d');
            if (context) {
                const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
                gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                context.fillStyle = gradient;
                context.fillRect(0, 0, 64, 64);
            }
            const texture = new THREE.CanvasTexture(tempCanvas);
            return texture;
        };

        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            map: createCircleTexture(),
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        const lineMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending
        });

        const linesGroup = new THREE.Group();
        scene.add(linesGroup);

        const createTrail = (length: number) => {
            const points = [];
            let currentX = -50;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 20;

            points.push(new THREE.Vector3(currentX, y, z));
            points.push(new THREE.Vector3(currentX + length, y, z));

            const geo = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geo, lineMat);

            return { mesh: line, speed: 0.3 + Math.random() * 0.4 };
        };

        const trails = Array.from({ length: 20 }, () => createTrail(15 + Math.random() * 30));
        trails.forEach(t => linesGroup.add(t.mesh));

        let animationId: number;
        let time = 0;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            resizeRendererToDisplaySize();
            if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            time += 0.01;

            const pPositions = particles.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                pPositions[i * 3] += speeds[i];

                if (pPositions[i * 3] > 60) {
                    pPositions[i * 3] = -60;
                    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;

            trails.forEach(t => {
                t.mesh.position.x += t.speed;
                if (t.mesh.position.x > 110) {
                    t.mesh.position.x = -110;
                }
            });

            camera.position.y = Math.sin(time * 0.5) * 2;
            camera.position.x = Math.cos(time * 0.3) * 1;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            scene.clear();
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            lineMat.dispose();
        };
    }, []);

    return canvasRef;
}
