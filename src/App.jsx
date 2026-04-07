import { useState, useRef } from "react";

const DEFAULT_GRADE_PRICES = {
  "A193 B7":{base:7.50},"A193 B7M":{base:7.50},"A320 L7":{base:8.50},"A320 L7M":{base:8.50},
  "A453 GR660":{base:12.00},"A193 B8M":{base:11.00},"A193 B8":{base:11.00},"SS 316":{base:10.00},"SS 304":{base:9.00},
};
const FINISH_COSTS={"TC":20.0,"SDG":15.0,"ZINC PLATING":8.0};
const INCOTERM_PCT={"EXW":0,"FOB":2,"CIF":4,"DDP":7};
const PAYMENT_PCT={"Advance":-2,"LC":0,"30 Days Credit":2,"60 Days Credit":4};
const USD_RATE=0.272;
const BULK_TIERS=[{minKg:0,pct:0},{minKg:500,pct:2},{minKg:1000,pct:4},{minKg:5000,pct:6}];

const STUD_BOLT_INCH={
  "0.5":{60:0.111,65:0.115,70:0.119,85:0.131},
  "0.625":{80:0.216,85:0.222,90:0.229,95:0.235,100:0.241,105:0.248,110:0.254},
  "0.75":{105:0.379,110:0.389,115:0.398,125:0.416,135:0.435},
  "0.875":{115:0.575,125:0.600,140:0.638,145:0.651,165:0.702},
  "1":{140:0.873,160:0.939},"1.125":{150:1.206,160:1.249,180:1.335,190:1.378},
  "1.25":{180:1.716,200:1.824,215:1.904,220:1.931,240:2.039},
  "1.375":{260:2.692,300:2.957,320:3.089,330:3.155},"1.5":{280:3.471},
  "1.625":{290:4.260,370:5.014,450:5.768},"2":{430:9.067,475:9.724,585:11.329},
  "2.5":{510:17.131},"3":{690:32.163,845:37.396},"3.5":{800:51.205},
};
const HEX_BOLT_INCH={"0.375":{30:0.023},"0.5":{40:0.059},"0.875":{147:0.549}};
const HVY_HEX_BOLT_INCH={"0.5":{40:0.210},"0.875":{147:0.566}};
const HEX_SCREW_INCH={"0.375":{30:0.026},"0.5":{40:0.053},"0.875":{147:0.503}};
const HVY_HEX_SCREW_INCH={"0.5":{40:0.055},"0.875":{147:0.512}};
const SHCS_INCH={"0.25":{15:0.006,20:0.008},"0.375":{20:0.021,25:0.024,30:0.026,35:0.029},"0.5":{30:0.052,35:0.057},"0.875":{50:0.271,55:0.286},"1.25":{140:1.215,275:2.054}};
const SHCS_MM={6:{15:0.006},12:{25:0.041}};
const GRUB_MM={6:{10:0.006,15:0.006},10:{20:0.023,35:0.030}};
const FTS_MM={16:{75:0.106,80:0.112},20:{70:0.155},30:{125:0.614},36:{135:0.961,145:1.03,150:1.064}};
const FTS_INCH={"0.625":{95:0.127,110:0.146},"2.75":{310:8.901,330:9.466}};
const UBOLT_INCH={"0.315":{67:0.050,90:0.070}};
const HEX_NUT_MM={20:0.065,24:0.110,30:0.225,36:0.395,42:0.660,48:0.980,56:1.450,64:1.980};
const HVY_HEX_NUT_MM={20:0.106,24:0.185,30:0.340,36:0.590,42:0.900,48:1.350,56:1.950,64:2.650};
const HEX_LOCK_MM={20:0.036,24:0.058,30:0.110,36:0.190,42:0.307,48:0.460,56:0.696,64:0.950};
const HVY_HEX_LOCK_MM={20:0.058,24:0.102,30:0.187,36:0.325,42:0.495,48:0.743,56:1.073,64:1.458};
const HEX_NUT_INCH={"0.5":0.018,"0.875":0.088};
const HVY_HEX_NUT_INCH={"0.5":0.030,"0.625":0.054,"0.875":0.135,"2.75":3.350};
const HEX_LOCK_INCH={"0.5":0.012,"0.875":0.054};
const HVY_HEX_LOCK_INCH={"0.5":0.018,"0.875":0.076};
const EXTRA_NUT={
  "Hex Nut":{8:0.005,10:0.008,12:0.014,16:0.025},
  "Hvy Hex Nut":{8:0.005,10:0.012,12:0.020,16:0.056},
  "Hex Lock Nut":{8:0.003,10:0.005,12:0.009,16:0.018},
  "Hvy Hex Lock Nut":{8:0.005,10:0.009,12:0.015,16:0.028},
  "Plain Washer BS4320":{8:0.005,10:0.009,12:0.013,16:0.022},
  "Plain Washer F436":{8:0.008,10:0.013,12:0.018,16:0.028},
  "Spring Washer DIN127":{8:0.005,10:0.008,12:0.011,16:0.018},
};
const PW_BS4320_MM={20:0.017,24:0.031,30:0.051,36:0.088,42:0.177,48:0.287,56:0.403,64:0.467};
const PW_F436M_MM={20:0.032,24:0.045,30:0.063,36:0.091,42:0.220,48:0.276,56:0.380,64:0.450};
const SW_DIN127_MM={20:0.015,24:0.026,30:0.044,36:0.067,42:0.111,48:0.123,56:0.193,64:0.218};
const PW_BS4320_INCH={"0.5":0.006,"0.875":0.018};
const PW_F436_INCH={"0.5":0.011,"0.875":0.034};
const NUT_H_INCH={0.25:0.22,0.375:0.33,0.5:0.41,0.625:0.52,0.75:0.59,0.875:0.67,1:0.78,1.125:0.86,1.25:0.94,1.375:1.03,1.5:1.09,1.625:1.2,2:1.5,2.5:1.88,3:2.25,3.5:2.63};
const COMP={
  "0.5":{"70":2.62,"80":2.79},"0.625":{"90":5.03,"100":5.31},"0.75":{"110":8.55,"120":8.96,"130":9.37},
  "0.875":{"115":15.81,"125":16.51,"140":17.56},"1":{"140":15.27,"160":16.44},
  "1.125":{"150":21.10,"160":21.86,"180":23.36,"190":24.11},
  "1.25":{"180":30.03,"200":31.91,"215":33.33,"220":33.80,"240":35.68},
  "1.375":{"300":51.74,"320":54.06,"330":55.21},"1.5":{"280":60.74},
  "1.625":{"290":74.56,"370":87.75,"450":100.95},"2":{"430":149.61,"475":160.44,"585":186.93},
  "2.5":{"510":282.65},"3":{"690":530.69,"845":617.03},"3.5":{"800":384.04},
};
const BOLT_TYPES=["Stud Bolt","Full Threaded Stud","Hex Bolt","Hvy Hex Bolt","Hex Screw","Hvy Hex Screw","Socket Head Cap Screw","Grub Screw","U Bolt","Hex Nut","Hvy Hex Nut","Hex Lock Nut","Hvy Hex Lock Nut","Plain Washer BS4320","Plain Washer F436","Spring Washer DIN127"];
const NUT_WASHER=["Hex Nut","Hvy Hex Nut","Hex Lock Nut","Hvy Hex Lock Nut","Plain Washer BS4320","Plain Washer F436","Spring Washer DIN127"];
const METRIC_MM=[6,8,10,12,16,20,24,30,36,42,48,56,64];

