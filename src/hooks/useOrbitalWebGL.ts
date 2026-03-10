import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useOrbitalWebGL() {
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
        resizeRendererToDisplaySize();

        const scene = new THREE.Scene();
        // Fog to fade out far edges smoothly
        scene.fog = new THREE.FogExp2(0x000000, 0.035);

        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        camera.position.set(0, 4, 16);
        camera.lookAt(0, 0, 0);

        const colorEmerald = new THREE.Color('#4ade80');
        const colorWhite = new THREE.Color('#ffffff');

        // 1. Central "Data Core" (High poly spherical wireframe)
        const coreGeometry = new THREE.IcosahedronGeometry(2.5, 3);
        const coreWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(coreGeometry),
            new THREE.LineBasicMaterial({ color: colorWhite, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending })
        );
        scene.add(coreWireframe);

        // Solid dark core inside to block background lines & add depth
        const solidCore = new THREE.Mesh(
            new THREE.IcosahedronGeometry(2.48, 3),
            new THREE.MeshBasicMaterial({ color: 0x000000 })
        );
        scene.add(solidCore);

        // Core glow points at vertices
        const pointsMat = new THREE.PointsMaterial({
            color: colorEmerald,
            size: 0.04,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        const corePoints = new THREE.Points(coreGeometry, pointsMat);
        scene.add(corePoints);

        // 2. Complex Orbital Rings
        const ringsGroup = new THREE.Group();
        scene.add(ringsGroup);

        const ringCount = 4;
        const ringRadiuses = [4.5, 6.0, 7.5, 9.0];

        for (let i = 0; i < ringCount; i++) {
            const radius = ringRadiuses[i];
            const ringGeo = new THREE.TorusGeometry(radius, 0.01, 8, 128); // thinner
            const isMain = i === 1 || i === 3;

            const ringMat = new THREE.MeshBasicMaterial({
                color: colorWhite,
                transparent: true,
                opacity: isMain ? 0.08 : 0.03, // much more subtle
                blending: THREE.AdditiveBlending
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);

            // Random orientation for the orbital plane
            ringMesh.rotation.x = (Math.random() - 0.5) * Math.PI * 0.9;
            ringMesh.rotation.y = (Math.random() - 0.5) * Math.PI * 0.9;

            ringMesh.userData = {
                rx: (Math.random() - 0.5) * 0.0005, // slower
                ry: (Math.random() - 0.5) * 0.0005,
                rz: (Math.random() - 0.5) * 0.001,
            };

            ringsGroup.add(ringMesh);

            // Create a trail/dust effect on the ring using BufferGeometry
            const dustGeo = new THREE.BufferGeometry();
            const dustCount = 300; // fewer particles
            const pos = new Float32Array(dustCount * 3);
            for (let d = 0; d < dustCount; d++) {
                const t = Math.random() * Math.PI * 2;
                // Add tiny random spread to radius and y-axis to make it look like space dust
                const rOffset = radius + (Math.random() - 0.5) * 0.2; // tighter spread
                pos[d * 3] = Math.cos(t) * rOffset;
                pos[d * 3 + 1] = (Math.random() - 0.5) * 0.1;
                pos[d * 3 + 2] = Math.sin(t) * rOffset;
            }
            dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const dustMat = new THREE.PointsMaterial({
                color: isMain ? colorEmerald : colorWhite,
                size: 0.03,
                transparent: true,
                opacity: isMain ? 0.4 : 0.1,
                blending: THREE.AdditiveBlending
            });
            const dustMesh = new THREE.Points(dustGeo, dustMat);
            ringMesh.add(dustMesh);
        }

        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            resizeRendererToDisplaySize();
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

            const time = performance.now() * 0.001;

            // Smooth core rotations (slower)
            coreWireframe.rotation.y = time * 0.08;
            coreWireframe.rotation.x = time * 0.04;
            corePoints.rotation.y = time * 0.08;
            corePoints.rotation.x = time * 0.04;
            solidCore.rotation.y = time * 0.08;

            // Subtle pulse effect using scale on the particle core
            const pulse = 1 + Math.sin(time * 2) * 0.01;
            corePoints.scale.set(pulse, pulse, pulse);

            // Ring rotation
            ringsGroup.children.forEach((ring) => {
                ring.rotation.x += ring.userData.rx;
                ring.rotation.y += ring.userData.ry;
                ring.rotation.z += ring.userData.rz;
            });

            // Camera subtle floating to give weightless space feel
            camera.position.x = Math.sin(time * 0.1) * 1.0;
            camera.position.y = 4 + Math.sin(time * 0.15) * 0.3;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            scene.clear();
            renderer.dispose();
            // Free meshes to prevent memory leaks
            coreGeometry.dispose();
            pointsMat.dispose();
            // Optional: exhaustive dispose omitted.
        };
    }, []);

    return canvasRef;
}
