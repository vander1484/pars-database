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
 const best=rs.filter(x=>x.r==='W').sort((a,b)=>(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf)[0];
 const highest=[...rs].sort((a,b)=>(b.gf+b.ga)-(a.gf+a.ga))[0];
 const scorerShare=topScorer&&gf?Math.round(topScorer.goals/gf*100):null;
 const goalsPerMatch=(gf/rs.length).toFixed(2);
 return <section className="numbersSection" id="numbers">
  <div className="numbersTitle"><span>All competitions</span><h2>Season in numbers</h2><p>One statistical summary of the complete competitive season.</p></div>
  <div className="numbersCanvas">
   <div className="numberHero matches"><strong>{rs.length}</strong><span>matches</span><small><b>{wins}</b> wins&nbsp;&nbsp; {draws} draws&nbsp;&nbsp; {losses} defeats</small></div>
   <div className="numberHero goals"><strong>{gf}</strong><span>goals scored</span><small>{ga} conceded&nbsp;&nbsp; <b>{gd>0?'+':''}{gd}</b> goal difference</small></div>
   {topScorer&&<div className="numberFeature scorer"><span>Top scorer</span><strong>{topScorer.goals}</strong><b>{topScorer.name}</b>{scorerShare!=null&&<small>{scorerShare}% of team goals</small>}</div>}
   <div className="numberFeature squad"><span>Players used</span><strong>{players.length}</strong><b>{scorers} different goalscorers</b></div>
   <div className="numberStrip">
    {leagueFinish&&<div><span>League finish</span><strong>{ordinal(leagueFinish)}</strong></div>}
    <div><span>Clean sheets</span><strong>{cleanSheets}</strong></div>
    <div><span>Goals per match</span><strong>{goalsPerMatch}</strong><small>all competitions</small></div>
    {best&&<div><span>Biggest win</span><strong>{best.gf}–{best.ga}</strong><small>{best.opp}</small></div>}
    {highest&&<div><span>Highest scoring</span><strong>{highest.gf}–{highest.ga}</strong><small>{highest.opp}</small></div>}
   </div>
  </div>
  <style jsx>{`
   .numbersSection{margin:0 0 4.5rem;padding:0;scroll-margin-top:78px;min-width:0}.numbersTitle{display:grid;grid-template-columns:1fr 2fr;gap:.25rem 2rem;align-items:end;border-bottom:1px solid #d8d3ca;padding-bottom:1rem;margin-bottom:1.5rem}.numbersTitle>span{grid-row:1/3;font-size:.58rem;font-weight:950;text-transform:uppercase;letter-spacing:.12em;color:#d51f2b;align-self:start;padding-top:.35rem}.numbersTitle h2{font-size:clamp(2.2rem,4.5vw,4rem);line-height:.9;letter-spacing:-.045em;margin:0}.numbersTitle p{margin:.35rem 0 0;color:#777;font-size:.78rem}.numbersCanvas{display:grid;grid-template-columns:1.25fr 1.25fr .8fr .8fr;background:#111;color:#fff;border:1px solid #111;min-width:0;overflow:hidden}.numberHero,.numberFeature{min-width:0;min-height:250px;padding:1.5rem;display:flex;flex-direction:column;border-right:1px solid #353535}.numberHero strong{font-size:clamp(5.4rem,9vw,9rem);line-height:.75;letter-spacing:-.075em;margin:auto 0 .8rem}.numberHero>span,.numberFeature>span{text-transform:uppercase;letter-spacing:.1em;font-size:.58rem;font-weight:900;color:#999}.numberHero small{font-size:.67rem;color:#999}.numberHero small b{color:#fff}.numberHero.goals{background:#f2eee7;color:#111;border-color:#d7d2c9}.numberHero.goals>span,.numberHero.goals small{color:#777}.numberHero.goals small b{color:#d51f2b}.numberFeature{background:#181818}.numberFeature strong{font-size:clamp(3.6rem,6vw,6rem);line-height:.85;letter-spacing:-.06em;margin:auto 0 .7rem}.numberFeature>b{font-size:.76rem;overflow-wrap:anywhere}.numberFeature small{font-size:.58rem;color:#888;margin-top:.25rem}.numberFeature.squad{background:#d51f2b}.numberFeature.squad>span,.numberFeature.squad small{color:#f1bfc3}.numberStrip{grid-column:1/-1;display:grid;grid-template-columns:repeat(5,1fr);background:#fff;color:#111;min-width:0}.numberStrip>div{min-width:0;min-height:115px;padding:1rem 1.2rem;border-right:1px solid #d7d2c9;display:flex;flex-direction:column;justify-content:flex-end}.numberStrip>div:last-child{border:0}.numberStrip span{font-size:.54rem;color:#777;text-transform:uppercase;letter-spacing:.07em;font-weight:900}.numberStrip strong{font-size:2rem;line-height:1;margin:.35rem 0 .15rem;letter-spacing:-.04em}.numberStrip small{font-size:.56rem;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}@media(max-width:900px){.numbersCanvas{grid-template-columns:1fr 1fr}.numberHero,.numberFeature{min-height:210px}.numberStrip{grid-template-columns:repeat(3,1fr)}.numberStrip>div:nth-child(3){border-right:0}.numberStrip>div:nth-child(-n+3){border-bottom:1px solid #d7d2c9}}@media(max-width:650px){.numbersSection{margin-bottom:3rem;width:100%;max-width:100%;overflow:hidden}.numbersTitle{display:block;width:100%;min-width:0}.numbersTitle>span{display:block;margin-bottom:.55rem}.numbersTitle h2{font-size:2.15rem;line-height:.98}.numbersTitle p{font-size:.7rem}.numbersCanvas{grid-template-columns:1fr 1fr;width:100%;max-width:100%}.numberHero,.numberFeature{min-height:152px;padding:.85rem}.numberHero strong{font-size:3.9rem;line-height:.82}.numberHero>span,.numberFeature>span{font-size:.47rem}.numberHero small{font-size:.52rem;line-height:1.35;overflow-wrap:anywhere}.numberFeature strong{font-size:2.8rem}.numberFeature>b{font-size:.6rem;line-height:1.2}.numberFeature small{font-size:.5rem}.numberStrip{grid-template-columns:1fr 1fr;width:100%;max-width:100%}.numberStrip>div{min-width:0;min-height:88px;padding:.72rem;border-bottom:1px solid #d7d2c9}.numberStrip>div:nth-child(odd){border-right:1px solid #d7d2c9}.numberStrip>div:nth-child(even){border-right:0}.numberStrip strong{font-size:1.4rem}.numberStrip small{font-size:.5rem}.numberStrip span{font-size:.48rem}}
  `}</style>
  <style jsx global>{`
   .overviewGrid{display:none!important}
   @media(max-width:650px){
    .archiveContent{width:100%!important;max-width:100%!important;box-sizing:border-box!important;padding-left:14px!important;padding-right:14px!important;overflow-x:hidden!important}
    .sectionBlock,.numbersSection{width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important}
    .sectionHeader{display:block!important;width:100%!important;min-width:0!important;margin-bottom:1rem!important;padding-bottom:.75rem!important}
    .sectionHeader h2{font-size:2rem!important;line-height:1!important;overflow-wrap:anywhere!important}
    .sectionHeader p{font-size:.7rem!important;line-height:1.4!important;margin:.35rem 0 0!important;max-width:none!important}
    .performancePanel,.cupGrid,.goalList,.squadTable,.transferColumns,.leagueTable,.dataList{width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important}
    .performanceHeader{flex-direction:column!important;align-items:flex-start!important;gap:.6rem!important}
    .impactScroller{width:100%!important;max-width:100%!important;overflow-x:auto!important;-webkit-overflow-scrolling:touch}
    .performanceInsights{grid-template-columns:1fr 1fr!important}
    .cupGrid{grid-template-columns:1fr!important}
    .cupCard{width:100%!important;min-width:0!important;overflow:hidden!important}
    .cupTrack{display:block!important;width:100%!important;max-width:100%!important;overflow:visible!important;padding:.75rem!important;box-sizing:border-box!important}
    .cupNode{width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;margin:0 0 .65rem!important;grid-template-columns:30px minmax(0,1fr)!important}
    .goalList{display:block!important;overflow:hidden!important}
    .goalRow{display:grid!important;width:100%!important;max-width:100%!important;min-width:0!important;grid-template-columns:26px minmax(0,1fr) 40px!important;grid-template-rows:auto 12px!important;column-gap:.55rem!important;row-gap:.42rem!important;align-items:center!important;padding:.72rem 0!important;box-sizing:border-box!important}
    .goalRow>b{grid-column:1!important;grid-row:1!important}
    .goalRow>strong{grid-column:2!important;grid-row:1!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    .goalRow>span{grid-column:3!important;grid-row:1!important;text-align:right!important;font-size:.95rem!important}
    .goalBar{grid-column:2/4!important;grid-row:2!important;position:relative!important;display:block!important;width:100%!important;height:10px!important;min-width:0!important;background:#eee9e1!important;overflow:hidden!important}
    .goalBar>i{position:absolute!important;left:0!important;top:0!important;bottom:0!important;display:block!important;height:100%!important;width:var(--bar)!important;max-width:100%!important;background:#d51f2b!important;transform:none!important}
    .squadHead,.squadRow{width:100%!important;max-width:100%!important;min-width:0!important;grid-template-columns:minmax(0,1fr) 50px 50px!important;gap:.4rem!important;box-sizing:border-box!important}
    .squadPlayer{min-width:0!important}.squadPlayer strong{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    .transferColumns{grid-template-columns:1fr!important;gap:1px!important;overflow:hidden!important}
    .transferColumns article{min-width:0!important;width:100%!important}
    .transferRow{width:100%!important;max-width:100%!important;min-width:0!important;grid-template-columns:minmax(0,1fr) auto!important;gap:.55rem!important;box-sizing:border-box!important}
    .transferIdentity{min-width:0!important}.transferIdentity>div:last-child{min-width:0!important}.transferIdentity strong{overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    .transferRoute{grid-column:1/-1!important;grid-template-columns:34px minmax(0,1fr)!important;padding-left:44px!important;min-width:0!important}
    .leagueTable{overflow:hidden!important}
    .leagueTableHead,.leagueTableRow.compact{width:100%!important;min-width:0!important;grid-template-columns:42px minmax(0,1fr) 46px 46px!important;padding:.62rem .5rem!important;box-sizing:border-box!important}
    .leagueTableHead .desktopCol,.leagueTableRow.compact .desktopCol{display:none!important}
    .leagueClub{min-width:0!important}.leagueClub span{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:.7rem!important}
    .matchRow{width:100%!important;max-width:100%!important;min-width:0!important;grid-template-columns:minmax(0,1fr) 18px!important;gap:.45rem!important;padding:.7rem 0!important;box-sizing:border-box!important}
    .matchMeta{grid-column:1/-1!important;display:flex!important;justify-content:space-between!important;gap:.5rem!important;min-width:0!important}
    .matchMeta small{max-width:48%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;text-align:right!important}
    .matchTeams{grid-template-columns:minmax(0,1fr) 54px minmax(0,1fr)!important;gap:.35rem!important;min-width:0!important;font-size:.68rem!important}
    .matchTeams span{min-width:0!important;overflow-wrap:anywhere!important}.matchTeams em{font-size:.88rem!important}
   }
  `}</style>
 </section>
}
