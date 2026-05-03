import { useState, useEffect, useRef } from "react";
import { loadRoom, saveRoom, subscribeRoom } from "./firebase";

// ─── GOOGLE FONTS ─────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root { --gold:#d4a017; --dark:#080c08; }
    body { background:var(--dark); overflow-x:hidden; }
    .pitch-bg { position:fixed;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,0.012) 60px,rgba(255,255,255,0.012) 61px),repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,0.012) 60px,rgba(255,255,255,0.012) 61px),linear-gradient(180deg,#050a05 0%,#0a150a 15%,#0d1f0d 30%,#0a1a0a 50%,#081408 70%,#050a05 100%);pointer-events:none;z-index:0; }
    .grass-stripes { position:fixed;inset:0;background:repeating-linear-gradient(180deg,rgba(26,74,26,0.18) 0px,rgba(26,74,26,0.18) 40px,rgba(20,61,20,0.12) 40px,rgba(20,61,20,0.12) 80px);pointer-events:none;z-index:0; }
    .stadium-lights { position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 60% 30% at 10% 0%,rgba(255,240,180,0.07) 0%,transparent 70%),radial-gradient(ellipse 60% 30% at 90% 0%,rgba(255,240,180,0.07) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 50% 100%,rgba(30,80,30,0.3) 0%,transparent 60%); }
    .center-circle { position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:320px;height:320px;border:1px solid rgba(255,255,255,0.03);border-radius:50%;pointer-events:none;z-index:0; }
    .center-circle::before { content:'';position:absolute;inset:30px;border:1px solid rgba(255,255,255,0.02);border-radius:50%; }
    .corner-arc { position:fixed;width:80px;height:80px;border:1px solid rgba(255,255,255,0.03);pointer-events:none;z-index:0; }
    .corner-arc.tl{top:-40px;left:-40px;border-radius:0 0 80px 0;} .corner-arc.tr{top:-40px;right:-40px;border-radius:0 0 0 80px;}
    .corner-arc.bl{bottom:-40px;left:-40px;border-radius:0 80px 0 0;} .corner-arc.br{bottom:-40px;right:-40px;border-radius:80px 0 0 0;}
    .content { position:relative;z-index:1; }
    .title-main { font-family:'Bebas Neue',sans-serif;font-size:clamp(42px,10vw,90px);letter-spacing:4px;line-height:0.9;background:linear-gradient(180deg,#f5f0e8 0%,#d4a017 60%,#a07010 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 4px 20px rgba(212,160,23,0.3)); }
    .title-by { font-family:'Crimson Text',serif;font-style:italic;font-size:13px;color:rgba(212,160,23,0.6);letter-spacing:2px;margin-top:4px; }
    .section-label { font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:4px;color:var(--gold); }
    .card { background:rgba(5,12,5,0.85);border:1px solid rgba(212,160,23,0.18);border-radius:12px;padding:20px;backdrop-filter:blur(4px); }
    .card-dark { background:rgba(3,8,3,0.9);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px; }
    .btn-gold { background:linear-gradient(135deg,#c8940e,#d4a017,#e8b820);color:#050a05;border:none;border-radius:8px;padding:13px 28px;font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:3px;cursor:pointer;box-shadow:0 4px 20px rgba(212,160,23,0.35);transition:all 0.2s; }
    .btn-gold:hover{transform:translateY(-1px);box-shadow:0 6px 28px rgba(212,160,23,0.5);}
    .btn-gold:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
    .btn-ghost { background:rgba(255,255,255,0.04);color:#8a7a5a;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:11px 22px;font-family:'Oswald',sans-serif;font-size:14px;letter-spacing:1px;cursor:pointer;transition:all 0.2s; }
    .btn-ghost:hover{border-color:rgba(212,160,23,0.3);color:#d4a017;}
    .field-input { width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(212,160,23,0.2);border-radius:8px;padding:11px 14px;color:#f5f0e8;font-family:'Oswald',sans-serif;font-size:14px;outline:none;transition:border-color 0.2s; }
    .field-input:focus{border-color:rgba(212,160,23,0.5);}
    .field-input::placeholder{color:#3a3020;}
    .field-select { width:100%;background:#050a05;border:1px solid rgba(212,160,23,0.15);border-radius:7px;padding:8px 10px;color:#f5f0e8;font-family:'Oswald',sans-serif;font-size:13px;outline:none; }
    .field-select option{background:#0a150a;}
    .score-bar-track{height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;margin-top:8px;}
    .score-bar-fill{height:100%;border-radius:3px;transition:width 0.8s ease;}
    .tab-btn{font-family:'Bebas Neue',sans-serif;letter-spacing:2px;font-size:14px;border-radius:6px;padding:8px 18px;cursor:pointer;transition:all 0.2s;border:1px solid transparent;}
    .verdict{font-family:'Bebas Neue',sans-serif;letter-spacing:4px;font-size:15px;padding:8px 22px;border-radius:20px;display:inline-block;margin-top:14px;}
    .room-code{font-family:'Bebas Neue',sans-serif;font-size:52px;letter-spacing:10px;color:#d4a017;text-shadow:0 0 30px rgba(212,160,23,0.4);}
    .hit{color:#5dff8a;} .partial{color:#d4a017;} .miss{color:#3a3020;}
    .char-count{font-size:10px;color:#4a3a22;text-align:right;margin-top:3px;font-family:'Oswald',sans-serif;}
    .live-dot{display:inline-block;width:7px;height:7px;background:#5dff8a;border-radius:50%;margin-right:6px;animation:livePulse 1.5s infinite;}
    @keyframes livePulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.7);}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
    .fade-up{animation:fadeUp 0.5s ease forwards;}
    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.6;}}
    .pulse{animation:pulse 2s infinite;}
  `}</style>
);

const MAX_NAME_LENGTH = 24;
const MAX_JOIN_ATTEMPTS = 8;
const JOIN_COOLDOWN_MS = 30000;

const VALID_TEAMS = new Set([
  "México","Sudáfrica","Corea del Sur","Rep. Checa",
  "Canadá","Bosnia-Herzegovina","Qatar","Suiza",
  "Brasil","Marruecos","Haití","Escocia",
  "EE.UU.","Paraguay","Australia","Turquía",
  "Alemania","Curazao","Costa de Marfil","Ecuador",
  "Países Bajos","Japón","Suecia","Túnez",
  "Bélgica","Egipto","Irán","Nueva Zelanda",
  "España","Cabo Verde","Arabia Saudita","Uruguay",
  "Francia","Senegal","Irak","Noruega",
  "Argentina","Argelia","Austria","Jordania",
  "Portugal","Uzbekistán","Colombia","R.D. del Congo",
  "Inglaterra","Croacia","Ghana","Panamá",
]);
const VALID_GROUP_IDS = new Set(["A","B","C","D","E","F","G","H","I","J","K","L"]);
const VALID_POS = new Set(["p1","p2"]);

function sanitizeName(raw) {
  return raw.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑäöÄÖß0-9 .\-_]/g,"").slice(0,MAX_NAME_LENGTH).trimStart();
}
function sanitizeCode(raw) { return raw.replace(/[^A-Z0-9]/g,"").slice(0,12); }
function isValidTeam(val) { return val === "" || VALID_TEAMS.has(val); }

function validateRoom(data) {
  if (!data || typeof data !== "object") return null;
  const required = ["code","created","p1Name","p2Name","p1","p2","results"];
  if (!required.every(k => k in data)) return null;
  if (typeof data.code !== "string" || !/^[A-Z0-9]{4,12}$/.test(data.code)) return null;
  if (typeof data.p1Name !== "string" || typeof data.p2Name !== "string") return null;
  const p1Name = sanitizeName(data.p1Name);
  const p2Name = sanitizeName(data.p2Name);
  if (!p1Name || !p2Name) return null;
  function validatePlayer(p) {
    if (!p || typeof p !== "object") return { preds: null, locked: false };
    const locked = p.locked === true;
    if (!p.preds) return { preds: null, locked };
    const preds = p.preds;
    if (typeof preds !== "object") return { preds: null, locked };
    const grupos = {};
    if (preds.grupos && typeof preds.grupos === "object") {
      for (const gid of Object.keys(preds.grupos)) {
        if (!VALID_GROUP_IDS.has(gid)) continue;
        const g = preds.grupos[gid];
        if (!g || typeof g !== "object") continue;
        grupos[gid] = { p1: isValidTeam(g.p1)?(g.p1||""):"", p2: isValidTeam(g.p2)?(g.p2||""):"" };
      }
    }
    return { preds: { grupos, campeon: isValidTeam(preds.campeon)?(preds.campeon||""):"", finalista: isValidTeam(preds.finalista)?(preds.finalista||""):"" }, locked };
  }
  function validateResults(r) {
    if (!r || typeof r !== "object") return { grupos:{}, campeon:"", finalista:"" };
    const grupos = {};
    if (r.grupos && typeof r.grupos === "object") {
      for (const gid of Object.keys(r.grupos)) {
        if (!VALID_GROUP_IDS.has(gid)) continue;
        const g = r.grupos[gid];
        if (!g || typeof g !== "object") continue;
        grupos[gid] = { p1: isValidTeam(g.p1)?(g.p1||""):"", p2: isValidTeam(g.p2)?(g.p2||""):"" };
      }
    }
    return { grupos, campeon: isValidTeam(r.campeon)?(r.campeon||""):"", finalista: isValidTeam(r.finalista)?(r.finalista||""):"" };
  }
  return { code: data.code, created: typeof data.created==="number"?data.created:Date.now(), p1Name, p2Name, p1: validatePlayer(data.p1), p2: validatePlayer(data.p2), results: validateResults(data.results) };
}

const GRUPOS = [
  { id:"A", equipos:["México","Sudáfrica","Corea del Sur","Rep. Checa"] },
  { id:"B", equipos:["Canadá","Bosnia-Herzegovina","Qatar","Suiza"] },
  { id:"C", equipos:["Brasil","Marruecos","Haití","Escocia"] },
  { id:"D", equipos:["EE.UU.","Paraguay","Australia","Turquía"] },
  { id:"E", equipos:["Alemania","Curazao","Costa de Marfil","Ecuador"] },
  { id:"F", equipos:["Países Bajos","Japón","Suecia","Túnez"] },
  { id:"G", equipos:["Bélgica","Egipto","Irán","Nueva Zelanda"] },
  { id:"H", equipos:["España","Cabo Verde","Arabia Saudita","Uruguay"] },
  { id:"I", equipos:["Francia","Senegal","Irak","Noruega"] },
  { id:"J", equipos:["Argentina","Argelia","Austria","Jordania"] },
  { id:"K", equipos:["Portugal","Uzbekistán","Colombia","R.D. del Congo"] },
  { id:"L", equipos:["Inglaterra","Croacia","Ghana","Panamá"] },
];

const FLAGS = {
  "México":"🇲🇽","Sudáfrica":"🇿🇦","Corea del Sur":"🇰🇷","Rep. Checa":"🇨🇿",
  "Canadá":"🇨🇦","Bosnia-Herzegovina":"🇧🇦","Qatar":"🇶🇦","Suiza":"🇨🇭",
  "Brasil":"🇧🇷","Marruecos":"🇲🇦","Haití":"🇭🇹","Escocia":"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "EE.UU.":"🇺🇸","Paraguay":"🇵🇾","Australia":"🇦🇺","Turquía":"🇹🇷",
  "Alemania":"🇩🇪","Curazao":"🇨🇼","Costa de Marfil":"🇨🇮","Ecuador":"🇪🇨",
  "Países Bajos":"🇳🇱","Japón":"🇯🇵","Suecia":"🇸🇪","Túnez":"🇹🇳",
  "Bélgica":"🇧🇪","Egipto":"🇪🇬","Irán":"🇮🇷","Nueva Zelanda":"🇳🇿",
  "España":"🇪🇸","Cabo Verde":"🇨🇻","Arabia Saudita":"🇸🇦","Uruguay":"🇺🇾",
  "Francia":"🇫🇷","Senegal":"🇸🇳","Irak":"🇮🇶","Noruega":"🇳🇴",
  "Argentina":"🇦🇷","Argelia":"🇩🇿","Austria":"🇦🇹","Jordania":"🇯🇴",
  "Portugal":"🇵🇹","Uzbekistán":"🇺🇿","Colombia":"🇨🇴","R.D. del Congo":"🇨🇩",
  "Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croacia":"🇭🇷","Ghana":"🇬🇭","Panamá":"🇵🇦",
};

const TODOS = [...new Set(GRUPOS.flatMap(g => g.equipos))];
const PUNTOS = { p1:2, p2:1, campeon:10, finalista:5 };
const PLAYER_COLORS = [
  { primary:"#e8417a", secondary:"#ff9cc0", glow:"rgba(232,65,122,0.3)", bg:"rgba(232,65,122,0.08)", border:"rgba(232,65,122,0.25)" },
  { primary:"#1a6fc4", secondary:"#5db0ff", glow:"rgba(26,111,196,0.3)", bg:"rgba(26,111,196,0.08)", border:"rgba(26,111,196,0.25)" },
  { primary:"#e07b20", secondary:"#ffaa55", glow:"rgba(224,123,32,0.3)", bg:"rgba(224,123,32,0.08)", border:"rgba(224,123,32,0.25)" },
  { primary:"#8b2fc9", secondary:"#c06aff", glow:"rgba(139,47,201,0.3)", bg:"rgba(139,47,201,0.08)", border:"rgba(139,47,201,0.25)" },
];

function genCode() {
  const words = ["GOL","COPA","GANA","BOLA","PASE","TIRO","META","ONCE","LIGA","ROJA"];
  const arr = new Uint32Array(2);
  crypto.getRandomValues(arr);
  return `${words[arr[0]%words.length]}${(arr[1]%900000)+100000}`;
}

function calcScore(preds, results) {
  if (!results || !preds) return 0;
  let s = 0;
  GRUPOS.forEach(g => {
    const pr = preds.grupos?.[g.id]; const re = results.grupos?.[g.id];
    if (!pr || !re) return;
    if (pr.p1 && isValidTeam(pr.p1) && pr.p1===re.p1) s+=PUNTOS.p1;
    if (pr.p2 && isValidTeam(pr.p2) && pr.p2===re.p2) s+=PUNTOS.p2;
    if (pr.p1 && isValidTeam(pr.p1) && pr.p1===re.p2) s+=PUNTOS.p2;
    if (pr.p2 && isValidTeam(pr.p2) && pr.p2===re.p1) s+=PUNTOS.p2;
  });
  if (preds.campeon && isValidTeam(preds.campeon) && preds.campeon===results.campeon) s+=PUNTOS.campeon;
  if (preds.finalista && isValidTeam(preds.finalista) && preds.finalista===results.finalista) s+=PUNTOS.finalista;
  return s;
}

function emptyPreds() {
  const grupos = {};
  GRUPOS.forEach(g => { grupos[g.id]={p1:"",p2:""}; });
  return { grupos, campeon:"", finalista:"" };
}

export default function App() {
  const [screen, setScreen]       = useState("home");
  const [lang, setLang]           = useState("es");
  const [roomCode, setRoomCode]   = useState("");
  const [joinCode, setJoinCode]   = useState("");
  const [playerIdx, setPlayerIdx] = useState(null);
  const [room, setRoom]           = useState(null);
  const [preds, setPreds]         = useState(emptyPreds());
  const [results, setResults]     = useState({grupos:{},campeon:"",finalista:""});
  const [loading, setLoading]     = useState(false);
  const [msg, setMsg]             = useState("");
  const [msgType, setMsgType]     = useState("ok");
  const [activeTab, setActiveTab] = useState("score");
  const [paso, setPaso]           = useState(0);
  const [p1Name, setP1Name]       = useState("");
  const [p2Name, setP2Name]       = useState("");
  const [namesSet, setNamesSet]   = useState(false);
  const [connected, setConnected] = useState(false);
  const joinAttempts = useRef(0);
  const joinLockedAt = useRef(null);
  const unsubscribe  = useRef(null);

  const de = lang==="de";
  const myColor = playerIdx!==null ? PLAYER_COLORS[playerIdx] : PLAYER_COLORS[0];
  const myName  = playerIdx===0 ? (p1Name||"Jugador 1") : (p2Name||"Jugador 2");
  const myKey   = `p${playerIdx!==null?playerIdx+1:1}`;
  const showMsg = (text,type="ok") => { setMsg(text); setMsgType(type); setTimeout(()=>setMsg(""),3500); };

  useEffect(() => {
    if (!roomCode || screen==="home" || screen==="join") return;
    if (unsubscribe.current) unsubscribe.current();
    setConnected(false);
    const unsub = subscribeRoom(roomCode, (data) => {
      const validated = validateRoom(data);
      if (validated) { setRoom(validated); setConnected(true); }
    });
    unsubscribe.current = unsub;
    return () => { if (unsubscribe.current) unsubscribe.current(); };
  }, [roomCode, screen]);

  const createRoom = async () => {
    const c1=sanitizeName(p1Name); const c2=sanitizeName(p2Name);
    if (!c1||!c2) { showMsg("Completa ambos nombres.","error"); return; }
    if (c1.toLowerCase()===c2.toLowerCase()) { showMsg("Los nombres deben ser distintos.","error"); return; }
    setLoading(true);
    const code = genCode();
    const newRoom = { code, created:Date.now(), p1Name:c1, p2Name:c2, p1:{preds:null,locked:false}, p2:{preds:null,locked:false}, results:{grupos:{},campeon:"",finalista:""} };
    const ok = await saveRoom(code, newRoom);
    if (!ok) { showMsg("Error al crear la sala.","error"); setLoading(false); return; }
    setRoomCode(code); setRoom(newRoom); setResults(newRoom.results);
    setPreds(emptyPreds()); setLoading(false); setScreen("predict"); setPaso(0);
  };

  const joinRoom = async () => {
    if (joinLockedAt.current) {
      const elapsed = Date.now()-joinLockedAt.current;
      if (elapsed<JOIN_COOLDOWN_MS) { showMsg(`Espera ${Math.ceil((JOIN_COOLDOWN_MS-elapsed)/1000)}s.`,"error"); return; }
      else { joinLockedAt.current=null; joinAttempts.current=0; }
    }
    const code = sanitizeCode(joinCode.trim().toUpperCase());
    if (!code) { showMsg("Código inválido.","error"); return; }
    setLoading(true);
    const r = await loadRoom(code);
    if (r) {
      const validated = validateRoom(r);
      if (!validated) { showMsg("Datos inválidos.","error"); setLoading(false); return; }
      joinAttempts.current=0;
      setRoom(validated); setRoomCode(code);
      setP1Name(validated.p1Name||""); setP2Name(validated.p2Name||"");
      setNamesSet(true);
      setResults(validated.results||{grupos:{},campeon:"",finalista:""});
      if (validated[myKey]?.preds) setPreds(validated[myKey].preds);
      setScreen("predict"); setPaso(0);
    } else {
      joinAttempts.current+=1;
      if (joinAttempts.current>=MAX_JOIN_ATTEMPTS) { joinLockedAt.current=Date.now(); showMsg("Demasiados intentos. Pausa 30s.","error"); }
      else showMsg("Sala no encontrada. Revisa el código.","error");
    }
    setLoading(false);
  };

  const savePreds = async (lock=false) => {
    if (!roomCode||playerIdx===null) return;
    const cleanGrupos={};
    GRUPOS.forEach(g=>{ const gp=preds.grupos?.[g.id]||{}; cleanGrupos[g.id]={p1:isValidTeam(gp.p1)?(gp.p1||""):"",p2:isValidTeam(gp.p2)?(gp.p2||""):""}; });
    const cleanPreds={grupos:cleanGrupos,campeon:isValidTeam(preds.campeon)?(preds.campeon||""):"",finalista:isValidTeam(preds.finalista)?(preds.finalista||""):""};
    setLoading(true);
    const fresh=await loadRoom(roomCode);
    if (!fresh) { showMsg("Error de conexión.","error"); setLoading(false); return; }
    const validated=validateRoom(fresh);
    if (!validated) { showMsg("Error de datos.","error"); setLoading(false); return; }
    const updated={...validated,[myKey]:{preds:cleanPreds,locked:lock}};
    const ok=await saveRoom(roomCode,updated);
    if (ok) { showMsg(lock?"✓ Predicciones confirmadas":"✓ Borrador guardado","ok"); if(lock) setScreen("dashboard"); }
    else showMsg("No se pudo guardar.","error");
    setLoading(false);
  };

  const saveResults = async () => {
    if (!roomCode) return;
    const cleanGrupos={};
    GRUPOS.forEach(g=>{ const rg=results.grupos?.[g.id]||{}; cleanGrupos[g.id]={p1:isValidTeam(rg.p1)?(rg.p1||""):"",p2:isValidTeam(rg.p2)?(rg.p2||""):""}; });
    const cleanRes={grupos:cleanGrupos,campeon:isValidTeam(results.campeon)?(results.campeon||""):"",finalista:isValidTeam(results.finalista)?(results.finalista||""):""};
    setLoading(true);
    const fresh=await loadRoom(roomCode);
    if (!fresh) { showMsg("Error de conexión.","error"); setLoading(false); return; }
    const validated=validateRoom(fresh);
    if (!validated) { showMsg("Error.","error"); setLoading(false); return; }
    const ok=await saveRoom(roomCode,{...validated,results:cleanRes});
    if (ok) { setResults(cleanRes); showMsg("✓ Resultados guardados","ok"); }
    else showMsg("No se pudo guardar.","error");
    setLoading(false);
  };

  const setPG=(gid,pos,val)=>{ if(!VALID_GROUP_IDS.has(gid)||!VALID_POS.has(pos)||!isValidTeam(val))return; setPreds(p=>({...p,grupos:{...p.grupos,[gid]:{...p.grupos[gid],[pos]:val}}})); };
  const setRG=(gid,pos,val)=>{ if(!VALID_GROUP_IDS.has(gid)||!VALID_POS.has(pos)||!isValidTeam(val))return; setResults(r=>({...r,grupos:{...r.grupos,[gid]:{...r.grupos?.[gid],[pos]:val}}})); };
  const gruposCompletos=GRUPOS.every(g=>preds.grupos?.[g.id]?.p1&&preds.grupos?.[g.id]?.p2);

  const res=room?.results||{grupos:{},campeon:"",finalista:""};
  const score1=calcScore(room?.p1?.preds,res);
  const score2=calcScore(room?.p2?.preds,res);
  const maxScore=Math.max(score1,score2,1);
  const leader=score1>score2?"p1":score2>score1?"p2":null;
  const leaderName=leader==="p1"?(room?.p1Name||"Jugador 1"):(room?.p2Name||"Jugador 2");
  const leaderColor=leader==="p1"?PLAYER_COLORS[0]:PLAYER_COLORS[1];

  const PitchBg=()=>(<><div className="pitch-bg"/><div className="grass-stripes"/><div className="stadium-lights"/><div className="center-circle"/><div className="corner-arc tl"/><div className="corner-arc tr"/><div className="corner-arc bl"/><div className="corner-arc br"/><div style={{position:"fixed",left:"50%",top:0,bottom:0,width:1,background:"rgba(255,255,255,0.025)",transform:"translateX(-50%)",pointerEvents:"none",zIndex:0}}/><div style={{position:"fixed",top:"50%",left:0,right:0,height:1,background:"rgba(255,255,255,0.025)",transform:"translateY(-50%)",pointerEvents:"none",zIndex:0}}/><div style={{position:"fixed",left:"50%",top:0,transform:"translateX(-50%)",width:280,height:100,border:"1px solid rgba(255,255,255,0.025)",borderTop:"none",pointerEvents:"none",zIndex:0}}/><div style={{position:"fixed",left:"50%",bottom:0,transform:"translateX(-50%)",width:280,height:100,border:"1px solid rgba(255,255,255,0.025)",borderBottom:"none",pointerEvents:"none",zIndex:0}}/></>);
  const TopBar=({back})=>(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}><div style={{display:"flex",alignItems:"center",gap:10}}>{back&&<button className="btn-ghost" onClick={back} style={{padding:"7px 14px",fontSize:13}}>←</button>}<div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(18px,4vw,26px)",letterSpacing:3,background:"linear-gradient(135deg,#f5f0e8,#d4a017)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Predicciones Mundialistas</div>{roomCode&&(<div style={{fontFamily:"'Oswald',sans-serif",fontSize:11,color:"#4a3a22",letterSpacing:2,marginTop:1}}>SALA <span style={{color:"#d4a017",fontWeight:"bold"}}>{roomCode}</span>{playerIdx!==null&&<span style={{color:myColor.primary}}> · {myName}</span>}{connected&&<span style={{marginLeft:8}}><span className="live-dot"/>LIVE</span>}</div>)}</div></div><button onClick={()=>setLang(l=>l==="es"?"de":"es")} style={{background:"rgba(212,160,23,0.08)",border:"1px solid rgba(212,160,23,0.2)",borderRadius:16,padding:"5px 14px",color:"#d4a017",fontSize:11,cursor:"pointer",fontFamily:"'Oswald',sans-serif",letterSpacing:1}}>{lang==="es"?"🇩🇪 Deutsch":"🇪🇨 Español"}</button></div>);
  const MsgBanner=()=>msg?(<div style={{textAlign:"center",color:msgType==="ok"?"#5dff8a":"#ff7070",fontSize:13,marginBottom:12,fontFamily:"'Oswald',sans-serif",letterSpacing:0.5}}>{msg}</div>):null;
  const wrap={maxWidth:780,margin:"0 auto",padding:"24px 16px 60px"};
  const pageBase={minHeight:"100vh",fontFamily:"'Oswald',sans-serif",color:"#f5f0e8",position:"relative"};

  if (screen==="home") return (
    <div style={pageBase}><FontLoader/><PitchBg/>
    <div className="content" style={{...wrap,maxWidth:700}}>
      <div style={{textAlign:"center",marginBottom:40,paddingTop:20}}>
        <div style={{fontSize:52,marginBottom:12}}>⚽</div>
        <div className="title-main">Predicciones<br/>Mundialistas</div>
        <div className="title-by">by Juzz P.</div>
        <div style={{fontFamily:"'Oswald',sans-serif",color:"#3a3020",fontSize:11,letterSpacing:4,marginTop:12}}>USA · CANADA · MEXICO · 11 JUN – 19 JUL 2026</div>
        <button onClick={()=>setLang(l=>l==="es"?"de":"es")} style={{marginTop:14,background:"rgba(212,160,23,0.08)",border:"1px solid rgba(212,160,23,0.2)",borderRadius:16,padding:"5px 16px",color:"#d4a017",fontSize:11,cursor:"pointer",fontFamily:"'Oswald',sans-serif",letterSpacing:1}}>{lang==="es"?"🇩🇪 Auf Deutsch":"🇪🇨 En Español"}</button>
      </div>
      <MsgBanner/>
      {!namesSet?(
        <div className="card fade-up" style={{marginBottom:20}}>
          <div className="section-label" style={{marginBottom:20,display:"block"}}>{de?"SPIELER EINRICHTEN":"CONFIGURAR JUGADORES"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:8}}>
            {[[0,"🟥",de?"Spieler 1":"Jugador 1",p1Name,setP1Name],[1,"🟦",de?"Spieler 2":"Jugador 2",p2Name,setP2Name]].map(([i,dot,ph,val,setter])=>(
              <div key={i}>
                <label style={{fontFamily:"'Oswald',sans-serif",fontSize:11,color:"#6a5a3a",letterSpacing:2,display:"block",marginBottom:6}}>{dot} {de?"SPIELER":"JUGADOR"} {i+1}</label>
                <input className="field-input" placeholder={ph} value={val} maxLength={MAX_NAME_LENGTH} onChange={e=>setter(sanitizeName(e.target.value))} style={{borderColor:i===0?"rgba(232,65,122,0.3)":"rgba(26,111,196,0.3)"}}/>
                <div className="char-count">{val.length}/{MAX_NAME_LENGTH}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:16}}>
            <button className="btn-gold" onClick={()=>{const c1=sanitizeName(p1Name),c2=sanitizeName(p2Name);if(!c1||!c2){showMsg("Completa ambos nombres.","error");return;}if(c1.toLowerCase()===c2.toLowerCase()){showMsg("Los nombres deben ser distintos.","error");return;}setNamesSet(true);}} disabled={!p1Name.trim()||!p2Name.trim()}>{de?"WEITER →":"CONTINUAR →"}</button>
          </div>
        </div>
      ):(
        <div className="card fade-up" style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div className="section-label">{de?"SPIELER WÄHLEN":"ELIGE TU PERFIL"}</div>
            <button className="btn-ghost" onClick={()=>setNamesSet(false)} style={{fontSize:11,padding:"5px 12px"}}>✏️ {de?"Ändern":"Editar"}</button>
          </div>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
            {[0,1].map(i=>{const c=PLAYER_COLORS[i],nm=i===0?p1Name:p2Name,sel=playerIdx===i;return(<button key={i} onClick={()=>setPlayerIdx(i)} style={{background:sel?c.bg:"rgba(255,255,255,0.03)",border:`2px solid ${sel?c.primary:"rgba(255,255,255,0.08)"}`,borderRadius:12,padding:"18px 32px",color:sel?c.secondary:"#4a3a22",fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:3,cursor:"pointer",boxShadow:sel?`0 0 24px ${c.glow}`:"none",transition:"all 0.2s"}}>{nm}</button>);})}
          </div>
          {playerIdx!==null&&(
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="btn-gold" onClick={createRoom} disabled={loading}>{loading?"...":(de?"🆕 NEUE RUNDE":"🆕 CREAR SALA")}</button>
              <button className="btn-ghost" onClick={()=>setScreen("join")}>{de?"🔑 RAUM BEITRETEN":"🔑 UNIRME A SALA"}</button>
            </div>
          )}
        </div>
      )}
      <div className="card" style={{background:"rgba(3,8,3,0.7)"}}>
        <div className="section-label" style={{fontSize:14,display:"block",marginBottom:16}}>{de?"SO GEHT'S":"CÓMO FUNCIONA"}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
          {[["⚽","Crea la sala","Define los nombres"],["📲","Comparte","Manda el código por WhatsApp"],["✍️","Predice","Cada quien su quiniela"],["🏆","Compite","Marcador en tiempo real"]].map(([icon,t,d])=>(<div key={t} className="card-dark" style={{textAlign:"center"}}><div style={{fontSize:22,marginBottom:6}}>{icon}</div><div style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2,fontSize:14,color:"#d4a017",marginBottom:4}}>{t}</div><div style={{fontSize:11,color:"#4a3a22",lineHeight:1.5}}>{d}</div></div>))}
        </div>
      </div>
    </div></div>
  );

  if (screen==="join") return (
    <div style={pageBase}><FontLoader/><PitchBg/>
    <div className="content" style={{...wrap,maxWidth:500}}>
      <TopBar back={()=>setScreen("home")}/>
      <div className="card" style={{textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:12}}>🔑</div>
        <div className="section-label" style={{display:"block",marginBottom:16}}>{de?"RAUMCODE":"CÓDIGO DE SALA"}</div>
        <p style={{color:"#6a5a3a",fontSize:13,marginBottom:20}}>{de?"Gib den Code ein:":"Ingresa el código que te mandaron:"}</p>
        <input className="field-input" value={joinCode} onChange={e=>setJoinCode(sanitizeCode(e.target.value.toUpperCase()))} placeholder="ej. GOL482931" maxLength={12} style={{textAlign:"center",fontSize:20,letterSpacing:4,marginBottom:16}}/>
        <MsgBanner/>
        <button className="btn-gold" onClick={joinRoom} disabled={loading||!!joinLockedAt.current}>{loading?"...":"UNIRME →"}</button>
      </div>
    </div></div>
  );

  if (screen==="predict") {
    const isLocked=room?.[myKey]?.locked;
    return (
      <div style={pageBase}><FontLoader/><PitchBg/>
      <div className="content" style={wrap}>
        <TopBar back={()=>setScreen("home")}/>
        <div style={{textAlign:"center",marginBottom:20}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:4,fontSize:16,padding:"6px 20px",borderRadius:20,background:myColor.bg,border:`1px solid ${myColor.border}`,color:myColor.secondary}}>{myName} · {de?"DEINE TIPPS":"TUS PREDICCIONES"}</span>
        </div>
        {isLocked?(
          <div className="card" style={{textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:12}}>🔒</div>
            <div className="section-label" style={{display:"block",marginBottom:8}}>{de?"TIPPS GESPEICHERT":"PREDICCIONES CONFIRMADAS"}</div>
            <p style={{color:"#6a5a3a",fontSize:13,marginBottom:20}}>{de?"Nicht mehr änderbar.":"Ya no puedes modificarlas."}</p>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="btn-gold" onClick={()=>setScreen("dashboard")}>📊 {de?"SCOREBOARD":"MARCADOR"}</button>
              <button className="btn-ghost" onClick={()=>setScreen("results")}>⚽ {de?"ERGEBNISSE":"RESULTADOS"}</button>
            </div>
          </div>
        ):(
          <>
            <div style={{display:"flex",gap:8,marginBottom:24,justifyContent:"center"}}>
              {[[0,de?"GRUPPEN":"GRUPOS"],[1,de?"FINALE":"FINAL"]].map(([i,lbl])=>(<button key={i} className="tab-btn" onClick={()=>setPaso(i)} style={{background:paso===i?`linear-gradient(135deg,${myColor.primary},${myColor.secondary}20)`:"rgba(255,255,255,0.03)",border:`1px solid ${paso===i?myColor.primary:"rgba(255,255,255,0.06)"}`,color:paso===i?"#fff":"#5a4a32"}}>{lbl}</button>))}
            </div>
            <MsgBanner/>
            {paso===0&&(<><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:10}}>{GRUPOS.map(g=>(<div key={g.id} className="card"><div style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3,color:myColor.secondary,fontSize:13,marginBottom:10}}>{de?"GRUPPE":"GRUPO"} {g.id}</div>{[["p1",de?"🥇 1. Platz":"🥇 1ro"],["p2",de?"🥈 2. Platz":"🥈 2do"]].map(([pos,lbl])=>(<div key={pos} style={{marginBottom:8}}><label style={{fontSize:10,color:"#4a3a22",display:"block",marginBottom:4,letterSpacing:1}}>{lbl}</label><select className="field-select" value={preds.grupos?.[g.id]?.[pos]||""} onChange={e=>setPG(g.id,pos,e.target.value)}><option value="">{de?"Auswählen...":"Selecciona..."}</option>{g.equipos.map(eq=><option key={eq} value={eq}>{FLAGS[eq]||""} {eq}</option>)}</select></div>))}</div>))}</div><div style={{textAlign:"center",marginTop:22,display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}><button className="btn-ghost" onClick={()=>savePreds(false)} disabled={loading}>💾 {de?"SPEICHERN":"GUARDAR BORRADOR"}</button><button className="btn-gold" onClick={()=>gruposCompletos&&setPaso(1)} style={{opacity:gruposCompletos?1:0.4,cursor:gruposCompletos?"pointer":"default"}}>{gruposCompletos?(de?"WEITER →":"CONTINUAR →"):(de?"ALLE AUSFÜLLEN":"COMPLETA LOS GRUPOS")}</button></div></>)}
            {paso===1&&(<><div style={{display:"grid",gap:14,maxWidth:500,margin:"0 auto"}}>{[{key:"campeon",label:de?"🏆 WELTMEISTER":"🏆 CAMPEÓN",pts:`+${PUNTOS.campeon} pts`},{key:"finalista",label:de?"🥈 FINALIST":"🥈 FINALISTA",pts:`+${PUNTOS.finalista} pts`}].map(({key,label,pts})=>(<div key={key} className="card"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><label style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2,fontSize:15,color:"#c8a030"}}>{label}</label><span style={{color:"#5dff8a",fontSize:11,fontWeight:"bold"}}>{pts}</span></div><select className="field-select" value={preds[key]||""} onChange={e=>{if(isValidTeam(e.target.value))setPreds(p=>({...p,[key]:e.target.value}))}}><option value="">{de?"Auswählen...":"Selecciona..."}</option>{TODOS.map(eq=><option key={eq} value={eq}>{FLAGS[eq]||""} {eq}</option>)}</select></div>))}<div className="card-dark"><div style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3,color:"#d4a017",fontSize:13,marginBottom:12}}>{de?"PUNKTESYSTEM":"SISTEMA DE PUNTOS"}</div>{[[de?"1ro exacto":"1ro exacto",`+${PUNTOS.p1}`],[de?"2do exacto":"2do exacto",`+${PUNTOS.p2}`],["Invertido",`+${PUNTOS.p2}`],[de?"Finalista":"Finalista",`+${PUNTOS.finalista}`],[de?"Campeón":"Campeón",`+${PUNTOS.campeon}`]].map(([l,p])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#4a3a22",marginBottom:5}}><span>{l}</span><span style={{color:"#d4a017",fontWeight:"bold"}}>{p} pts</span></div>))}</div></div><div style={{textAlign:"center",marginTop:22,display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}><button className="btn-ghost" onClick={()=>setPaso(0)}>← {de?"ZURÜCK":"ATRÁS"}</button><button className="btn-ghost" onClick={()=>savePreds(false)} disabled={loading}>💾 {de?"SPEICHERN":"GUARDAR"}</button><button className="btn-gold" onClick={()=>savePreds(true)} disabled={loading}>🔒 {de?"EINREICHEN":"CONFIRMAR"}</button></div><p style={{textAlign:"center",color:"#3a2a12",fontSize:11,marginTop:10}}>{de?"Nach dem Einreichen nicht mehr änderbar.":"Una vez confirmadas no puedes cambiarlas."}</p></>)}
          </>
        )}
      </div></div>
    );
  }

  if (screen==="results") return (
    <div style={pageBase}><FontLoader/><PitchBg/>
    <div className="content" style={wrap}>
      <TopBar back={()=>setScreen("dashboard")}/>
      <div className="section-label" style={{display:"block",textAlign:"center",marginBottom:6}}>{de?"ERGEBNISSE EINTRAGEN":"INGRESAR RESULTADOS"}</div>
      <p style={{textAlign:"center",color:"#4a3a22",fontSize:12,marginBottom:20,letterSpacing:1}}>{de?"Beide können Ergebnisse eintragen":"Cualquiera puede ingresar resultados"}</p>
      <MsgBanner/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:10,marginBottom:16}}>
        {GRUPOS.map(g=>(<div key={g.id} className="card"><div style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3,color:"#d4a017",fontSize:13,marginBottom:10}}>{de?"GRUPPE":"GRUPO"} {g.id}</div>{[["p1","🥇 1ro"],["p2","🥈 2do"]].map(([pos,lbl])=>(<div key={pos} style={{marginBottom:8}}><label style={{fontSize:10,color:"#4a3a22",display:"block",marginBottom:4,letterSpacing:1}}>{lbl}</label><select className="field-select" value={results.grupos?.[g.id]?.[pos]||""} onChange={e=>setRG(g.id,pos,e.target.value)}><option value="">{de?"Noch nicht gespielt":"Aún no jugado"}</option>{g.equipos.map(eq=><option key={eq} value={eq}>{FLAGS[eq]||""} {eq}</option>)}</select></div>))}</div>))}
      </div>
      <div className="card" style={{maxWidth:500,margin:"0 auto 20px"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3,color:"#d4a017",fontSize:15,marginBottom:14}}>{de?"FINALE":"FINAL"}</div>
        {[{key:"campeon",label:"🏆 Campeón"},{key:"finalista",label:"🥈 Finalista"}].map(({key,label})=>(<div key={key} style={{marginBottom:12}}><label style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:"#8a7a5a",display:"block",marginBottom:6,letterSpacing:2}}>{label}</label><select className="field-select" value={results[key]||""} onChange={e=>{if(isValidTeam(e.target.value))setResults(r=>({...r,[key]:e.target.value}))}}><option value="">{de?"Noch nicht gespielt":"Aún no jugado"}</option>{TODOS.map(eq=><option key={eq} value={eq}>{FLAGS[eq]||""} {eq}</option>)}</select></div>))}
      </div>
      <div style={{textAlign:"center",display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <button className="btn-ghost" onClick={()=>setScreen("dashboard")}>← {de?"ZURÜCK":"ATRÁS"}</button>
        <button className="btn-gold" onClick={saveResults} disabled={loading}>💾 {de?"SPEICHERN":"GUARDAR RESULTADOS"}</button>
      </div>
    </div></div>
  );

  if (screen==="dashboard") {
    const p1Preds=room?.p1?.preds,p2Preds=room?.p2?.preds;
    const rr=room?.results||{grupos:{},campeon:"",finalista:""};
    const n1=room?.p1Name||"Jugador 1",n2=room?.p2Name||"Jugador 2";
    return (
      <div style={pageBase}><FontLoader/><PitchBg/>
      <div className="content" style={wrap}>
        <TopBar back={()=>setScreen("home")}/>
        <div className="card" style={{marginBottom:16,textAlign:"center",background:"rgba(3,8,3,0.95)",border:"1px solid rgba(212,160,23,0.25)"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:6,color:"#3a2a12",fontSize:12,marginBottom:16}}>{de?"AKTUELLER STAND":"MARCADOR"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:16,alignItems:"center"}}>
            {[[n1,score1,PLAYER_COLORS[0]],[n2,score2,PLAYER_COLORS[1]]].map(([nm,sc,c],i)=>(<div key={i}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(14px,3vw,20px)",letterSpacing:2,color:c.secondary,marginBottom:6}}>{nm}</div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(42px,10vw,72px)",color:c.primary,lineHeight:1,filter:`drop-shadow(0 0 20px ${c.glow})`}}>{sc}</div><div style={{color:"#3a2a12",fontSize:11,letterSpacing:2,marginBottom:8}}>PTS</div><div className="score-bar-track"><div className="score-bar-fill" style={{width:`${Math.min(100,(sc/maxScore)*100)}%`,background:c.primary}}/></div></div>))}
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#2a1a08",letterSpacing:1}}>VS</div>
          </div>
          {leader&&<div className="verdict" style={{background:leaderColor.bg,border:`1px solid ${leaderColor.border}`,color:leaderColor.secondary}}>{leaderName.toUpperCase()} {de?"FÜHRT!":"VA GANANDO!"}</div>}
          {!leader&&(score1>0||score2>0)&&<div className="verdict" style={{background:"rgba(212,160,23,0.1)",border:"1px solid rgba(212,160,23,0.2)",color:"#d4a017"}}>⚖️ {de?"UNENTSCHIEDEN!":"¡EMPATE!"}</div>}
          {score1===0&&score2===0&&<p className="pulse" style={{color:"#3a2a12",fontSize:12,marginTop:12,letterSpacing:2}}>{de?"NOCH KEINE ERGEBNISSE":"SIN RESULTADOS AÚN"}</p>}
        </div>
        <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
          {[["score",de?"📊 PUNKTE":"📊 PUNTOS"],["compare",de?"⚔️ VERGLEICH":"⚔️ COMPARAR"],["code",de?"🔑 CODE":"🔑 CÓDIGO"]].map(([id,lbl])=>(<button key={id} className="tab-btn" onClick={()=>setActiveTab(id)} style={{background:activeTab===id?"linear-gradient(135deg,#c8940e,#d4a017)":"rgba(255,255,255,0.03)",border:`1px solid ${activeTab===id?"#d4a017":"rgba(255,255,255,0.06)"}`,color:activeTab===id?"#050a05":"#5a4a32"}}>{lbl}</button>))}
        </div>
        {activeTab==="score"&&(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:10}}>{GRUPOS.map(g=>{const re=rr.grupos?.[g.id],p1p=p1Preds?.grupos?.[g.id],p2p=p2Preds?.grupos?.[g.id],hasR=re?.p1||re?.p2;return(<div key={g.id} className="card" style={{opacity:hasR?1:0.55}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3,color:"#d4a017",fontSize:12}}>{de?"GRUPPE":"GRUPO"} {g.id}</span>{!hasR&&<span style={{fontSize:10,color:"#3a2a12",letterSpacing:1}}>{de?"AUSSTEHEND":"PENDIENTE"}</span>}</div>{hasR&&<div style={{fontSize:11,color:"#4a3a22",marginBottom:8}}>✅ {FLAGS[re.p1]||""} {re.p1} / {FLAGS[re.p2]||""} {re.p2}</div>}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{[[n1,p1p,PLAYER_COLORS[0]],[n2,p2p,PLAYER_COLORS[1]]].map(([nm,p,c])=>{const c1=hasR&&p?.p1===re?.p1?"hit":hasR&&(p?.p1===re?.p2||p?.p2===re?.p1)?"partial":"miss",c2=hasR&&p?.p2===re?.p2?"hit":hasR&&p?.p2===re?.p1?"partial":"miss";return(<div key={nm} className="card-dark"><div style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2,color:c.secondary,fontSize:11,marginBottom:5}}>{nm}</div><div className={c1} style={{fontSize:11,marginBottom:2}}>{FLAGS[p?.p1]||""} {p?.p1||"—"}</div><div className={c2} style={{fontSize:11}}>{FLAGS[p?.p2]||""} {p?.p2||"—"}</div></div>);})}</div></div>);})}</div>)}
        {activeTab==="compare"&&(<div style={{display:"grid",gap:12}}><div className="card"><div style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3,color:"#d4a017",fontSize:14,marginBottom:16}}>{de?"FINALE TIPPS":"PREDICCIONES FINALES"}</div>{[{key:"campeon",label:de?"🏆 WELTMEISTER":"🏆 CAMPEÓN",pts:PUNTOS.campeon},{key:"finalista",label:de?"🥈 FINALIST":"🥈 FINALISTA",pts:PUNTOS.finalista}].map(({key,label,pts})=>{const rv=rr[key],v1=p1Preds?.[key],v2=p2Preds?.[key];return(<div key={key} className="card-dark" style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2,fontSize:13,color:"#8a7a5a"}}>{label}</span><span style={{color:"#5dff8a",fontSize:11}}>+{pts} pts</span></div><div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center"}}>{[[n1,v1,PLAYER_COLORS[0]],[n2,v2,PLAYER_COLORS[1]]].map(([nm,v,c],i)=>(<div key={nm} style={{textAlign:i===0?"left":"right"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",color:c.secondary,fontSize:11,letterSpacing:2,marginBottom:3}}>{nm}</div><div style={{fontSize:14,color:rv&&v===rv?"#5dff8a":"#d4c4a0"}}>{v?`${FLAGS[v]||""} ${v}`:"—"}</div>{rv&&v===rv&&<div style={{fontSize:10,color:"#5dff8a"}}>✓ +{pts}</div>}</div>))}<div style={{color:"#2a1a08",fontSize:12,textAlign:"center"}}>VS</div></div>{rv&&<div style={{textAlign:"center",fontSize:11,color:"#4a3a22",marginTop:8,borderTop:"1px solid rgba(255,255,255,0.04)",paddingTop:6}}>Real: {FLAGS[rv]||""} {rv}</div>}</div>);})}</div><div className="card"><div style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3,color:"#d4a017",fontSize:13,marginBottom:12}}>{de?"STATUS":"ESTADO"}</div>{[["p1",n1,PLAYER_COLORS[0]],["p2",n2,PLAYER_COLORS[1]]].map(([k,nm,c])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2,color:c.secondary,fontSize:14}}>{nm}</span><span style={{fontSize:11,padding:"3px 12px",borderRadius:10,background:room?.[k]?.locked?"rgba(93,255,138,0.12)":"rgba(255,255,255,0.04)",color:room?.[k]?.locked?"#5dff8a":"#4a3a22",border:`1px solid ${room?.[k]?.locked?"rgba(93,255,138,0.25)":"rgba(255,255,255,0.06)"}`,fontFamily:"'Oswald',sans-serif",letterSpacing:1}}>{room?.[k]?.locked?(de?"✓ GESPEICHERT":"✓ CONFIRMADO"):(de?"⏳ AUSSTEHEND":"⏳ PENDIENTE")}</span></div>))}</div></div>)}
        {activeTab==="code"&&(<div className="card" style={{textAlign:"center"}}><div style={{fontSize:36,marginBottom:12}}>🔑</div><div style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3,color:"#8a7a5a",fontSize:13,marginBottom:12}}>{de?"TEILE DIESEN CODE":"COMPARTE ESTE CÓDIGO"}</div><div className="room-code" style={{display:"block",marginBottom:16}}>{roomCode}</div><p style={{color:"#4a3a22",fontSize:12,maxWidth:300,margin:"0 auto 20px"}}>{de?"Die andere Person gibt diesen Code beim Beitreten ein.":"La otra persona lo ingresa al unirse."}</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,maxWidth:300,margin:"0 auto"}}>{[["p1",n1,PLAYER_COLORS[0]],["p2",n2,PLAYER_COLORS[1]]].map(([k,nm,c])=>(<div key={k} className="card-dark" style={{textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",color:c.secondary,fontSize:12,letterSpacing:2}}>{nm}</div><div style={{fontSize:11,color:room?.[k]?.locked?"#5dff8a":"#4a3a22",marginTop:4}}>{room?.[k]?.locked?"✓ Listo":"⏳ Pendiente"}</div></div>))}</div></div>)}
        <div style={{marginTop:20,display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
          {!room?.[myKey]?.locked&&<button className="btn-ghost" onClick={()=>setScreen("predict")}>✏️ {de?"TIPPS BEARBEITEN":"EDITAR PREDICCIONES"}</button>}
          <button className="btn-gold" onClick={()=>setScreen("results")}>⚽ {de?"ERGEBNISSE":"INGRESAR RESULTADOS"}</button>
        </div>
      </div></div>
    );
  }

  return null;
}
