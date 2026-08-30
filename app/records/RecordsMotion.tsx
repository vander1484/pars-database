"use client";

import Link from "next/link";
import {motion,useInView,useReducedMotion,useSpring,useTransform} from "motion/react";
import {useEffect,useRef} from "react";

export function AnimatedNumber({value,className=""}:{value:string;className?:string}){
  const reduced=useReducedMotion();
  const ref=useRef<HTMLElement>(null);
  const inView=useInView(ref,{once:true,amount:.5});
  const numeric=/^[\d,]+$/.test(value)?Number(value.replace(/,/g,"")):null;
  const spring=useSpring(0,{stiffness:80,damping:22,mass:.7});
  const display=useTransform(spring,v=>Math.round(v).toLocaleString("en-GB"));
  useEffect(()=>{if(inView&&numeric!==null)spring.set(numeric)},[inView,numeric,spring]);
  if(numeric===null||reduced)return <strong ref={ref as React.RefObject<HTMLElement>} className={className}>{value}</strong>;
  return <motion.strong ref={ref as React.RefObject<HTMLElement>} className={className}>{display}</motion.strong>;
}

export function RevealCard({children,className="",delay=0}:{children:React.ReactNode;className?:string;delay?:number}){
  const reduced=useReducedMotion();
  return <motion.article className={className} initial={reduced?false:{opacity:0,y:24,scale:.985}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true,amount:.2}} transition={reduced?{duration:0}:{duration:.45,delay,ease:[.16,1,.3,1]}} whileHover={reduced?undefined:{y:-5}}>{children}</motion.article>;
}

export function RecordLink({href,children,className="",delay=0}:{href:string;children:React.ReactNode;className?:string;delay?:number}){
  const reduced=useReducedMotion();
  return <motion.div initial={reduced?false:{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={reduced?{duration:0}:{duration:.4,delay,ease:[.16,1,.3,1]}} whileHover={reduced?undefined:{y:-5,scale:1.01}}><Link href={href} className={className}>{children}</Link></motion.div>;
}

export function RankedRow({href,rank,name,value,max}:{href:string;rank:number;name:string;value:number;max:number}){
  const reduced=useReducedMotion();
  return <motion.div layout initial={reduced?false:{opacity:0,x:-18}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.35}} transition={reduced?{duration:0}:{duration:.34,delay:Math.min(rank-1,12)*.025,ease:[.16,1,.3,1]}} whileHover={reduced?undefined:{x:5}} className="rankingMotionRow"><Link href={href} className={`appearanceRow ${rank<=3?'podium':''}`}><span className="rank">{rank}</span><strong>{name}</strong><b>{value}</b><span className="rankingBar" aria-hidden="true"><motion.i initial={{scaleX:0}} whileInView={{scaleX:value/max}} viewport={{once:true,amount:.5}} transition={reduced?{duration:0}:{type:"spring",stiffness:120,damping:24,delay:Math.min(rank-1,10)*.02}}/></span></Link></motion.div>;
}

export function SectionReveal({children,className=""}:{children:React.ReactNode;className?:string}){
  const reduced=useReducedMotion();
  return <motion.div className={className} initial={reduced?false:{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={reduced?{duration:0}:{duration:.55,ease:[.16,1,.3,1]}}>{children}</motion.div>;
}
