"use client";
import {useEffect,useState} from "react";

export default function HomeHeroVideo(){
  const [enabled,setEnabled]=useState(false);
  useEffect(()=>{
    const media=window.matchMedia("(min-width: 781px) and (prefers-reduced-motion: no-preference)");
    const nav=navigator as Navigator & {connection?:{saveData?:boolean,effectiveType?:string}};
    const update=()=>{
      const saveData=Boolean(nav.connection?.saveData);
      const slow=nav.connection?.effectiveType==="slow-2g"||nav.connection?.effectiveType==="2g";
      setEnabled(media.matches&&!saveData&&!slow);
    };
    update();
    media.addEventListener?.("change",update);
    return()=>media.removeEventListener?.("change",update);
  },[]);
  if(!enabled)return null;
  return <div className="heroVideo" aria-hidden="true"><iframe src="https://www.youtube-nocookie.com/embed/nczThfZG8_8?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&playsinline=1&start=23&end=32&loop=1&playlist=nczThfZG8_8" title="" allow="autoplay; encrypted-media" tabIndex={-1}/></div>;
}
