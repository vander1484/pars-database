import "./map-fix.css";
import MapRuntimeFix from "./MapRuntimeFix";

export default function EuropeLayout({children}:{children:React.ReactNode}){
  return <>{children}<MapRuntimeFix/></>;
}