function getBulk(kg){let p=0;for(const t of BULK_TIERS)if(kg>=t.minKg)p=t.pct;return p;}
function toMM(s){const d=parseFloat(s)*25.4,r=Math.round(d);if(METRIC_MM.includes(r))return r;for(const m of METRIC_MM)if(Math.abs(d-m)<=0.5)return m;return r;}
function interp(tbl,key){
  const k=parseFloat(key),keys=Object.keys(tbl).map(Number).sort((a,b)=>a-b);
  if(tbl[k]!==undefined)return tbl[k];
  for(const ek of keys)if(Math.abs(ek-k)<0.5)return tbl[ek];
  if(k<=keys[0]){const r=(tbl[keys[1]]-tbl[keys[0]])/(keys[1]-keys[0]);return Math.max(0,tbl[keys[0]]+r*(k-keys[0]));}
  if(k>=keys[keys.length-1]){const l1=keys[keys.length-2],l2=keys[keys.length-1];return tbl[l2]+((tbl[l2]-tbl[l1])/(l2-l1))*(k-l2);}
  for(let i=0;i<keys.length-1;i++)if(k>=keys[i]&&k<=keys[i+1])return tbl[keys[i]]+(tbl[keys[i+1]]-tbl[keys[i]])*(k-keys[i])/(keys[i+1]-keys[i]);
  return 0;
}
function nutLook(iT,mT,s,bt){
  const sk=String(parseFloat(s));
  if(iT[sk]!==undefined)return iT[sk];
  const mm=toMM(s);
  if(bt&&EXTRA_NUT[bt]&&EXTRA_NUT[bt][mm]!==undefined)return EXTRA_NUT[bt][mm];
  if(mT[mm]!==undefined)return mT[mm];
  return parseFloat((interp(mT,mm)||0).toFixed(3));
}
function calcW(bt,si,lm,nuts,wash){
  const s=parseFloat(si),l=parseFloat(lm),n=parseInt(nuts)||2,w=parseInt(wash)||0;
  if(!s)return 0;
  const d=s*25.4,mm=toMM(s);
  let wt=0;
  if(bt==="Stud Bolt"){
    const t=STUD_BOLT_INCH[String(s)];
    if(t&&l)wt=parseFloat((interp(t,l)||0).toFixed(3));
    else if(l){const af=1.5*d,nh=0.875*d;wt=(Math.PI/4)*d*d*l*7.85e-6+2*((Math.sqrt(3)/2*af*af)-(Math.PI/4*d*d))*nh*7.85e-6;}
    const af=1.5*d,nh=(NUT_H_INCH[s]||0.875*s)*25.4,sn=((Math.sqrt(3)/2*af*af)-(Math.PI/4*d*d))*nh*7.85e-6;
    if(n!==2)wt+=(n-2)*sn;
  } else if(bt==="Full Threaded Stud"){
    const ti=FTS_INCH[String(s)],tm=FTS_MM[mm];
    if(ti&&l){const v=interp(ti,l);if(v)wt=parseFloat(v.toFixed(3));}
    if(!wt&&tm&&l){const v=interp(tm,l);if(v)wt=parseFloat(v.toFixed(3));}
    if(!wt&&l)for(const k of Object.keys(FTS_MM))if(Math.abs(parseInt(k)-mm)<=1){const v=interp(FTS_MM[k],l);if(v){wt=parseFloat(v.toFixed(3));break;}}
  } else if(bt==="Hex Bolt"){const t=HEX_BOLT_INCH[String(s)];wt=(t&&l)?parseFloat((interp(t,l)||0).toFixed(3)):0;
  } else if(bt==="Hvy Hex Bolt"){const t=HVY_HEX_BOLT_INCH[String(s)];wt=(t&&l)?parseFloat((interp(t,l)||0).toFixed(3)):0;
  } else if(bt==="Hex Screw"){const t=HEX_SCREW_INCH[String(s)];wt=(t&&l)?parseFloat((interp(t,l)||0).toFixed(3)):0;
  } else if(bt==="Hvy Hex Screw"){const t=HVY_HEX_SCREW_INCH[String(s)];wt=(t&&l)?parseFloat((interp(t,l)||0).toFixed(3)):0;
  } else if(bt==="Socket Head Cap Screw"){
    const ti=SHCS_INCH[String(s)],tm=SHCS_MM[mm];
    if(ti&&l){const v=interp(ti,l);if(v)wt=parseFloat(v.toFixed(3));}
    if(!wt&&tm&&l){const v=interp(tm,l);if(v)wt=parseFloat(v.toFixed(3));}
    if(!wt&&l)for(const k of Object.keys(SHCS_MM))if(Math.abs(parseInt(k)-mm)<=1){const v=interp(SHCS_MM[k],l);if(v){wt=parseFloat(v.toFixed(3));break;}}
  } else if(bt==="Grub Screw"){
    let tm=GRUB_MM[mm];
    if(!tm)for(const k of Object.keys(GRUB_MM))if(Math.abs(parseInt(k)-mm)<=1){tm=GRUB_MM[k];break;}
    if(tm&&l)wt=parseFloat((interp(tm,l)||0).toFixed(3));
  } else if(bt==="U Bolt"){const t=UBOLT_INCH[String(s)];if(t&&l)wt=parseFloat((interp(t,l)||0).toFixed(3));
  } else if(bt==="Hex Nut"){wt=nutLook(HEX_NUT_INCH,HEX_NUT_MM,s,"Hex Nut");
  } else if(bt==="Hvy Hex Nut"){wt=nutLook(HVY_HEX_NUT_INCH,HVY_HEX_NUT_MM,s,"Hvy Hex Nut");
  } else if(bt==="Hex Lock Nut"){wt=nutLook(HEX_LOCK_INCH,HEX_LOCK_MM,s,"Hex Lock Nut");
  } else if(bt==="Hvy Hex Lock Nut"){wt=nutLook(HVY_HEX_LOCK_INCH,HVY_HEX_LOCK_MM,s,"Hvy Hex Lock Nut");
  } else if(bt==="Plain Washer BS4320"){wt=nutLook(PW_BS4320_INCH,PW_BS4320_MM,s,"Plain Washer BS4320");
  } else if(bt==="Plain Washer F436"){wt=nutLook(PW_F436_INCH,PW_F436M_MM,s,"Plain Washer F436");
  } else if(bt==="Spring Washer DIN127"){wt=nutLook({},SW_DIN127_MM,s,"Spring Washer DIN127");}
  if(!NUT_WASHER.includes(bt)&&w>0)wt+=w*nutLook(PW_BS4320_INCH,PW_BS4320_MM,s,"Plain Washer BS4320");
  return parseFloat(wt.toFixed(3));
}
function getComp(si,lm){
  const t=COMP[String(parseFloat(si))];if(!t)return null;
  const v=interp(t,parseFloat(lm));return v?parseFloat(v.toFixed(2)):null;
}
function processRows(rows,inco,pay,usd,gp){
  const gw=rows.reduce((s,r)=>s+calcW(r.boltType||"Stud Bolt",r.size,r.length,r.nuts,r.washers)*(parseFloat(r.qty)||1),0);
  const bp=getBulk(gw),ip=INCOTERM_PCT[inco]||0,pp=PAYMENT_PCT[pay]||0,adj=1+(ip+pp-bp)/100;
  return rows.map((r,i)=>{
    const bt=r.boltType||"Stud Bolt";
    const uw=r.unitWeight?parseFloat(r.unitWeight):calcW(bt,r.size,r.length,r.nuts,r.washers);
    const qty=parseFloat(r.qty)||1,tw=parseFloat((uw*qty).toFixed(3));
    const grade=r.grade||"A193 B7",finish=r.finish||"TC";
    const base=gp[grade]?gp[grade].base:7.5,coat=FINISH_COSTS[finish]||20,ppkg=base+coat;
    const uAED=parseFloat((uw*ppkg*adj).toFixed(2)),uUSD=parseFloat((uAED*usd).toFixed(2));
    const tAED=parseFloat((uAED*qty).toFixed(2)),tUSD=parseFloat((uUSD*qty).toFixed(2));
    const cAED=getComp(r.size,r.length),margin=cAED?parseFloat(((uAED-cAED)/cAED*100).toFixed(1)):null;
    return{sno:i+1,...r,unitWt:uw,totalWt:tw,qty,basePrice:base,coating:coat,pricePerKg:ppkg,unitAED:uAED,unitUSD:uUSD,totalAED:tAED,totalUSD:tUSD,compUnitAED:cAED,margin};
  });
}
function newRow(i){return{sno:i,boltType:"Stud Bolt",size:"0.5",length:"",qty:"1",grade:"A193 B7",nutGrade:"",finish:"TC",nuts:2,washers:0,unitWeight:null,gradeIsNew:false};}

