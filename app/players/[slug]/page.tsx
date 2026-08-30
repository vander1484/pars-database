import Link from "next/link";

const slugs=[
  'mccathie-norrie','dickson-charlie','edwards-alex','barry-roy','paton-bert','lunn-john','leishman-jim','kozma-istvan','peebles-george','connachan-eddie','crawford-stevie','smith-andy','mailer-ron','cunningham-willie','nicholson-barry','brewster-craig','whyte-hugh','gardner-pat','herriot-jim','callaghan-willie-1','thomson-scott','skerla-andrius','mason-gary','french-hamish','westwater-ian','petrie-stewart','tod-andy','dair-jason','ruitenbeek-marco','bullen-lee','shields-greg','morrison-steve','thomson-kenny','ferguson-alex','watson-john','jenkins-grant','sinclair-jackie','miller-george','mcnamara-jackie','thomson-jim','robertson-bobby','smith-alex','jack-ross','mcnaughton-sandy','donnelly-paul','maclean-jim','mccall-ian','rhodes-andy','cushley-john','bowie-jim'
];

export function generateStaticParams(){
  return slugs.map(slug=>({slug}));
}

export default async function LegacyPlayerPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const destination=`../../player/?slug=${encodeURIComponent(slug)}`;
  return <main style={{minHeight:'70vh',display:'grid',placeItems:'center',padding:'3rem',textAlign:'center'}}>
    <meta httpEquiv="refresh" content={`0; url=${destination}`}/>
    <div>
      <p style={{fontWeight:900,letterSpacing:'.12em',fontSize:'.7rem'}}>PARS DATABASE</p>
      <h1>Opening player profile…</h1>
      <p><Link href={`/player/?slug=${slug}`}>Continue to the player profile →</Link></p>
    </div>
  </main>;
}
