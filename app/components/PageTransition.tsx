"use client";
import {motion,useReducedMotion} from "motion/react";
import {usePathname} from "next/navigation";
export default function PageTransition({children}:{children:React.ReactNode}){const path=usePathname(),reduced=useReducedMotion();return <motion.div key={path} className="motionPage" initial={reduced?false:{opacity:0,y:14,filter:"blur(2px)"}} animate={{opacity:1,y:0,filter:"blur(0px)"}} transition={{duration:reduced?0:.42,ease:[.16,1,.3,1]}}>{children}</motion.div>}
