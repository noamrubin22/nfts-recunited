import { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type DreiGLTF = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.MeshStandardMaterial>;
};

interface DiamondProps {
  color?: string;
  type: string;
}

export const Diamond: React.FC<DiamondProps> = ({ color, type }) => {
  const group = useRef();
  const myMesh = useRef<THREE.Mesh>();
  const { nodes } = useGLTF("diamond.glb") as DreiGLTF;
  const texture = useTexture("matcap-crystal.png");

  useFrame(() => {
    if (myMesh && myMesh.current && myMesh.current.rotation) {
      myMesh.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <mesh geometry={nodes.dobj.geometry} ref={myMesh}>
        {type === "wire" ? (
          <meshBasicMaterial
            attach="material"
            wireframeLinewidth={2}
            color={color}
            wireframe
          />
        ) : (
          <meshMatcapMaterial matcap={texture} color={color} />
        )}
      </mesh>
    </group>
  );
};