export default function App(){
  const [tab,setTab]=useState("calc");
  const [incoterm,setIncoterm]=useState("FOB");
  const [payment,setPayment]=useState("LC");
  const [usdRate,setUsdRate]=useState(USD_RATE);
  const [pasteMode,setPasteMode]=useState("excel");
  const [pasteText,setPasteText]=useState("");
  const [image,setImage]=useState(null);
  const [imageData,setImageData]=useState(null);
  const [loading,setLoading]=useState(false);
  const [rows,setRows]=useState([]);
  const [results,setResults]=useState([]);
  const [summary,setSummary]=useState(null);
  const [status,setStatus]=useState("");
  const [copied,setCopied]=useState(false);
  const [gradePrices,setGradePrices]=useState(DEFAULT_GRADE_PRICES);
  const [newGrades,setNewGrades]=useState([]);
  const [newGrade,setNewGrade]=useState({name:"",base:""});
  const [history,setHistory]=useState([
    {date:"2025-12-10",desc:"A193 B7 multiple sizes",totalUSD:4200,won:false},
    {date:"2026-01-15",desc:"A320 L7M bulk order",totalUSD:7800,won:true},
  ]);
  const [wonFilter,setWonFilter]=useState("all");
  const fileRef=useRef();
  const excelRef=useRef();

  const handleImage=(file)=>{
    if(!file)return;
    const r=new FileReader();
    r.onload=(e)=>{setImage(e.target.result);setImageData(e.target.result.split(",")[1]);setRows([]);setResults([]);setSummary(null);setStatus("");};
    r.readAsDataURL(file);
  };

  const handleExcel=async(file)=>{
    if(!file)return;
    setLoading(true);setStatus("Reading file...");
    try{
      const ext=file.name.split(".").pop().toLowerCase();
      let text="";
      if(ext==="csv"){
        text=await file.text();
      } else {
        await new Promise((res,rej)=>{
          if(window.XLSX){res();return;}
          const s=document.createElement("script");
          s.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
          s.onload=res;s.onerror=rej;
          document.head.appendChild(s);
        });
        const buf=await file.arrayBuffer();
        const wb=window.XLSX.read(buf,{type:"array"});
        const ws=wb.Sheets[wb.SheetNames[0]];
        text=window.XLSX.utils.sheet_to_csv(ws);
      }
      // Clean: remove empty lines and lines with no meaningful content
      const cleaned=text.split("\n")
        .map(l=>l.trim())
        .filter(l=>{
          if(!l||l.replace(/,/g,"").trim()==="")return false;
          // Keep lines that have at least some alphanumeric content
          return /[a-zA-Z0-9]/.test(l);
        })
        .join("\n");
      setPasteText(cleaned);
      setStatus("File loaded ("+cleaned.split("\n").length+" rows) — click Process");
    }catch(e){setStatus("Could not read file: "+e.message);}
    setLoading(false);
  };

  const buildPrompt=(kg,data)=>"You are reading MTO data for fasteners. Extract ALL rows. Return JSON array, each object:\n- itemNo: item/commodity code\n- sno: row number\n- boltType: 'Hvy Hex Nut' for A194 Gr.2H/2HM/7M/7L nuts, 'Hex Nut' for standard. Others: Stud Bolt, Full Threaded Stud, Hex Bolt, Hvy Hex Bolt, Hex Screw, Hvy Hex Screw, Socket Head Cap Screw, Grub Screw, U Bolt, Hex Lock Nut, Hvy Hex Lock Nut, Plain Washer BS4320, Plain Washer F436, Spring Washer DIN127\n- size: inches decimal. Metric: M6=0.236,M8=0.315,M10=0.394,M12=0.472,M16=0.630,M20=0.787,M24=0.945,M30=1.181,M36=1.417,M42=1.654,M48=1.890. Inch: 1/4=0.25,3/8=0.375,1/2=0.5,5/8=0.625,3/4=0.75,7/8=0.875,1-1/4=1.25,1-3/8=1.375,1-1/2=1.5\n- length: mm or null for nuts/washers\n- qty: total quantity\n- grade: known: "+kg+"\n- nutGrade: 2H/2HM/7M/7L or null\n- finish: TC/SDG/ZINC PLATING\n- nuts: default 2\n- washers: default 0\n- unitWeight: if visible else null\n- gradeIsNew: true if not in: "+kg+"\n\n"+data+"\n\nReturn ONLY valid JSON array.";

  const extract=async(type)=>{
    setLoading(true);setStatus(type==="image"?"Reading image...":"Processing data...");
    try{
      const kg=Object.keys(gradePrices).join(", ");
      let allParsed=[];

      if(type==="image"){
        const msgs=[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/png",data:imageData}},{type:"text",text:buildPrompt(kg,"")}]}];
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,messages:msgs})});
        const data=await res.json();
        if(data.error){setStatus("API error: "+data.error.message);setLoading(false);return;}
        const text=data.content.map(c=>c.text||"").join("").trim();
        allParsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      } else {
        // Split into batches of ~3000 chars each
        const lines=pasteText.split("\n");
        const header=lines.slice(0,3).join("\n"); // keep first 3 rows as header context
        const dataLines=lines.slice(3);
        const BATCH=40; // ~40 rows per batch
        const batches=[];
        for(let i=0;i<dataLines.length;i+=BATCH){
          batches.push(dataLines.slice(i,i+BATCH).join("\n"));
        }
        setStatus("Processing "+batches.length+" batch(es) of rows...");
        for(let b=0;b<batches.length;b++){
          setStatus("Processing batch "+(b+1)+" of "+batches.length+"...");
          const batchData=header+"\n"+batches[b];
          const msgs=[{role:"user",content:buildPrompt(kg,"Here is the Excel data (CSV format):\n\n"+batchData)}];
          const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,messages:msgs})});
          const data=await res.json();
          if(data.error){setStatus("API error on batch "+(b+1)+": "+data.error.message);setLoading(false);return;}
          const text=data.content.map(c=>c.text||"").join("").trim();
          const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
          allParsed=[...allParsed,...parsed];
        }
      }

      const up={...gradePrices};const disc=[];
      for(const row of allParsed)if(row.gradeIsNew&&row.grade&&!up[row.grade]){up[row.grade]={base:9.0,estimated:true};disc.push(row.grade);}
      if(disc.length){setGradePrices(up);setNewGrades(p=>[...new Set([...p,...disc])]);}
      setRows(allParsed);
      setStatus("Extracted "+allParsed.length+" rows"+(disc.length?" + "+disc.length+" new grade(s)":""));
    }catch(e){setStatus("Error: "+e.message);}
    setLoading(false);
  };

  const addRow=()=>setRows(r=>[...r,newRow(r.length+1)]);
  const removeRow=(i)=>setRows(r=>r.filter((_,j)=>j!==i));
  const upd=(i,f,v)=>setRows(r=>r.map((x,j)=>j===i?{...x,[f]:v}:x));

  const calculate=()=>{
    if(!rows.length)return;
    const res=processRows(rows,incoterm,payment,usdRate,gradePrices);
    const tUSD=parseFloat(res.reduce((s,r)=>s+r.totalUSD,0).toFixed(2));
    const tAED=parseFloat(res.reduce((s,r)=>s+r.totalAED,0).toFixed(2));
    const gw=parseFloat(res.reduce((s,r)=>s+r.totalWt,0).toFixed(2));
    setResults(res);setSummary({totalUSD:tUSD,totalAED:tAED,grandTotalWt:gw,bulkPct:getBulk(gw),incoPct:INCOTERM_PCT[incoterm]||0,payPct:PAYMENT_PCT[payment]||0});
  };

  const addGrade=()=>{if(!newGrade.name||!newGrade.base)return;setGradePrices(p=>({...p,[newGrade.name]:{base:parseFloat(newGrade.base)}}));setNewGrade({name:"",base:""});};

  const copyTable=()=>{
    const h=["Item No","Type","Size","Length","Qty","Grade","Nut","Finish","Nuts","Washers","Unit Wt","Total Wt","Base/kg","Coat/kg","Total/kg","Unit AED","Unit USD","Total USD","Comp AED","Margin"].join("\t");
    const d=results.map(r=>[r.itemNo||r.sno,r.boltType||"Stud Bolt",r.size,r.length||"-",r.qty,r.grade,r.nutGrade||"-",r.finish,r.nuts||2,r.washers||0,r.unitWt,r.totalWt,r.basePrice.toFixed(3),r.coating.toFixed(3),r.pricePerKg.toFixed(3),r.unitAED,r.unitUSD,r.totalUSD,r.compUnitAED||"-",r.margin!==null?r.margin+"%":"-"].join("\t"));
    const el=document.createElement("textarea");el.value=[h,...d].join("\n");el.style.position="fixed";el.style.opacity="0";
    document.body.appendChild(el);el.focus();el.select();document.execCommand("copy");document.body.removeChild(el);
    setCopied(true);setTimeout(()=>setCopied(false),2000);
  };

  const st={
    card:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:16,marginBottom:14},
    label:{fontSize:11,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:0.8,marginBottom:4,display:"block"},
    input:{padding:"7px 10px",borderRadius:7,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(0,0,0,0.3)",color:"#e2e8f0",fontSize:12,width:"100%",boxSizing:"border-box",outline:"none"},
    sel:{padding:"7px 10px",borderRadius:7,border:"1px solid rgba(255,255,255,0.12)",background:"#1e293b",color:"#e2e8f0",fontSize:13,width:"100%",outline:"none"},
    th:{padding:"8px 10px",color:"#64748b",fontWeight:600,textAlign:"left",whiteSpace:"nowrap",fontSize:11},
    td:{padding:"8px 10px",whiteSpace:"nowrap",fontSize:12,color:"#e2e8f0"},
  };

  const fh=history.filter(e=>wonFilter==="all"||(wonFilter==="won"&&e.won===true)||(wonFilter==="lost"&&e.won===false)||(wonFilter==="pending"&&e.won===null));

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0d1117 0%,#0f1e2e 50%,#0d1117 100%)",color:"#e2e8f0",fontFamily:"'Segoe UI',sans-serif",padding:"24px 12px"}}>
      <div style={{maxWidth:1400,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <svg viewBox="0 0 240 235" width="75" style={{display:"block",margin:"0 auto 8px"}}>
            <polygon points="120,4 210,52 210,148 120,196 30,148 30,52" fill="#1e3a8a"/>
            <polygon points="120,18 198,62 198,148 120,182 42,148 42,62" fill="white"/>
            <polygon points="120,30 188,70 188,142 120,172 52,142 52,70" fill="#1e3a8a"/>
            <text x="120" y="122" textAnchor="middle" fontFamily="'Segoe UI',sans-serif" fontWeight="800" fontSize="52" fill="white">TM</text>
            <text x="120" y="218" textAnchor="middle" fontFamily="'Segoe UI',sans-serif" fontWeight="600" fontSize="19" fill="#94a3b8" letterSpacing="3">TECHNICAL METAL</text>
          </svg>
          <h1 style={{fontSize:22,fontWeight:800,margin:0,background:"linear-gradient(to right,#60a5fa,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>MTO Pricing Calculator</h1>
          <p style={{color:"#475569",fontSize:13,marginTop:4}}>Stud Bolts · Hex Bolts · Nuts · Washers</p>
        </div>

        <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
          {[["calc","Calculator"],["grades","Grade Prices"],["history","Win/Loss"]].map(([k,v])=>(
            <button key={k} onClick={()=>setTab(k)} style={{padding:"8px 20px",borderRadius:8,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,background:tab===k?"#3b82f6":"rgba(255,255,255,0.06)",color:tab===k?"#fff":"#94a3b8",position:"relative"}}>
              {v}
              {k==="grades"&&newGrades.length>0&&<span style={{position:"absolute",top:-4,right:-4,background:"#f59e0b",color:"#000",borderRadius:"50%",width:16,height:16,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{newGrades.length}</span>}
            </button>
          ))}
        </div>

        {tab==="calc"&&(
          <div>
            <div style={st.card}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
                <div><label style={st.label}>Incoterms</label>
                  <select value={incoterm} onChange={e=>setIncoterm(e.target.value)} style={st.sel}>
                    {Object.entries(INCOTERM_PCT).map(([k,v])=><option key={k} value={k}>{k} (+{v}%)</option>)}
                  </select>
                </div>
                <div><label style={st.label}>Payment Terms</label>
                  <select value={payment} onChange={e=>setPayment(e.target.value)} style={st.sel}>
                    {Object.entries(PAYMENT_PCT).map(([k,v])=><option key={k} value={k}>{k} ({v>=0?"+":""}{v}%)</option>)}
                  </select>
                </div>
                <div><label style={st.label}>USD Rate (1 AED =)</label>
                  <input type="number" value={usdRate} onChange={e=>setUsdRate(parseFloat(e.target.value))} step="0.001" style={st.input}/>
                </div>
              </div>
            </div>

            <div style={st.card}>
              <div style={{display:"flex",gap:8,marginBottom:14}}>
                {[["excel","📊 Upload Excel"],["image","📸 Upload Screenshot"]].map(([k,v])=>(
                  <button key={k} onClick={()=>setPasteMode(k)} style={{padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,background:pasteMode===k?"#3b82f6":"rgba(255,255,255,0.06)",color:pasteMode===k?"#fff":"#94a3b8"}}>{v}</button>
                ))}
              </div>

              {pasteMode==="excel"&&(
                <>
                  <input ref={excelRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e=>handleExcel(e.target.files[0])}/>
                  <div onClick={()=>excelRef.current.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleExcel(e.dataTransfer.files[0]);}}
                    style={{border:"2px dashed rgba(52,211,153,0.4)",borderRadius:12,padding:"28px 20px",textAlign:"center",cursor:"pointer",background:"rgba(52,211,153,0.04)"}}>
                    <div style={{fontSize:32,marginBottom:8}}>📊</div>
                    <p style={{color:"#34d399",fontWeight:600,margin:"0 0 4px",fontSize:14}}>Click or drag to upload Excel or CSV file</p>
                    <p style={{color:"#475569",fontSize:12,margin:0}}>Supports .xlsx, .xls, .csv</p>
                  </div>
                  {pasteText&&<p style={{fontSize:12,color:"#34d399",margin:"10px 0 0"}}>File loaded — ready to process</p>}
                  <div style={{display:"flex",gap:10,marginTop:12,alignItems:"center"}}>
                    <button onClick={()=>extract("paste")} disabled={loading||!pasteText.trim()}
                      style={{padding:"9px 24px",background:loading||!pasteText.trim()?"rgba(99,102,241,0.3)":"linear-gradient(135deg,#3b82f6,#6366f1)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:loading||!pasteText.trim()?"not-allowed":"pointer"}}>
                      {loading?"Processing...":"Process File"}
                    </button>
                    <button onClick={()=>{setPasteText("");setRows([]);setResults([]);setSummary(null);setStatus("");}}
                      style={{padding:"9px 16px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,color:"#94a3b8",fontSize:13,cursor:"pointer"}}>Clear</button>
                    {status&&<span style={{fontSize:13,color:status.startsWith("Extracted")||status.includes("loaded")?"#34d399":"#fbbf24"}}>{status}</span>}
                  </div>
                </>
              )}

              {pasteMode==="image"&&(
                <>
                  <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImage(e.target.files[0])}/>
                  <div onClick={()=>fileRef.current.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleImage(e.dataTransfer.files[0]);}}
                    style={{border:"2px dashed rgba(99,102,241,0.4)",borderRadius:12,padding:"28px 20px",textAlign:"center",cursor:"pointer",background:"rgba(99,102,241,0.05)"}}>
                    {image?<img src={image} style={{maxHeight:160,maxWidth:"100%",borderRadius:8,objectFit:"contain"}} alt="uploaded"/>:<>
                      <div style={{fontSize:28,marginBottom:6}}>📸</div>
                      <p style={{color:"#60a5fa",fontWeight:600,margin:"0 0 4px",fontSize:14}}>Click or drag to upload MTO screenshot</p>
                    </>}
                  </div>
                  {image&&(
                    <div style={{display:"flex",gap:10,marginTop:12,alignItems:"center"}}>
                      <button onClick={()=>extract("image")} disabled={loading}
                        style={{padding:"9px 24px",background:loading?"rgba(99,102,241,0.3)":"linear-gradient(135deg,#3b82f6,#6366f1)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:loading?"not-allowed":"pointer"}}>
                        {loading?"Reading...":"Extract Data"}
                      </button>
                      <button onClick={()=>{setImage(null);setImageData(null);setRows([]);setResults([]);setSummary(null);setStatus("");}}
                        style={{padding:"9px 16px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,color:"#94a3b8",fontSize:13,cursor:"pointer"}}>Clear</button>
                      {status&&<span style={{fontSize:13,color:status.startsWith("Extracted")?"#34d399":"#fbbf24"}}>{status}</span>}
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
              <button onClick={addRow} style={{padding:"9px 20px",background:"rgba(99,102,241,0.2)",border:"1px solid rgba(99,102,241,0.4)",borderRadius:8,color:"#a78bfa",fontSize:13,cursor:"pointer",fontWeight:600}}>+ Add Row</button>
              {rows.length>0&&<button onClick={calculate} style={{padding:"9px 24px",background:"linear-gradient(135deg,#3b82f6,#6366f1)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",boxShadow:"0 4px 16px rgba(99,102,241,0.4)"}}>Calculate</button>}
              {rows.length>0&&<button onClick={()=>{setRows([]);setResults([]);setSummary(null);}} style={{padding:"9px 16px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,color:"#94a3b8",fontSize:13,cursor:"pointer"}}>Clear All</button>}
            </div>

            {rows.length>0&&(
              <div style={st.card}>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                      {["#","Type","Size","Length","Qty","Grade","Nut Grade","Finish","Nuts","Washers",""].map(h=><th key={h} style={st.th}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {rows.map((r,i)=>(
                        <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                          <td style={st.td}>{r.itemNo||r.sno||i+1}</td>
                          <td style={st.td}><select value={r.boltType||"Stud Bolt"} onChange={e=>upd(i,"boltType",e.target.value)} style={{...st.sel,width:160}}>{BOLT_TYPES.map(t=><option key={t}>{t}</option>)}</select></td>
                          <td style={st.td}><input type="number" value={r.size} onChange={e=>upd(i,"size",e.target.value)} style={{...st.input,width:65}}/></td>
                          <td style={st.td}>{NUT_WASHER.includes(r.boltType)?<span style={{color:"#475569",fontSize:11}}>N/A</span>:<input type="number" value={r.length||""} onChange={e=>upd(i,"length",e.target.value)} placeholder="-" style={{...st.input,width:65}}/>}</td>
                          <td style={st.td}><input type="number" value={r.qty} onChange={e=>upd(i,"qty",e.target.value)} style={{...st.input,width:65}}/></td>
                          <td style={st.td}><select value={r.grade||"A193 B7"} onChange={e=>upd(i,"grade",e.target.value)} style={{...st.sel,width:120}}>{Object.keys(gradePrices).map(g=><option key={g}>{g}</option>)}</select></td>
                          <td style={st.td}><input value={r.nutGrade||""} onChange={e=>upd(i,"nutGrade",e.target.value)} style={{...st.input,width:55}} placeholder="-"/></td>
                          <td style={st.td}><select value={r.finish||"TC"} onChange={e=>upd(i,"finish",e.target.value)} style={{...st.sel,width:120}}>{Object.keys(FINISH_COSTS).map(f=><option key={f}>{f}</option>)}</select></td>
                          <td style={st.td}><input type="number" value={r.nuts||2} onChange={e=>upd(i,"nuts",e.target.value)} style={{...st.input,width:45}}/></td>
                          <td style={st.td}><input type="number" value={r.washers||0} onChange={e=>upd(i,"washers",e.target.value)} style={{...st.input,width:45}}/></td>
                          <td style={st.td}><button onClick={()=>removeRow(i)} style={{padding:"4px 8px",background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:6,color:"#ef4444",cursor:"pointer",fontSize:14}}>x</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {summary&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:14}}>
                {[{label:"Rows",val:results.length},{label:"Total Weight",val:summary.grandTotalWt+" kg"},{label:"Bulk Discount",val:"-"+summary.bulkPct+"%",color:"#34d399"},{label:"Incoterm Adj",val:"+"+summary.incoPct+"%"},{label:"Total AED",val:summary.totalAED.toLocaleString()},{label:"Total USD",val:"$"+summary.totalUSD.toLocaleString(),color:"#34d399"}].map((c,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"12px 14px"}}>
                    <div style={{fontSize:11,color:"#64748b",marginBottom:4}}>{c.label}</div>
                    <div style={{fontSize:15,fontWeight:700,color:c.color||"#e2e8f0"}}>{c.val}</div>
                  </div>
                ))}
              </div>
            )}

            {results.length>0&&(
              <div style={{...st.card,border:"1px solid rgba(52,211,153,0.2)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <span style={{fontSize:12,color:"#64748b"}}>{results.length} rows calculated</span>
                  <button onClick={copyTable} style={{padding:"7px 16px",background:copied?"rgba(52,211,153,0.2)":"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:8,color:"#34d399",fontSize:12,cursor:"pointer",fontWeight:600}}>{copied?"Copied!":"Copy to Excel"}</button>
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                      {["#","Type","Size","Length","Qty","Grade","Nut","Finish","Nuts","Wsh","Unit Wt","Total Wt","Base/kg","Coat/kg","Total/kg","Unit AED","Unit USD","Total USD","Comp AED","Margin"].map(h=><th key={h} style={st.th}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {results.map((r,i)=>(
                        <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.05)",background:i%2===0?"transparent":"rgba(255,255,255,0.02)"}}>
                          <td style={st.td}>{r.itemNo||r.sno}</td>
                          <td style={st.td}>{r.boltType||"Stud Bolt"}</td>
                          <td style={st.td}>{r.size}"</td>
                          <td style={st.td}>{r.length?r.length+"mm":"-"}</td>
                          <td style={st.td}>{r.qty}</td>
                          <td style={st.td}>{r.grade}{r.gradeIsNew&&<span style={{marginLeft:4,fontSize:10,padding:"2px 5px",borderRadius:4,background:"rgba(245,158,11,0.2)",color:"#f59e0b"}}>NEW</span>}</td>
                          <td style={st.td}>{r.nutGrade||"-"}</td>
                          <td style={st.td}>{r.finish}</td>
                          <td style={st.td}>{r.nuts||2}</td>
                          <td style={st.td}>{r.washers||0}</td>
                          <td style={st.td}>{r.unitWt}</td>
                          <td style={st.td}>{r.totalWt}</td>
                          <td style={st.td}>{r.basePrice.toFixed(3)}</td>
                          <td style={st.td}>{r.coating.toFixed(3)}</td>
                          <td style={st.td}>{r.pricePerKg.toFixed(3)}</td>
                          <td style={{...st.td,color:"#34d399"}}>{r.unitAED}</td>
                          <td style={{...st.td,color:"#34d399"}}>{r.unitUSD}</td>
                          <td style={{...st.td,color:"#34d399",fontWeight:700}}>{r.totalUSD}</td>
                          <td style={{...st.td,color:"#94a3b8"}}>{r.compUnitAED||"-"}</td>
                          <td style={{...st.td,fontWeight:600,color:r.margin===null?"#64748b":r.margin>0?"#f87171":"#34d399"}}>{r.margin!==null?(r.margin>0?"+":"")+r.margin+"%":"-"}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot><tr style={{borderTop:"2px solid rgba(255,255,255,0.1)"}}>
                      <td colSpan={17} style={{...st.td,color:"#94a3b8",fontWeight:700,textAlign:"right"}}>TOTAL USD</td>
                      <td style={{...st.td,color:"#34d399",fontWeight:800,fontSize:14}}>${summary&&summary.totalUSD.toLocaleString()}</td>
                      <td colSpan={2}></td>
                    </tr></tfoot>
                  </table>
                </div>
                <div style={{marginTop:14,display:"flex",justifyContent:"space-between"}}>
                  <button onClick={()=>setHistory(h=>[{date:new Date().toISOString().split("T")[0],desc:results.length+" line items",totalUSD:summary.totalUSD,won:null},...h])}
                    style={{padding:"8px 18px",background:"rgba(99,102,241,0.2)",border:"1px solid rgba(99,102,241,0.4)",borderRadius:8,color:"#a78bfa",fontSize:13,cursor:"pointer",fontWeight:600}}>Save to History</button>
                  <span style={{fontSize:14,fontWeight:700,color:"#34d399"}}>Total: ${summary&&summary.totalUSD.toLocaleString()} USD</span>
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="grades"&&(
          <div style={st.card}>
            <p style={{fontSize:13,color:"#64748b",marginTop:0}}>Set base material price per kg for each grade.</p>
            {newGrades.length>0&&(
              <div style={{marginBottom:16,padding:"12px 14px",background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:10}}>
                <p style={{margin:"0 0 6px",fontSize:12,color:"#f59e0b",fontWeight:600}}>New grades detected — set correct prices:</p>
                {newGrades.map(g=><span key={g} style={{display:"inline-block",margin:"2px 4px",padding:"3px 10px",borderRadius:6,background:"rgba(245,158,11,0.15)",color:"#f59e0b",fontSize:12}}>{g}</span>)}
              </div>
            )}
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,marginBottom:20}}>
              <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                {["Grade","Base Price (AED/kg)","Coating","Total/kg",""].map(h=><th key={h} style={st.th}>{h}</th>)}
              </tr></thead>
              <tbody>
                {Object.entries(gradePrices).map(([grade,p])=>(
                  <tr key={grade} style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                    <td style={st.td}>{grade}{p.estimated&&<span style={{marginLeft:6,fontSize:10,padding:"2px 5px",borderRadius:4,background:"rgba(245,158,11,0.2)",color:"#f59e0b"}}>EST</span>}</td>
                    <td style={st.td}><input type="number" value={p.base} step="0.5" onChange={e=>setGradePrices(prev=>({...prev,[grade]:{base:parseFloat(e.target.value),estimated:false}}))} style={{...st.input,width:90}}/></td>
                    <td style={{...st.td,color:"#64748b"}}>20.000</td>
                    <td style={{...st.td,color:"#34d399",fontWeight:600}}>{(p.base+20).toFixed(3)}</td>
                    <td style={st.td}><button onClick={()=>{const np={...gradePrices};delete np[grade];setGradePrices(np);setNewGrades(g=>g.filter(x=>x!==grade));}} style={{padding:"3px 10px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:6,color:"#ef4444",fontSize:11,cursor:"pointer"}}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:14}}>
              <p style={{margin:"0 0 10px",fontSize:12,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:0.8}}>Add New Grade</p>
              <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
                <div style={{flex:1}}><label style={st.label}>Grade Name</label><input value={newGrade.name} onChange={e=>setNewGrade(g=>({...g,name:e.target.value}))} placeholder="e.g. A193 B16" style={st.input}/></div>
                <div style={{width:120}}><label style={st.label}>Base Price AED/kg</label><input type="number" value={newGrade.base} onChange={e=>setNewGrade(g=>({...g,base:e.target.value}))} placeholder="e.g. 8.5" style={st.input}/></div>
                <button onClick={addGrade} style={{padding:"8px 20px",background:"linear-gradient(135deg,#3b82f6,#6366f1)",color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",whiteSpace:"nowrap"}}>+ Add Grade</button>
              </div>
            </div>
          </div>
        )}

        {tab==="history"&&(
          <div style={st.card}>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {[["all","All"],["won","Won"],["lost","Lost"],["pending","Pending"]].map(([k,v])=>(
                <button key={k} onClick={()=>setWonFilter(k)} style={{padding:"6px 14px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
                  background:wonFilter===k?(k==="won"?"rgba(52,211,153,0.3)":k==="lost"?"rgba(248,113,113,0.3)":"rgba(59,130,246,0.3)"):"rgba(255,255,255,0.06)",
                  color:wonFilter===k?(k==="won"?"#34d399":k==="lost"?"#f87171":"#60a5fa"):"#94a3b8"}}>{v}</button>
              ))}
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                {["Date","Description","Total USD","Result",""].map(h=><th key={h} style={st.th}>{h}</th>)}
              </tr></thead>
              <tbody>
                {fh.map((e,i)=>{
                  const hi=history.indexOf(e);
                  return(
                    <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                      <td style={st.td}>{e.date}</td>
                      <td style={st.td}>{e.desc}</td>
                      <td style={{...st.td,color:"#34d399"}}>${e.totalUSD&&e.totalUSD.toLocaleString()}</td>
                      <td style={st.td}><span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:e.won===true?"rgba(52,211,153,0.2)":e.won===false?"rgba(248,113,113,0.2)":"rgba(255,255,255,0.07)",color:e.won===true?"#34d399":e.won===false?"#f87171":"#64748b"}}>{e.won===true?"WON":e.won===false?"LOST":"PENDING"}</span></td>
                      <td style={st.td}>
                        <div style={{display:"flex",gap:6}}>
                          <button onClick={()=>setHistory(h=>h.map((x,j)=>j===hi?{...x,won:true}:x))} style={{padding:"4px 8px",background:"rgba(52,211,153,0.15)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:6,color:"#34d399",fontSize:11,cursor:"pointer"}}>W</button>
                          <button onClick={()=>setHistory(h=>h.map((x,j)=>j===hi?{...x,won:false}:x))} style={{padding:"4px 8px",background:"rgba(248,113,113,0.15)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:6,color:"#f87171",fontSize:11,cursor:"pointer"}}>L</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
