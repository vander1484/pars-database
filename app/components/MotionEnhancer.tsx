"use client";
import {useEffect,useRef} from "react";

export default function MotionEnhancer(){
  const progressRef=useRef<HTMLDivElement>(null);
  const ambientRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    if(reduced.matches)return;
    let frame=0;
    const update=()=>{
      frame=0;
      const doc=document.documentElement;
      const max=Math.max(1,doc.scrollHeight-window.innerHeight);
      const progress=Math.min(1,Math.max(0,window.scrollY/max));
      if(progressRef.current)progressRef.current.style.transform=`scaleX(${progress})`;
      if(ambientRef.current&&window.innerWidth>780){
        const phase=Math.min(1,progress/.35);
        ambientRef.current.style.transform=`translate3d(0,${-44*phase}px,0)`;
        ambientRef.current.style.opacity=String(1-.24*Math.min(1,progress/.22));
      }
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
    update();
    window.addEventListener("scroll",schedule,{passive:true});
    window.addEventListener("resize",schedule,{passive:true});
    return()=>{
      window.removeEventListener("scroll",schedule);
      window.removeEventListener("resize",schedule);
      if(frame)cancelAnimationFrame(frame);
    };
  },[]);

  return <div className="motionSystem" aria-hidden="true">
    <div ref={progressRef} className="motionScrollProgress" style={{transform:"scaleX(0)"}}/>
    <div ref={ambientRef} className="motionAmbient"/>
  </div>;
}
