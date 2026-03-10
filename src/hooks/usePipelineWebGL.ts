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
        resizeRendererToDisplaySize();

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.015);

        const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 40);

        const particleCount = 400;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const speeds: number[] = [];
        const opacities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Horizontal spread from -50 to 50
            positions[i * 3] = (Math.random() - 0.5) * 100;

            // Vertical spread tightly clustered around center
            const yOffset = (Math.random() - 0.5);
            positions[i * 3 + 1] = yOffset * 15 * (Math.random() * 0.5 + 0.5);

            // Z spread
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

            // Speed for horizontal flow
            speeds.push(0.1 + Math.random() * 0.4);
            opacities[i] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

        // Custom shader material to make particles glow softly with different opacities
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color1: { value: new THREE.Color('#ffffff') },
                color2: { value: new THREE.Color('#4ade80') }
            },
            vertexShader: `
                attribute float aOpacity;
                varying float vOpacity;
                void main() {
                    vOpacity = aOpacity;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = (20.0 / -mvPosition.z); // Scale by distance
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                varying float vOpacity;
                void main() {
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    // Soft circular particle
                    float dist = length(coord);
                    if(dist > 0.5) discard;
                    
                    float alpha = smoothstep(0.5, 0.2, dist) * vOpacity;
                    
                    // Mix between white and emerald randomly per particle (using vOpacity as seed)
                    vec3 finalColor = mix(color1, color2, step(0.5, vOpacity));
                    gl_FragColor = vec4(finalColor, alpha * 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Add some subtle connecting lines trailing horizontally
        const lineMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.05,
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

            return { mesh: line, speed: 0.2 + Math.random() * 0.3, y, z };
        };

        const trails = Array.from({ length: 15 }, () => createTrail(10 + Math.random() * 20));
        trails.forEach(t => linesGroup.add(t.mesh));

        let animationId: number;
        let time = 0;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            resizeRendererToDisplaySize();
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

            time += 0.01;

            // Move particles left to right
            const pPositions = particles.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                pPositions[i * 3] += speeds[i];

                // Wrap around when passing the right edge
                if (pPositions[i * 3] > 60) {
                    pPositions[i * 3] = -60;
                    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;

            // Move trails
            trails.forEach(t => {
                t.mesh.position.x += t.speed;
                if (t.mesh.position.x > 110) { // reset when out of view
                    t.mesh.position.x = -110;
                }
            });

            // Camera subtle wave to make it feel organic
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
