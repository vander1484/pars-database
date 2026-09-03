"use client";
import {AnimatePresence,motion,useReducedMotion} from "motion/react";
import {usePathname} from "next/navigation";

export default function PageTransition({children}:{children:React.ReactNode}){
  const path=usePathname(),reduced=useReducedMotion();
  return <AnimatePresence mode="wait" initial={false}>
    <motion.main
      id="main-content"
      tabIndex={-1}
      key={path}
      className="motionPage"
      initial={reduced?false:{opacity:0,y:6}}
      animate={{opacity:1,y:0}}
      exit={reduced?undefined:{opacity:0,y:-3}}
      transition={reduced?{duration:0}:{duration:.2,ease:[.16,1,.3,1]}}
    >{children}</motion.main>
  </AnimatePresence>
}
