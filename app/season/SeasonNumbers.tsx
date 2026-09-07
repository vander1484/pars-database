"use client";

type Match={id:number;played_on:string|null;home_score:number|null;away_score:number|null;home:{name:string}|null;away:{name:string}|null};
type Player={name:string;slug:string;apps:number;goals:number};
type Props={matches:Match[];players:Player[];leagueFinish:number|null;topScorer:Player|null};
const DAFC="Dunfermline Athletic";
function result(m:Match){if(m.home_score==null||m.away_score==null)return null;const home=m.home?.name===DAFC;if(!home&&m.away?.name!==DAFC)return null;const gf=home?m.home_score:m.away_score,ga=home?m.away_score:m.home_score;return {m,gf,ga,r:gf>ga?'W':gf===ga?'D':'L',opp:home?m.away?.name:m.home?.name}}
function ordinal(n:number){const v=n%100;return n+(v>=11&&v<=13?'th':n%10===1?'st':n%10===2?'nd':n%10===3?'rd':'th')}
export default function SeasonNumbers({matches,players,leagueFinish,topScorer}:Props){
 const rs=matches.map(result).filter(Boolean) as NonNullable<ReturnType<typeof result>>[];
 if(!rs.length)return null;
 const wins=rs.filter(x=>x.r==='W').length,draws=rs.filter(x=>x.r==='D').length,losses=rs.filter(x=>x.r==='L').length;
 const gf=rs.reduce((n,x)=>n+x.gf,0),ga=rs.reduce((n,x)=>n+x.ga,0),gd=gf-ga;
 const cleanSheets=rs.filter(x=>x.ga===0).length,scorers=players.filter(x=>x.goals>0).length;
 let run=0,longest=0;for(const x of rs){if(x.r!=='L'){run++;longest=Math.max(longest,run)}else run=0}
 const best=rs.filter(x=>x.r==='W').sort((a,b)=>(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf)[0];
 const highest=[...rs].sort((a,b)=>(b.gf+b.ga)-(a.gf+a.ga))[0];
 const scorerShare=topScorer&&gf?Math.round(topScorer.goals/gf*100):null;
 return <section className="numbersSection" id="numbers">
  <div className="numbersTitle"><span>Season portrait</span><h2>The season in numbers</h2><p>A statistical snapshot of the campaign.</p></div>
  <div className="numbersCanvas">
   <div className="numberHero matches"><strong>{rs.length}</strong><span>matches</span><small><b>{wins}</b> wins&nbsp;&nbsp; {draws} draws&nbsp;&nbsp; {losses} defeats</small></div>
   <div className="numberHero goals"><strong>{gf}</strong><span>goals scored</span><small>{ga} conceded&nbsp;&nbsp; <b>{gd>0?'+':''}{gd}</b> goal difference</small></div>
   {topScorer&&<div className="numberFeature scorer"><span>Top scorer</span><strong>{topScorer.goals}</strong><b>{topScorer.name}</b>{scorerShare!=null&&<small>{scorerShare}% of team goals</small>}</div>}
   <div className="numberFeature squad"><span>Players used</span><strong>{players.length}</strong><b>{scorers} different goalscorers</b></div>
   <div className="numberStrip">
    {leagueFinish&&<div><span>League finish</span><strong>{ordinal(leagueFinish)}</strong></div>}
    <div><span>Clean sheets</span><strong>{cleanSheets}</strong></div>
    <div><span>Longest unbeaten</span><strong>{longest}</strong><small>matches</small></div>
    {best&&<div><span>Biggest win</span><strong>{best.gf}–{best.ga}</strong><small>{best.opp}</small></div>}
    {highest&&<div><span>Highest scoring</span><strong>{highest.gf}–{highest.ga}</strong><small>{highest.opp}</small></div>}
   </div>
  </div>
  <style jsx>{`
   .numbersSection{margin:0 0 4.5rem;padding:0;scroll-margin-top:78px}.numbersTitle{display:grid;grid-template-columns:1fr 2fr;gap:.25rem 2rem;align-items:end;border-bottom:1px solid #d8d3ca;padding-bottom:1rem;margin-bottom:1.5rem}.numbersTitle>span{grid-row:1/3;font-size:.58rem;font-weight:950;text-transform:uppercase;letter-spacing:.12em;color:#d51f2b;align-self:start;padding-top:.35rem}.numbersTitle h2{font-size:clamp(2.2rem,4.5vw,4rem);line-height:.9;letter-spacing:-.045em;margin:0}.numbersTitle p{margin:.35rem 0 0;color:#777;font-size:.78rem}.numbersCanvas{display:grid;grid-template-columns:1.25fr 1.25fr .8fr .8fr;background:#111;color:#fff;border:1px solid #111}.numberHero,.numberFeature{min-height:250px;padding:1.5rem;display:flex;flex-direction:column;border-right:1px solid #353535}.numberHero strong{font-size:clamp(5.4rem,9vw,9rem);line-height:.75;letter-spacing:-.075em;margin:auto 0 .8rem}.numberHero>span,.numberFeature>span{text-transform:uppercase;letter-spacing:.1em;font-size:.58rem;font-weight:900;color:#999}.numberHero small{font-size:.67rem;color:#999}.numberHero small b{color:#fff}.numberHero.goals{background:#f2eee7;color:#111;border-color:#d7d2c9}.numberHero.goals>span,.numberHero.goals small{color:#777}.numberHero.goals small b{color:#d51f2b}.numberFeature{background:#181818}.numberFeature strong{font-size:clamp(3.6rem,6vw,6rem);line-height:.85;letter-spacing:-.06em;margin:auto 0 .7rem}.numberFeature>b{font-size:.76rem}.numberFeature small{font-size:.58rem;color:#888;margin-top:.25rem}.numberFeature.scorer strong{color:#fff}.numberFeature.scorer>b{color:#fff}.numberFeature.squad{background:#d51f2b}.numberFeature.squad>span,.numberFeature.squad small{color:#f1bfc3}.numberStrip{grid-column:1/-1;display:grid;grid-template-columns:repeat(5,1fr);background:#fff;color:#111}.numberStrip>div{min-height:115px;padding:1rem 1.2rem;border-right:1px solid #d7d2c9;display:flex;flex-direction:column;justify-content:flex-end}.numberStrip>div:last-child{border:0}.numberStrip span{font-size:.54rem;color:#777;text-transform:uppercase;letter-spacing:.07em;font-weight:900}.numberStrip strong{font-size:2rem;line-height:1;margin:.35rem 0 .15rem;letter-spacing:-.04em}.numberStrip small{font-size:.56rem;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}@media(max-width:900px){.numbersCanvas{grid-template-columns:1fr 1fr}.numberHero,.numberFeature{min-height:210px}.numberStrip{grid-template-columns:repeat(3,1fr)}.numberStrip>div:nth-child(3){border-right:0}.numberStrip>div:nth-child(-n+3){border-bottom:1px solid #d7d2c9}}@media(max-width:650px){.numbersSection{margin-bottom:3rem}.numbersTitle{display:block}.numbersTitle>span{display:block;margin-bottom:.55rem}.numbersTitle h2{font-size:2.35rem}.numbersCanvas{grid-template-columns:1fr 1fr}.numberHero,.numberFeature{min-height:165px;padding:1rem}.numberHero strong{font-size:4.6rem}.numberHero>span,.numberFeature>span{font-size:.5rem}.numberHero small{font-size:.56rem;line-height:1.35}.numberFeature strong{font-size:3.2rem}.numberFeature>b{font-size:.65rem}.numberStrip{grid-template-columns:1fr 1fr}.numberStrip>div{min-height:95px;padding:.8rem;border-bottom:1px solid #d7d2c9}.numberStrip>div:nth-child(odd){border-right:1px solid #d7d2c9}.numberStrip>div:nth-child(even){border-right:0}.numberStrip strong{font-size:1.55rem}}@media(prefers-reduced-motion:reduce){.numbersSection *{animation:none!important}}
  `}</style>
 </section>
}
