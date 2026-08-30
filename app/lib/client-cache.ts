const memory=new Map<string,{expires:number,value:unknown}>();
const pending=new Map<string,Promise<unknown>>();

export async function cachedJson<T>(url:string,init?:RequestInit,ttlMs=5*60*1000):Promise<T>{
  const now=Date.now();
  const hit=memory.get(url);
  if(hit&&hit.expires>now)return hit.value as T;
  const inflight=pending.get(url);
  if(inflight)return inflight as Promise<T>;
  if(typeof window!=="undefined"){
    try{
      const raw=sessionStorage.getItem(`pars-cache:${url}`);
      if(raw){
        const parsed=JSON.parse(raw) as {expires:number,value:T};
        if(parsed.expires>now){memory.set(url,parsed);return parsed.value}
        sessionStorage.removeItem(`pars-cache:${url}`);
      }
    }catch{}
  }
  const request=fetch(url,init).then(async r=>{
    if(!r.ok)throw new Error(`Request failed: ${r.status}`);
    const value=await r.json() as T;
    const entry={expires:Date.now()+ttlMs,value};
    memory.set(url,entry);
    if(typeof window!=="undefined"){
      try{sessionStorage.setItem(`pars-cache:${url}`,JSON.stringify(entry))}catch{}
    }
    return value;
  }).finally(()=>pending.delete(url));
  pending.set(url,request);
  return request;
}
