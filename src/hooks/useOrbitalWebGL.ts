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

        const colorCyan = new THREE.Color('#06b6d4');

        // 1. Central "Data Core" (High poly spherical wireframe)
        const coreGeometry = new THREE.IcosahedronGeometry(2.5, 3);
        const coreWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(coreGeometry),
            new THREE.LineBasicMaterial({ color: colorCyan, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending })
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
            color: colorCyan,
            size: 0.06,
            transparent: true,
            opacity: 0.8,
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
            const ringGeo = new THREE.TorusGeometry(radius, 0.015, 8, 128);
            const isMain = i === 1 || i === 3;

            const ringMat = new THREE.MeshBasicMaterial({
                color: isMain ? colorCyan : 0x334155,
                transparent: true,
                opacity: isMain ? 0.3 : 0.15,
                blending: THREE.AdditiveBlending
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);

            // Random orientation for the orbital plane
            ringMesh.rotation.x = (Math.random() - 0.5) * Math.PI * 0.9;
            ringMesh.rotation.y = (Math.random() - 0.5) * Math.PI * 0.9;

            ringMesh.userData = {
                rx: (Math.random() - 0.5) * 0.001,
                ry: (Math.random() - 0.5) * 0.001,
                rz: (Math.random() - 0.5) * 0.002,
            };

            ringsGroup.add(ringMesh);

            // Create a trail/dust effect on the ring using BufferGeometry
            const dustGeo = new THREE.BufferGeometry();
            const dustCount = 400; // lots of small particles forming the ring
            const pos = new Float32Array(dustCount * 3);
            for (let d = 0; d < dustCount; d++) {
                const t = Math.random() * Math.PI * 2;
                // Add tiny random spread to radius and y-axis to make it look like space dust
                const rOffset = radius + (Math.random() - 0.5) * 0.3;
                pos[d * 3] = Math.cos(t) * rOffset;
                pos[d * 3 + 1] = (Math.random() - 0.5) * 0.15;
                pos[d * 3 + 2] = Math.sin(t) * rOffset;
            }
            dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const dustMat = new THREE.PointsMaterial({
                color: isMain ? colorCyan : 0x64748b,
                size: 0.04,
                transparent: true,
                opacity: isMain ? 0.6 : 0.2,
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

            // Smooth core rotations
            coreWireframe.rotation.y = time * 0.15;
            coreWireframe.rotation.x = time * 0.08;
            corePoints.rotation.y = time * 0.15;
            corePoints.rotation.x = time * 0.08;
            solidCore.rotation.y = time * 0.15;

            // Subtle pulse effect using scale on the particle core
            const pulse = 1 + Math.sin(time * 3) * 0.015;
            corePoints.scale.set(pulse, pulse, pulse);

            // Ring rotation
            ringsGroup.children.forEach((ring) => {
                ring.rotation.x += ring.userData.rx;
                ring.rotation.y += ring.userData.ry;
                ring.rotation.z += ring.userData.rz;
            });

            // Camera subtle floating to give weightless space feel
            camera.position.x = Math.sin(time * 0.2) * 1.5;
            camera.position.y = 4 + Math.sin(time * 0.3) * 0.5;
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
