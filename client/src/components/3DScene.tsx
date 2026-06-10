import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Custom shader material for distortion effect
const vertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  
  varying vec2 vUv;
  varying float vWave;
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    float wave = sin(pos.x * 3.0 + uTime) * sin(pos.y * 3.0 + uTime) * uAmplitude;
    pos.z += wave;
    
    vWave = wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  
  varying vec2 vUv;
  varying float vWave;
  
  void main() {
    vec2 uv = vUv;
    
    // Iridescent effect
    vec3 color = vec3(
      sin(uv.x * 10.0 + uTime) * 0.5 + 0.5,
      sin(uv.y * 10.0 + uTime + 2.0) * 0.5 + 0.5,
      sin((uv.x + uv.y) * 10.0 + uTime + 4.0) * 0.5 + 0.5
    );
    
    // Add wave influence
    color += vec3(vWave) * 0.3;
    
    gl_FragColor = vec4(color, 0.8);
  }
`;

function ShaderMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { mouse } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0.3 },
      uMouse: { value: new THREE.Vector2() },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += 0.01;
      materialRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y);
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef} scale={2}>
      <icosahedronGeometry args={[1, 4]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
}

// Particle system
function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 3000;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += particles.velocities[i];
        positions[i + 1] += particles.velocities[i + 1];
        positions[i + 2] += particles.velocities[i + 2];

        // Wrap around
        if (positions[i] > 10) positions[i] = -10;
        if (positions[i] < -10) positions[i] = 10;
        if (positions[i + 1] > 10) positions[i + 1] = -10;
        if (positions[i + 1] < -10) positions[i + 1] = 10;
        if (positions[i + 2] > 10) positions[i + 2] = -10;
        if (positions[i + 2] < -10) positions[i + 2] = 10;
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
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#a78bfa"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#a78bfa" />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#06b6d4" />
      <ShaderMesh />
      <ParticleSystem />
      <Environment preset="night" />
    </>
  );
}

export default function ThreeDScene() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full h-screen"
    >
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </motion.div>
  );
}
