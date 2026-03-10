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
        resizeRendererToDisplaySize();

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.005); // Deeper fog to cover the horizon

        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 500);
        camera.position.set(0, 5, 0); // Position slightly above the grid
        camera.lookAt(0, 5, -100);

        const colorCyan = new THREE.Color('#06b6d4');

        // Infinite Grid moving towards camera (Warp Speed / Digital Landscape feel)
        const gridGeo = new THREE.PlaneGeometry(200, 1000, 40, 200);

        // Displace the grid z-positions to make it look like a landscape or wave
        const posAttr = gridGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            // Add some gentle sine wave hills to the grid
            const z = Math.sin(x * 0.1) * 3 + Math.cos(y * 0.05) * 5;
            posAttr.setZ(i, z);
        }
        gridGeo.computeVertexNormals();

        // Tăng opacity của lưới lên một chút để tạo cảm giác dày & rõ rệt hơn
        const gridMat = new THREE.MeshBasicMaterial({
            color: colorCyan,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });

        // We need an array of grids to seamlessly loop
        const gridGroup = new THREE.Group();
        gridGroup.rotation.x = -Math.PI / 2; // Lay flat
        scene.add(gridGroup);

        const grid1 = new THREE.Mesh(gridGeo, gridMat);
        grid1.position.z = -500;
        gridGroup.add(grid1);

        const grid2 = new THREE.Mesh(gridGeo, gridMat);
        grid2.position.z = 500;
        gridGroup.add(grid2);

        // Warp lines (Light speed streaks)
        // Để làm các đường line dày dặn hơn (thay vì phụ thuộc vào WebGL render 1px line render),
        // mình sử dụng hình trụ (Cylinder) trải dài để nó có ĐỘ DÀY thực sự trong không gian 3D.
        const streaksCount = 150;
        const streaksGroup = new THREE.Group();
        scene.add(streaksGroup);

        const streakGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 4); // Thinner line
        streakGeo.rotateX(Math.PI / 2); // align along Z axis
        const streakMat = new THREE.MeshBasicMaterial({
            color: colorCyan,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });

        const streaksData: { mesh: THREE.Mesh, speed: number }[] = [];

        for (let i = 0; i < streaksCount; i++) {
            const mesh = new THREE.Mesh(streakGeo, streakMat);

            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() * 40) + 2; // Above the grid
            const z = -400 - Math.random() * 400; // Far away
            const length = 20 + Math.random() * 40; // Length of streak

            mesh.position.set(x, y, z);
            mesh.scale.set(1, 1, length);

            streaksGroup.add(mesh);
            streaksData.push({ mesh, speed: 2 + Math.random() * 4 });
        }

        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            resizeRendererToDisplaySize();
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

            // Move the grid towards the camera
            const speed = 1.5;
            gridGroup.position.z += speed;

            // Loop the grid seamlessly
            if (gridGroup.position.z > 500) {
                gridGroup.position.z = 0;
            }

            // Animate streaks rushing past
            for (let i = 0; i < streaksCount; i++) {
                const data = streaksData[i];
                data.mesh.position.z += data.speed * 2; // Moving fast towards camera

                if (data.mesh.position.z > 50) { // Passed the camera
                    data.mesh.position.z = -400 - Math.random() * 200;
                    data.mesh.position.x = (Math.random() - 0.5) * 100;
                    data.mesh.position.y = (Math.random() * 40) + 2;
                }
            }

            // Optional subtle camera sway for dynamics
            const time = performance.now() * 0.001;
            camera.rotation.z = Math.sin(time * 0.5) * 0.02;

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            scene.clear();
            renderer.dispose();
            gridGeo.dispose();
            gridMat.dispose();
            streakGeo.dispose();
            streakMat.dispose();
        };
    }, []);

    return canvasRef;
}
