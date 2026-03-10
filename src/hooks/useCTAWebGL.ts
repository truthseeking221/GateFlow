import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useCTAWebGL() {
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
        scene.fog = new THREE.FogExp2(0x000000, 0.008);

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 0, 0);

        const colorEmerald = new THREE.Color('#4ade80');
        const colorWhite = new THREE.Color('#ffffff');

        const portalGroup = new THREE.Group();
        scene.add(portalGroup);
        portalGroup.position.z = -80; // Push back into the scene
        portalGroup.rotation.x = Math.PI * 0.05; // Slightly tilt towards camera

        // --- 1. The Gate Rings (Concentric Particle Rings) ---
        const ringCount = 12;
        const rings: { mesh: THREE.Points, speed: number }[] = [];

        for (let i = 0; i < ringCount; i++) {
            const particlesPerRing = 300 + i * 100;
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(particlesPerRing * 3);
            const radius = 8 + i * 4.5;
            const colors = new Float32Array(particlesPerRing * 3);

            for (let j = 0; j < particlesPerRing; j++) {
                const theta = (j / particlesPerRing) * Math.PI * 2;
                const r = radius + (Math.random() - 0.5) * 3;
                const z = (Math.random() - 0.5) * 5 - (i * 2); // Deeper as it gets wider

                pos[j * 3] = Math.cos(theta) * r;
                pos[j * 3 + 1] = Math.sin(theta) * r;
                pos[j * 3 + 2] = z;

                // Inner rings are greener, outer rings fade to white
                const mixRatio = Math.max(0, 1 - (i / ringCount));
                const mixedColor = new THREE.Color().lerpColors(colorWhite, colorEmerald, mixRatio);

                // Add some random variation
                if (Math.random() > 0.8) {
                    mixedColor.setHex(0xffffff);
                }

                colors[j * 3] = mixedColor.r;
                colors[j * 3 + 1] = mixedColor.g;
                colors[j * 3 + 2] = mixedColor.b;
            }

            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const makeCircleTexture = () => {
                const c = document.createElement('canvas');
                c.width = 32; c.height = 32;
                const ctx = c.getContext('2d');
                if (ctx) {
                    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
                    grad.addColorStop(0, 'rgba(255,255,255,1)');
                    grad.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, 32, 32);
                }
                return new THREE.CanvasTexture(c);
            };

            const mat = new THREE.PointsMaterial({
                size: 0.6 + Math.random() * 0.5,
                vertexColors: true,
                map: makeCircleTexture(),
                transparent: true,
                opacity: 0.8 - (i * 0.05), // fade out
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const ring = new THREE.Points(geo, mat);
            // Alternate rotation directions
            const speed = (i % 2 === 0 ? 1 : -1) * (0.001 + Math.random() * 0.002);
            rings.push({ mesh: ring, speed });
            portalGroup.add(ring);
        }

        // --- 2. Data Beams (Warp streaks pulling towards center) ---
        const beamCount = 100;
        const beamGroup = new THREE.Group();
        portalGroup.add(beamGroup);

        const beamGeo = new THREE.CylinderGeometry(0.02, 0.05, 1, 4);
        beamGeo.rotateX(Math.PI / 2);
        const beamMat = new THREE.MeshBasicMaterial({
            color: colorEmerald,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });

        const beams: { mesh: THREE.Mesh, speed: number, radius: number, theta: number }[] = [];

        for (let i = 0; i < beamCount; i++) {
            const mesh = new THREE.Mesh(beamGeo, beamMat);
            const radius = 10 + Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            const zLength = 10 + Math.random() * 30;
            const z = Math.random() * 100; // Start in front of the portal

            mesh.scale.set(1, 1, zLength);
            mesh.position.set(Math.cos(theta) * radius, Math.sin(theta) * radius, z);

            beamGroup.add(mesh);
            beams.push({ mesh, speed: 0.5 + Math.random() * 1.5, radius, theta });
        }


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

            // Rotate concentric rings slowly
            rings.forEach(r => {
                r.mesh.rotation.z += r.speed;
            });

            // Pulse the portal group slightly
            portalGroup.scale.setScalar(1 + Math.sin(time * 0.5) * 0.02);

            // Animate data beams pulling into the portal (moving away from camera in Z)
            beams.forEach(b => {
                b.mesh.position.z -= b.speed;
                if (b.mesh.position.z < -20) {
                    // Reset to front
                    b.mesh.position.z = 100 + Math.random() * 50;
                    b.radius = 10 + Math.random() * 50;
                    b.theta = Math.random() * Math.PI * 2;
                    b.mesh.position.x = Math.cos(b.theta) * b.radius;
                    b.mesh.position.y = Math.sin(b.theta) * b.radius;
                }
            });

            // Gentle camera float
            camera.position.x = Math.sin(time * 0.2) * 2;
            camera.position.y = Math.cos(time * 0.15) * 2;
            camera.lookAt(0, 0, -80);

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            scene.clear();
            renderer.dispose();
            rings.forEach(r => {
                r.mesh.geometry.dispose();
                (r.mesh.material as THREE.Material).dispose();
            });
            beamGeo.dispose();
            beamMat.dispose();
        };
    }, []);

    return canvasRef;
}
