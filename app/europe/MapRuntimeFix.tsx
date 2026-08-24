"use client";
import {useEffect} from "react";

/*
 * The Europe page already renders campaign-specific markers and routes from React state.
 * Keep this runtime helper deliberately minimal: remove any legacy tile layers left by
 * earlier experiments and let the page's own keyed elements control campaign changes.
 */
export default function MapRuntimeFix(){
 useEffect(()=>{
  const root=document.querySelector('.euroV4');
  if(!root)return;
  root.querySelectorAll('.tileLayer,.mapAttribution,.geoBase').forEach(el=>el.remove());
 },[]);
 return null;
}
