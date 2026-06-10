import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Advanced vertex shader with multiple effects
const advancedVertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uScrollProgress;
  
  varying vec2 vUv;
  varying float vWave;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    
    // Wave effect
    float wave = sin(pos.x * 3.0 + uTime) * sin(pos.y * 3.0 + uTime) * uAmplitude;
    
    // Scroll-based distortion
    float scrollDistortion = sin(pos.z * 5.0 + uScrollProgress * 10.0) * 0.2;
    
    pos.z += wave + scrollDistortion;
    vWave = wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const advancedFragmentShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  
  varying vec2 vUv;
  varying float vWave;
  varying vec3 vPosition;
  
  void main() {
    vec2 uv = vUv;
    
    // Iridescent effect with scroll influence
    vec3 color = vec3(
      sin(uv.x * 10.0 + uTime + uScrollProgress) * 0.5 + 0.5,
      sin(uv.y * 10.0 + uTime + 2.0 + uScrollProgress * 0.5) * 0.5 + 0.5,
      sin((uv.x + uv.y) * 10.0 + uTime + 4.0 - uScrollProgress) * 0.5 + 0.5
    );
    
    // Add wave influence
    color += vec3(vWave) * 0.3;
    
    // Add glow effect
    float glow = sin(uv.x * 5.0) * sin(uv.y * 5.0) * 0.5 + 0.5;
    color += vec3(glow) * 0.2;
    
    gl_FragColor = vec4(color, 0.85);
  }
`;

function AdvancedShaderMesh({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { mouse } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0.3 },
      uMouse: { value: new THREE.Vector2() },
      uScrollProgress: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += 0.01;
      materialRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y);
      materialRef.current.uniforms.uScrollProgress.value = scrollProgress;
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += 0.0008;
      meshRef.current.rotation.y += 0.0015;
      meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} scale={2.5}>
      <icosahedronGeometry args={[1, 5]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={advancedVertexShader}
        fragmentShader={advancedFragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
}

// Enhanced particle system with scroll interaction
function EnhancedParticleSystem({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 5000;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 25;
      positions[i + 1] = (Math.random() - 0.5) * 25;
      positions[i + 2] = (Math.random() - 0.5) * 25;

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;

      // Color variation
      const hue = Math.random();
      colors[i] = Math.sin(hue * Math.PI) * 0.5 + 0.5; // R
      colors[i + 1] = Math.sin((hue + 0.33) * Math.PI) * 0.5 + 0.5; // G
      colors[i + 2] = Math.sin((hue + 0.66) * Math.PI) * 0.5 + 0.5; // B
    }

    return { positions, velocities, colors };
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += particles.velocities[i];
        positions[i + 1] += particles.velocities[i + 1];
        positions[i + 2] += particles.velocities[i + 2];

        // Wrap around with scroll influence
        const wrapDistance = 12.5 + scrollProgress * 5;
        if (positions[i] > wrapDistance) positions[i] = -wrapDistance;
        if (positions[i] < -wrapDistance) positions[i] = wrapDistance;
        if (positions[i + 1] > wrapDistance) positions[i + 1] = -wrapDistance;
        if (positions[i + 1] < -wrapDistance) positions[i + 1] = wrapDistance;
        if (positions[i + 2] > wrapDistance) positions[i + 2] = -wrapDistance;
        if (positions[i + 2] < -wrapDistance) positions[i + 2] = wrapDistance;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0.7}
        vertexColors
      />
    </points>
  );
}

// Torus geometry for additional visual interest
function TorusRings({ scrollProgress }: { scrollProgress: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((child, idx) => {
        child.rotation.x += 0.0005 * (idx + 1);
        child.rotation.y += 0.0008 * (idx + 1);
        child.scale.z = 1 + Math.sin(state.clock.elapsedTime * 0.5 + idx) * 0.1;
      });
    }
  });

  return (
    <group ref={group}>
      {[1, 1.5, 2].map((scale, idx) => (
        <mesh key={idx} scale={scale} position={[0, 0, 0]}>
          <torusGeometry args={[1, 0.3, 16, 100]} />
          <meshStandardMaterial
            color={idx === 0 ? '#a78bfa' : idx === 1 ? '#06b6d4' : '#ec4899'}
            emissive={idx === 0 ? '#a78bfa' : idx === 1 ? '#06b6d4' : '#ec4899'}
            emissiveIntensity={0.5 + Math.sin(idx) * 0.3}
            wireframe={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function AdvancedScene() {
  const { scrollY } = useScroll();
  const scrollProgress = scrollY.get() / window.innerHeight;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={75} />
      <ambientLight intensity={0.6} />
      <pointLight position={[15, 15, 15]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[-15, -15, 15]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[0, 0, -15]} intensity={0.6} color="#ec4899" />

      <AdvancedShaderMesh scrollProgress={scrollProgress} />
      <EnhancedParticleSystem scrollProgress={scrollProgress} />
      <TorusRings scrollProgress={scrollProgress} />

      <Environment preset="night" />
    </>
  );
}

export default function AdvancedSceneCanvas() {
  return (
    <Canvas
      className="w-full h-screen"
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <AdvancedScene />
    </Canvas>
  );
}
