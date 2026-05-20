import { useEffect, type ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

export const SCENE_DURATIONS: Record<string, number> = {
  scene1: 3000,
  scene2: 4000,
  scene3: 4500,
  scene4: 3500,
  scene5: 4000,
};

const SCENE_COMPONENTS: Record<string, ComponentType> = {
  scene1: Scene1,
  scene2: Scene2,
  scene3: Scene3,
  scene4: Scene4,
  scene5: Scene5,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="w-full h-screen overflow-hidden relative bg-[#1a1a2e] text-white">
      {/* Persistent Background Layer */}
      <div className="absolute inset-0">
        <video
          src={`${import.meta.env.BASE_URL}videos/bg.mp4`}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/50 via-[#1a1a2e]/80 to-[#1a1a2e] pointer-events-none" />
      </div>

      {/* Floating Accent Shapes */}
      <motion.div
        className="absolute w-[60vh] h-[60vh] rounded-full bg-[#C84B31]/10 blur-[80px]"
        animate={{
          x: ['-20vw', '40vw', '10vw', '-10vw', '50vw'][sceneIndex],
          y: ['-10vh', '50vh', '80vh', '30vh', '20vh'][sceneIndex],
          scale: [1, 1.2, 0.8, 1.5, 1][sceneIndex],
        }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[40vh] h-[40vh] rounded-full bg-[#0f3460]/40 blur-[60px]"
        animate={{
          x: ['50vw', '-10vw', '60vw', '20vw', '-20vw'][sceneIndex],
          y: ['60vh', '10vh', '-20vh', '80vh', '50vh'][sceneIndex],
          scale: [1.5, 0.9, 1.2, 1, 1.8][sceneIndex],
        }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      />

      {/* Main Scenes */}
      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
