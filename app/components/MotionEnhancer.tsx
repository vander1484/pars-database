"use client";
import {motion,useReducedMotion,useScroll,useSpring,useTransform} from "motion/react";

export default function MotionEnhancer(){
  const reduced=useReducedMotion();
  const {scrollYProgress}=useScroll();
  const smooth=useSpring(scrollYProgress,{stiffness:130,damping:28,mass:.25});
  const ambientY=useTransform(smooth,[0,.35],[0,-44]);
  const ambientOpacity=useTransform(smooth,[0,.22],[1,.76]);
  return <div className="motionSystem" aria-hidden="true">
    {!reduced&&<motion.div className="motionScrollProgress" style={{scaleX:smooth}}/>}
    {!reduced&&<motion.div className="motionAmbient" style={{y:ambientY,opacity:ambientOpacity}}/>}
  </div>
}
