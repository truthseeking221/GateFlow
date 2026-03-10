import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useGlobeWebGL() {
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
        scene.fog = new THREE.FogExp2(0x000000, 0.02);

        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
        camera.position.set(0, 0, 45); // Move camera back

        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        const radius = 14;
        const colorEmerald = new THREE.Color('#4ade80');
        const colorWhite = new THREE.Color('#ffffff');

        // 1. Globe wireframe (latitude/longitude lines)
        const globeGeo = new THREE.SphereGeometry(radius, 40, 40);
        const globeMat = new THREE.LineBasicMaterial({
            color: colorWhite,
            transparent: true,
            opacity: 0.1, // Increased brightness
            blending: THREE.AdditiveBlending
        });
        const globeWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(globeGeo),
            globeMat
        );
        globeGroup.add(globeWireframe);

        // Add a solid black core to hide back part slightly
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.98, 32, 32), coreMat);
        globeGroup.add(coreMesh);

        // 2. Nodes on the surface
        const numNodes = 250;
        const nodeGeo = new THREE.BufferGeometry();
        const nodePos = new Float32Array(numNodes * 3);
        const nodeData: { x: number, y: number, z: number, isActive: boolean, isHub: boolean }[] = [];

        for (let i = 0; i < numNodes; i++) {
            // Fibonacci sphere distribution for even spread
            const phi = Math.acos(-1 + (2 * i) / numNodes);
            const theta = Math.sqrt(numNodes * Math.PI) * phi;

            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);

            nodePos[i * 3] = x;
            nodePos[i * 3 + 1] = y;
            nodePos[i * 3 + 2] = z;

            const isHub = Math.random() > 0.95;
            const isActive = isHub || Math.random() > 0.7;
            nodeData.push({ x, y, z, isActive, isHub });
        }
        nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));

        // Active nodes (emerald)
        const activeNodePos = [];
        const hubNodePos = [];
        for (let i = 0; i < numNodes; i++) {
            if (nodeData[i].isHub) {
                hubNodePos.push(nodeData[i].x, nodeData[i].y, nodeData[i].z);
            } else if (nodeData[i].isActive) {
                activeNodePos.push(nodeData[i].x, nodeData[i].y, nodeData[i].z);
            }
        }

        const activeNodeGeo = new THREE.BufferGeometry();
        activeNodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(activeNodePos, 3));
        const activeNodeMat = new THREE.PointsMaterial({
            color: colorWhite,
            size: 0.2,
            transparent: true,
            opacity: 0.8, // Increased brightness
            blending: THREE.AdditiveBlending
        });
        const activeNodes = new THREE.Points(activeNodeGeo, activeNodeMat);
        globeGroup.add(activeNodes);

        const hubNodeGeo = new THREE.BufferGeometry();
        hubNodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(hubNodePos, 3));
        const hubNodeMat = new THREE.PointsMaterial({
            color: colorEmerald,
            size: 0.6,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });
        const hubNodes = new THREE.Points(hubNodeGeo, hubNodeMat);
        globeGroup.add(hubNodes);

        // All nodes (faint white)
        const allNodeMat = new THREE.PointsMaterial({
            color: colorWhite,
            size: 0.1,
            transparent: true,
            opacity: 0.4, // Increased brightness
            blending: THREE.AdditiveBlending
        });
        const allNodes = new THREE.Points(nodeGeo, allNodeMat);
        globeGroup.add(allNodes);

        // 3. Arcs connecting nodes
        const arcGroup = new THREE.Group();
        globeGroup.add(arcGroup);

        const activeIndices = nodeData.map((n, i) => n.isActive ? i : -1).filter(i => i !== -1);

        for (let i = 0; i < activeIndices.length; i++) {
            for (let j = i + 1; j < activeIndices.length; j++) {
                const nodeA = nodeData[activeIndices[i]];
                const nodeB = nodeData[activeIndices[j]];

                // More likely to connect if one is a hub
                const connectionChance = (nodeA.isHub || nodeB.isHub) ? 0.90 : 0.98;

                if (Math.random() > connectionChance) {
                    const p1 = new THREE.Vector3(nodeA.x, nodeA.y, nodeA.z);
                    const p2 = new THREE.Vector3(nodeB.x, nodeB.y, nodeB.z);

                    const distance = p1.distanceTo(p2);
                    // Only connect if distance is reasonable
                    if (distance > radius * 0.4 && distance < radius * 1.5) {
                        const midNode = p1.clone().add(p2).multiplyScalar(0.5);
                        midNode.normalize().multiplyScalar(radius + distance * 0.25); // bump curve height based on distance

                        const curve = new THREE.QuadraticBezierCurve3(p1, midNode, p2);
                        const points = curve.getPoints(20);
                        const geometry = new THREE.BufferGeometry().setFromPoints(points);

                        const isHubConnection = nodeA.isHub || nodeB.isHub;

                        const material = new THREE.LineBasicMaterial({
                            color: isHubConnection ? colorEmerald : colorWhite,
                            transparent: true,
                            opacity: isHubConnection ? 0.6 : 0.15, // Increased brightness
                            blending: THREE.AdditiveBlending
                        });

                        const arc = new THREE.Line(geometry, material);
                        arcGroup.add(arc);
                    }
                }
            }
        }

        // Place globe on the right edge so it clips nicely
        globeGroup.position.x = 20;
        globeGroup.position.y = 0;
        globeGroup.rotation.z = Math.PI / 8; // tilt a bit

        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            resizeRendererToDisplaySize();
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

            const time = performance.now() * 0.0005;

            // Rotate globe
            globeGroup.rotation.y = time * 0.15;

            // Subtle camera movement
            camera.position.y = Math.sin(time * 0.5) * 1.5;
            camera.position.x = Math.cos(time * 0.3) * 1.0;
            camera.lookAt(globeGroup.position.x * 0.3, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            scene.clear();
            renderer.dispose();
            globeGeo.dispose();
            globeMat.dispose();
            nodeGeo.dispose();
            activeNodeGeo.dispose();
            allNodeMat.dispose();
            hubNodeMat.dispose();
        };
    }, []);

    return canvasRef;
}
