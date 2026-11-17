
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles() {
  const pointsRef = useRef()

  const positions = useMemo(() => {
    const data = new Float32Array(2200 * 3)

    for (let i = 0; i < 2200; i++) {
      data[i * 3] = (Math.random() - 0.5) * 24
      data[i * 3 + 1] = (Math.random() - 0.5) * 14
      data[i * 3 + 2] = (Math.random() - 0.5) * 12
    }

    return data
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return

    pointsRef.current.rotation.y =
      state.clock.elapsedTime * 0.012

    pointsRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.1) * 0.04
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#00dfff"
        size={0.025}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function CyberStructure() {
  const groupRef = useRef()
  const innerRef = useRef()
  const ringRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.12
    }

    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.2
      innerRef.current.rotation.y = t * 0.3
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.15
    }
  })

  return (
    <group ref={groupRef} position={[2.2, 0, -1]}>

      {/* Outer 3D wireframe */}
      <mesh>
        <icosahedronGeometry args={[1.8, 2]} />
        <meshBasicMaterial
          color="#00dfff"
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* Inner rotating structure */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial
          color="#00eaff"
          wireframe
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Inner core */}
      <mesh>
        <octahedronGeometry args={[0.65, 1]} />
        <meshBasicMaterial
          color="#783bff"
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Outer orbit */}
      <mesh ref={ringRef} rotation={[1.1, 0.3, 0]}>
        <torusGeometry args={[2.35, 0.009, 8, 150]} />
        <meshBasicMaterial
          color="#00eaff"
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Second orbit */}
      <mesh rotation={[0.5, 1.1, 0.7]}>
        <torusGeometry args={[2.65, 0.006, 8, 150]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Glowing center */}
      <mesh>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshBasicMaterial color="#00eaff" />
      </mesh>

      <pointLight
        color="#00dfff"
        intensity={2}
        distance={7}
      />

    </group>
  )
}

function BackgroundScene() {
  return (
    <>
      <color attach="background" args={['#050914']} />

      <Particles />
      <CyberStructure />

      <ambientLight intensity={0.5} />
    </>
  )
}

export default function Background3D() {
  return (
    <div className="background-3d">
      <Canvas
        camera={{
          position: [0, 0, 9],
          fov: 55
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
      >
        <BackgroundScene />
      </Canvas>
    </div>
  )
}
