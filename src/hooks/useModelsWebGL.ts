import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useModelsWebGL() {
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
        scene.fog = new THREE.FogExp2(0x000000, 0.015);

        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
        camera.position.set(0, 5, 40);

        const colorCyan = new THREE.Color('#06b6d4');
        const colorGray = new THREE.Color('#374151');

        const networkGroup = new THREE.Group();
        scene.add(networkGroup);

        // Core glow (very subtle now)
        const glowGeo = new THREE.SphereGeometry(1.5, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({ color: colorCyan, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });
        const glowNode = new THREE.Mesh(glowGeo, glowMat);
        networkGroup.add(glowNode);

        // Outer "Model" Nodes
        const nodeCount = 200;
        const outerNodesGeo = new THREE.BufferGeometry();
        const outerNodesPos = new Float32Array(nodeCount * 3);
        const nodeData: { x: number, y: number, z: number, phaseX: number, phaseY: number, phaseZ: number, radius: number }[] = [];

        for (let i = 0; i < nodeCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / nodeCount);
            const theta = Math.sqrt(nodeCount * Math.PI) * phi;

            const radius = 15 + Math.random() * 25;

            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);

            outerNodesPos[i * 3] = x;
            outerNodesPos[i * 3 + 1] = y;
            outerNodesPos[i * 3 + 2] = z;

            nodeData.push({
                x, y, z,
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                phaseZ: Math.random() * Math.PI * 2,
                radius
            });
        }

        outerNodesGeo.setAttribute('position', new THREE.BufferAttribute(outerNodesPos, 3));
        const outerNodesMat = new THREE.PointsMaterial({
            color: colorCyan,
            size: 0.08, // Extremely small
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        const outerParticles = new THREE.Points(outerNodesGeo, outerNodesMat);
        networkGroup.add(outerParticles);

        // Faint connecting lines
        const linesGeo = new THREE.BufferGeometry();
        const linesPos = new Float32Array(nodeCount * 6);
        for (let i = 0; i < nodeCount; i++) {
            linesPos[i * 6] = 0;
            linesPos[i * 6 + 1] = 0;
            linesPos[i * 6 + 2] = 0;
            linesPos[i * 6 + 3] = nodeData[i].x;
            linesPos[i * 6 + 4] = nodeData[i].y;
            linesPos[i * 6 + 5] = nodeData[i].z;
        }
        linesGeo.setAttribute('position', new THREE.BufferAttribute(linesPos, 3));

        const linesMat = new THREE.LineBasicMaterial({
            color: colorGray,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending
        });
        const connectionLines = new THREE.LineSegments(linesGeo, linesMat);
        networkGroup.add(connectionLines);

        // Tiny floating data packets traversing the lines slowly
        const streamCount = 80;
        const streamsGeo = new THREE.BufferGeometry();
        const streamsPos = new Float32Array(streamCount * 3);
        const streamData: { targetNode: number, progress: number, speed: number, returning: boolean }[] = [];

        for (let i = 0; i < streamCount; i++) {
            streamData.push({
                targetNode: Math.floor(Math.random() * nodeCount),
                progress: Math.random(),
                speed: 0.001 + Math.random() * 0.002, // Very slow
                returning: Math.random() > 0.5
            });
            streamsPos[i * 3] = 0;
            streamsPos[i * 3 + 1] = 0;
            streamsPos[i * 3 + 2] = 0;
        }

        streamsGeo.setAttribute('position', new THREE.BufferAttribute(streamsPos, 3));
        const streamsMat = new THREE.PointsMaterial({
            color: colorCyan,
            size: 0.06, // Tiny
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const streamsParticles = new THREE.Points(streamsGeo, streamsMat);
        networkGroup.add(streamsParticles);

        let animationId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            resizeRendererToDisplaySize();
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

            const time = clock.getElapsedTime();

            // Slower network rotation
            networkGroup.rotation.y = time * 0.02;
            networkGroup.rotation.z = time * 0.01;

            const positions = outerParticles.geometry.attributes.position.array;
            const linePositions = connectionLines.geometry.attributes.position.array;

            // Subtle, slow, organic wobble for nodes
            for (let i = 0; i < nodeCount; i++) {
                const data = nodeData[i];

                // Slow sine/cosine drifting on all axes
                const nx = data.x + Math.sin(time * 0.2 + data.phaseX) * 2;
                const ny = data.y + Math.cos(time * 0.25 + data.phaseY) * 2;
                const nz = data.z + Math.sin(time * 0.3 + data.phaseZ) * 2;

                positions[i * 3] = nx;
                positions[i * 3 + 1] = ny;
                positions[i * 3 + 2] = nz;

                linePositions[i * 6 + 3] = nx;
                linePositions[i * 6 + 4] = ny;
                linePositions[i * 6 + 5] = nz;
            }
            outerParticles.geometry.attributes.position.needsUpdate = true;
            connectionLines.geometry.attributes.position.needsUpdate = true;

            // Slow data streams
            const sPositions = streamsParticles.geometry.attributes.position.array;
            for (let i = 0; i < streamCount; i++) {
                const sd = streamData[i];
                sd.progress += sd.speed;

                if (sd.progress > 1) {
                    sd.progress = 0;
                    sd.targetNode = Math.floor(Math.random() * nodeCount);
                    sd.returning = !sd.returning;
                }

                const t = sd.returning ? 1 - sd.progress : sd.progress;

                const targetX = positions[sd.targetNode * 3];
                const targetY = positions[sd.targetNode * 3 + 1];
                const targetZ = positions[sd.targetNode * 3 + 2];

                sPositions[i * 3] = targetX * t;
                sPositions[i * 3 + 1] = targetY * t;
                sPositions[i * 3 + 2] = targetZ * t;
            }
            streamsParticles.geometry.attributes.position.needsUpdate = true;

            // Subtle camera drifting
            camera.position.x = Math.sin(time * 0.1) * 2;
            camera.position.y = 5 + Math.cos(time * 0.15) * 1;
            camera.lookAt(0, 5, 0);

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            scene.clear();
            renderer.dispose();
            glowGeo.dispose();
            glowMat.dispose();
            outerNodesGeo.dispose();
            outerNodesMat.dispose();
            linesGeo.dispose();
            linesMat.dispose();
            streamsGeo.dispose();
            streamsMat.dispose();
        };
    }, []);

    return canvasRef;
}
