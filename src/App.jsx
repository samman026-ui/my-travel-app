import { useState, useRef, useEffect, useCallback } from "react";

/* ════════════════════════════════════════════════════
   SUPABASE CONFIG
   替換以下兩個值為你自己的 Supabase 憑證
   Get them from: https://supabase.com → Project Settings → API
════════════════════════════════════════════════════ */
const SUPABASE_URL = "https://qqvajsrcdlpgfnbgylld.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxdmFqc3JjZGxwZ2ZuYmd5bGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDg0ODEsImV4cCI6MjA5Mjg4NDQ4MX0.mtkUZFzKy3-zJrZ_ay5sGBZws3k2VsrU3evO8skQ0y0";

/* ════════════════════════════════════════════════════
   SUPABASE CLIENT (輕量版，不需要安裝SDK)
════════════════════════════════════════════════════ */
const sb = {
  headers: {
    "Content-Type": "application/json",
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Prefer": "return=representation",
  },

  async getTrips() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/trips?order=sort_date.asc`, {
        headers: this.headers,
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error("getTrips error:", e);
      return null;
    }
  },

  async upsertTrip(trip) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/trips`, {
        method: "POST",
        headers: { ...this.headers, "Prefer": "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          id: trip.id,
          sort_date: trip.sortDate,
          title: trip.title,
          data: trip, // store full trip object as JSON
          updated_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) return false;
      return true;
    } catch (e) {
      console.error("upsertTrip error:", e);
      return false;
    }
  },

  async deleteTrip(id) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/trips?id=eq.${id}`, {
        method: "DELETE",
        headers: this.headers,
      });
      return true;
    } catch (e) {
      return false;
    }
  },
};

/* ════════════════════════════════════════════════════
   DESIGN TOKENS
════════════════════════════════════════════════════ */
const C = {
  bg:"#0A0A0C",surface:"#141418",surface2:"#1E1E26",surface3:"#262632",
  border:"rgba(255,255,255,0.08)",border2:"rgba(255,255,255,0.15)",
  text:"#FFFFFF",text2:"#CCCCDD",muted:"#88889A",
  accent:"#E8C882",accent2:"#C97B4B",green:"#7FC8A9",red:"#E07060",
  blue:"#6BA3E0",pink:"#F4A0C0",lavender:"#C4A0F0",
  jp:"'Shippori Mincho B1',serif",ui:"'Noto Sans JP',sans-serif",mono:"'DM Mono',monospace",
};

/* ════════════════════════════════════════════════════
   GHIBLI MASCOTS
════════════════════════════════════════════════════ */
const SamGhibli = ({ size = 64, mood = "smile" }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115" style={{ display: "block" }}>
    <ellipse cx="50" cy="112" rx="22" ry="4" fill="rgba(0,0,0,0.18)" />
    <rect x="20" y="72" width="60" height="38" rx="16" fill="#EDE8DF" />
    <rect x="36" y="70" width="28" height="8" rx="4" fill="#D8D2C8" />
    <line x1="28" y1="82" x2="28" y2="100" stroke="#D8D2C8" strokeWidth="1" opacity=".6" />
    <line x1="34" y1="82" x2="34" y2="104" stroke="#D8D2C8" strokeWidth="1" opacity=".6" />
    <line x1="66" y1="82" x2="66" y2="104" stroke="#D8D2C8" strokeWidth="1" opacity=".6" />
    <line x1="72" y1="82" x2="72" y2="100" stroke="#D8D2C8" strokeWidth="1" opacity=".6" />
    <rect x="38" y="62" width="24" height="14" rx="8" fill="#F2C9A0" />
    <ellipse cx="50" cy="44" rx="30" ry="28" fill="#F2C9A0" />
    <ellipse cx="50" cy="20" rx="28" ry="14" fill="#2A1E14" />
    <ellipse cx="40" cy="14" rx="8" ry="4" fill="#4A3828" opacity=".6" />
    <ellipse cx="34" cy="28" rx="14" ry="18" fill="#2A1E14" />
    <ellipse cx="66" cy="28" rx="11" ry="15" fill="#2A1E14" />
    <ellipse cx="50" cy="30" rx="24" ry="8" fill="#F2C9A0" />
    <path d="M 30 28 Q 33 22 38 26" stroke="#2A1E14" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 36 24 Q 40 19 45 24" stroke="#2A1E14" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <ellipse cx="21" cy="44" rx="6" ry="6.5" fill="#F0C298" />
    <ellipse cx="79" cy="44" rx="6" ry="6.5" fill="#F0C298" />
    <ellipse cx="36" cy="44" rx="7.5" ry="7" fill="#fff" />
    <ellipse cx="36" cy="44" rx="5.5" ry="5.5" fill="#2A1E0A" />
    <ellipse cx="36" cy="44" rx="3.5" ry="3.5" fill="#3A2E1A" />
    <circle cx="33.5" cy="41.5" r="2.5" fill="white" />
    <circle cx="38" cy="43" r="1" fill="white" opacity=".7" />
    <path d="M 28.5 40 Q 36 37 43.5 40" stroke="#1A1008" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <ellipse cx="64" cy="44" rx="7.5" ry="7" fill="#fff" />
    <ellipse cx="64" cy="44" rx="5.5" ry="5.5" fill="#2A1E0A" />
    <ellipse cx="64" cy="44" rx="3.5" ry="3.5" fill="#3A2E1A" />
    <circle cx="61.5" cy="41.5" r="2.5" fill="white" />
    <circle cx="66" cy="43" r="1" fill="white" opacity=".7" />
    <path d="M 56.5 40 Q 64 37 71.5 40" stroke="#1A1008" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d="M 27 35 Q 34 31 41 34" stroke="#1A1008" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    <path d="M 59 34 Q 66 30 73 33" stroke="#1A1008" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    <path d="M 47 52 Q 50 55 53 52" stroke="#D4A080" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {mood === "smile"
      ? <path d="M 40 60 Q 50 66 60 60" stroke="#C07860" strokeWidth="2" fill="none" strokeLinecap="round" />
      : <path d="M 42 60 Q 50 65 58 60" stroke="#C07860" strokeWidth="2" fill="none" strokeLinecap="round" />}
    <ellipse cx="24" cy="52" rx="8" ry="5" fill="#F4A0A0" opacity=".35" />
    <ellipse cx="76" cy="52" rx="8" ry="5" fill="#F4A0A0" opacity=".35" />
    <g transform="translate(74, 78)">
      <rect x="-8" y="-4" width="16" height="13" rx="5" fill="#F2C9A0" />
      <rect x="4" y="-14" width="7" height="13" rx="3.5" fill="#F2C9A0" />
      <ellipse cx="7.5" cy="-12" rx="2.5" ry="2" fill="#D4A878" opacity=".6" />
    </g>
  </svg>
);

const GFGhibli = ({ size = 64 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115" style={{ display: "block" }}>
    <ellipse cx="50" cy="112" rx="22" ry="4" fill="rgba(0,0,0,0.18)" />
    <rect x="18" y="70" width="64" height="40" rx="15" fill="#5A9FD0" />
    <rect x="18" y="76" width="64" height="7" rx="0" fill="#EEF4FA" opacity=".88" />
    <rect x="18" y="90" width="64" height="7" rx="0" fill="#EEF4FA" opacity=".88" />
    <rect x="18" y="70" width="64" height="10" rx="8" fill="#5A9FD0" />
    <rect x="38" y="60" width="24" height="14" rx="8" fill="#F0C8A8" />
    <ellipse cx="50" cy="42" rx="29" ry="27" fill="#F0C8A8" />
    <rect x="12" y="34" width="16" height="48" rx="8" fill="#2C1E14" />
    <rect x="72" y="34" width="16" height="48" rx="8" fill="#2C1E14" />
    <ellipse cx="50" cy="18" rx="28" ry="14" fill="#2C1E14" />
    <rect x="22" y="24" width="56" height="16" rx="4" fill="#2C1E14" />
    <ellipse cx="50" cy="40" rx="26" ry="7" fill="#F0C8A8" />
    <ellipse cx="55" cy="14" rx="8" ry="5" fill="#F4A0C0" transform="rotate(-20 55 14)" />
    <ellipse cx="63" cy="11" rx="8" ry="5" fill="#F4A0C0" transform="rotate(20 63 11)" />
    <circle cx="59" cy="12" r="3.5" fill="#E8588A" />
    <ellipse cx="21" cy="42" rx="5" ry="5.5" fill="#EEC0A0" />
    <ellipse cx="79" cy="42" rx="5" ry="5.5" fill="#EEC0A0" />
    <ellipse cx="35" cy="43" rx="9" ry="8.5" fill="#fff" />
    <ellipse cx="35" cy="43" rx="6.5" ry="6.5" fill="#1E1608" />
    <ellipse cx="35" cy="43" rx="4.5" ry="4.5" fill="#3A2A18" />
    <circle cx="31.5" cy="39.5" r="3" fill="white" />
    <circle cx="37.5" cy="42" r="1.5" fill="white" opacity=".8" />
    <path d="M 26 37 Q 35 33 44 37" stroke="#100C04" strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="65" cy="43" rx="9" ry="8.5" fill="#fff" />
    <ellipse cx="65" cy="43" rx="6.5" ry="6.5" fill="#1E1608" />
    <ellipse cx="65" cy="43" rx="4.5" ry="4.5" fill="#3A2A18" />
    <circle cx="61.5" cy="39.5" r="3" fill="white" />
    <circle cx="67.5" cy="42" r="1.5" fill="white" opacity=".8" />
    <path d="M 56 37 Q 65 33 74 37" stroke="#100C04" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M 24 30 Q 33 25 42 29" stroke="#1A1008" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <path d="M 58 29 Q 67 24 76 28" stroke="#1A1008" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <circle cx="50" cy="52" r="1.5" fill="#C8987A" opacity=".6" />
    <path d="M 38 59 Q 50 69 62 59" stroke="#C07060" strokeWidth="2" fill="#F8C0C0" opacity=".6" />
    <path d="M 38 59 Q 50 69 62 59" stroke="#C07060" strokeWidth="1.8" fill="none" />
    <ellipse cx="22" cy="50" rx="9" ry="5.5" fill="#F4A0A0" opacity=".45" />
    <ellipse cx="78" cy="50" rx="9" ry="5.5" fill="#F4A0A0" opacity=".45" />
    <g transform="translate(20, 72)">
      <ellipse cx="0" cy="0" rx="8" ry="7" fill="#F0C8A8" />
      <rect x="-3" y="-18" width="5.5" height="16" rx="2.8" fill="#F0C8A8" />
      <rect x="3.5" y="-18" width="5.5" height="16" rx="2.8" fill="#F0C8A8" />
    </g>
    <text x="6" y="20" fontSize="9" fill="#F4C0C0" opacity=".9">✦</text>
    <text x="86" y="16" fontSize="7" fill="#E8D080" opacity=".85">★</text>
  </svg>
);

const CoupleGhibli = ({ w = 180, h = 100 }) => (
  <svg width={w} height={h} viewBox="0 0 180 100" style={{ display: "block" }}>
    <ellipse cx="90" cy="95" rx="60" ry="6" fill="rgba(0,0,0,0.2)" />
    {[[12,14],[165,10],[88,6],[155,28],[18,28]].map(([x,y],i)=>(
      <text key={i} x={x} y={y} fontSize="9" fill={["#E8C882","#F4A0C0","#7FC8A9","#C4A0F0","#A0C8F0"][i]} opacity=".9">✦</text>
    ))}
    <text x="74" y="65" fontSize="18" textAnchor="middle">🩷</text>
    <g transform="translate(4,6)"><SamGhibli size={76} /></g>
    <g transform="translate(96,6)"><GFGhibli size={76} /></g>
  </svg>
);

/* ════════════════════════════════════════════════════
   APP LOGO — Based on IMG_8832 Ghibli scene
   Two characters at lobster restaurant, warm tones
   Used in top-left header replacing the fake clock
════════════════════════════════════════════════════ */
const AppLogo = ({ size = 44 }) => {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
      {/* Icon — Globe + Plane cartoon in rounded square */}
      <svg width={size} height={size} viewBox="0 0 44 44" style={{ display:"block", borderRadius: Math.round(size * 0.26), overflow:"hidden", flexShrink:0 }}>
        <defs>
          <linearGradient id="fifi-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0D1B3E"/>
            <stop offset="100%" stopColor="#1A0E2E"/>
          </linearGradient>
          <radialGradient id="fifi-glow" cx="55%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#2255AA" stopOpacity=".6"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>
        {/* BG */}
        <rect width="44" height="44" fill="url(#fifi-bg)"/>
        <rect width="44" height="44" fill="url(#fifi-glow)"/>
        {/* Globe body */}
        <circle cx="23" cy="26" r="14" fill="#1E6EC8" opacity=".9"/>
        {/* Globe shine */}
        <circle cx="23" cy="26" r="14" fill="none" stroke="#4FC3F7" strokeWidth="1.2" opacity=".6"/>
        {/* Latitude rings */}
        <ellipse cx="23" cy="26" rx="14" ry="5" fill="none" stroke="#4FC3F7" strokeWidth=".8" opacity=".45"/>
        <ellipse cx="23" cy="26" rx="14" ry="9.5" fill="none" stroke="#4FC3F7" strokeWidth=".8" opacity=".3"/>
        {/* Meridian */}
        <line x1="23" y1="12" x2="23" y2="40" stroke="#4FC3F7" strokeWidth=".8" opacity=".4"/>
        {/* Land patches */}
        <ellipse cx="18" cy="22" rx="5" ry="3.5" fill="#4CAF50" opacity=".85"/>
        <ellipse cx="29" cy="29" rx="4" ry="2.8" fill="#4CAF50" opacity=".85"/>
        <ellipse cx="24" cy="20" rx="3" ry="2.2" fill="#66BB6A" opacity=".75"/>
        {/* Airplane — top-right, tilted */}
        <g transform="translate(6,4) rotate(-35,14,14)">
          {/* Body */}
          <ellipse cx="14" cy="14" rx="8" ry="3.2" fill="white" opacity=".97"/>
          {/* Nose tip */}
          <path d="M22 14 Q25 14 23 12 Q22 13 22 14Z" fill="#FF8A65"/>
          {/* Tail fin */}
          <path d="M6 14 Q4 10 8 11 Q8 12 8 14Z" fill="#FF8A65"/>
          {/* Upper wing */}
          <path d="M13 14 Q15 9 20 9.5 Q17 12.5 17 14Z" fill="white" opacity=".88"/>
          {/* Lower wing */}
          <path d="M12 14 Q13 18 18 17.5 Q15.5 15 14 14Z" fill="white" opacity=".75"/>
          {/* Windows */}
          <circle cx="17.5" cy="12.5" r="1.2" fill="#90CAF9" opacity=".9"/>
          <circle cx="14" cy="12.5" r="1.2" fill="#90CAF9" opacity=".9"/>
        </g>
        {/* Stars */}
        <circle cx="5" cy="7" r="1" fill="#FFD54F" opacity=".9"/>
        <circle cx="38" cy="5" r=".7" fill="#FFD54F" opacity=".8"/>
        <circle cx="40" cy="13" r="1.1" fill="#F48FB1" opacity=".75"/>
        <circle cx="3" cy="18" r=".8" fill="#CE93D8" opacity=".7"/>
      </svg>

      {/* Wordmark */}
      <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
        <div style={{ fontFamily:"'Shippori Mincho B1',serif", fontSize: Math.round(size * 0.38), fontWeight:800, color:"#fff", lineHeight:1, letterSpacing:-0.5 }}>菲菲旅行社</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize: Math.round(size * 0.2), color:"rgba(232,200,130,0.8)", letterSpacing:1.5, textTransform:"uppercase" }}>Fifi Travel Agency</div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════
   MAGIC TRANSITION
════════════════════════════════════════════════════ */
function MagicTransition({ show }) {
  const ref = useRef();
  useEffect(() => {
    if (!show || !ref.current) return;
    const cv = ref.current, ctx = cv.getContext("2d");
    cv.width = 390; cv.height = 844;
    const pts = Array.from({ length: 28 }, () => ({
      x: 195 + (Math.random() - .5) * 360, y: 422 + (Math.random() - .5) * 700,
      r: Math.random() * 5 + 2, life: 0, spd: Math.random() * 3 + 1.5,
      angle: Math.random() * Math.PI * 2,
      c: ["#E8C882","#F4A0C0","#7FC8A9","#C4A0F0","#F2C9A0"][Math.floor(Math.random() * 5)],
    }));
    let f = 0, raf;
    const draw = () => {
      ctx.clearRect(0, 0, 390, 844);
      ctx.fillStyle = "rgba(10,10,12,0.80)"; ctx.fillRect(0, 0, 390, 844);
      pts.forEach(p => {
        p.life += p.spd; ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - p.life / 38); ctx.fillStyle = p.c;
        ctx.translate(p.x, p.y); ctx.rotate(p.angle + p.life * .06);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = i * Math.PI * 2 / 5 - Math.PI / 2, a2 = (i + .5) * Math.PI * 2 / 5 - Math.PI / 2;
          const r1 = p.r + p.life * .5, r2 = p.r * .4;
          i === 0 ? ctx.moveTo(Math.cos(a)*r1, Math.sin(a)*r1) : ctx.lineTo(Math.cos(a)*r1, Math.sin(a)*r1);
          ctx.lineTo(Math.cos(a2)*r2, Math.sin(a2)*r2);
        }
        ctx.closePath(); ctx.fill(); ctx.restore();
      });
      f++; if (f < 20) raf = requestAnimationFrame(draw);
    };
    draw(); return () => { if (raf) cancelAnimationFrame(raf); };
  }, [show]);
  if (!show) return null;
  return (
    <div style={{ position:"absolute",inset:0,zIndex:9000,pointerEvents:"none",borderRadius:48,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <canvas ref={ref} style={{ position:"absolute",inset:0 }} />
      <div style={{ position:"relative",zIndex:2,animation:"magicPop .5s cubic-bezier(.34,1.56,.64,1) forwards" }}>
        <CoupleGhibli w={200} h={110} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   SYNC STATUS INDICATOR
════════════════════════════════════════════════════ */
function SyncBadge({ status }) {
  const cfg = {
    syncing: { color: C.accent, text: "⟳ 同步中…" },
    saved:   { color: C.green,  text: "✓ 已儲存" },
    error:   { color: C.red,    text: "✗ 無法同步" },
    offline: { color: C.muted,  text: "◌ 本地模式" },
  };
  const c = cfg[status] || cfg.offline;
  return (
    <div style={{ fontFamily: C.mono, fontSize: 9, color: c.color, display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 10, background: `${c.color}18`, border: `1px solid ${c.color}44` }}>
      {c.text}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   EMERGENCY DATA
════════════════════════════════════════════════════ */
const EMERGENCY_BY_COUNTRY = {
  JP: { name:"日本 🇯🇵", contacts:[{cat:"🚨 緊急",name:"警察",num:"110",desc:"報警"},{cat:"🚨 緊急",name:"消防/救護",num:"119",desc:"Fire/Ambulance"},{cat:"🏥 醫療",name:"醫療諮詢 #7119",num:"0570-200-702",desc:"急症轉介"},{cat:"🇨🇦 領事",name:"加拿大駐日大使館",num:"+81-3-5412-6200",desc:"Emergency"},{cat:"🚗 道路",name:"JAF 道路救援",num:"0570-00-8139",desc:"24hr"}]},
  CA: { name:"加拿大 🇨🇦", contacts:[{cat:"🚨 緊急",name:"緊急求救",num:"911",desc:"Police/Fire/Ambulance"},{cat:"🚑 醫療",name:"Health Connect",num:"811",desc:"24hr醫療諮詢"},{cat:"🚗 道路",name:"CAA Roadside",num:"1-800-222-4357",desc:"道路救援"},{cat:"🏛️ 領事",name:"HK ETOToronto",num:"+1-416-924-5544",desc:"Toronto"}]},
  US: { name:"美國 🇺🇸", contacts:[{cat:"🚨 緊急",name:"Emergency",num:"911",desc:"Police/Fire/Ambulance"},{cat:"🚗 道路",name:"AAA Roadside",num:"1-800-222-4357",desc:"道路救援"}]},
  GB: { name:"英國 🇬🇧", contacts:[{cat:"🚨 緊急",name:"Emergency",num:"999",desc:"Police/Fire/Ambulance"},{cat:"🏥 醫療",name:"NHS Non-Emergency",num:"111",desc:"非緊急醫療"},{cat:"🚔 警察",name:"Police Non-Emergency",num:"101",desc:"非緊急"}]},
  FR: { name:"法國 🇫🇷", contacts:[{cat:"🚨 緊急",name:"Police",num:"17",desc:"報警"},{cat:"🚑 救護",name:"SAMU",num:"15",desc:"醫療緊急"},{cat:"🚒 消防",name:"Pompiers",num:"18",desc:"消防/救援"},{cat:"🌍 統一",name:"EU Emergency",num:"112",desc:"全歐通用"}]},
  ES: { name:"西班牙 🇪🇸", contacts:[{cat:"🚨 緊急",name:"EU Emergency",num:"112",desc:"Police/Ambulance/Fire"},{cat:"🚔 警察",name:"Policia Nacional",num:"091",desc:"國家警察"},{cat:"🏛️ 領事",name:"加拿大駐西班牙",num:"+34-91-382-8400",desc:"Madrid"}]},
  PE: { name:"秘魯 🇵🇪", contacts:[
    {cat:"🚨 緊急",name:"警察 Policía Nacional",num:"105",desc:"報警"},
    {cat:"🚨 緊急",name:"救護車 Ambulancia",num:"106",desc:"緊急醫療"},
    {cat:"🏥 醫療",name:"Clínica Anglo Americana",num:"+51-1-616-8900",desc:"利馬英語醫療"},
    {cat:"🇨🇦 領事",name:"加拿大駐秘魯大使館",num:"+51-1-319-3200",desc:"Lima Emergency"},
    {cat:"🏔️ 高山",name:"高山症緊急求助",num:"+51-84-222-221",desc:"庫斯科醫院"},
  ]},
  BO: { name:"玻利維亞 🇧🇴", contacts:[
    {cat:"🚨 緊急",name:"警察 Policía",num:"110",desc:"報警"},
    {cat:"🚨 緊急",name:"消防/救護",num:"119",desc:"Fire/Ambulance"},
    {cat:"🇨🇦 領事",name:"加拿大駐玻利維亞大使館",num:"+591-2-241-5021",desc:"La Paz"},
  ]},
  AR: { name:"阿根廷 🇦🇷", contacts:[
    {cat:"🚨 緊急",name:"警察 Policía",num:"911",desc:"報警"},
    {cat:"🚑 救護",name:"SAME 救護車",num:"107",desc:"Buenos Aires 急救"},
    {cat:"🚒 消防",name:"消防 Bomberos",num:"100",desc:"消防"},
    {cat:"🇨🇦 領事",name:"加拿大駐阿根廷大使館",num:"+54-11-4808-1000",desc:"Buenos Aires"},
  ]},
  BR: { name:"巴西 🇧🇷", contacts:[
    {cat:"🚨 緊急",name:"警察 Polícia",num:"190",desc:"報警"},
    {cat:"🚑 救護",name:"SAMU 救護車",num:"192",desc:"醫療緊急"},
    {cat:"🚒 消防",name:"消防 Bombeiros",num:"193",desc:"消防/救援"},
    {cat:"🇨🇦 領事",name:"加拿大駐巴西大使館",num:"+55-61-3424-5400",desc:"Brasília"},
    {cat:"🌆 里約",name:"里約旅遊警察",num:"+55-21-2332-2924",desc:"Delegacia do Turista"},
  ]},
  KR: { name:"韓國 🇰🇷", contacts:[{cat:"🚨 緊急",name:"警察",num:"112",desc:"報警"},{cat:"🚑 救護",name:"消防/救護",num:"119",desc:"消防/救護"},{cat:"🌏 外國人",name:"外國人諮詢",num:"1345",desc:"24hr多語"}]},
  DEFAULT: { name:"當地 🌍", contacts:[{cat:"🚨 緊急",name:"國際緊急求救",num:"112",desc:"國際通用"},{cat:"🏛️ 領事",name:"加拿大領事館緊急",num:"+1-613-996-8885",desc:"Ottawa 24hr"}]},
};

function detectCountryCode(trip) {
  const t = (trip.title + " " + (trip.location || "") + " " + (trip.country || "") + " " + (trip.id || "")).toLowerCase();
  if (t.includes("🇯🇵")||t.includes("japan")||t.includes("日本")||t.includes("tokyo")||t.includes("東京")||t.includes("osaka")||t.includes("kyoto")) return "JP";
  if (t.includes("🇬🇧")||t.includes("london")||t.includes("倫敦")||t.includes("uk")||t.includes("england")) return "GB";
  if (t.includes("🇫🇷")||t.includes("paris")||t.includes("巴黎")||t.includes("france")||t.includes("法國")) return "FR";
  if (t.includes("🇪🇸")||t.includes("spain")||t.includes("西班牙")||t.includes("madrid")||t.includes("barcelona")) return "ES";
  if (t.includes("🇺🇸")||t.includes("usa")||t.includes("美國")||t.includes("new york")||t.includes("紐約")) return "US";
  if (t.includes("🇦🇺")||t.includes("australia")||t.includes("澳洲")) return "AU";
  if (t.includes("🇰🇷")||t.includes("korea")||t.includes("韓國")||t.includes("seoul")||t.includes("首爾")) return "KR";
  // South America — check before generic CA to avoid false matches
  if (t.includes("🇧🇷")||t.includes("brazil")||t.includes("巴西")||t.includes("rio")||t.includes("são paulo")||t.includes("gru")||t.includes("gig")) return "BR";
  if (t.includes("🇦🇷")||t.includes("argentina")||t.includes("阿根廷")||t.includes("buenos aires")||t.includes("eze")||t.includes("buenosaires")) return "AR";
  if (t.includes("🇧🇴")||t.includes("bolivia")||t.includes("玻利維亞")||t.includes("la paz")||t.includes("uyuni")||t.includes("烏尤尼")) return "BO";
  if (t.includes("🇵🇪")||t.includes("peru")||t.includes("秘魯")||t.includes("lima")||t.includes("cusco")||t.includes("庫斯科")||t.includes("southamerica")) return "PE";
  if (t.includes("🇨🇦")||t.includes("canada")||t.includes("加拿大")||t.includes("toronto")||t.includes("ottawa")||t.includes("montreal")||t.includes("vancouver")||t.includes("quebec")||t.includes("魁北克")) return "CA";
  return "DEFAULT";
}

/* ════════════════════════════════════════════════════
   INITIAL TRIP DATA
════════════════════════════════════════════════════ */
const TRIPS_DEFAULT = [
  /* ─── 1. OTTAWA ─────────────────────────────── */
  {
    id:"ottawa2026", sortDate:"2026-05-13",
    title:"渥太華鬱金香節", subtitle:"Parc Omega 野生動物 · 自駕遊",
    dates:"2026/05/13–05/14", daysCount:2, country:"🇨🇦", daysUntil:14,
    location:"Ottawa & Montebello, Canada",
    weather:{icon:"🌤️",temp:"18°C",feels:"12°C",desc:"晴間多雲，日夜溫差大",outfit:"分層穿搭：薄毛衣 + 外套，晚上需保暖"},
    budget:{
      totalCAD:800, currency:"CAD",
      items:[
        {icon:"⛽",name:"油費（多倫多↔渥太華↔Montebello）",cat:"交通",amt:95,color:"#6BA3E0"},
        {icon:"🏨",name:"Ottawa Downtown Hotel（1晚）",cat:"住宿",amt:300,color:"#E8C882"},
        {icon:"🌷",name:"鬱金香節 Blacklight夜遊門票",cat:"景點",amt:60,color:"#F4A0C0"},
        {icon:"🦌",name:"Parc Omega 門票 × 2",cat:"景點",amt:100,color:"#7FC8A9"},
        {icon:"🥞",name:"餐飲（BeaverTails + 晚飯）",cat:"餐飲",amt:200,color:"#C97B4B"},
        {icon:"🛍️",name:"手信 & 雜費",cat:"購物",amt:45,color:"#9B72CF"},
      ],
      expenses:[],
      breakdown:[
        {cat:"住宿",color:"#E8C882",pct:38,amt:300},
        {cat:"餐飲",color:"#C97B4B",pct:25,amt:200},
        {cat:"景點",color:"#7FC8A9",pct:20,amt:160},
        {cat:"油費",color:"#6BA3E0",pct:12,amt:95},
        {cat:"雜費",color:"#9B72CF",pct:5,amt:45},
      ],
    },
    days:[
      {
        id:1, type:"travel", date:"May 13",
        title:"多倫多 → 渥太華 · 鬱金香節",
        transport:"自駕", transportTime:300,
        spots:[
          {name:"08:00 出發多倫多（多倫多→渥太華 ~5h / 445km）",stay:300},
          {name:"13:00 Commissioners Park (Dows Lake) — 300,000+ 鬱金香",stay:150},
          {name:"15:30 Rideau Canal & Major's Hill Park — 國會山景",stay:90},
          {name:"17:00 ByWard Market — 晚飯 + BeaverTails",stay:120},
          {name:"19:30 Blacklight Boardwalk — 夜間燈光鬱金香",stay:60},
        ],
        stay:"Ottawa Downtown Hotel",
        tour:"國會山莊導賞", ts:"pending",
      },
      {
        id:2, type:"travel", date:"May 14",
        title:"Parc Omega Safari → 返多倫多",
        transport:"自駕", transportTime:90,
        spots:[
          {name:"09:00 出發往Parc Omega（渥太華→Montebello ~1.5h）",stay:90},
          {name:"10:00 Parc Omega 12km 自駕Safari — 餵鹿/麋鹿",stay:120},
          {name:"12:00 First Nations Trail 原住民步道",stay:60},
          {name:"13:00 猛禽表演 Raptor Show",stay:60},
          {name:"14:30 返回多倫多（Montebello→Toronto ~3.5h）",stay:210},
        ],
        stay:"返回多倫多",
        tour:"Parc Omega Wildlife Safari", ts:"booked",
      },
    ],
    checklist:[{
      cat:"🌷 必備清單",
      items:[
        {t:"Parc Omega門票（網上預訂）",c:false},
        {t:"國會山莊導覽預訂",c:false},
        {t:"大袋紅蘿蔔 No Frills/Walmart（餵動物）",c:false},
        {t:"分層衣物（日18°C / 夜8°C）",c:false},
        {t:"防水外套",c:false},
        {t:"相機 / 充電器",c:false},
        {t:"現金（部分小攤位唔收卡）",c:false},
      ],
    }],
    shopping:[{
      cat:"🎁 渥太華手信",
      items:[
        {n:"BeaverTails 楓糖甜品",note:"ByWard Market 現場",b:false},
        {n:"加拿大楓糖漿",note:"ByWard Market",b:false},
        {n:"鬱金香節限定紀念品",note:"Commissioners Park 現場",b:false},
      ],
    }],
    flights:[], hasFlight:false,
    bgColor:"linear-gradient(135deg,#0d2a18,#1a4a2d)",
    emoji:"🌷🦌", cartoon:"ottawa",
    alerts:[{time:"14:30",msg:"⚠️ Day 2 14:30必須從Parc Omega出發！確保天黑前返多倫多"}],
  },

  /* ─── 2. QUÉBEC ─────────────────────────────── */
  {
    id:"quebec2026", sortDate:"2026-12-18",
    title:"魁北克白色聖誕", subtitle:"聖誕市集 · 夜攝之旅",
    dates:"2026/12/18–12/20", daysCount:3, country:"🇨🇦", daysUntil:240,
    location:"Québec Province",
    weather:{icon:"❄️",temp:"-8°C",feels:"-15°C",desc:"大雪，能見度低",outfit:"羽絨外套-20°C + 雪地靴 + 暖包，相機備用電池低溫快耗"},
    budget:{
      totalCAD:600, currency:"CAD",
      items:[
        {icon:"⛽",name:"油費（全程自駕）",cat:"交通",amt:72,color:"#6BA3E0"},
        {icon:"🏨",name:"Mont-Tremblant 住宿（1晚）",cat:"住宿",amt:140,color:"#E8C882"},
        {icon:"🏨",name:"Old Quebec 住宿（1晚）",cat:"住宿",amt:100,color:"#E8C882"},
        {icon:"🎄",name:"景點門票",cat:"景點",amt:90,color:"#7FC8A9"},
        {icon:"🍽️",name:"餐飲（3天）",cat:"餐飲",amt:168,color:"#C97B4B"},
        {icon:"🛍️",name:"手信 & 雜費",cat:"購物",amt:30,color:"#9B72CF"},
      ],
      expenses:[],
      breakdown:[
        {cat:"住宿",color:"#E8C882",pct:40,amt:240},
        {cat:"餐飲",color:"#C97B4B",pct:28,amt:168},
        {cat:"景點",color:"#7FC8A9",pct:15,amt:90},
        {cat:"油費",color:"#6BA3E0",pct:12,amt:72},
        {cat:"雜費",color:"#9B72CF",pct:5,amt:30},
      ],
    },
    days:[
      {id:1,type:"travel",title:"多倫多→蒙特利爾→Mont-Tremblant",transport:"自駕",transportTime:420,spots:[{name:"Montreal Great Christmas Market",stay:120},{name:"Mont-Tremblant夜間燈光",stay:90},{name:"夜攝",stay:60}],stay:"Mont-Tremblant",date:"Dec 18",tour:"",ts:"none"},
      {id:2,type:"travel",title:"Mont-Tremblant → 魁北克市",transport:"自駕",transportTime:150,spots:[{name:"Le Grand Marché",stay:90},{name:"Place d'Youville 滑冰",stay:60},{name:"Petit-Champlain 聖誕街",stay:90},{name:"白色聖誕攝影",stay:120}],stay:"Old Quebec",date:"Dec 19",tour:"",ts:"none"},
      {id:3,type:"travel",title:"魁北克→Sherbrooke→多倫多",transport:"自駕",transportTime:360,spots:[{name:"Montmorency Falls",stay:60},{name:"Sherbrooke Marché de la Gare 午餐",stay:60},{name:"⚠️ 16:30準時出發返多倫多",stay:0}],stay:"返回多倫多",date:"Dec 20",tour:"",ts:"none"},
    ],
    checklist:[
      {cat:"📷 攝影裝備",items:[{t:"相機+三腳架（夜攝）",c:false},{t:"備用電池×3（低溫快耗）",c:false},{t:"操控手套",c:false}]},
      {cat:"❄️ 保暖",items:[{t:"羽絨外套（-20°C）",c:false},{t:"雪地防水靴",c:false},{t:"暖包×10",c:false},{t:"保溫水壺",c:false}]},
      {cat:"🚗 自駕安全",items:[{t:"冬季輪胎確認",c:true},{t:"雪刷 & 除冰噴霧",c:false},{t:"緊急毛毯",c:false}]},
    ],
    shopping:[{cat:"🎄 聖誕手信",items:[{n:"魁北克手工楓糖",note:"Petit-Champlain",b:false},{n:"魁北克冰酒",note:"Le Grand Marché",b:false},{n:"Mont-Tremblant紀念品",note:"山莊商店",b:false}]}],
    flights:[], hasFlight:false,
    bgColor:"linear-gradient(135deg,#0d1a2d,#1a2a4a)",
    emoji:"🎄❄️", cartoon:"quebec",
    alerts:[{time:"16:30",msg:"🚨 硬性提醒：16:30必須從Sherbrooke出發！確保午夜前返多倫多"}],
  },

  /* ─── 3. SOUTH AMERICA ───────────────────────── */
  {
    id:"southamerica2027", sortDate:"2027-05-01",
    title:"南美安地斯大西洋之旅", subtitle:"秘魯 · 玻利維亞 · 阿根廷 · 巴西",
    dates:"2027/05/01–05/22", daysCount:22, country:"🇵🇪🇧🇴🇦🇷🇧🇷", daysUntil:390,
    location:"Lima / Cusco / Uyuni / Buenos Aires / Rio / São Paulo",
    weather:{icon:"🌄",temp:"22°C",feels:"20°C",desc:"多變：利馬乾燥、烏尤尼-15°C、里約25°C+",outfit:"四季衣物！烏尤尼需重保暖，里約需輕薄防曬"},
    budget:{
      totalCAD:15000, currency:"CAD",
      items:[
        {icon:"✈️",name:"國際機票 YYZ↔LIM + GRU↔YYZ",cat:"交通",amt:4000,color:"#6BA3E0"},
        {icon:"✈️",name:"內陸航班（6段南美境內）",cat:"交通",amt:2000,color:"#6BA3E0"},
        {icon:"🏨",name:"住宿 22晚（含 Skylodge）",cat:"住宿",amt:4500,color:"#E8C882"},
        {icon:"🚂",name:"Belmond Hiram Bingham 火車",cat:"特色行程",amt:1200,color:"#C97B4B"},
        {icon:"🧂",name:"烏尤尼私人奢華4x4團（3天2夜）",cat:"特色行程",amt:1500,color:"#7FC8A9"},
        {icon:"🍽️",name:"餐飲（22天，含利馬頂級餐廳）",cat:"餐飲",amt:2000,color:"#F4A0C0"},
        {icon:"🛍️",name:"購物（皮革/羊駝毛/咖啡/葡萄酒）",cat:"購物",amt:800,color:"#9B72CF"},
      ],
      expenses:[],
      breakdown:[
        {cat:"機票交通",color:"#6BA3E0",pct:40,amt:6000},
        {cat:"住宿",color:"#E8C882",pct:30,amt:4500},
        {cat:"特色行程",color:"#7FC8A9",pct:18,amt:2700},
        {cat:"餐飲",color:"#F4A0C0",pct:7,amt:1050},
        {cat:"購物",color:"#9B72CF",pct:5,amt:750},
      ],
    },
    days:[
      {id:1,type:"arrival",title:"Day 1 — YYZ → LIM → CUZ · Skylodge",transport:"飛機",transportTime:600,
        spots:[{name:"YYZ出發（週三）→ 利馬LIM（~8h）",stay:480},{name:"LIM → CUZ 國內線（~2h）",stay:120},{name:"Skylodge Adventure Suites入住（海拔掛壁套房）",stay:90}],
        stay:"Skylodge Adventure Suites, 庫斯科",date:"May 1",tour:"",ts:"none"},
      {id:2,type:"sightseeing",title:"Day 2 — 聖谷一日遊：馬拉斯鹽田 & 莫瑞梯田",transport:"旅遊巴",transportTime:60,
        spots:[{name:"馬拉斯鹽田 Salineras de Maras（印加古鹽田）",stay:90},{name:"莫瑞梯田 Moray（圓形農業梯田）",stay:90},{name:"聖谷市集自由活動",stay:60}],
        stay:"Skylodge Adventure Suites, 庫斯科",date:"May 2",tour:"Sacred Valley Tour",ts:"booked"},
      {id:3,type:"sightseeing",title:"Day 3 — 奧揚泰坦博 Ollantaytambo",transport:"旅遊巴",transportTime:90,
        spots:[{name:"Ollantaytambo 印加要塞遺址",stay:150},{name:"古鎮街道漫步",stay:60},{name:"返回庫斯科",stay:90}],
        stay:"庫斯科市區酒店",date:"May 3",tour:"Ollantaytambo Tour",ts:"booked"},
      {id:4,type:"sightseeing",title:"Day 4 — 太陽神廟 & 庫斯科市區",transport:"步行",transportTime:0,
        spots:[{name:"Qorikancha 太陽神廟（黃金神殿）",stay:90},{name:"武器廣場 Plaza de Armas",stay:60},{name:"庫斯科大教堂",stay:60},{name:"San Blas藝術家街區",stay:60}],
        stay:"庫斯科市區酒店",date:"May 4",tour:"",ts:"none"},
      {id:5,type:"sightseeing",title:"Day 5 — 馬丘比丘（庫斯科接送 + 一日遊）",transport:"旅遊巴+火車",transportTime:180,
        spots:[{name:"庫斯科出發 → Aguas Calientes（火車）",stay:120},{name:"馬丘比丘入場導覽（太陽門、神廟、梯田）",stay:240},{name:"Aguas Calientes小鎮晚飯",stay:90}],
        stay:"Aguas Calientes河畔酒店",date:"May 5",tour:"Machu Picchu Day Tour",ts:"booked"},
      {id:6,type:"sightseeing",title:"Day 6 — 馬丘比丘再遊 + Hiram Bingham火車返庫",transport:"奢華火車",transportTime:240,
        spots:[{name:"清晨馬丘比丘日出（第二次入場）",stay:180},{name:"Belmond Hiram Bingham 奢華火車午宴返程",stay:240}],
        stay:"庫斯科市區酒店",date:"May 6",tour:"Belmond Hiram Bingham",ts:"booked"},
      {id:7,type:"travel",title:"Day 7 — 庫斯科 → 拉巴斯 · 安地斯探索",transport:"飛機",transportTime:120,
        spots:[{name:"CUZ → LPB 飛越安地斯山脈",stay:120},{name:"拉巴斯市區安地斯探索之旅",stay:180},{name:"月亮谷 Valle de la Luna",stay:90}],
        stay:"拉巴斯精品酒店",date:"May 7",tour:"Andes Discovery Tour",ts:"pending"},
      {id:8,type:"travel",title:"Day 8 — 拉巴斯 → 烏尤尼 · 安頓",transport:"飛機",transportTime:60,
        spots:[{name:"LPB → UYU 飛往烏尤尼",stay:60},{name:"機場接送，酒店安頓",stay:60},{name:"烏尤尼鎮自由活動",stay:90}],
        stay:"烏尤尼精品鹽鹼地酒店",date:"May 8",tour:"",ts:"none"},
      {id:9,type:"sightseeing",title:"Day 9-11 — 烏尤尼鹽沼3天2夜私人4x4團",transport:"私人4x4",transportTime:60,
        spots:[{name:"Day 9：鹽沼日落 + 星空攝影（倒影黃金時段）",stay:300},{name:"Day 10：紅色潟湖 Laguna Colorada + 火烈鳥群",stay:300},{name:"Day 11：綠色潟湖 Laguna Verde + 回鹽沼鎮",stay:240}],
        stay:"鹽沼內奢華帳篷/鹽屋",date:"May 9-11",tour:"私人奢華4x4烏尤尼團",ts:"booked"},
      {id:10,type:"travel",title:"Day 12 — 烏尤尼 → 布宜諾斯艾利斯",transport:"飛機",transportTime:360,
        spots:[{name:"UYU → LPB 中轉",stay:120},{name:"LPB → EZE 飛往阿根廷",stay:240},{name:"EZE 機場接送，酒店安頓",stay:60}],
        stay:"布宜諾斯艾利斯精品酒店 Palermo區",date:"May 12",tour:"",ts:"none"},
      {id:11,type:"sightseeing",title:"Day 13-14 — 布宜諾斯艾利斯",transport:"步行/的士",transportTime:30,
        spots:[{name:"La Boca 彩色街區 + 博卡青年人球場",stay:90},{name:"San Telmo古董市集",stay:90},{name:"Bar Sur探戈表演（港片情懷！）",stay:120},{name:"Avellaneda Bridge（港片場景朝聖）",stay:60},{name:"Puerto Madero海濱晚飯",stay:90}],
        stay:"布宜諾斯艾利斯精品酒店 Palermo區",date:"May 13-14",tour:"",ts:"none"},
      {id:12,type:"travel",title:"Day 15 — 飛往伊瓜蘇瀑布",transport:"飛機",transportTime:120,
        spots:[{name:"AEP → IGR 阿根廷航空（~2h）",stay:120},{name:"伊瓜蘇國家公園阿根廷側",stay:240}],
        stay:"伊瓜蘇瀑布酒店",date:"May 15",tour:"",ts:"none"},
      {id:13,type:"travel",title:"Day 16 — IGR → IGU → 里約 · 租車市遊",transport:"巴士+飛機",transportTime:180,
        spots:[{name:"IGR → IGU 巴士過境巴西側",stay:60},{name:"IGU → GIG 飛往里約（GOL/LATAM）",stay:180},{name:"租車 + Cristo Redentor 基督像",stay:120},{name:"Copacabana 海灘日落",stay:60}],
        stay:"里約 Ipanema 精品酒店",date:"May 16",tour:"",ts:"none"},
      {id:14,type:"sightseeing",title:"Day 17-18 — 里約熱內盧觀光",transport:"租車/纜車",transportTime:30,
        spots:[{name:"Sugarloaf Mountain 麵包山纜車",stay:120},{name:"Santa Teresa 藝術家社區",stay:90},{name:"Lapa Arches + 桑巴夜生活",stay:120},{name:"Ipanema/Leblon 海灘自由時間",stay:180}],
        stay:"里約 Ipanema 精品酒店",date:"May 17-18",tour:"",ts:"none"},
      {id:15,type:"travel",title:"Day 19 — 里約 → 聖保羅（自駕）",transport:"租車自駕",transportTime:360,
        spots:[{name:"Rio → São Paulo 自駕（Via Dutra公路，~6h）",stay:360},{name:"聖保羅 Vila Madalena 街頭藝術區",stay:90}],
        stay:"聖保羅精品酒店 Jardins區",date:"May 19",tour:"",ts:"none"},
      {id:16,type:"sightseeing",title:"Day 20-21 — 聖保羅城市觀光",transport:"地鐵/步行",transportTime:30,
        spots:[{name:"Ibirapuera公園晨跑",stay:60},{name:"MASP 聖保羅藝術博物館",stay:90},{name:"Liberdade 日裔街區（亞洲美食）",stay:90},{name:"Oscar Freire 奢侈品購物街",stay:120},{name:"頂級巴西烤肉 Churrascaria晚飯",stay:120}],
        stay:"聖保羅精品酒店 Jardins區",date:"May 20-21",tour:"",ts:"none"},
      {id:17,type:"departure",title:"Day 22 — 還車 + GRU → YYZ 返多倫多",transport:"飛機",transportTime:660,
        spots:[{name:"還車，前往 Guarulhos機場 GRU",stay:120},{name:"GRU → YYZ Air Canada 直飛返多倫多（~11h）",stay:660}],
        stay:"返回多倫多",date:"May 22",tour:"",ts:"none"},
    ],
    checklist:[
      {cat:"🛂 簽證文件",items:[
        {t:"加拿大護照（有效>6個月）",c:false},
        {t:"玻利維亞電子簽證（提前辦理）",c:false},
        {t:"巴西電子簽 e-Visa（2026年確認政策）",c:false},
        {t:"黃熱病疫苗證明（進入巴西部分地區需要）",c:false},
        {t:"旅遊保險（含醫療撤離）",c:false},
      ]},
      {cat:"💊 健康",items:[
        {t:"高山症藥物 Diamox（庫斯科/烏尤尼必備）",c:false},
        {t:"腸胃藥 + 止痛藥",c:false},
        {t:"防曬 SPF50+（高海拔紫外線超強）",c:false},
        {t:"驅蟲噴霧（亞馬遜區域）",c:false},
      ]},
      {cat:"🎒 裝備",items:[
        {t:"太陽眼鏡（鹽沼反光極強）",c:false},
        {t:"防水外套",c:false},
        {t:"厚保暖層（烏尤尼-15°C）",c:false},
        {t:"輕薄衣物（里約25°C+）",c:false},
        {t:"相機 + 備用電池（低溫快耗）",c:false},
        {t:"三腳架（星空攝影）",c:false},
      ]},
      {cat:"💳 理財",items:[
        {t:"兩張不同銀行信用卡",c:false},
        {t:"美金現金 USD $500（南美美金強勢）",c:false},
        {t:"知會銀行出行（防止卡被鎖）",c:false},
      ]},
    ],
    shopping:[
      {cat:"🦙 秘魯",items:[
        {n:"Alpaca 羊駝毛圍巾/外套",note:"庫斯科市集或精品店",b:false},
        {n:"秘魯優質咖啡豆",note:"利馬機場或市區咖啡店",b:false},
        {n:"印加手工藝品",note:"聖谷市集",b:false},
      ]},
      {cat:"🥩 阿根廷",items:[
        {n:"手工真皮皮帶/皮包",note:"San Telmo市集",b:false},
        {n:"Malbec 馬爾貝克紅酒",note:"布宜諾斯艾利斯酒莊",b:false},
      ]},
      {cat:"☕ 巴西",items:[
        {n:"巴西精品咖啡豆（單一莊園）",note:"聖保羅精品咖啡店",b:false},
        {n:"Havaianas 人字拖（紀念版）",note:"里約或聖保羅商場",b:false},
      ]},
    ],
    hasFlight:true,
    flights:[
      {id:"sa1",airline:"Air Canada",flightNo:"AC092",from:"YYZ Toronto",to:"LIM Lima",depTime:"2027-05-01T23:55",arrTime:"2027-05-02T06:30",terminal:"T1",seat:"",status:"pending"},
      {id:"sa2",airline:"LATAM",flightNo:"LA2xxx",from:"LIM Lima",to:"CUZ Cusco",depTime:"2027-05-02T09:00",arrTime:"2027-05-02T10:30",terminal:"",seat:"",status:"pending"},
      {id:"sa3",airline:"LATAM/BoA",flightNo:"TBC",from:"CUZ Cusco",to:"LPB La Paz",depTime:"2027-05-07T08:00",arrTime:"2027-05-07T10:00",terminal:"",seat:"",status:"pending"},
      {id:"sa4",airline:"Boliviana de Aviación",flightNo:"OB xxx",from:"LPB La Paz",to:"UYU Uyuni",depTime:"2027-05-08T07:00",arrTime:"2027-05-08T08:30",terminal:"",seat:"",status:"pending"},
      {id:"sa5",airline:"Aerolíneas Argentinas",flightNo:"AR xxx",from:"AEP Buenos Aires",to:"IGR Iguazú",depTime:"2027-05-15T08:00",arrTime:"2027-05-15T10:00",terminal:"",seat:"",status:"pending"},
      {id:"sa6",airline:"GOL/LATAM",flightNo:"TBC",from:"IGU Foz do Iguaçu",to:"GIG Rio de Janeiro",depTime:"2027-05-16T13:00",arrTime:"2027-05-16T15:30",terminal:"",seat:"",status:"pending"},
      {id:"sa7",airline:"Air Canada",flightNo:"AC091",from:"GRU São Paulo",to:"YYZ Toronto",depTime:"2027-05-22T22:00",arrTime:"2027-05-23T08:00",terminal:"T3",seat:"",status:"pending"},
    ],
    bgColor:"linear-gradient(135deg,#1a0a2e,#2e1a0a,#0a2e1a)",
    emoji:"🏔️🌊", cartoon:"southamerica",
  },
];


const CURRENCIES=[{code:"HKD",name:"港元",flag:"🇭🇰",rate:1},{code:"JPY",name:"日圓",flag:"🇯🇵",rate:19.24},{code:"CAD",name:"加拿大元",flag:"🇨🇦",rate:0.172},{code:"USD",name:"美元",flag:"🇺🇸",rate:0.128},{code:"GBP",name:"英鎊",flag:"🇬🇧",rate:0.101},{code:"EUR",name:"歐元",flag:"🇪🇺",rate:0.119},{code:"KRW",name:"韓元",flag:"🇰🇷",rate:175.2},{code:"CNY",name:"人民幣",flag:"🇨🇳",rate:0.928},{code:"TWD",name:"台幣",flag:"🇹🇼",rate:4.14}];

/* ════════════════════════════════════════════════════
   HERO SVGS
════════════════════════════════════════════════════ */
const HeroOttawa=({h=145})=>(<svg viewBox="0 0 390 145" style={{width:"100%",height:h,display:"block"}}><defs><linearGradient id="ho9" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d2a18"/><stop offset="100%" stopColor="#1a4a2d"/></linearGradient></defs><rect width="390" height="145" fill="url(#ho9)"/><rect x="155" y="36" width="80" height="88" rx="3" fill="#1e2e54"/><polygon points="155,36 195,11 235,36" fill="#2a3a6a"/><rect x="192" y="4" width="6" height="20" fill="#E8C882"/><circle cx="195" cy="50" r="14" fill="#0e1a3a" stroke="#E8C882" strokeWidth="1.5"/><line x1="195" y1="50" x2="195" y2="42" stroke="#E8C882" strokeWidth="1.5"/><line x1="195" y1="50" x2="201" y2="53" stroke="#E8C882" strokeWidth="1.5"/><rect x="0" y="111" width="390" height="34" fill="#081a10" opacity=".8"/>{[30,70,110,150,200,250,300,350].map((x,i)=>(<g key={i}><ellipse cx={x} cy={104+i%3*4} rx={8} ry={14} fill={["#FF6B9D","#FF4785","#E8548A"][i%3]} opacity=".85"/><rect x={x-1.5} y={118} width={3} height={16} fill="#2d4a18"/></g>))}</svg>);
const HeroQuebec=({h=145})=>(<svg viewBox="0 0 390 145" style={{width:"100%",height:h,display:"block"}}><defs><linearGradient id="hq9" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d1a2d"/><stop offset="100%" stopColor="#1a2a4a"/></linearGradient></defs><rect width="390" height="145" fill="url(#hq9)"/><rect x="140" y="46" width="110" height="78" rx="4" fill="#1e2e54"/><polygon points="140,46 195,18 250,46" fill="#2a3a6a"/><rect x="192" y="4" width="6" height="22" fill="#E8C882"/>{[50,90,300,340].map((x,i)=><g key={i}><polygon points={`${x},95 ${x+5},70 ${x+10},95`} fill="#1a3a10"/><polygon points={`${x},95 ${x+5},73 ${x+10},95`} fill="white" opacity=".3"/></g>)}<rect x="0" y="130" width="390" height="15" fill="white" opacity=".12"/><text x="30" y="46" fontSize="18">❄️</text><text x="350" y="56" fontSize="16">⭐</text></svg>);
const HeroSouthAmerica=({h=145})=>(<svg viewBox="0 0 390 145" style={{width:"100%",height:h,display:"block"}}><defs><linearGradient id="hsa" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a0a2e"/><stop offset="50%" stopColor="#2e1a08"/><stop offset="100%" stopColor="#0a2e1a"/></linearGradient><radialGradient id="hsaglow" cx="30%" cy="40%" r="50%"><stop offset="0%" stopColor="#E8C882" stopOpacity=".25"/><stop offset="100%" stopColor="transparent"/></radialGradient></defs><rect width="390" height="145" fill="url(#hsa)"/><rect width="390" height="145" fill="url(#hsaglow)"/>
{/* Stars */}{[[20,12],[60,8],[100,15],[350,10],[370,18],[310,8],[280,14],[240,6]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%3===0?1.5:1} fill="white" opacity={.4+i%3*.2}/>)}
{/* Machu Picchu stepped terraces */}<polygon points="60,90 100,60 140,90" fill="#2a4a1a"/><polygon points="100,60 130,45 160,60 130,75" fill="#3a5a2a"/><rect x="110" y="40" width="40" height="20" rx="2" fill="#2a3a1a"/><rect x="120" y="32" width="20" height="12" rx="2" fill="#1e2e14"/>
{/* Uyuni salt flats mirror effect */}<rect x="0" y="100" width="390" height="45" fill="#0a1a2a"/><ellipse cx="195" cy="102" rx="190" ry="8" fill="#1a3a5a" opacity=".6"/>{[0,60,120,180,240,300,350].map((x,i)=><line key={i} x1={x} y1={100} x2={x+30} y2={145} stroke="rgba(107,163,224,0.15)" strokeWidth="1"/>)}
{/* Salt flat reflection sparkles */}{[[40,115],[120,108],[200,112],[280,106],[340,118]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={1.5} fill="#E8C882" opacity=".8"/>)}
{/* Christ the Redeemer silhouette */}<rect x="308" y="52" width="4" height="40" fill="#1a1a2a"/><rect x="295" y="62" width="30" height="4" rx="2" fill="#1a1a2a"/><ellipse cx="310" cy="50" rx="5" ry="6" fill="#1a1a2a"/>
{/* Sun/moon */}<circle cx="340" cy="25" r="14" fill="#E8C882" opacity=".7"/><circle cx="348" cy="20" r="10" fill="#2e1a08"/>
{/* Condor birds */}{[[160,35],[175,28],[190,33]].map(([x,y],i)=><path key={i} d={`M${x},${y} Q${x+6},${y-5} ${x+12},${y}`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>)}
{/* Andes mountain silhouette */}<polygon points="0,85 40,55 80,70 130,40 180,65 220,45 270,70 310,50 350,68 390,58 390,100 0,100" fill="#0d1a0d" opacity=".9"/><polygon points="130,40 155,25 180,40" fill="#162614" opacity=".9"/>
<rect x="0" y="133" width="390" height="12" fill="#060e06" opacity=".8"/></svg>);

const HeroGeneric=({h=145})=>(<svg viewBox="0 0 390 145" style={{width:"100%",height:h,display:"block"}}><defs><linearGradient id="hg9" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a1a2e"/><stop offset="100%" stopColor="#2e2e4a"/></linearGradient></defs><rect width="390" height="145" fill="url(#hg9)"/><text x="160" y="85" fontSize="44" textAnchor="middle">🌍</text><text x="230" y="85" fontSize="36" textAnchor="middle">✈️</text></svg>);
const HERO_MAP={ottawa:HeroOttawa,quebec:HeroQuebec,southamerica:HeroSouthAmerica};

/* ════════════════════════════════════════════════════
   INNER TABS
════════════════════════════════════════════════════ */
const INNER_TABS=[
  {id:"itinerary", icon:"📅", label:"行程"},
  {id:"budget",    icon:"💴", label:"預算"},
  {id:"flights",   icon:"✈️", label:"機票"},
  {id:"map",       icon:"🗺️", label:"地圖"},
  {id:"checklist", icon:"✅", label:"清單"},
  {id:"shopping",  icon:"🛍️", label:"購物"},
  {id:"currency",  icon:"💱", label:"換算"},
  {id:"emergency", icon:"🆘", label:"緊急"},
];

/* ════════════════════════════════════════════════════
   MAP TAB — Google Maps route links per trip
════════════════════════════════════════════════════ */
const TRIP_MAPS = {
  ottawa2026: {
    overviewUrl: "https://www.google.com/maps/dir/Toronto,+ON/Ottawa,+ON/Montebello,+QC/@44.5,-75.5,8z",
    waypoints: [
      { name:"多倫多出發點", addr:"Toronto, ON", icon:"🏠", url:"https://maps.google.com/?q=Toronto,ON" },
      { name:"Commissioners Park 鬱金香", addr:"Dow's Lake, Ottawa, ON", icon:"🌷", url:"https://maps.google.com/?q=Commissioners+Park+Ottawa" },
      { name:"ByWard Market", addr:"ByWard Market, Ottawa, ON", icon:"🥞", url:"https://maps.google.com/?q=ByWard+Market+Ottawa" },
      { name:"Parc Omega", addr:"Montebello, QC", icon:"🦌", url:"https://maps.google.com/?q=Parc+Omega+Montebello+Quebec" },
    ],
  },
  quebec2026: {
    overviewUrl: "https://www.google.com/maps/dir/Toronto,+ON/Montreal,+QC/Mont-Tremblant,+QC/Quebec+City,+QC/Sherbrooke,+QC/@46,-73,7z",
    waypoints: [
      { name:"多倫多出發", addr:"Toronto, ON", icon:"🏠", url:"https://maps.google.com/?q=Toronto,ON" },
      { name:"Montreal Christmas Market", addr:"Montreal, QC", icon:"🎄", url:"https://maps.google.com/?q=Montreal+Christmas+Market" },
      { name:"Mont-Tremblant", addr:"Mont-Tremblant, QC", icon:"🏔️", url:"https://maps.google.com/?q=Mont+Tremblant+Quebec" },
      { name:"Vieux-Québec", addr:"Old Quebec City, QC", icon:"⛸️", url:"https://maps.google.com/?q=Old+Quebec+City" },
      { name:"Sherbrooke 出發返多倫多", addr:"Sherbrooke, QC", icon:"🚗", url:"https://maps.google.com/?q=Sherbrooke,QC" },
    ],
  },
  southamerica2027: {
    overviewUrl: "https://www.google.com/maps/dir/Lima,+Peru/Cusco,+Peru/La+Paz,+Bolivia/Uyuni,+Bolivia/Buenos+Aires,+Argentina/Iguazu,+Argentina/Rio+de+Janeiro,+Brazil/Sao+Paulo,+Brazil/@-18,-65,4z",
    waypoints: [
      { name:"利馬 Lima", addr:"Lima, Peru", icon:"✈️", url:"https://maps.google.com/?q=Lima,Peru" },
      { name:"庫斯科 Cusco + Skylodge", addr:"Cusco, Peru", icon:"🏔️", url:"https://maps.google.com/?q=Cusco,Peru" },
      { name:"馬丘比丘 Machu Picchu", addr:"Machu Picchu, Peru", icon:"🏛️", url:"https://maps.google.com/?q=Machu+Picchu,Peru" },
      { name:"拉巴斯 La Paz", addr:"La Paz, Bolivia", icon:"🌄", url:"https://maps.google.com/?q=La+Paz,Bolivia" },
      { name:"烏尤尼鹽沼 Salar de Uyuni", addr:"Uyuni, Bolivia", icon:"🧂", url:"https://maps.google.com/?q=Salar+de+Uyuni,Bolivia" },
      { name:"布宜諾斯艾利斯", addr:"Buenos Aires, Argentina", icon:"💃", url:"https://maps.google.com/?q=Buenos+Aires,Argentina" },
      { name:"伊瓜蘇瀑布 Iguazu Falls", addr:"Iguazu, Argentina/Brazil", icon:"💧", url:"https://maps.google.com/?q=Iguazu+Falls" },
      { name:"里約熱內盧 Rio de Janeiro", addr:"Rio de Janeiro, Brazil", icon:"⛱️", url:"https://maps.google.com/?q=Rio+de+Janeiro,Brazil" },
      { name:"聖保羅 São Paulo", addr:"São Paulo, Brazil", icon:"🏙️", url:"https://maps.google.com/?q=Sao+Paulo,Brazil" },
    ],
  },
};

function MapTab({ trip }) {
  const mapData = TRIP_MAPS[trip.id];
  const genericSearch = `https://maps.google.com/?q=${encodeURIComponent(trip.location || trip.title)}`;

  return (
    <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:14 }}>

      {/* Open full route in Google Maps */}
      <a
        href={mapData?.overviewUrl || genericSearch}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration:"none" }}
      >
        <div style={{
          background:`linear-gradient(135deg,#1a3a6a,#0a2040)`,
          border:`1.5px solid ${C.blue}`,
          borderRadius:16, padding:"16px 18px",
          display:"flex", alignItems:"center", gap:14, marginTop:8,
          cursor:"pointer",
        }}>
          <div style={{ fontSize:36 }}>🗺️</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:4 }}>完整行程路線</div>
            <div style={{ fontSize:11, color:C.blue, fontFamily:C.mono }}>在 Google Maps 開啟全程路線 →</div>
          </div>
          <div style={{ fontSize:22, color:C.blue }}>↗</div>
        </div>
      </a>

      {/* Waypoints list */}
      {mapData ? (
        <>
          <div style={{ fontSize:11, fontFamily:C.mono, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>
            行程地點 · 逐一導航
          </div>
          {mapData.waypoints.map((wp, i) => (
            <a key={i} href={wp.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
              <div style={{
                background:C.surface, border:`1px solid ${C.border2}`,
                borderRadius:13, padding:"13px 16px",
                display:"flex", alignItems:"center", gap:13,
                cursor:"pointer",
              }}>
                {/* Step number */}
                <div style={{
                  width:30, height:30, borderRadius:"50%",
                  background:`rgba(107,163,224,0.15)`,
                  border:`1.5px solid ${C.blue}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:C.mono, fontSize:11, fontWeight:700, color:C.blue,
                  flexShrink:0,
                }}>{i+1}</div>
                {/* Icon + name */}
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:"#fff", marginBottom:3 }}>
                    {wp.icon} {wp.name}
                  </div>
                  <div style={{ fontSize:11, color:C.muted, fontFamily:C.mono }}>{wp.addr}</div>
                </div>
                {/* Open maps arrow */}
                <div style={{
                  background:"rgba(107,163,224,.15)",
                  border:`1px solid rgba(107,163,224,.3)`,
                  borderRadius:20, padding:"5px 12px",
                  fontSize:10, color:C.blue, fontFamily:C.mono, fontWeight:700,
                  flexShrink:0,
                }}>導航 ↗</div>
              </div>
            </a>
          ))}
        </>
      ) : (
        <a href={genericSearch} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border2}`, borderRadius:13, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <span style={{ fontSize:24 }}>📍</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{trip.location || trip.title}</div>
              <div style={{ fontSize:11, color:C.muted, fontFamily:C.mono }}>在 Google Maps 搜尋</div>
            </div>
            <span style={{ color:C.blue, fontSize:18 }}>↗</span>
          </div>
        </a>
      )}

      {/* Tip */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px" }}>
        <div style={{ fontSize:11, color:C.muted, fontFamily:C.mono, letterSpacing:1, textTransform:"uppercase", marginBottom:7 }}>💡 提示</div>
        {["撳任何地點開啟 Google Maps 即時導航","建議出發前將地圖離線下載以備無網絡使用","「完整行程路線」顯示整個旅程嘅多點路線"].map((t,i)=>(
          <div key={i} style={{ display:"flex", gap:8, padding:i?"5px 0 0":"0", fontSize:12, color:C.text2 }}>
            <span style={{ color:C.accent, flexShrink:0 }}>▸</span><span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   EMERGENCY TAB
════════════════════════════════════════════════════ */
function EmergencyTab({ trip }) {
  const em = EMERGENCY_BY_COUNTRY[detectCountryCode(trip)] || EMERGENCY_BY_COUNTRY.DEFAULT;
  const cats = [...new Set(em.contacts.map(c => c.cat))];
  return (
    <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ background:"rgba(224,112,96,.1)", border:"1.5px solid rgba(224,112,96,.4)", borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", gap:10, marginTop:8 }}>
        <span style={{ fontSize:28 }}>🆘</span>
        <div><div style={{ fontSize:13, fontWeight:700, color:C.red }}>緊急聯絡 · {em.name}</div><div style={{ fontSize:10, color:C.text2, marginTop:2, fontFamily:C.mono }}>遇到緊急情況時請即撥打以下電話</div></div>
      </div>
      {cats.map(cat => (
        <div key={cat}>
          <div style={{ fontSize:10, fontFamily:C.mono, color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:7 }}>{cat}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {em.contacts.filter(c => c.cat === cat).map((contact, i) => (
              <div key={i} style={{ background:C.surface, border:`1px solid ${cat.includes("🚨") ? "rgba(224,112,96,.4)" : C.border2}`, borderRadius:13, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:600, color:"#fff", marginBottom:3 }}>{contact.name}</div><div style={{ fontSize:10, color:C.muted, fontFamily:C.mono }}>{contact.desc}</div></div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
                  <div style={{ fontFamily:C.mono, fontSize:15, fontWeight:700, color:cat.includes("🚨") ? C.red : C.accent }}>{contact.num}</div>
                  <a href={`tel:${contact.num.replace(/[^+\d]/g,"")}`} style={{ background:cat.includes("🚨") ? C.red : C.green, color:"#fff", fontSize:10, fontFamily:C.mono, fontWeight:700, padding:"5px 14px", borderRadius:20, textDecoration:"none" }}>📞 立即致電</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   ITINERARY TAB — fixed scroll + fixed drag
════════════════════════════════════════════════════ */
const TYPE_ICONS={"travel":"🚗","arrival":"✈️","departure":"✈️","sightseeing":"🏞️","shopping":"🛍️","local":"🚶"};
const TYPE_COLORS={"travel":C.blue,"arrival":C.green,"departure":C.muted,"sightseeing":C.accent,"shopping":C.pink,"local":C.lavender};

function ItineraryTab({ trip, onUpdate }) {
  const [days, setDays] = useState(() => trip.days.map(d => ({ ...d, spots: d.spots.map(s => ({ ...s })) })));
  const [showAdd, setShowAdd] = useState(false);
  const [newDay, setNewDay] = useState({ title:"", type:"sightseeing", transport:"", transportTime:60, date:"", stay:"" });
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const daysRef = useRef(null);
  const dragIdxRef = useRef(null);
  const isDraggingRef = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => { daysRef.current = days; }, [days]);

  const save = useCallback((updated) => {
    setDays(updated);
    daysRef.current = updated;
    onUpdate && onUpdate({ ...trip, days: updated });
  }, [trip, onUpdate]);

  const calcTimes = (spots, tt, startTime) => {
    // startTime: "HH:MM" string, default "08:30"
    const [sh, sm] = (startTime || "08:30").split(":").map(Number);
    let t = sh*60 + (sm||0) + (tt||0);
    return spots.map(s=>{
      const h=Math.floor(t/60)%24, m=t%60;
      const arr=`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
      t+=(s.stay||60);
      const eh=Math.floor(t/60)%24, em2=t%60;
      return {arrival:arr, departure:`${String(eh).padStart(2,"0")}:${String(em2).padStart(2,"0")}`};
    });
  };

  const [editingStartTime, setEditingStartTime] = useState(null); // di index being edited
  const [startTimeVal, setStartTimeVal] = useState("08:30");

  const updStartTime = (di) => {
    const src = daysRef.current || days;
    const n = src.map(d => ({ ...d, spots: d.spots.map(s => ({ ...s })) }));
    n[di].startTime = startTimeVal;
    save(n);
    setEditingStartTime(null);
  };

  const deleteDay=(i)=>save((daysRef.current||days).filter((_,idx)=>idx!==i));
  const addDay=()=>{
    if(!newDay.title.trim())return;
    save([...(daysRef.current||days),{id:Date.now(),...newDay,spots:[{name:"新景點",stay:60}]}]);
    setNewDay({title:"",type:"sightseeing",transport:"",transportTime:60,date:"",stay:""});
    setShowAdd(false);
  };
  const updSpot=(di,si,key,val)=>{
    const src=daysRef.current||days;
    const n=src.map(d=>({...d,spots:d.spots.map(s=>({...s}))}));
    n[di].spots[si][key]=key==="stay"?(parseInt(val)||0):val;
    save(n);
  };
  const addSpot=(di)=>{const src=daysRef.current||days;const n=src.map(d=>({...d,spots:d.spots.map(s=>({...s}))}));n[di].spots.push({name:"新景點",stay:60});save(n);};
  const delSpot=(di,si)=>{const src=daysRef.current||days;const n=src.map(d=>({...d,spots:d.spots.map(s=>({...s}))}));n[di].spots.splice(si,1);save(n);};

  const handleDragStart = useCallback((idx, clientY) => {
    dragIdxRef.current = idx;
    isDraggingRef.current = true;
    setDraggingIdx(idx);

    const onMove = (e) => {
      if (!isDraggingRef.current) return;
      e.preventDefault(); // stop page scroll during drag
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      const cards = containerRef.current?.querySelectorAll(".day-card");
      if (!cards || dragIdxRef.current === null) return;
      let newIdx = dragIdxRef.current;
      cards.forEach((card, ri) => {
        const rect = card.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        if (cy < mid && dragIdxRef.current > ri) newIdx = ri;
        if (cy > mid && dragIdxRef.current < ri) newIdx = ri;
      });
      if (newIdx !== dragIdxRef.current) {
        setDays(prev => {
          const n = [...prev];
          const [removed] = n.splice(dragIdxRef.current, 1);
          n.splice(newIdx, 0, removed);
          dragIdxRef.current = newIdx;
          daysRef.current = n;
          return n;
        });
        setDragOverIdx(newIdx);
      }
    };

    const onEnd = () => {
      isDraggingRef.current = false;
      setDays(prev => { onUpdate && onUpdate({ ...trip, days: prev }); return prev; });
      setDraggingIdx(null); setDragOverIdx(null); dragIdxRef.current = null;
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
    };

    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd, { passive: true });
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
  }, [trip, onUpdate]);

  return (
    <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:6 }}>
        <div style={{ fontSize:11, fontFamily:C.mono, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>
          行程安排<span style={{ color:"rgba(255,255,255,.18)", textTransform:"none", letterSpacing:0 }}> — ⠿ 拖動</span>
        </div>
        <button onClick={()=>setShowAdd(s=>!s)} style={{ background:showAdd?"rgba(224,112,96,.15)":C.accent, color:showAdd?C.red:"#000", border:`1px solid ${showAdd?"rgba(224,112,96,.4)":"transparent"}`, borderRadius:20, padding:"6px 16px", fontFamily:C.mono, fontSize:11, fontWeight:700, cursor:"pointer" }}>
          {showAdd?"× 取消":"＋ 新增日子"}
        </button>
      </div>

      {showAdd&&(<div style={{ background:C.surface, border:`1px solid ${C.accent}`, borderRadius:14, padding:14, display:"flex", flexDirection:"column", gap:8 }}>
        {[{ph:"日子標題",key:"title"},{ph:"日期",key:"date"},{ph:"交通方式",key:"transport"},{ph:"住宿",key:"stay"}].map(f=>(
          <input key={f.key} value={newDay[f.key]} onChange={e=>setNewDay(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
            style={{ background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, color:"#fff", fontFamily:C.mono, fontSize:13, padding:"10px 12px", outline:"none" }}/>
        ))}
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:11, color:C.muted, fontFamily:C.mono, whiteSpace:"nowrap" }}>交通時間(分鐘)</span>
          <input type="number" value={newDay.transportTime} onChange={e=>setNewDay(p=>({...p,transportTime:parseInt(e.target.value)||0}))}
            style={{ width:64, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, color:"#fff", fontFamily:C.mono, fontSize:12, padding:"8px", outline:"none", textAlign:"center" }}/>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {Object.keys(TYPE_ICONS).map(ty=>(
              <div key={ty} onClick={()=>setNewDay(p=>({...p,type:ty}))}
                style={{ fontSize:10, padding:"4px 10px", borderRadius:12, fontFamily:C.mono, cursor:"pointer", background:newDay.type===ty?TYPE_COLORS[ty]+"33":C.surface2, border:`1px solid ${newDay.type===ty?TYPE_COLORS[ty]:C.border}`, color:newDay.type===ty?TYPE_COLORS[ty]:"#fff" }}>
                {TYPE_ICONS[ty]} {ty}
              </div>
            ))}
          </div>
        </div>
        <button onClick={addDay} style={{ background:C.accent, color:"#000", border:"none", borderRadius:10, padding:"11px", fontFamily:C.mono, fontSize:13, fontWeight:700, cursor:"pointer" }}>確認新增 ＋</button>
      </div>)}

      <div ref={containerRef} style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {days.map((d, di) => {
          const times = calcTimes(d.spots, d.transportTime, d.startTime);
          const tc = TYPE_COLORS[d.type] || C.muted;
          const ti = TYPE_ICONS[d.type] || "📅";
          const totalMins = (d.transportTime||0) + d.spots.reduce((a,s)=>a+(s.stay||0),0);
          const [sh2, sm2] = (d.startTime || "08:30").split(":").map(Number);
          const endMinutes = sh2*60 + (sm2||0) + totalMins;
          const endH = Math.floor(endMinutes/60)%24;
          const endM2 = endMinutes%60;
          const isDragging = draggingIdx === di;
          const isOver = dragOverIdx === di && draggingIdx !== di;
          const isEditingTime = editingStartTime === di;
          return (
            <div key={d.id} className="day-card" style={{
              background:C.surface,
              border:`1.5px solid ${isOver?C.accent:isDragging?C.blue:C.border}`,
              borderRadius:14, overflow:"hidden",
              opacity:isDragging?0.72:1,
              transform:isDragging?"scale(0.97)":"scale(1)",
              transition:"opacity .15s, transform .15s, border-color .15s",
              userSelect:"none",
            }}>
              <div style={{ background:C.surface2, padding:"12px", display:"flex", alignItems:"center", gap:10 }}>
                {/* Drag handle */}
                <div
                  onMouseDown={e=>{ e.preventDefault(); handleDragStart(di, e.clientY); }}
                  onTouchStart={e=>{ handleDragStart(di, e.touches[0].clientY); }}
                  style={{ width:36, height:44, display:"flex", alignItems:"center", justifyContent:"center", cursor:"grab", flexShrink:0, color:"rgba(255,255,255,.45)", fontSize:22, touchAction:"none", userSelect:"none" }}
                >⠿</div>
                <div style={{ width:30, height:30, borderRadius:8, background:tc+"22", border:`1px solid ${tc}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{ti}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>
                    {d.date&&<span style={{ color:C.muted, fontFamily:C.mono, fontSize:10, marginRight:6 }}>{d.date}</span>}
                    {d.title}
                  </div>
                  {/* Start time row — editable */}
                  {isEditingTime ? (
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }} onTouchStart={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()}>
                      <input
                        type="time"
                        value={startTimeVal}
                        onChange={e=>setStartTimeVal(e.target.value)}
                        style={{ background:C.surface3, border:`1px solid ${C.accent}`, borderRadius:7, color:C.accent, fontFamily:C.mono, fontSize:12, padding:"4px 8px", outline:"none", colorScheme:"dark" }}
                      />
                      <button onClick={()=>updStartTime(di)} style={{ background:C.green, color:"#000", border:"none", borderRadius:7, padding:"4px 10px", fontFamily:C.mono, fontSize:11, fontWeight:700, cursor:"pointer" }}>✓</button>
                      <button onClick={()=>setEditingStartTime(null)} style={{ background:"rgba(255,255,255,.1)", color:"#fff", border:"none", borderRadius:7, padding:"4px 8px", fontFamily:C.mono, fontSize:11, cursor:"pointer" }}>✕</button>
                    </div>
                  ) : (
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3, flexWrap:"wrap" }}>
                      <div style={{ fontSize:10, color:tc, fontFamily:C.mono }}>
                        🚗 {d.transport} · {d.transportTime}分鐘 | {d.startTime||"08:30"} → {String(endH).padStart(2,"0")}:{String(endM2).padStart(2,"0")}
                      </div>
                      <button
                        onClick={()=>{ setEditingStartTime(di); setStartTimeVal(d.startTime||"08:30"); }}
                        onTouchStart={e=>e.stopPropagation()}
                        style={{ background:`rgba(232,200,130,.15)`, border:`1px solid rgba(232,200,130,.3)`, color:C.accent, borderRadius:20, padding:"2px 9px", fontFamily:C.mono, fontSize:10, fontWeight:700, cursor:"pointer", flexShrink:0 }}
                      >🕐 改時間</button>
                    </div>
                  )}
                  {d.tour&&d.ts!=="none"&&<div style={{ fontSize:10, fontFamily:C.mono, color:d.ts==="booked"?C.green:C.accent, marginTop:1 }}>{d.ts==="booked"?"🎟":"⏳"} {d.tour}</div>}
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={()=>addSpot(di)} style={{ background:"rgba(127,200,169,.15)", border:"1px solid rgba(127,200,169,.3)", color:C.green, borderRadius:8, padding:"5px 10px", fontSize:11, fontFamily:C.mono, cursor:"pointer" }}>＋</button>
                  <button onClick={()=>deleteDay(di)} style={{ background:"rgba(224,112,96,.15)", border:"1px solid rgba(224,112,96,.3)", color:C.red, borderRadius:8, padding:"5px 10px", fontSize:11, cursor:"pointer" }}>✕</button>
                </div>
              </div>
              <div style={{ padding:"8px 12px", display:"flex", flexDirection:"column", gap:6 }}>
                {d.spots.map((spot,si)=>(
                  <div key={si} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 11px", background:C.surface3, borderRadius:10, border:`1px solid ${C.border}` }}>
                    <div style={{ width:3, minHeight:30, borderRadius:2, background:tc, flexShrink:0, alignSelf:"stretch" }}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <input value={spot.name} onChange={e=>updSpot(di,si,"name",e.target.value)}
                        onTouchStart={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()}
                        style={{ background:"transparent", border:"none", color:"#fff", fontFamily:C.mono, fontSize:13, fontWeight:500, outline:"none", width:"100%" }}/>
                      <div style={{ fontSize:10, color:C.muted, fontFamily:C.mono, marginTop:2 }}>
                        🕐 <span style={{ color:C.green }}>{times[si]?.arrival}</span> → <span style={{ color:C.accent }}>{times[si]?.departure}</span>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
                      <span style={{ fontSize:10, color:C.muted, fontFamily:C.mono }}>分鐘</span>
                      <input type="number" value={spot.stay} min={0} max={999}
                        onChange={e=>updSpot(di,si,"stay",e.target.value)}
                        onTouchStart={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()}
                        style={{ width:46, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:6, color:"#fff", fontFamily:C.mono, fontSize:11, padding:"4px 5px", textAlign:"center", outline:"none" }}/>
                    </div>
                    <button onClick={()=>delSpot(di,si)} style={{ background:"transparent", border:"none", color:"rgba(255,255,255,.25)", fontSize:15, cursor:"pointer", padding:"0 2px", flexShrink:0 }}>×</button>
                  </div>
                ))}
                <div style={{ fontSize:10, fontFamily:C.mono, color:C.muted, paddingLeft:10, paddingTop:2 }}>🏨 {d.stay}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   BUDGET TAB
════════════════════════════════════════════════════ */
function BudgetTab({ trip, onUpdate }) {
  const [items, setItems] = useState(trip.budget.items.map(i=>({...i})));
  const [expenses, setExpenses] = useState(trip.budget.expenses||[]);
  const [totalBudget, setTotalBudget] = useState(trip.budget.totalCAD);
  const [editingBudget, setEditingBudget] = useState(false);
  const [showAddExp, setShowAddExp] = useState(false);
  const [newExp, setNewExp] = useState({icon:"🛍️",name:"",cat:"購物",amt:"",note:""});
  const [editingIdx, setEditingIdx] = useState(null);

  const sync = useCallback((updItems, updExpenses, updTotal) => {
    const updBudget = { ...trip.budget, items:updItems||items, expenses:updExpenses||expenses, totalCAD:updTotal||totalBudget };
    onUpdate && onUpdate({ ...trip, budget:updBudget });
  }, [trip, onUpdate, items, expenses, totalBudget]);

  const totalSpent = [...items,...expenses].reduce((a,e)=>a+(parseFloat(e.amt)||0),0);
  const remaining = totalBudget - totalSpent;
  const circ = 2*Math.PI*44; let off=0;
  const segs = trip.budget.breakdown.map(seg=>{const dash=(seg.pct/100)*circ;const el={...seg,dash,off};off+=dash;return el;});
  const expIcons=["🍜","🛍️","🚗","🏨","🎡","🍺","☕","🎵","💊","🏪","✈️","🎫","🦞","🍣","⛽","🎪"];

  const addExpense=()=>{
    if(!newExp.name.trim()||!newExp.amt)return;
    const updated=[...expenses,{...newExp,id:`exp_${Date.now()}`,amt:parseFloat(newExp.amt),date:new Date().toLocaleDateString("zh-HK")}];
    setExpenses(updated);setNewExp({icon:"🛍️",name:"",cat:"購物",amt:"",note:""});setShowAddExp(false);
    sync(null,updated,null);
  };

  return (
    <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, paddingTop:8 }}>
        <svg width="112" height="112" viewBox="0 0 112 112" style={{ flexShrink:0 }}>
          <circle cx="56" cy="56" r="44" fill="none" stroke={C.surface2} strokeWidth="16"/>
          {segs.map((seg,i)=>(<circle key={i} cx="56" cy="56" r="44" fill="none" stroke={seg.color} strokeWidth="16" strokeDasharray={`${seg.dash} ${circ-seg.dash}`} strokeDashoffset={-seg.off} transform="rotate(-90 56 56)"/>))}
          <text x="56" y="51" textAnchor="middle" style={{ fontFamily:C.jp, fontSize:10, fontWeight:700, fill:"#fff" }}>{trip.budget.currency} ${totalBudget.toLocaleString()}</text>
          <text x="56" y="64" textAnchor="middle" style={{ fontFamily:C.mono, fontSize:7, fill:C.muted }}>總預算</text>
        </svg>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5 }}>
          {trip.budget.breakdown.map(seg=>(<div key={seg.cat} style={{ display:"flex", alignItems:"center", gap:7 }}><div style={{ width:8, height:8, borderRadius:"50%", background:seg.color, flexShrink:0 }}/><span style={{ fontSize:10, color:C.text2, flex:1 }}>{seg.cat}</span><span style={{ fontFamily:C.mono, fontSize:10, color:"#fff", fontWeight:600 }}>{trip.budget.currency}${seg.amt.toLocaleString()}</span><span style={{ fontFamily:C.mono, fontSize:9, color:C.muted, width:26, textAlign:"right" }}>{seg.pct}%</span></div>))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {[{l:"總預算",v:`${trip.budget.currency} $${totalBudget.toLocaleString()}`,sub:`≈ HKD $${Math.round(totalBudget/0.172).toLocaleString()}`,edit:true},{l:"已花費",v:`${trip.budget.currency} $${totalSpent.toFixed(0)}`,sub:`${Math.round(totalSpent/totalBudget*100)}% 已分配`},{l:"剩餘",v:`${trip.budget.currency} $${remaining.toFixed(0)}`,sub:remaining<0?"超支！":"安全範圍",over:remaining<0},{l:"每日平均",v:`${trip.budget.currency} $${Math.round(totalBudget/trip.daysCount)}`,sub:`共 ${trip.daysCount} 天`}].map((s,i)=>(
          <div key={i} style={{ background:s.over?"rgba(224,112,96,.08)":C.surface, border:`1px solid ${s.over?"rgba(224,112,96,.4)":C.border2}`, borderRadius:12, padding:12, position:"relative" }}>
            <div style={{ fontFamily:C.mono, fontSize:9, color:C.muted, letterSpacing:"1.5px", marginBottom:4, textTransform:"uppercase" }}>{s.l}</div>
            {s.edit&&editingBudget?<input type="number" defaultValue={totalBudget} onBlur={e=>{const v=parseFloat(e.target.value)||totalBudget;setTotalBudget(v);setEditingBudget(false);sync(null,null,v);}} autoFocus style={{ background:"transparent", border:"none", fontFamily:C.jp, fontSize:16, fontWeight:700, color:C.accent, outline:"none", width:"100%" }}/>:<div style={{ fontFamily:C.jp, fontSize:16, fontWeight:700, color:s.over?C.red:C.accent }}>{s.v}</div>}
            <div style={{ fontSize:10, color:s.over?C.red:C.muted, marginTop:2 }}>{s.sub}</div>
            {s.edit&&!editingBudget&&<button onClick={()=>setEditingBudget(true)} style={{ position:"absolute", top:8, right:8, background:"transparent", border:"none", fontSize:11, cursor:"pointer", color:C.muted }}>✏️</button>}
          </div>
        ))}
      </div>
      <div style={{ fontSize:10, fontFamily:C.mono, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>費用明細</div>
      {items.map((e,i)=>(
        <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:11, padding:"10px 13px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:18, width:34, height:34, background:C.surface2, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer" }} onClick={()=>setEditingIdx(editingIdx===i?null:i)}>{e.icon}</div>
            <div style={{ flex:1 }}>
              {editingIdx===i?<input value={e.name} onChange={ev=>{const n=[...items];n[i]={...n[i],name:ev.target.value};setItems(n);sync(n,null,null);}} style={{ background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:7, color:"#fff", fontFamily:C.mono, fontSize:11, padding:"4px 8px", outline:"none", width:"100%" }}/>:<div style={{ fontSize:11, fontWeight:500, color:"#fff", marginBottom:2 }}>{e.name}</div>}
              <div style={{ fontSize:10, color:C.muted, fontFamily:C.mono }}>{e.cat}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              {editingIdx===i?<input type="number" value={e.amt} onChange={ev=>{const n=[...items];n[i]={...n[i],amt:parseFloat(ev.target.value)||0};setItems(n);sync(n,null,null);}} style={{ width:80, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:7, color:C.accent, fontFamily:C.mono, fontSize:12, padding:"4px 8px", outline:"none", textAlign:"right" }}/>:<div style={{ fontFamily:C.mono, fontSize:12, fontWeight:600, color:"#fff" }}>{trip.budget.currency} ${e.amt.toLocaleString()}</div>}
            </div>
          </div>
        </div>
      ))}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontSize:10, fontFamily:C.mono, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>消費記錄</div>
        <button onClick={()=>setShowAddExp(s=>!s)} style={{ background:showAddExp?"rgba(224,112,96,.15)":C.green, color:showAddExp?C.red:"#000", border:`1px solid ${showAddExp?"rgba(224,112,96,.3)":"transparent"}`, borderRadius:20, padding:"5px 14px", fontFamily:C.mono, fontSize:10, fontWeight:700, cursor:"pointer" }}>{showAddExp?"× 取消":"＋ 記錄消費"}</button>
      </div>
      {showAddExp&&(<div style={{ background:C.surface, border:`1px solid ${C.green}`, borderRadius:14, padding:14, display:"flex", flexDirection:"column", gap:7 }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:2 }}>{expIcons.map(ic=>(<div key={ic} onClick={()=>setNewExp(p=>({...p,icon:ic}))} style={{ fontSize:18, width:34, height:34, borderRadius:8, background:newExp.icon===ic?"rgba(127,200,169,.2)":C.surface2, border:`1px solid ${newExp.icon===ic?C.green:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>{ic}</div>))}</div>
        <input value={newExp.name} onChange={e=>setNewExp(p=>({...p,name:e.target.value}))} placeholder="消費項目名稱" style={{ background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, color:"#fff", fontFamily:C.mono, fontSize:11, padding:"8px 11px", outline:"none" }}/>
        <div style={{ display:"flex", gap:7 }}>
          <input type="number" value={newExp.amt} onChange={e=>setNewExp(p=>({...p,amt:e.target.value}))} placeholder={trip.budget.currency} style={{ flex:1, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, color:"#fff", fontFamily:C.mono, fontSize:11, padding:"8px 11px", outline:"none" }}/>
          <input value={newExp.cat} onChange={e=>setNewExp(p=>({...p,cat:e.target.value}))} placeholder="分類" style={{ flex:1, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:9, color:"#fff", fontFamily:C.mono, fontSize:11, padding:"8px 11px", outline:"none" }}/>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setShowAddExp(false)} style={{ flex:1, background:C.surface2, border:`1px solid ${C.border2}`, color:C.muted, fontFamily:C.mono, fontSize:11, padding:10, borderRadius:10, cursor:"pointer" }}>取消</button>
          <button onClick={addExpense} style={{ flex:2, background:C.green, color:"#000", border:"none", fontFamily:C.mono, fontSize:11, fontWeight:700, padding:10, borderRadius:10, cursor:"pointer" }}>確認記錄 ✓</button>
        </div>
      </div>)}
      {expenses.length===0&&!showAddExp&&<div style={{ textAlign:"center", padding:"16px", color:C.muted, fontFamily:C.mono, fontSize:11 }}>暫無消費記錄</div>}
      {expenses.map((e)=>(<div key={e.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:11, padding:"10px 13px", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ fontSize:18, width:32, height:32, background:C.surface2, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{e.icon}</div>
        <div style={{ flex:1 }}><div style={{ fontSize:11, fontWeight:500, color:"#fff", marginBottom:1 }}>{e.name}</div><div style={{ fontSize:9, color:C.muted, fontFamily:C.mono }}>{e.cat} · {e.date}</div></div>
        <div style={{ fontFamily:C.mono, fontSize:12, fontWeight:600, color:C.red }}>-{trip.budget.currency} ${parseFloat(e.amt).toLocaleString()}</div>
        <button onClick={()=>{const u=expenses.filter(x=>x.id!==e.id);setExpenses(u);sync(null,u,null);}} style={{ background:"rgba(224,112,96,.15)", border:"1px solid rgba(224,112,96,.3)", color:C.red, borderRadius:7, padding:"3px 7px", fontSize:10, cursor:"pointer" }}>×</button>
      </div>))}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   CHECKLIST TAB
════════════════════════════════════════════════════ */
function ChecklistTab({ trip, onUpdate }) {
  const [data, setData] = useState(trip.checklist.map(s=>({...s,items:s.items.map(i=>({...i}))})));
  const [inps, setInps] = useState({});
  const save = (d) => { setData(d); onUpdate&&onUpdate({...trip,checklist:d}); };
  const toggle=(si,ii)=>{const n=data.map(s=>({...s,items:s.items.map(i=>({...i}))}));n[si].items[ii].c=!n[si].items[ii].c;save(n);};
  const del=(si,ii)=>{const n=data.map(s=>({...s,items:s.items.map(i=>({...i}))}));n[si].items.splice(ii,1);save(n);};
  const add=(si)=>{const k=`s${si}`;if(!inps[k]?.trim())return;const n=data.map(s=>({...s,items:s.items.map(i=>({...i}))}));n[si].items.push({t:inps[k].trim(),c:false});save(n);setInps(p=>({...p,[k]:""}));};
  const tot=data.flatMap(s=>s.items).length,done=data.flatMap(s=>s.items).filter(x=>x.c).length;
  return(<div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:14}}>
    <div style={{display:"flex",justifyContent:"flex-end",paddingTop:4}}><div style={{fontFamily:C.mono,fontSize:12,color:C.green,fontWeight:600}}>{done}/{tot} 完成</div></div>
    {data.map((sec,si)=>(<div key={si}><div style={{fontFamily:C.mono,fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{sec.cat}</div>
      <div style={{display:"flex",flexDirection:"column",gap:5}}>{sec.items.map((item,ii)=>(<div key={ii} onClick={()=>toggle(si,ii)} style={{background:item.c?"rgba(127,200,169,.08)":C.surface,border:`1px solid ${item.c?"rgba(127,200,169,.25)":C.border}`,borderRadius:10,padding:"9px 12px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
        <div style={{width:20,height:20,borderRadius:5,border:`1.5px solid ${item.c?C.green:C.border2}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",background:item.c?C.green:"transparent"}}>{item.c?"✓":""}</div>
        <div style={{flex:1,fontSize:11,color:item.c?C.muted:"#fff",textDecoration:item.c?"line-through":"none"}}>{item.t}</div>
        <div onClick={e=>{e.stopPropagation();del(si,ii);}} style={{color:"rgba(255,255,255,.18)",fontSize:15,cursor:"pointer",padding:"2px 3px"}}>×</div>
      </div>))}</div>
      <div style={{display:"flex",gap:7,marginTop:6}}><input value={inps[`s${si}`]||""} onChange={e=>setInps(p=>({...p,[`s${si}`]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&add(si)} placeholder="新增項目…" style={{flex:1,background:C.surface,border:`1px solid ${C.border2}`,borderRadius:9,color:"#fff",fontFamily:C.mono,fontSize:11,padding:"7px 11px",outline:"none"}}/><button onClick={()=>add(si)} style={{background:C.accent,color:"#000",border:"none",borderRadius:9,padding:"7px 13px",fontFamily:C.mono,fontSize:11,fontWeight:700,cursor:"pointer"}}>＋</button></div>
    </div>))}
  </div>);
}

/* ════════════════════════════════════════════════════
   SHOPPING TAB
════════════════════════════════════════════════════ */
function ShoppingTab({ trip, onUpdate }) {
  const [data, setData] = useState(trip.shopping.map(s=>({...s,items:s.items.map(i=>({...i}))})));
  const [inps, setInps] = useState({});
  const save = (d) => { setData(d); onUpdate&&onUpdate({...trip,shopping:d}); };
  const tog=(si,ii)=>{const n=data.map(s=>({...s,items:s.items.map(i=>({...i}))}));n[si].items[ii].b=!n[si].items[ii].b;save(n);};
  const del=(si,ii)=>{const n=data.map(s=>({...s,items:s.items.map(i=>({...i}))}));n[si].items.splice(ii,1);save(n);};
  const add=(si)=>{const k=`s${si}`;if(!inps[k]?.trim())return;const n=data.map(s=>({...s,items:s.items.map(i=>({...i}))}));n[si].items.push({n:inps[k].trim(),note:"",b:false});save(n);setInps(p=>({...p,[k]:""}));};
  return(<div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:13}}>
    {data.map((sec,si)=>{const bought=sec.items.filter(x=>x.b).length;return(<div key={si}>
      <div style={{fontFamily:C.mono,fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:6,display:"flex",alignItems:"center",gap:8}}>{sec.cat}<span style={{fontSize:9,color:C.green,background:"rgba(127,200,169,.12)",border:"1px solid rgba(127,200,169,.2)",padding:"1px 7px",borderRadius:5,fontWeight:600,textTransform:"none",letterSpacing:0}}>{bought}/{sec.items.length} 已購</span></div>
      <div style={{display:"flex",flexDirection:"column",gap:5}}>{sec.items.map((item,ii)=>(<div key={ii} style={{background:item.b?"rgba(127,200,169,.07)":C.surface,border:`1px solid ${item.b?"rgba(127,200,169,.2)":C.border}`,borderRadius:11,padding:"9px 12px",display:"flex",alignItems:"center",gap:9}}>
        <button onClick={()=>tog(si,ii)} style={{width:22,height:22,borderRadius:6,border:`1.5px solid ${item.b?C.green:C.border2}`,background:item.b?C.green:"transparent",flexShrink:0,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#000"}}>{item.b?"✓":""}</button>
        <div style={{flex:1}}><div style={{fontSize:11,fontWeight:500,color:item.b?C.muted:"#fff",textDecoration:item.b?"line-through":"none"}}>{item.n}</div><div style={{fontSize:9,color:C.muted,fontFamily:C.mono,marginTop:1}}>{item.note}</div></div>
        <div onClick={()=>del(si,ii)} style={{color:"rgba(255,255,255,.15)",fontSize:14,cursor:"pointer",padding:3}}>×</div>
      </div>))}</div>
      <div style={{display:"flex",gap:7,marginTop:5}}><input value={inps[`s${si}`]||""} onChange={e=>setInps(p=>({...p,[`s${si}`]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&add(si)} placeholder="新增…" style={{flex:1,background:C.surface,border:`1px solid ${C.border2}`,borderRadius:9,color:"#fff",fontFamily:C.mono,fontSize:11,padding:"7px 11px",outline:"none"}}/><button onClick={()=>add(si)} style={{background:C.accent,color:"#000",border:"none",borderRadius:9,padding:"7px 12px",fontFamily:C.mono,fontSize:11,fontWeight:700,cursor:"pointer"}}>＋</button></div>
    </div>);})}
  </div>);
}

/* ════════════════════════════════════════════════════
   CURRENCY TAB
════════════════════════════════════════════════════ */
function CurrencyTab() {
  const [base,setBase]=useState("HKD");const [amt,setAmt]=useState("");
  const bc=CURRENCIES.find(c=>c.code===base);
  const conv=(toCur)=>{if(!amt||isNaN(parseFloat(amt)))return "—";const hkd=parseFloat(amt)/bc.rate;const r=hkd*toCur.rate;return r>=1000?r.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,","):r.toFixed(2);};
  return(<div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:12}}>
    <div style={{background:C.surface,border:`1px solid ${C.border2}`,borderRadius:14,padding:16,marginTop:8}}>
      <div style={{fontSize:10,color:C.muted,fontFamily:C.mono,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>輸入金額</div>
      <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:26}}>{bc.flag}</span><div style={{flex:1}}><div style={{fontFamily:C.mono,fontSize:10,color:C.muted,letterSpacing:2,marginBottom:3}}>{bc.code} · {bc.name}</div><input value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0" type="number" style={{width:"100%",background:"transparent",border:"none",fontFamily:C.jp,fontSize:28,fontWeight:700,color:"#fff",outline:"none"}}/></div></div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>{CURRENCIES.map(cur=>(<div key={cur.code} onClick={()=>setBase(cur.code)} style={{fontSize:10,padding:"4px 10px",borderRadius:20,fontFamily:C.mono,cursor:"pointer",background:cur.code===base?"rgba(232,200,130,.2)":C.surface2,border:`1px solid ${cur.code===base?"rgba(232,200,130,.5)":C.border}`,color:cur.code===base?C.accent:"#fff"}}>{cur.flag} {cur.code}</div>))}</div>
    </div>
    <div style={{fontSize:10,fontFamily:C.mono,color:C.muted,letterSpacing:2,textTransform:"uppercase"}}>即時換算</div>
    {CURRENCIES.filter(c=>c.code!==base).map(cur=>(<div key={cur.code} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,padding:"11px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>{cur.flag}</span><div><div style={{fontSize:12,fontWeight:500,color:"#fff"}}>{cur.name}</div><div style={{fontSize:10,color:C.muted,fontFamily:C.mono}}>{cur.code}</div></div></div>
      <div style={{fontFamily:C.jp,fontSize:18,fontWeight:700,color:C.accent}}>{conv(cur)}</div>
    </div>))}
  </div>);
}

/* ════════════════════════════════════════════════════
   FLIGHTS TAB
════════════════════════════════════════════════════ */
function FlightsTab({ trip, onUpdate }) {
  const [flights, setFlights] = useState(trip.flights||[]);
  const [hasFlight, setHasFlight] = useState(trip.hasFlight||false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newF, setNewF] = useState({airline:"",flightNo:"",from:"",to:"",depTime:"",arrTime:"",terminal:"",seat:"",status:"pending"});
  const statusColors={confirmed:C.green,pending:C.accent,checkedin:C.blue};
  const statusLabels={confirmed:"已確認",pending:"待確認",checkedin:"已辦理"};
  const dur=(dep,arr)=>{try{const d=new Date(dep),a=new Date(arr);const m=Math.round((a-d)/60000);return `${Math.floor(m/60)}h${m%60}m`;}catch{return "";}};
  const save=(f,hf)=>{const upd=f||flights;const upHF=hf!==undefined?hf:hasFlight;setFlights(upd);onUpdate&&onUpdate({...trip,flights:upd,hasFlight:upHF});};
  const addF=()=>{const u=[...flights,{...newF,id:`f_${Date.now()}`}];save(u);setNewF({airline:"",flightNo:"",from:"",to:"",depTime:"",arrTime:"",terminal:"",seat:"",status:"pending"});setShowAdd(false);};
  const updF=(id,k,v)=>{const u=flights.map(fl=>fl.id===id?{...fl,[k]:v}:fl);save(u);};
  return(<div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:12}}>
    <div style={{background:C.surface,border:`1px solid ${hasFlight?"rgba(107,163,224,.4)":C.border2}`,borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,marginTop:8}}>
      <span style={{fontSize:24}}>✈️</span>
      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#fff"}}>此行程包含飛機段？</div><div style={{fontSize:10,color:C.muted,fontFamily:C.mono,marginTop:2}}>{hasFlight?"已啟用機票功能":"點擊開關啟用"}</div></div>
      <div onClick={()=>{const h=!hasFlight;setHasFlight(h);save(null,h);}} style={{width:44,height:24,borderRadius:12,background:hasFlight?C.blue:"rgba(255,255,255,.15)",cursor:"pointer",position:"relative",transition:"background .2s"}}>
        <div style={{width:18,height:18,borderRadius:9,background:"white",position:"absolute",top:3,left:hasFlight?23:3,transition:"left .2s"}}/>
      </div>
    </div>
    {hasFlight&&(<>
      {flights.map(fl=>(<div key={fl.id} style={{background:C.surface,border:`1px solid ${C.border2}`,borderRadius:16,overflow:"hidden"}}>
        <div style={{background:`linear-gradient(135deg,${C.surface2},${C.surface3})`,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:20}}>✈️</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{fl.airline||"—"} <span style={{color:C.accent,fontFamily:C.mono}}>{fl.flightNo||"—"}</span></div><div style={{fontSize:10,color:C.muted,fontFamily:C.mono}}>{fl.from||"—"} → {fl.to||"—"}</div></div>
          <div style={{display:"flex",gap:5}}>
            <div style={{fontSize:9,padding:"3px 9px",borderRadius:20,background:`${statusColors[fl.status]||C.muted}22`,color:statusColors[fl.status]||C.muted,fontFamily:C.mono,border:`1px solid ${statusColors[fl.status]||C.muted}55`}}>{statusLabels[fl.status]||fl.status}</div>
            <button onClick={()=>setEditingId(editingId===fl.id?null:fl.id)} style={{background:C.surface,border:`1px solid ${C.border2}`,color:C.muted,borderRadius:8,padding:"3px 8px",fontSize:9,cursor:"pointer"}}>✏️</button>
            <button onClick={()=>save(flights.filter(x=>x.id!==fl.id))} style={{background:"rgba(224,112,96,.15)",border:"1px solid rgba(224,112,96,.3)",color:C.red,borderRadius:8,padding:"3px 8px",fontSize:9,cursor:"pointer"}}>✕</button>
          </div>
        </div>
        <div style={{padding:"12px 14px",display:"flex",gap:0,alignItems:"center"}}>
          <div style={{flex:1,textAlign:"center"}}><div style={{fontFamily:C.mono,fontSize:18,fontWeight:700,color:"#fff"}}>{fl.depTime?new Date(fl.depTime).toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"}):"--:--"}</div><div style={{fontSize:9,color:C.muted,fontFamily:C.mono,marginTop:2}}>{fl.from?.split(" ")[0]||"出發"}</div></div>
          <div style={{flex:1,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{fontSize:10,color:C.muted,fontFamily:C.mono}}>{dur(fl.depTime,fl.arrTime)||"✈"}</div><div style={{width:"100%",height:1,background:`linear-gradient(to right,${C.border2},${C.blue},${C.border2})`}}/></div>
          <div style={{flex:1,textAlign:"center"}}><div style={{fontFamily:C.mono,fontSize:18,fontWeight:700,color:"#fff"}}>{fl.arrTime?new Date(fl.arrTime).toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"}):"--:--"}</div><div style={{fontSize:9,color:C.muted,fontFamily:C.mono,marginTop:2}}>{fl.to?.split(" ")[0]||"到達"}</div></div>
        </div>
        <div style={{padding:"0 14px 12px",display:"flex",gap:8,flexWrap:"wrap"}}>
          {[{l:"航站樓",v:fl.terminal},{l:"座位",v:fl.seat}].map(d=>(<div key={d.l} style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 10px"}}><div style={{fontSize:8,color:C.muted,fontFamily:C.mono}}>{d.l}</div><div style={{fontSize:11,color:"#fff",fontFamily:C.mono,fontWeight:600}}>{d.v||"—"}</div></div>))}
          {Object.entries(statusLabels).map(([k,v])=>(<div key={k} onClick={()=>updF(fl.id,"status",k)} style={{fontSize:9,padding:"4px 9px",borderRadius:20,fontFamily:C.mono,cursor:"pointer",background:fl.status===k?`${statusColors[k]}22`:C.surface2,border:`1px solid ${fl.status===k?statusColors[k]:C.border}`,color:fl.status===k?statusColors[k]:C.muted}}>{v}</div>))}
        </div>
        {editingId===fl.id&&(<div style={{padding:"0 14px 14px",display:"flex",flexDirection:"column",gap:6,borderTop:`1px solid ${C.border}`}}>
          {[{ph:"航空公司",k:"airline"},{ph:"航班號",k:"flightNo"},{ph:"出發地 (e.g. HKG)",k:"from"},{ph:"目的地 (e.g. NRT)",k:"to"},{ph:"航站樓",k:"terminal"},{ph:"座位 (e.g. 28A)",k:"seat"}].map(f=>(<input key={f.k} value={fl[f.k]||""} onChange={e=>updF(fl.id,f.k,e.target.value)} placeholder={f.ph} style={{background:C.surface2,border:`1px solid ${C.border2}`,borderRadius:8,color:"#fff",fontFamily:C.mono,fontSize:11,padding:"7px 11px",outline:"none"}}/>))}
          <div style={{display:"flex",gap:6}}>
            <div style={{flex:1}}><div style={{fontSize:9,color:C.muted,fontFamily:C.mono,marginBottom:4}}>出發時間</div><input type="datetime-local" value={fl.depTime||""} onChange={e=>updF(fl.id,"depTime",e.target.value)} style={{width:"100%",background:C.surface2,border:`1px solid ${C.border2}`,borderRadius:8,color:"#fff",fontFamily:C.mono,fontSize:10,padding:"7px",outline:"none"}}/></div>
            <div style={{flex:1}}><div style={{fontSize:9,color:C.muted,fontFamily:C.mono,marginBottom:4}}>到達時間</div><input type="datetime-local" value={fl.arrTime||""} onChange={e=>updF(fl.id,"arrTime",e.target.value)} style={{width:"100%",background:C.surface2,border:`1px solid ${C.border2}`,borderRadius:8,color:"#fff",fontFamily:C.mono,fontSize:10,padding:"7px",outline:"none"}}/></div>
          </div>
        </div>)}
      </div>))}
      {showAdd?(<div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:14,padding:14,display:"flex",flexDirection:"column",gap:7}}>
        {[{ph:"航空公司",k:"airline"},{ph:"航班號",k:"flightNo"}].map(f=>(<input key={f.k} value={newF[f.k]} onChange={e=>setNewF(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={{background:C.surface2,border:`1px solid ${C.border2}`,borderRadius:8,color:"#fff",fontFamily:C.mono,fontSize:11,padding:"8px 11px",outline:"none"}}/>))}
        <div style={{display:"flex",gap:6}}><input value={newF.from} onChange={e=>setNewF(p=>({...p,from:e.target.value}))} placeholder="出發地 (e.g. HKG)" style={{flex:1,background:C.surface2,border:`1px solid ${C.border2}`,borderRadius:8,color:"#fff",fontFamily:C.mono,fontSize:11,padding:"8px 11px",outline:"none"}}/><input value={newF.to} onChange={e=>setNewF(p=>({...p,to:e.target.value}))} placeholder="目的地 (e.g. NRT)" style={{flex:1,background:C.surface2,border:`1px solid ${C.border2}`,borderRadius:8,color:"#fff",fontFamily:C.mono,fontSize:11,padding:"8px 11px",outline:"none"}}/></div>
        <div style={{display:"flex",gap:6}}>
          <div style={{flex:1}}><div style={{fontSize:9,color:C.muted,fontFamily:C.mono,marginBottom:4}}>出發時間</div><input type="datetime-local" value={newF.depTime} onChange={e=>setNewF(p=>({...p,depTime:e.target.value}))} style={{width:"100%",background:C.surface2,border:`1px solid ${C.border2}`,borderRadius:8,color:"#fff",fontFamily:C.mono,fontSize:10,padding:"7px",outline:"none"}}/></div>
          <div style={{flex:1}}><div style={{fontSize:9,color:C.muted,fontFamily:C.mono,marginBottom:4}}>到達時間</div><input type="datetime-local" value={newF.arrTime} onChange={e=>setNewF(p=>({...p,arrTime:e.target.value}))} style={{width:"100%",background:C.surface2,border:`1px solid ${C.border2}`,borderRadius:8,color:"#fff",fontFamily:C.mono,fontSize:10,padding:"7px",outline:"none"}}/></div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setShowAdd(false)} style={{flex:1,background:C.surface2,border:`1px solid ${C.border2}`,color:C.muted,fontFamily:C.mono,fontSize:11,padding:10,borderRadius:10,cursor:"pointer"}}>取消</button>
          <button onClick={addF} style={{flex:2,background:C.blue,color:"#fff",border:"none",fontFamily:C.mono,fontSize:11,fontWeight:700,padding:10,borderRadius:10,cursor:"pointer"}}>確認新增機票</button>
        </div>
      </div>):(<button onClick={()=>setShowAdd(true)} style={{background:C.surface,border:`1.5px dashed ${C.blue}`,color:C.blue,fontFamily:C.mono,fontSize:12,fontWeight:700,padding:"12px",borderRadius:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>✈️ ＋ 新增機票</button>)}
    </>)}
  </div>);
}

/* ════════════════════════════════════════════════════
   ADD TRIP WIZARD
════════════════════════════════════════════════════ */
const THEMES=["觀光景點","自駕遊","購物","美食","自然風光","文化體驗","海灘","滑雪冬季","音樂演出","攝影之旅"];
function AddTripWizard({ onClose, onCreated }) {
  const TOTAL=7;const [step,setStep]=useState(1);const [creating,setCreating]=useState(false);
  const [form,setForm]=useState({destination:"",depDate:"",retDate:"",pax:"2",budget:"",currency:"CAD",hasFlight:null,selectedThemes:[],notes:""});
  const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleTheme=(th)=>setForm(f=>({...f,selectedThemes:f.selectedThemes.includes(th)?f.selectedThemes.filter(x=>x!==th):[...f.selectedThemes,th]}));
  const canNext=()=>{if(step===1)return form.destination.trim().length>0;if(step===2)return form.depDate&&form.retDate;if(step===3)return parseInt(form.pax)>0;if(step===4)return form.budget.trim().length>0;if(step===5)return form.hasFlight!==null;return true;};
  const create=()=>{setCreating(true);setTimeout(()=>{const depD=new Date(form.depDate),retD=new Date(form.retDate);const daysCount=Math.max(1,Math.round((retD-depD)/86400000));const daysUntil=Math.max(0,Math.round((depD-new Date())/86400000));const newTrip={id:`trip_${Date.now()}`,sortDate:form.depDate,title:form.destination,subtitle:form.selectedThemes.join(" · ")||"",dates:`${form.depDate.replace(/-/g,"/")} – ${form.retDate.replace(/-/g,"/")}`,daysCount,country:"🌍",daysUntil,location:form.destination,weather:{icon:"🌤️",temp:"—",feels:"—",desc:"—",outfit:"—"},budget:{totalCAD:parseFloat(form.budget)||0,currency:form.currency,items:[],expenses:[],breakdown:[]},days:[{id:1,type:"sightseeing",title:"Day 1 行程",transport:"",transportTime:0,spots:[{name:"新景點",stay:120}],stay:"",date:form.depDate,tour:"",ts:"none"}],checklist:[{cat:"📄 必備",items:[{t:"護照",c:false},{t:"旅遊保險",c:false}]}],shopping:[{cat:"🛍️ 購物",items:[]}],flights:form.hasFlight?[{id:"f_new",airline:"",flightNo:"",from:"",to:"",depTime:"",arrTime:"",terminal:"",seat:"",status:"pending"}]:[],hasFlight:form.hasFlight===true,bgColor:"linear-gradient(135deg,#1a1a2e,#2e2e4a)",emoji:"🌍✈️",cartoon:"generic",notes:form.notes};onCreated(newTrip);setCreating(false);},800);};
  if(creating)return(<div style={{position:"absolute",inset:0,background:C.bg,borderRadius:48,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,zIndex:500}}><div style={{animation:"kFloat 1s ease-in-out infinite",display:"flex",gap:4}}><SamGhibli size={64} mood="smile"/><GFGhibli size={64}/></div><div style={{fontFamily:C.jp,fontSize:18,color:C.accent}}>正在建立行程…</div></div>);
  const stepContent=()=>{if(step===1)return(<div><div style={{fontSize:14,color:C.text2,marginBottom:14}}>去邊度旅行？</div><input value={form.destination} onChange={e=>upd("destination",e.target.value)} placeholder="目的地（例：日本東京、西班牙馬德里）" style={{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:12,color:"#fff",fontFamily:C.mono,fontSize:13,padding:"12px 16px",outline:"none"}}/></div>);if(step===2)return(<div><div style={{fontSize:14,color:C.text2,marginBottom:14}}>旅行日期</div><div style={{fontSize:11,color:C.muted,fontFamily:C.mono,marginBottom:6}}>出發日期</div><input value={form.depDate} onChange={e=>upd("depDate",e.target.value)} type="date" style={{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:12,color:"#fff",fontFamily:C.mono,fontSize:13,padding:"12px 16px",outline:"none",marginBottom:10}}/><div style={{fontSize:11,color:C.muted,fontFamily:C.mono,marginBottom:6}}>回程日期</div><input value={form.retDate} onChange={e=>upd("retDate",e.target.value)} type="date" style={{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:12,color:"#fff",fontFamily:C.mono,fontSize:13,padding:"12px 16px",outline:"none"}}/></div>);if(step===3)return(<div><div style={{fontSize:14,color:C.text2,marginBottom:14}}>有幾多人同行？</div><input value={form.pax} onChange={e=>upd("pax",e.target.value)} type="number" placeholder="人數" style={{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:12,color:"#fff",fontFamily:C.mono,fontSize:13,padding:"12px 16px",outline:"none"}}/></div>);if(step===4)return(<div><div style={{fontSize:14,color:C.text2,marginBottom:14}}>大概預算係幾多？</div><input value={form.budget} onChange={e=>upd("budget",e.target.value)} type="number" style={{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:12,color:"#fff",fontFamily:C.mono,fontSize:13,padding:"12px 16px",outline:"none",marginBottom:10}}/><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["CAD","HKD","USD","JPY","GBP","EUR"].map(c=>(<div key={c} onClick={()=>upd("currency",c)} style={{padding:"7px 14px",borderRadius:20,fontFamily:C.mono,fontSize:11,cursor:"pointer",background:form.currency===c?C.accent:C.surface,color:form.currency===c?"#000":"#fff",border:`1px solid ${form.currency===c?C.accent:C.border2}`}}>{c}</div>))}</div></div>);if(step===5)return(<div><div style={{fontSize:14,color:C.text2,marginBottom:18}}>有冇坐飛機？</div><div style={{display:"flex",flexDirection:"column",gap:12}}>{[[true,"✈️ 有，包含飛機段"],[false,"🚗 冇，陸路/船/自駕"]].map(([val,label])=>(<div key={String(val)} onClick={()=>upd("hasFlight",val)} style={{background:form.hasFlight===val?"rgba(232,200,130,.15)":C.surface,border:`1.5px solid ${form.hasFlight===val?C.accent:C.border2}`,borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:13,color:form.hasFlight===val?C.accent:C.text2,fontWeight:form.hasFlight===val?700:400}}>{label}</span>{form.hasFlight===val&&<span style={{marginLeft:"auto",color:C.accent}}>✓</span>}</div>))}</div></div>);if(step===6)return(<div><div style={{fontSize:14,color:C.text2,marginBottom:14}}>旅行主題（可多選）</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{THEMES.map((th,i)=>(<div key={i} onClick={()=>toggleTheme(th)} style={{padding:"8px 14px",borderRadius:20,fontFamily:C.mono,fontSize:11,cursor:"pointer",background:form.selectedThemes.includes(th)?"rgba(244,160,192,.2)":C.surface,color:form.selectedThemes.includes(th)?C.pink:"#fff",border:`1px solid ${form.selectedThemes.includes(th)?"rgba(244,160,192,.5)":C.border2}`}}>{th}</div>))}</div></div>);if(step===7)return(<div><div style={{fontSize:14,color:C.text2,marginBottom:14}}>旅行備忘（選填）</div><textarea value={form.notes} onChange={e=>upd("notes",e.target.value)} placeholder="有咩特別要注意？" rows={4} style={{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:12,color:"#fff",fontFamily:C.mono,fontSize:12,padding:"12px 16px",outline:"none",resize:"none"}}/></div>);};
  return(<div style={{position:"absolute",inset:0,background:C.bg,borderRadius:48,display:"flex",flexDirection:"column",overflow:"hidden",zIndex:500}}>
    <div style={{padding:"52px 20px 20px",background:`linear-gradient(to bottom,${C.surface},${C.bg})`,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}><div style={{fontFamily:C.jp,fontSize:20,fontWeight:800,color:"#fff"}}>新增旅程</div><button onClick={onClose} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"#fff",fontFamily:C.mono,fontSize:10,padding:"5px 12px",borderRadius:16,cursor:"pointer"}}>× 關閉</button></div>
      <div style={{display:"flex",alignItems:"center",gap:4}}>{Array.from({length:TOTAL}).map((_,i)=>(<div key={i} style={{flex:1,height:3,borderRadius:2,background:i<step?C.accent:C.surface2,transition:"background .2s"}}/>))}</div>
      <div style={{fontFamily:C.mono,fontSize:10,color:C.muted,marginTop:6}}>步驟 {step} / {TOTAL}</div>
    </div>
    <div style={{flex:1,overflow:"auto",padding:"10px 24px 20px",scrollbarWidth:"none"}}>
      {step>1&&<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 14px",marginBottom:16,display:"flex",flexWrap:"wrap",gap:8}}>{[form.destination,form.depDate&&`${form.depDate}→${form.retDate}`,form.pax&&`👥${form.pax}人`,form.budget&&`${form.currency}$${parseFloat(form.budget).toLocaleString()}`,form.hasFlight!==null&&(form.hasFlight?"✈️ 有機票":"🚗 陸路")].filter(Boolean).map((s,i)=>(<span key={i} style={{fontSize:10,background:C.surface2,color:C.text2,padding:"3px 10px",borderRadius:20,fontFamily:C.mono}}>{s}</span>))}</div>}
      {stepContent()}
    </div>
    <div style={{padding:"16px 24px 32px",display:"flex",gap:10,flexShrink:0,borderTop:`1px solid ${C.border}`}}>
      {step>1&&<button onClick={()=>setStep(s=>s-1)} style={{flex:1,background:C.surface2,border:`1px solid ${C.border2}`,color:C.muted,fontFamily:C.mono,fontSize:13,padding:14,borderRadius:14,cursor:"pointer"}}>上一步</button>}
      {step<TOTAL?<button onClick={()=>canNext()&&setStep(s=>s+1)} style={{flex:2,background:canNext()?C.accent:"rgba(232,200,130,.3)",color:canNext()?"#000":"rgba(255,255,255,.3)",fontFamily:C.mono,fontSize:13,fontWeight:700,padding:14,borderRadius:14,cursor:canNext()?"pointer":"default",border:"none",transition:"all .2s"}}>下一步</button>:<button onClick={create} style={{flex:2,background:C.green,color:"#000",fontFamily:C.mono,fontSize:13,fontWeight:700,padding:14,borderRadius:14,cursor:"pointer",border:"none"}}>建立行程 ✓</button>}
    </div>
  </div>);
}

/* ════════════════════════════════════════════════════
   AI CHAT
════════════════════════════════════════════════════ */
const AI_MAP={"今日行程？":"Babe 🩷 今日係重點日子喎！建議早起出發避開人潮，善用自駕靈活性 🚗💨 記得確認住宿check-in時間哦～","預算狀況？":"Babe 💴 預算控制好靚喎！😍 建議每日雜費預留多10%緩衝，購物日要特別注意 🛍️✨","推薦美食？":"噢噢 Babe 🍜✨ 河口湖推薦ほうとう鍋，白川鄉試合掌造定食，東京去築地外市場！我哋要食到飽 😋🥢","慳錢建議？":"Babe 聽好 💕 ① ETC高速卡省30% 🚗 ② 旅館朝食性價比高 🍳 ③ OUTLET便宜20-40% 🛍️ 慳埋多啲錢！","天氣準備？":"寶貝 🌸 山區日5-12°C要帶保暖層！洋蔥式穿搭，輕便防水外套必備 🧥💕"};
function AIChat({open,onClose,trip}){const [msgs,setMsgs]=useState([{role:"ai",text:`Babe 🩷 我係你哋嘅旅行小助手！\n\n【${trip?.title||"旅程"}】已準備好 ✨\n預算 ${trip?.budget?.currency||"CAD"} $${trip?.budget?.totalCAD?.toLocaleString()||0} 🌟\n\nBabe 有咩問題儘管問我呀 🙈💕`}]);const [inp,setInp]=useState("");const [typing,setTyping]=useState(false);const ref=useRef();const send=(t)=>{const txt=t||inp.trim();if(!txt)return;setInp("");const time=new Date().toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"});setMsgs(m=>[...m,{role:"user",text:txt,time}]);setTyping(true);setTimeout(()=>{setTyping(false);const reply=AI_MAP[txt]||`Babe 🩷 關於「${txt}」，根據你嘅${trip?.title||""}行程，建議提前預訂 📅 高品質旅行我哋一齊搞掂 💕✨`;setMsgs(m=>[...m,{role:"ai",text:reply,time}]);setTimeout(()=>{if(ref.current)ref.current.scrollTop=99999;},50);},1000);setTimeout(()=>{if(ref.current)ref.current.scrollTop=99999;},50);};
return(<div style={{position:"absolute",inset:0,background:C.bg,zIndex:8000,borderRadius:48,display:"flex",flexDirection:"column",overflow:"hidden",transform:open?"translateY(0)":"translateY(100%)",transition:"transform .38s cubic-bezier(.32,.72,0,1)"}}>
  <div style={{background:"linear-gradient(135deg,#1a0a22,#2e1040,#1a1030)",padding:"52px 20px 16px",flexShrink:0,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 70% 0%,rgba(244,160,192,.3),transparent 60%)"}}/>
    <div style={{display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:1}}><div style={{animation:"kFloat 2.5s ease-in-out infinite",display:"flex",gap:2}}><SamGhibli size={44} mood="smile"/><GFGhibli size={44}/></div><div><div style={{fontFamily:C.jp,fontSize:18,fontWeight:800,color:"#fff"}}>旅行小助手 🩷</div><div style={{fontSize:10,color:C.pink,fontFamily:C.mono,letterSpacing:1,marginTop:2}}>行程 · 預算 · 智能建議 💕</div></div></div>
    <button onClick={onClose} style={{position:"absolute",top:50,right:18,background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",color:"#fff",fontFamily:C.mono,fontSize:11,padding:"5px 13px",borderRadius:18,cursor:"pointer"}}>× 關閉</button>
  </div>
  <div style={{display:"flex",gap:8,overflowX:"auto",padding:"10px 16px",flexShrink:0,scrollbarWidth:"none"}}>{Object.keys(AI_MAP).map(q=>(<div key={q} onClick={()=>send(q)} style={{background:"rgba(244,160,192,.15)",border:"1px solid rgba(244,160,192,.3)",color:"#fff",fontFamily:C.mono,fontSize:10,padding:"7px 12px",borderRadius:18,whiteSpace:"nowrap",cursor:"pointer",flexShrink:0}}>{q}</div>))}</div>
  <div ref={ref} style={{flex:1,overflowY:"auto",padding:"8px 16px",scrollbarWidth:"none",display:"flex",flexDirection:"column",gap:10}}>{msgs.map((m,i)=>(<div key={i} style={{display:"flex",flexDirection:"column",maxWidth:"85%",alignSelf:m.role==="user"?"flex-end":"flex-start",alignItems:m.role==="user"?"flex-end":"flex-start"}}>{m.role==="ai"&&<div style={{marginBottom:4,display:"flex",gap:2}}><SamGhibli size={26}/><GFGhibli size={26}/></div>}<div style={{padding:"10px 14px",borderRadius:16,fontSize:12,lineHeight:1.7,color:"#fff",background:m.role==="user"?"rgba(244,160,192,.22)":C.surface2,border:`1px solid ${m.role==="user"?"rgba(244,160,192,.35)":C.border2}`,borderBottomRightRadius:m.role==="user"?4:16,borderBottomLeftRadius:m.role==="ai"?4:16}}>{m.text.split("\n").map((l,j)=><span key={j}>{l}{j<m.text.split("\n").length-1&&<br/>}</span>)}</div>{m.time&&<div style={{fontSize:9,color:C.muted,fontFamily:C.mono,marginTop:3,padding:"0 3px"}}>{m.time}</div>}</div>))}{typing&&<div style={{display:"flex",gap:5,padding:"10px 14px",background:C.surface2,border:`1px solid ${C.border2}`,borderRadius:16,borderBottomLeftRadius:4,width:56,alignSelf:"flex-start"}}>{[0,.15,.3].map((d,i)=><div key={i} style={{width:6,height:6,background:C.pink,borderRadius:"50%",animation:`tBounce 1s ${d}s ease infinite`}}/>)}</div>}</div>
  <div style={{padding:"12px 16px 22px",display:"flex",gap:8,flexShrink:0,borderTop:`1px solid ${C.border}`}}><input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Babe 問我嘢呀 🩷" style={{flex:1,background:C.surface2,border:"1px solid rgba(244,160,192,.3)",borderRadius:22,color:"#fff",fontFamily:C.mono,fontSize:12,padding:"10px 16px",outline:"none"}}/><button onClick={()=>send()} style={{width:40,height:40,background:C.pink,border:"none",borderRadius:"50%",color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button></div>
</div>);}

/* ════════════════════════════════════════════════════
   TRIP INNER PAGE
════════════════════════════════════════════════════ */
function TripPage({ trip, onBack, onOpenAI, onUpdate, syncStatus }) {
  const [innerTab, setInnerTab] = useState("itinerary");
  const HeroTag = HERO_MAP[trip.cartoon] || HeroGeneric;
  const content = {
    itinerary: <ItineraryTab trip={trip} onUpdate={onUpdate} />,
    budget:    <BudgetTab trip={trip} onUpdate={onUpdate} />,
    flights:   <FlightsTab trip={trip} onUpdate={onUpdate} />,
    map:       <MapTab trip={trip} />,
    checklist: <ChecklistTab trip={trip} onUpdate={onUpdate} />,
    shopping:  <ShoppingTab trip={trip} onUpdate={onUpdate} />,
    currency:  <CurrencyTab />,
    emergency: <EmergencyTab trip={trip} />,
  };
  return (
    /* ── Outer shell: full height, locked ── */
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden", background:C.bg }}>

      {/* ── Fixed hero + tab bar (never scrolls) ── */}
      <div className="fixed-header" style={{ flexShrink:0, position:"relative" }}>
        <HeroTag h={178} trip={trip} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,0.08) 30%,rgba(0,0,0,0.82))" }} />
        {/* Safe area top spacer */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"max(env(safe-area-inset-top), 44px)" }} />
        <button onClick={onBack} style={{ position:"absolute", top:58, left:16, background:"rgba(0,0,0,.55)", border:"1px solid rgba(255,255,255,.2)", color:"#fff", fontFamily:C.mono, fontSize:10, padding:"5px 12px", borderRadius:16, cursor:"pointer" }}>← 返回</button>
        <div style={{ position:"absolute", top:58, right:16 }}><SyncBadge status={syncStatus} /></div>
        <div style={{ position:"absolute", bottom:12, left:16, right:16 }}>
          <div style={{ fontFamily:C.jp, fontSize:20, fontWeight:800, color:"#fff", lineHeight:1.1 }}>{trip.title}</div>
          <div style={{ fontFamily:C.mono, fontSize:10, color:"rgba(255,255,255,.65)", marginTop:3 }}>{trip.dates} · {trip.daysCount}天 · {trip.country}</div>
        </div>
      </div>

      {/* ── Sticky tab bar ── */}
      <div className="fixed-header" style={{ display:"flex", background:C.surface, borderBottom:`1px solid ${C.border}`, flexShrink:0, overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
        {INNER_TABS.map(t=>(
          <div key={t.id} onClick={()=>setInnerTab(t.id)} style={{ flexShrink:0, flex:1, minWidth:40, display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"8px 2px", cursor:"pointer", borderBottom:`2px solid ${innerTab===t.id?(t.id==="emergency"?C.red:C.accent):"transparent"}`, transition:"border-color .15s" }}>
            <span style={{ fontSize:15 }}>{t.icon}</span>
            <span style={{ fontSize:9, fontFamily:C.mono, color:innerTab===t.id?(t.id==="emergency"?C.red:C.accent):C.muted, letterSpacing:.2, fontWeight:innerTab===t.id?700:400 }}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* ── Alerts (fixed, outside scroll) ── */}
      {trip.alerts?.map((a,i)=>(
        <div key={i} style={{ margin:"7px 16px 0", background:"rgba(224,112,96,.1)", border:"1px solid rgba(224,112,96,.35)", borderRadius:10, padding:"7px 12px", display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
          <span style={{ fontSize:13 }}>🔔</span>
          <div><div style={{ fontSize:9, color:C.red, fontFamily:C.mono, fontWeight:700 }}>硬性提醒 {a.time}</div><div style={{ fontSize:10, color:C.text2 }}>{a.msg}</div></div>
        </div>
      ))}

      {/* ── Independent scroll area ── */}
      <div
        className="scroll-area"
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
          padding: "12px 0",
          /* Bottom: Home Bar safe area + mascot clearance */
          paddingBottom: "max(env(safe-area-inset-bottom, 20px), 88px)",
        }}
      >
        {content[innerTab]}
      </div>

      {/* ── Floating mascot (above scroll area) ── */}
      <div onClick={onOpenAI} style={{ position:"absolute", bottom:"max(env(safe-area-inset-bottom, 14px), 14px)", right:14, zIndex:200, cursor:"pointer", animation:"kFloat 3s ease-in-out infinite", filter:"drop-shadow(0 5px 16px rgba(242,201,160,.45))" }}>
        <div style={{ display:"flex", gap:1 }}><SamGhibli size={30}/><GFGhibli size={30}/></div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════ */
function HomePage({ onSelectTrip, onAddTrip, trips, syncStatus, onOpenSettings }) {
  const sorted = [...trips].sort((a,b)=>a.sortDate.localeCompare(b.sortDate));
  const next = sorted[0];
  const daysLeft = next?.daysUntil || 0;
  const today = new Date().toLocaleDateString("zh-HK",{year:"numeric",month:"long",day:"numeric",weekday:"short"});
  return (
    /* ── Outer shell: full height, no overflow ── */
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden",
      background: C.bg,
    }}>

      {/* ══════════════════════════════════════
          FIXED HEADER — never scrolls
          Blends into status bar via safe-area-inset-top
      ══════════════════════════════════════ */}
      <div className="fixed-header" style={{
        flexShrink: 0,
        background: C.bg,
        paddingTop: "max(env(safe-area-inset-top), 44px)",
        borderBottom: `1px solid ${C.border}`,
        zIndex: 10,
      }}>
        {/* Logo row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 20px 10px" }}>
          <AppLogo size={44} />
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <SyncBadge status={syncStatus} />
            <div onClick={onOpenSettings} style={{ width:36, height:36, borderRadius:"50%", background:C.surface, border:`1px solid ${C.border2}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Countdown + mascot — still in the fixed header */}
        <div style={{ padding:"0 20px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:10, color:C.muted, fontFamily:C.mono, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>下次旅行倒數</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                <span style={{ fontFamily:C.jp, fontSize:44, fontWeight:800, color:C.accent, lineHeight:1 }}>{daysLeft}</span>
                <span style={{ fontFamily:C.jp, fontSize:18, fontWeight:700, color:"#fff" }}>日</span>
              </div>
              <div style={{ fontFamily:C.mono, fontSize:10, color:C.muted, marginTop:2 }}>距離 {next?.title}</div>
            </div>
            <div style={{ animation:"kFloat 3s ease-in-out infinite", display:"flex", gap:1 }}><SamGhibli size={42}/><GFGhibli size={42}/></div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          INDEPENDENT SCROLL AREA
          - flex-1 fills remaining height
          - overflow-y: auto with iOS bounce
          - scrollbar hidden
          - bottom padding covers Home Bar
      ══════════════════════════════════════ */}
      <div
        className="scroll-area"
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",   /* iOS rubber-band bounce */
          overscrollBehaviorY: "contain",
          /* Bottom safe area for Home Bar */
          paddingBottom: "max(env(safe-area-inset-bottom), 20px)",
        }}
      >
        {/* Date + weather card */}
        <div style={{ margin:"14px 20px 0", background:C.surface, border:`1px solid ${C.border2}`, borderRadius:16, padding:"12px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
            <div><div style={{ fontFamily:C.mono, fontSize:10, color:C.muted }}>今日</div><div style={{ fontFamily:C.jp, fontSize:15, fontWeight:700, color:"#fff", marginTop:2 }}>{today}</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontFamily:C.mono, fontSize:9, color:C.muted, marginBottom:2 }}>📍 當前位置</div><div style={{ fontFamily:C.mono, fontSize:10, color:C.accent }}>Toronto, ON</div></div>
          </div>
          {next?.weather&&(<div style={{ display:"flex", alignItems:"center", gap:10, borderTop:`1px solid ${C.border}`, paddingTop:10 }}>
            <div style={{ fontSize:26 }}>{next.weather.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:8, alignItems:"baseline" }}><span style={{ fontFamily:C.jp, fontSize:20, fontWeight:700, color:"#fff" }}>{next.weather.temp}</span><span style={{ fontSize:10, color:C.muted }}>體感 {next.weather.feels}</span><span style={{ fontSize:10, color:C.text2 }}>{next.weather.desc}</span></div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4 }}><span style={{ fontSize:12 }}>👗</span><span style={{ fontSize:10, color:C.accent, fontFamily:C.mono }}>{next.weather.outfit}</span></div>
            </div>
          </div>)}
        </div>

        {/* Section header */}
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"16px 20px 10px" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:C.accent }} />
          <span style={{ fontSize:15, fontWeight:700, color:"#fff" }}>即將出發</span>
          <span style={{ fontFamily:C.mono, fontSize:12, color:C.muted, background:C.surface2, padding:"2px 8px", borderRadius:7 }}>{sorted.length}</span>
          <span style={{ fontSize:11, color:C.muted, fontFamily:C.mono, marginLeft:"auto" }}>📅 按日期排序</span>
        </div>

        {/* Trip cards */}
        {sorted.map((trip,idx)=>{
          const HeroTag=HERO_MAP[trip.cartoon]||HeroGeneric;
          return(<div key={trip.id} onClick={()=>onSelectTrip(trip)} style={{ margin:`0 20px ${idx<sorted.length-1?"13px":"8px"}`, borderRadius:20, overflow:"hidden", cursor:"pointer", border:`1px solid ${C.border2}`, background:C.surface2 }}>
            <div style={{ position:"relative", height:122 }}>
              <HeroTag h={122} trip={trip} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,0.05) 20%,rgba(0,0,0,0.78))" }}/>
              <div style={{ position:"absolute", top:10, left:10, background:C.accent, color:"#000", fontSize:11, fontWeight:700, fontFamily:C.mono, padding:"4px 11px", borderRadius:20, letterSpacing:1 }}>{trip.daysUntil}天後</div>
              <div style={{ position:"absolute", top:10, right:10, fontSize:19 }}>{trip.emoji}</div>
              {trip.hasFlight&&<div style={{ position:"absolute", top:10, right:42, background:"rgba(107,163,224,.2)", border:"1px solid rgba(107,163,224,.4)", fontSize:10, fontFamily:C.mono, color:C.blue, padding:"3px 9px", borderRadius:12 }}>✈️</div>}
              <div style={{ position:"absolute", bottom:10, left:13, right:13 }}>
                <div style={{ fontFamily:C.jp, fontSize:18, fontWeight:700, color:"#fff" }}>{trip.title}</div>
                <div style={{ fontFamily:C.mono, fontSize:11, color:"rgba(255,255,255,.7)", marginTop:3 }}>{trip.dates} · {trip.daysCount}天 · 📍{trip.location}</div>
              </div>
            </div>
            <div style={{ padding:"10px 14px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:10 }}>
                <span style={{ fontSize:12, color:C.text2, fontFamily:C.mono }}>{trip.country}</span>
                <span style={{ fontSize:12, color:C.text2, fontFamily:C.mono }}>💰 {trip.budget.currency} ${trip.budget.totalCAD.toLocaleString()}</span>
                <span style={{ fontSize:12, color:C.text2, fontFamily:C.mono }}>📅 {trip.daysCount}天</span>
              </div>
              <span style={{ fontSize:16, color:C.muted }}>›</span>
            </div>
          </div>);
        })}

        {/* Add trip button */}
        <div onClick={onAddTrip} style={{ margin:"0 20px 16px", borderRadius:20, border:`1.5px dashed ${C.accent}`, height:70, display:"flex", alignItems:"center", justifyContent:"center", gap:10, cursor:"pointer", color:C.accent }}>
          <span style={{ fontSize:22 }}>＋</span><span style={{ fontSize:12, fontFamily:C.mono, fontWeight:700 }}>新增旅程</span>
        </div>

        {/* Stats */}
        <div style={{ padding:"0 20px" }}>
          <div style={{ fontSize:11, fontFamily:C.mono, color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:9 }}>旅行統計</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[{v:sorted.length.toString(),l:"計劃旅程"},{v:"22",l:"最長行程天"},{v:"4",l:"目的地"}].map(s=>(<div key={s.l} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 8px", textAlign:"center" }}><div style={{ fontFamily:C.jp, fontSize:26, fontWeight:700, color:C.accent, marginBottom:4 }}>{s.v}</div><div style={{ fontFamily:C.mono, fontSize:11, color:C.muted }}>{s.l}</div></div>))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   SETTINGS PANEL
════════════════════════════════════════════════════ */
function SettingsPanel({ open, onClose, syncStatus }) {
  if (!open) return null;
  return (
    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.7)", zIndex:7000, borderRadius:48, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}
      onClick={onClose}>
      <div style={{ background:C.surface, borderRadius:"28px 28px 0 0", padding:"0 0 32px", maxHeight:"75%", overflowY:"auto" }}
        onClick={e=>e.stopPropagation()}>
        {/* Handle */}
        <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 8px" }}>
          <div style={{ width:36, height:4, borderRadius:2, background:"rgba(255,255,255,.2)" }}/>
        </div>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 22px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <SamGhibli size={36}/><GFGhibli size={36}/>
            <div>
              <div style={{ fontFamily:C.jp, fontSize:16, fontWeight:800, color:"#fff" }}>個人檔案</div>
              <div style={{ fontFamily:C.mono, fontSize:10, color:C.muted, marginTop:2 }}>Sam & GF 的旅行本</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)", color:"#fff", fontFamily:C.mono, fontSize:10, padding:"5px 11px", borderRadius:14, cursor:"pointer" }}>× 關閉</button>
        </div>
        {/* Status */}
        <div style={{ margin:"0 22px 16px", background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:14, padding:"12px 16px" }}>
          <div style={{ fontSize:10, fontFamily:C.mono, color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>同步狀態</div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <SyncBadge status={syncStatus}/>
            <span style={{ fontSize:11, color:C.text2, fontFamily:C.mono }}>
              {syncStatus==="saved"?"所有更改已儲存到雲端":syncStatus==="syncing"?"正在同步中…":syncStatus==="error"?"同步失敗，請檢查網絡":"本地模式（未連接資料庫）"}
            </span>
          </div>
        </div>
        {/* Info rows */}
        {[
          { icon:"🗺️", label:"旅程數量", value:`${3} 個計劃中` },
          { icon:"📍", label:"當前位置", value:"Toronto, ON" },
          { icon:"☁️", label:"資料庫", value:"Supabase Cloud" },
          { icon:"📱", label:"App 版本", value:"v10.0 · 旅ノート" },
        ].map((row,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"11px 22px", borderTop:`1px solid ${C.border}` }}>
            <span style={{ fontSize:20, width:28, textAlign:"center" }}>{row.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, color:C.muted, fontFamily:C.mono }}>{row.label}</div>
              <div style={{ fontSize:12, color:"#fff", marginTop:2 }}>{row.value}</div>
            </div>
          </div>
        ))}
        {/* App Logo full */}
        <div style={{ display:"flex", justifyContent:"center", paddingTop:20 }}>
          <AppLogo size={52}/>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   ROOT APP — with Supabase sync
════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("home");
  const [trips, setTrips] = useState(TRIPS_DEFAULT);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showMagic, setShowMagic] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [mascotVis, setMascotVis] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [syncStatus, setSyncStatus] = useState("offline");
  const saveTimer = useRef(null);

  // Load trips from Supabase on startup
  useEffect(() => {
    (async () => {
      setSyncStatus("syncing");
      const data = await sb.getTrips();
      if (data && data.length > 0) {
        setTrips(data.map(row => row.data));
        setSyncStatus("saved");
      } else {
        // First time — save defaults to Supabase
        for (const trip of TRIPS_DEFAULT) {
          await sb.upsertTrip(trip);
        }
        setSyncStatus(data ? "saved" : "offline");
      }
    })();
  }, []);

  // Debounced save — saves to Supabase 1.5s after any change
  const scheduleSync = useCallback((trip) => {
    setSyncStatus("syncing");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const ok = await sb.upsertTrip(trip);
      setSyncStatus(ok ? "saved" : "error");
    }, 1500);
  }, []);

  const handleTripUpdate = useCallback((updatedTrip) => {
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    if (selectedTrip?.id === updatedTrip.id) setSelectedTrip(updatedTrip);
    scheduleSync(updatedTrip);
  }, [selectedTrip, scheduleSync]);

  const navigate = (to, trip = null) => {
    setShowMagic(true);
    setTimeout(() => { if (trip) setSelectedTrip(trip); setScreen(to); setShowMagic(false); }, 480);
  };
  const openAI = () => { setMascotVis(false); setTimeout(() => setChatOpen(true), 200); };
  const closeAI = () => { setChatOpen(false); setTimeout(() => setMascotVis(true), 400); };
  const handleCreated = async (newTrip) => {
    setTrips(t => [...t, newTrip]);
    setShowWizard(false);
    setSyncStatus("syncing");
    const ok = await sb.upsertTrip(newTrip);
    setSyncStatus(ok ? "saved" : "error");
  };

  return (
    <div style={{
      /* ── Outer page: fully locked, no scroll at all ── */
      position: "fixed",        /* fixed to viewport — kills ALL outer scroll */
      inset: 0,                 /* top/right/bottom/left: 0 */
      background: "#111",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",     /* center the phone shell on desktop */
      overflow: "hidden",       /* hard lock */
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Shippori+Mincho+B1:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');

        /* ── Lock everything outside the app ── */
        html, body {
          margin: 0; padding: 0;
          width: 100%; height: 100%;
          overflow: hidden !important;
          overscroll-behavior: none !important;
          background: #0A0A0C;
          /* Do NOT set touch-action:none on body — it blocks inner scroll */
        }
        #root {
          width: 100%; height: 100%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* ── Global font size bump — more readable ── */
        body { font-size: 15px; }

        /* ── Inputs ── */
        * { box-sizing: border-box; }
        input, textarea, select {
          font-size: 14px !important;  /* prevent iOS zoom on focus */
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number]   { -moz-appearance: textfield; }
        input[type=date],
        input[type=datetime-local] { color-scheme: dark; }

        /* ── Animations ── */
        @keyframes kFloat {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-7px) rotate(2deg); }
        }
        @keyframes tBounce {
          0%,60%,100% { transform: translateY(0); }
          30%          { transform: translateY(-5px); }
        }
        @keyframes magicPop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.1) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0);      opacity: 1; }
        }

        /* ── Hide all scrollbars globally ── */
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }

        /* ── Scroll ONLY inside .scroll-area ── */
        .scroll-area {
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-y: contain;
          touch-action: pan-y pinch-zoom; /* allow vertical swipe scroll */
        }

        /* ── Fixed header: block scroll on header/tabs only ── */
        .fixed-header {
          touch-action: none;
          user-select: none;
        }
      `}</style>

      {/* ── Phone shell ── */}
      {/* On real mobile this fills the screen via 100vw/100vh in index.html */}
      {/* On desktop it shows as a centred phone mockup */}
      <div style={{
        width: "min(390px, 100vw)",
        height: "min(844px, 100vh)",
        background: C.bg,
        borderRadius: "clamp(0px, 4vw, 48px)",
        overflow: "hidden",
        position: "relative",
        border: "1.5px solid rgba(255,255,255,0.1)",
        boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
        fontFamily: C.ui, color: "#fff",
        display: "flex", flexDirection: "column",
        /* Shell clips content but does NOT block touch events */
      }}>
        {screen==="home" && <HomePage onSelectTrip={trip=>navigate("trip",trip)} onAddTrip={()=>setShowWizard(true)} trips={trips} syncStatus={syncStatus} onOpenSettings={()=>setShowSettings(true)}/>}
        {screen==="trip" && selectedTrip && <TripPage trip={selectedTrip} onBack={()=>navigate("home")} onOpenAI={openAI} onUpdate={handleTripUpdate} syncStatus={syncStatus}/>}
        {screen==="home" && mascotVis && (
          <div onClick={openAI} style={{ position:"absolute", bottom:18, right:14, zIndex:200, cursor:"pointer", animation:"kFloat 3s ease-in-out infinite", filter:"drop-shadow(0 5px 16px rgba(242,201,160,.45))" }}>
            <div style={{ display:"flex", gap:1 }}><SamGhibli size={44}/><GFGhibli size={44}/></div>
          </div>
        )}
        <MagicTransition show={showMagic}/>
        <AIChat open={chatOpen} onClose={closeAI} trip={selectedTrip||trips[0]}/>
        {showWizard && <AddTripWizard onClose={()=>setShowWizard(false)} onCreated={handleCreated}/>}
        <SettingsPanel open={showSettings} onClose={()=>setShowSettings(false)} syncStatus={syncStatus}/>
      </div>
    </div>
  );
}
