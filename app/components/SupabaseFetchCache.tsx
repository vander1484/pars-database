"use client";
import {useLayoutEffect} from "react";

const TTL=5*60*1000;
const ALLOWED=new Set([
  "players","player_career_totals","seasons","player_season_stats","player_heritage_stats",
  "matches","clubs","competition_seasons","competitions","managers"
]);

type Entry={expires:number,status:number,statusText:string,headers:[string,string][],body:string};
const memory=new Map<string,Entry>();
const pending=new Map<string,Promise<Entry>>();
let installed=false;

function tableFrom(url:string){
  try{
    const u=new URL(url,window.location.href);
    if(u.hostname!=="uwhewuwnrcvrnclfzoge.supabase.co")return null;
    const m=u.pathname.match(/^\/rest\/v1\/([^/?]+)/);
    return m?.[1]||null;
  }catch{return null}
}

function responseFrom(entry:Entry){
  return new Response(entry.body,{status:entry.status,statusText:entry.statusText,headers:entry.headers});
}

export default function SupabaseFetchCache(){
  useLayoutEffect(()=>{
    if(installed)return;
    installed=true;
    const nativeFetch=window.fetch.bind(window);
    window.fetch=async(input:RequestInfo|URL,init?:RequestInit)=>{
      const method=(init?.method||(input instanceof Request?input.method:"GET")).toUpperCase();
      if(method!=="GET")return nativeFetch(input,init);
      const url=typeof input==="string"?input:input instanceof URL?input.toString():input.url;
      const table=tableFrom(url);
      if(!table||!ALLOWED.has(table))return nativeFetch(input,init);
      const key=url;
      const now=Date.now();
      const hit=memory.get(key);
      if(hit&&hit.expires>now)return responseFrom(hit);
      const inflight=pending.get(key);
      if(inflight)return responseFrom(await inflight);
      const request=nativeFetch(input,init).then(async res=>{
        if(!res.ok)return {expires:now,status:res.status,statusText:res.statusText,headers:[...res.headers.entries()] as [string,string][],body:await res.text()};
        const body=await res.text();
        const entry:Entry={expires:Date.now()+TTL,status:res.status,statusText:res.statusText,headers:[...res.headers.entries()],body};
        memory.set(key,entry);
        return entry;
      }).finally(()=>pending.delete(key));
      pending.set(key,request);
      const entry=await request;
      if(entry.expires<=now)return responseFrom(entry);
      return responseFrom(entry);
    };
    return()=>{};
  },[]);
  return null;
}
