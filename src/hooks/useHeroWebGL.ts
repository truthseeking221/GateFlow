import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useHeroWebGL() {
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
        scene.fog = new THREE.FogExp2(0x000000, 0.003);

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 0, 180);

        const group = new THREE.Group();
        scene.add(group);

        // 1. Core central starfield (Abstract Galaxy / Radial Network)
        const particleCount = 1500;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorEmerald = new THREE.Color('#4ade80');
        const colorWhite = new THREE.Color('#ffffff');

        for (let i = 0; i < particleCount; i++) {
            // Distribute in a flat disk facing camera, matching Gateway SVG shape
            const r = 5 + Math.pow(Math.random(), 2) * 160;
            const theta = Math.random() * Math.PI * 2;
            const zDepth = (Math.random() - 0.5) * 40 * (1 - r / 160); // Plump at center, flat at edges

            positions[i * 3] = r * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(theta);
            positions[i * 3 + 2] = zDepth;

            const c = Math.random() > 0.85 ? colorEmerald : colorWhite;
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const createCircleTexture = () => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 32;
            tempCanvas.height = 32;
            const context = tempCanvas.getContext('2d');
            if (context) {
                const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                context.fillStyle = gradient;
                context.fillRect(0, 0, 32, 32);
            }
            return new THREE.CanvasTexture(tempCanvas);
        };

        const material = new THREE.PointsMaterial({
            size: 1.2,
            vertexColors: true,
            map: createCircleTexture(),
            transparent: true,
            opacity: 0.6,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        group.add(particles);

        // 2. Slow, giant orbital arcs mirroring the right diagram's rings
        const arcGroup = new THREE.Group();
        group.add(arcGroup);
        const arcMat = new THREE.LineBasicMaterial({
            color: colorWhite,
            transparent: true,
            opacity: 0.05,
            blending: THREE.AdditiveBlending
        });
        const arcMatEmerald = new THREE.LineBasicMaterial({
            color: colorEmerald,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });

        for (let i = 0; i < 15; i++) {
            const r = 20 + i * 10;
            const curve = new THREE.EllipseCurve(0, 0, r, r, 0, Math.PI * (0.3 + Math.random() * 1.5), false, 0);
            const pts = curve.getPoints(50);
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            const arc = new THREE.Line(geo, Math.random() > 0.7 ? arcMatEmerald : arcMat);
            arc.rotation.z = Math.random() * Math.PI * 2;
            arcGroup.add(arc);
        }

        let animationId: number;
        let time = 0;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            resizeRendererToDisplaySize();
            if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();

                // Dynamically shift the group to align with the right-side Gateway
                const isDesktop = canvas.clientWidth >= 1024;

                // Calculate physical width visible at z=0
                const vFov = (camera.fov * Math.PI) / 180;
                const visibleHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
                const visibleWidth = visibleHeight * camera.aspect;

                // Target right-center for desktop, bottom-center for mobile depending on layout
                // In HeroSection layout: lg:grid-cols-2. The right col is roughly at x = visibleWidth * 0.25
                const targetX = isDesktop ? visibleWidth * 0.23 : 0;
                const targetY = isDesktop ? 0 : -visibleHeight * 0.2; // Move down on mobile if stacked

                group.position.x += (targetX - group.position.x) * 0.05;
                group.position.y += (targetY - group.position.y) * 0.05;
            }

            time += 0.005;

            // Faint, slow rotation around Z axis (like a wheel)
            group.rotation.z = -time * 0.05;
            arcGroup.rotation.z = time * 0.1; // Counter rotation for arcs

            const positionsArray = particles.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                // Gently move particles inward/outward
                const idx = i * 3 + 2; // z depth
                positionsArray[idx] += Math.sin(time * 2 + i) * 0.02;
            }
            particles.geometry.attributes.position.needsUpdate = true;

            // Subtle camera drifting to give depth
            camera.position.x = Math.cos(time * 0.2) * 2;
            camera.position.y = Math.sin(time * 0.3) * 2;
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
            arcMat.dispose();
            arcMatEmerald.dispose();
        };
    }, []);

    return canvasRef;
}
