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
  AU: { name:"澳洲 🇦🇺", contacts:[{cat:"🚨 緊急",name:"Emergency",num:"000",desc:"Police/Fire/Ambulance"},{cat:"🏥 醫療",name:"Health Direct",num:"1800-022-222",desc:"24hr建議"}]},
  KR: { name:"韓國 🇰🇷", contacts:[{cat:"🚨 緊急",name:"警察",num:"112",desc:"報警"},{cat:"🚑 救護",name:"消防/救護",num:"119",desc:"消防/救護"},{cat:"🌏 外國人",name:"外國人諮詢",num:"1345",desc:"24hr多語"}]},
  DEFAULT: { name:"當地 🌍", contacts:[{cat:"🚨 緊急",name:"國際緊急求救",num:"112",desc:"國際通用"},{cat:"🏛️ 領事",name:"加拿大領事館緊急",num:"+1-613-996-8885",desc:"Ottawa 24hr"}]},
};

function detectCountryCode(trip) {
  const t = (trip.title + " " + (trip.location || "") + " " + (trip.country || "")).toLowerCase();
  if (t.includes("🇯🇵")||t.includes("japan")||t.includes("日本")||t.includes("tokyo")||t.includes("東京")||t.includes("osaka")||t.includes("kyoto")) return "JP";
  if (t.includes("🇬🇧")||t.includes("london")||t.includes("倫敦")||t.includes("uk")||t.includes("england")) return "GB";
  if (t.includes("🇫🇷")||t.includes("paris")||t.includes("巴黎")||t.includes("france")||t.includes("法國")) return "FR";
  if (t.includes("🇪🇸")||t.includes("spain")||t.includes("西班牙")||t.includes("madrid")||t.includes("barcelona")) return "ES";
  if (t.includes("🇺🇸")||t.includes("usa")||t.includes("美國")||t.includes("new york")||t.includes("紐約")) return "US";
  if (t.includes("🇦🇺")||t.includes("australia")||t.includes("澳洲")) return "AU";
  if (t.includes("🇰🇷")||t.includes("korea")||t.includes("韓國")||t.includes("seoul")||t.includes("首爾")) return "KR";
  if (t.includes("🇨🇦")||t.includes("canada")||t.includes("加拿大")||t.includes("toronto")||t.includes("ottawa")||t.includes("montreal")||t.includes("vancouver")||t.includes("quebec")||t.includes("魁北克")) return "CA";
  return "DEFAULT";
}

/* ════════════════════════════════════════════════════
   INITIAL TRIP DATA
════════════════════════════════════════════════════ */
const TRIPS_DEFAULT = [
  {
    id:"ottawa2026",sortDate:"2026-05-13",title:"渥太華鬱金香節",subtitle:"Parc Omega 野生動物",
    dates:"2026/05/13–05/14",daysCount:2,country:"🇨🇦",daysUntil:34,location:"Ottawa, Ontario",
    weather:{icon:"🌤️",temp:"18°C",feels:"14°C",desc:"晴間多雲",outfit:"輕薄外套 + 長褲"},
    budget:{totalCAD:800,currency:"CAD",items:[{icon:"⛽",name:"油費",cat:"交通",amt:95,color:"#6BA3E0"},{icon:"🏨",name:"住宿 1晚",cat:"住宿",amt:300,color:"#E8C882"},{icon:"🌷",name:"鬱金香節門票",cat:"景點",amt:60,color:"#F4A0C0"},{icon:"🦌",name:"Parc Omega × 2",cat:"景點",amt:100,color:"#7FC8A9"},{icon:"🥞",name:"餐飲",cat:"餐飲",amt:200,color:"#C97B4B"},{icon:"🛍️",name:"手信",cat:"購物",amt:45,color:"#9B72CF"}],expenses:[],breakdown:[{cat:"住宿",color:"#E8C882",pct:38,amt:300},{cat:"餐飲",color:"#C97B4B",pct:25,amt:200},{cat:"景點",color:"#7FC8A9",pct:20,amt:160},{cat:"油費",color:"#6BA3E0",pct:12,amt:95},{cat:"雜費",color:"#9B72CF",pct:5,amt:45}]},
    days:[{id:1,type:"travel",title:"多倫多 → 渥太華",transport:"自駕",transportTime:300,spots:[{name:"Commissioners Park 鬱金香",stay:150},{name:"ByWard Market 晚飯",stay:120},{name:"Blacklight 夜遊",stay:60}],stay:"Ottawa Downtown Hotel",date:"May 13",tour:"國會山莊導賞",ts:"pending"},{id:2,type:"travel",title:"Parc Omega → 返多倫多",transport:"自駕",transportTime:300,spots:[{name:"Parc Omega Safari",stay:240},{name:"餵鹿/麋鹿",stay:60}],stay:"返回多倫多",date:"May 14",tour:"Parc Omega Safari",ts:"booked"}],
    checklist:[{cat:"🌷 必備",items:[{t:"Parc Omega門票",c:false},{t:"大袋紅蘿蔔（餵動物）",c:false},{t:"防水外套",c:false}]}],
    shopping:[{cat:"🎁 手信",items:[{n:"BeaverTails楓糖",note:"ByWard Market",b:false}]}],
    flights:[],hasFlight:false,
    bgColor:"linear-gradient(135deg,#0d2a18,#1a4a2d)",emoji:"🌷🦌",cartoon:"ottawa",
    alerts:[{time:"16:30",msg:"⚠️ 必須16:30出發！確保午夜前返多倫多"}],
  },
  {
    id:"quebec2026",sortDate:"2026-12-18",title:"魁北克白色聖誕",subtitle:"聖誕市集 · 夜攝",
    dates:"2026/12/18–12/20",daysCount:3,country:"🇨🇦",daysUntil:253,location:"Québec Province",
    weather:{icon:"❄️",temp:"-8°C",feels:"-15°C",desc:"大雪，能見度低",outfit:"羽絨外套-20°C + 雪地靴 + 暖包"},
    budget:{totalCAD:600,currency:"CAD",items:[{icon:"⛽",name:"油費",cat:"交通",amt:72,color:"#6BA3E0"},{icon:"🏨",name:"住宿兩晚",cat:"住宿",amt:240,color:"#E8C882"},{icon:"🎄",name:"景點門票",cat:"景點",amt:90,color:"#7FC8A9"},{icon:"🍽️",name:"餐飲 3天",cat:"餐飲",amt:168,color:"#C97B4B"},{icon:"🛍️",name:"手信",cat:"購物",amt:30,color:"#9B72CF"}],expenses:[],breakdown:[{cat:"住宿",color:"#E8C882",pct:40,amt:240},{cat:"餐飲",color:"#C97B4B",pct:28,amt:168},{cat:"景點",color:"#7FC8A9",pct:15,amt:90},{cat:"油費",color:"#6BA3E0",pct:12,amt:72},{cat:"雜費",color:"#9B72CF",pct:5,amt:30}]},
    days:[{id:1,type:"travel",title:"多倫多→蒙特利爾→Mont-Tremblant",transport:"自駕",transportTime:420,spots:[{name:"Montreal Christmas Market",stay:120},{name:"Mont-Tremblant夜燈",stay:90}],stay:"Mont-Tremblant",date:"Dec 18",tour:"",ts:"none"},{id:2,type:"travel",title:"Mont-Tremblant → 魁北克市",transport:"自駕",transportTime:150,spots:[{name:"Le Grand Marché",stay:90},{name:"Petit-Champlain 聖誕街",stay:90}],stay:"Old Quebec",date:"Dec 19",tour:"",ts:"none"},{id:3,type:"travel",title:"魁北克→多倫多",transport:"自駕",transportTime:360,spots:[{name:"Montmorency Falls",stay:60},{name:"Sherbrooke 午餐",stay:60}],stay:"返回多倫多",date:"Dec 20",tour:"",ts:"none"}],
    checklist:[{cat:"📷 攝影",items:[{t:"相機+三腳架",c:false},{t:"備用電池×3",c:false}]},{cat:"❄️ 保暖",items:[{t:"羽絨外套-20°C",c:false},{t:"雪地靴",c:false},{t:"暖包×10",c:false}]}],
    shopping:[{cat:"🎄 聖誕",items:[{n:"魁北克楓糖",note:"Petit-Champlain",b:false},{n:"冰酒",note:"Le Grand Marché",b:false}]}],
    flights:[],hasFlight:false,
    bgColor:"linear-gradient(135deg,#0d1a2d,#1a2a4a)",emoji:"🎄❄️",cartoon:"quebec",
    alerts:[{time:"16:30",msg:"🚨 16:30必須從Sherbrooke出發！"}],
  },
  {
    id:"jp2027",sortDate:"2027-04-01",title:"香港 & 日本自駕",subtitle:"心靈大掃除之旅",
    dates:"2027/04/01–04/21",daysCount:21,country:"🇯🇵🇭🇰",daysUntil:357,location:"Tokyo / Hakone / Shirakawa-go",
    weather:{icon:"🌸",temp:"14°C",feels:"11°C",desc:"晴，微風，適合戶外",outfit:"薄外套 + 輕便長褲，山區需額外保暖"},
    budget:{totalCAD:13000,currency:"CAD",items:[{icon:"✈️",name:"機票（HK↔Tokyo）",cat:"交通",amt:3000,color:"#6BA3E0"},{icon:"🚗",name:"租車 14天",cat:"交通",amt:1950,color:"#6BA3E0"},{icon:"🏨",name:"溫泉旅館 14晚",cat:"住宿",amt:3900,color:"#E8C882"},{icon:"🍜",name:"餐飲 21天",cat:"餐飲",amt:2080,color:"#C97B4B"},{icon:"🎡",name:"景點門票",cat:"景點",amt:1170,color:"#7FC8A9"},{icon:"🛍️",name:"購物",cat:"購物",amt:910,color:"#9B72CF"}],expenses:[],breakdown:[{cat:"交通",color:"#6BA3E0",pct:38,amt:4950},{cat:"住宿",color:"#E8C882",pct:30,amt:3900},{cat:"餐飲",color:"#C97B4B",pct:16,amt:2080},{cat:"景點",color:"#7FC8A9",pct:9,amt:1170},{cat:"購物",color:"#9B72CF",pct:7,amt:910}]},
    days:[{id:1,type:"arrival",title:"抵達香港",transport:"飛機",transportTime:0,spots:[{name:"香港機場接機",stay:60},{name:"家庭聚餐",stay:180}],stay:"親戚家",date:"Apr 1",tour:"",ts:"none"},{id:4,type:"sightseeing",title:"河口湖富士山",transport:"自駕",transportTime:60,spots:[{name:"富士山五合目",stay:120},{name:"大石公園",stay:90}],stay:"河口湖 温泉旅館",date:"Apr 8",tour:"富士山導覽",ts:"booked"},{id:7,type:"sightseeing",title:"白川鄉合掌造",transport:"自駕",transportTime:180,spots:[{name:"荻町合掌造集落",stay:150},{name:"UNESCO展望台",stay:60}],stay:"白川鄉 合掌造民宿",date:"Apr 13",tour:"合掌造導覽",ts:"booked"},{id:10,type:"departure",title:"返回多倫多",transport:"飛機",transportTime:840,spots:[{name:"築地外市場早餐",stay:60},{name:"成田機場",stay:120}],stay:"回家",date:"Apr 21",tour:"",ts:"none"}],
    checklist:[{cat:"📄 文件",items:[{t:"護照（有效>6個月）",c:true},{t:"國際駕駛許可證",c:false},{t:"Suica/IC卡",c:false}]}],
    shopping:[{cat:"💊 藥妝",items:[{n:"HADA LABO 極潤化妝水",note:"Matsumoto Kiyoshi",b:false},{n:"正露丸",note:"必備",b:true}]},{cat:"🎵 黑膠碟",items:[{n:"City Pop精選",note:"Disk Union",b:false}]}],
    flights:[{id:"f1",airline:"Cathay Pacific",flightNo:"CX888",from:"HKG",to:"NRT",depTime:"2027-04-07T10:30",arrTime:"2027-04-07T15:45",terminal:"T1",seat:"28A",status:"confirmed"}],
    hasFlight:true,
    bgColor:"linear-gradient(135deg,#0a1a3a,#1a3a6a)",emoji:"🗻🚗",cartoon:"fuji",
  },
];

const CURRENCIES=[{code:"HKD",name:"港元",flag:"🇭🇰",rate:1},{code:"JPY",name:"日圓",flag:"🇯🇵",rate:19.24},{code:"CAD",name:"加拿大元",flag:"🇨🇦",rate:0.172},{code:"USD",name:"美元",flag:"🇺🇸",rate:0.128},{code:"GBP",name:"英鎊",flag:"🇬🇧",rate:0.101},{code:"EUR",name:"歐元",flag:"🇪🇺",rate:0.119},{code:"KRW",name:"韓元",flag:"🇰🇷",rate:175.2},{code:"CNY",name:"人民幣",flag:"🇨🇳",rate:0.928},{code:"TWD",name:"台幣",flag:"🇹🇼",rate:4.14}];

/* ════════════════════════════════════════════════════
   HERO SVGS
════════════════════════════════════════════════════ */
const HeroFuji=({h=145})=>(<svg viewBox="0 0 390 145" style={{width:"100%",height:h,display:"block"}}><defs><linearGradient id="hf9" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a1a3a"/><stop offset="100%" stopColor="#1a3a6a"/></linearGradient></defs><rect width="390" height="145" fill="url(#hf9)"/><circle cx="330" cy="28" r="13" fill="#FFEAA0" opacity=".9"/><polygon points="195,22 258,133 132,133" fill="#1e3a5a"/><polygon points="195,22 218,68 172,68" fill="white" opacity=".8"/><ellipse cx="195" cy="137" rx="90" ry="12" fill="#102a48" opacity=".7"/><rect x="178" y="106" width="34" height="4" rx="2" fill="#D05040"/><rect x="181" y="110" width="5" height="17" fill="#D05040"/><rect x="204" y="110" width="5" height="17" fill="#D05040"/>{[120,270,340].map((x,i)=><circle key={i} cx={x} cy={50+i*8} r={3+i} fill="#FFB7C5" opacity=".7"/>)}<rect x="0" y="133" width="390" height="12" fill="#060e20" opacity=".8"/></svg>);
const HeroOttawa=({h=145})=>(<svg viewBox="0 0 390 145" style={{width:"100%",height:h,display:"block"}}><defs><linearGradient id="ho9" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d2a18"/><stop offset="100%" stopColor="#1a4a2d"/></linearGradient></defs><rect width="390" height="145" fill="url(#ho9)"/><rect x="155" y="36" width="80" height="88" rx="3" fill="#1e2e54"/><polygon points="155,36 195,11 235,36" fill="#2a3a6a"/><rect x="192" y="4" width="6" height="20" fill="#E8C882"/><circle cx="195" cy="50" r="14" fill="#0e1a3a" stroke="#E8C882" strokeWidth="1.5"/><line x1="195" y1="50" x2="195" y2="42" stroke="#E8C882" strokeWidth="1.5"/><line x1="195" y1="50" x2="201" y2="53" stroke="#E8C882" strokeWidth="1.5"/><rect x="0" y="111" width="390" height="34" fill="#081a10" opacity=".8"/>{[30,70,110,150,200,250,300,350].map((x,i)=>(<g key={i}><ellipse cx={x} cy={104+i%3*4} rx={8} ry={14} fill={["#FF6B9D","#FF4785","#E8548A"][i%3]} opacity=".85"/><rect x={x-1.5} y={118} width={3} height={16} fill="#2d4a18"/></g>))}</svg>);
const HeroQuebec=({h=145})=>(<svg viewBox="0 0 390 145" style={{width:"100%",height:h,display:"block"}}><defs><linearGradient id="hq9" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d1a2d"/><stop offset="100%" stopColor="#1a2a4a"/></linearGradient></defs><rect width="390" height="145" fill="url(#hq9)"/><rect x="140" y="46" width="110" height="78" rx="4" fill="#1e2e54"/><polygon points="140,46 195,18 250,46" fill="#2a3a6a"/><rect x="192" y="4" width="6" height="22" fill="#E8C882"/>{[50,90,300,340].map((x,i)=><g key={i}><polygon points={`${x},95 ${x+5},70 ${x+10},95`} fill="#1a3a10"/><polygon points={`${x},95 ${x+5},73 ${x+10},95`} fill="white" opacity=".3"/></g>)}<rect x="0" y="130" width="390" height="15" fill="white" opacity=".12"/><text x="30" y="46" fontSize="18">❄️</text><text x="350" y="56" fontSize="16">⭐</text></svg>);
const HeroGeneric=({h=145})=>(<svg viewBox="0 0 390 145" style={{width:"100%",height:h,display:"block"}}><defs><linearGradient id="hg9" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a1a2e"/><stop offset="100%" stopColor="#2e2e4a"/></linearGradient></defs><rect width="390" height="145" fill="url(#hg9)"/><text x="160" y="85" fontSize="44" textAnchor="middle">🌍</text><text x="230" y="85" fontSize="36" textAnchor="middle">✈️</text></svg>);
const HERO_MAP={fuji:HeroFuji,ottawa:HeroOttawa,quebec:HeroQuebec};

/* ════════════════════════════════════════════════════
   INNER TABS
════════════════════════════════════════════════════ */
const INNER_TABS=[{id:"itinerary",icon:"📅",label:"行程"},{id:"budget",icon:"💴",label:"預算"},{id:"flights",icon:"✈️",label:"機票"},{id:"checklist",icon:"✅",label:"清單"},{id:"shopping",icon:"🛍️",label:"購物"},{id:"currency",icon:"💱",label:"換算"},{id:"emergency",icon:"🆘",label:"緊急"}];

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
   ITINERARY TAB
════════════════════════════════════════════════════ */
const TYPE_ICONS={"travel":"🚗","arrival":"✈️","departure":"✈️","sightseeing":"🏞️","shopping":"🛍️","local":"🚶"};
const TYPE_COLORS={"travel":C.blue,"arrival":C.green,"departure":C.muted,"sightseeing":C.accent,"shopping":C.pink,"local":C.lavender};

function ItineraryTab({ trip, onUpdate }) {
  const [days, setDays] = useState(() => trip.days.map(d => ({ ...d, spots: d.spots.map(s => ({ ...s })) })));
  const [showAdd, setShowAdd] = useState(false);
  const [newDay, setNewDay] = useState({ title:"", type:"sightseeing", transport:"", transportTime:60, date:"", stay:"" });
  const dragIdx = useRef(null);

  const save = useCallback((updated) => {
    setDays(updated);
    onUpdate && onUpdate({ ...trip, days: updated });
  }, [trip, onUpdate]);

  const calcTimes = (spots, tt) => { let t = 8*60+30+(tt||0); return spots.map(s=>{ const h=Math.floor(t/60)%24,m=t%60; const arr=`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`; t+=(s.stay||60); const eh=Math.floor(t/60)%24,em=t%60; return {arrival:arr,departure:`${String(eh).padStart(2,"0")}:${String(em).padStart(2,"0")}`}; }); };
  const deleteDay=(i)=>save(days.filter((_,idx)=>idx!==i));
  const addDay=()=>{if(!newDay.title.trim())return;const nd=[...days,{id:Date.now(),...newDay,spots:[{name:"新景點",stay:60}]}];save(nd);setNewDay({title:"",type:"sightseeing",transport:"",transportTime:60,date:"",stay:""});setShowAdd(false);};
  const updSpot=(di,si,key,val)=>{const n=days.map(d=>({...d,spots:d.spots.map(s=>({...s}))}));n[di].spots[si][key]=key==="stay"?(parseInt(val)||0):val;save(n);};
  const addSpot=(di)=>{const n=days.map(d=>({...d,spots:d.spots.map(s=>({...s}))}));n[di].spots.push({name:"新景點",stay:60});save(n);};
  const delSpot=(di,si)=>{const n=days.map(d=>({...d,spots:d.spots.map(s=>({...s}))}));n[di].spots.splice(si,1);save(n);};
  const startDrag=useCallback((idx,e)=>{e.preventDefault();dragIdx.current=idx;const isTouch=e.type==="touchstart";const getY=ev=>isTouch?ev.touches[0].clientY:ev.clientY;const onMove=ev=>{ev.preventDefault();const cy=getY(ev);document.querySelectorAll(".day-drc").forEach((row,ri)=>{if(ri===dragIdx.current)return;const rect=row.getBoundingClientRect(),mid=rect.top+rect.height/2;if((cy<mid&&dragIdx.current>ri)||(cy>mid&&dragIdx.current<ri)){const n=[...days];[n[dragIdx.current],n[ri]]=[n[ri],n[dragIdx.current]];dragIdx.current=ri;save(n);}});};const onEnd=()=>{dragIdx.current=null;document.removeEventListener(isTouch?"touchmove":"mousemove",onMove);document.removeEventListener(isTouch?"touchend":"mouseup",onEnd);};document.addEventListener(isTouch?"touchmove":"mousemove",onMove,{passive:false});document.addEventListener(isTouch?"touchend":"mouseup",onEnd);},[days,save]);

  return (
    <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:6 }}>
        <div style={{ fontSize:10, fontFamily:C.mono, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>行程安排<span style={{ color:"rgba(255,255,255,.18)", textTransform:"none", letterSpacing:0 }}> — ⠿ 拖動重排</span></div>
        <button onClick={()=>setShowAdd(s=>!s)} style={{ background:showAdd?"rgba(224,112,96,.15)":C.accent, color:showAdd?C.red:"#000", border:`1px solid ${showAdd?"rgba(224,112,96,.4)":"transparent"}`, borderRadius:20, padding:"5px 14px", fontFamily:C.mono, fontSize:10, fontWeight:700, cursor:"pointer" }}>{showAdd?"× 取消":"＋ 新增日子"}</button>
      </div>
      {showAdd&&(<div style={{ background:C.surface, border:`1px solid ${C.accent}`, borderRadius:14, padding:14, display:"flex", flexDirection:"column", gap:8 }}>
        {[{ph:"日子標題",key:"title"},{ph:"日期",key:"date"},{ph:"交通方式",key:"transport"},{ph:"住宿",key:"stay"}].map(f=>(<input key={f.key} value={newDay[f.key]} onChange={e=>setNewDay(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} style={{ background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, color:"#fff", fontFamily:C.mono, fontSize:11, padding:"7px 11px", outline:"none" }}/>))}
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:10, color:C.muted, fontFamily:C.mono, whiteSpace:"nowrap" }}>交通時間(分鐘)</span>
          <input type="number" value={newDay.transportTime} onChange={e=>setNewDay(p=>({...p,transportTime:parseInt(e.target.value)||0}))} style={{ width:60, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:8, color:"#fff", fontFamily:C.mono, fontSize:11, padding:"7px 8px", outline:"none", textAlign:"center" }}/>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{Object.keys(TYPE_ICONS).map(ty=>(<div key={ty} onClick={()=>setNewDay(p=>({...p,type:ty}))} style={{ fontSize:9, padding:"3px 8px", borderRadius:12, fontFamily:C.mono, cursor:"pointer", background:newDay.type===ty?TYPE_COLORS[ty]+"33":C.surface2, border:`1px solid ${newDay.type===ty?TYPE_COLORS[ty]:C.border}`, color:newDay.type===ty?TYPE_COLORS[ty]:"#fff" }}>{TYPE_ICONS[ty]} {ty}</div>))}</div>
        </div>
        <button onClick={addDay} style={{ background:C.accent, color:"#000", border:"none", borderRadius:9, padding:"9px", fontFamily:C.mono, fontSize:12, fontWeight:700, cursor:"pointer" }}>確認新增 ＋</button>
      </div>)}
      {days.map((d,di)=>{const times=calcTimes(d.spots,d.transportTime);const tc=TYPE_COLORS[d.type]||C.muted;const ti=TYPE_ICONS[d.type]||"📅";const totalMins=(d.transportTime||0)+d.spots.reduce((a,s)=>a+(s.stay||0),0);const endH=Math.floor((8*60+30+totalMins)/60)%24,endM=(8*60+30+totalMins)%60;
        return(<div key={d.id} className="day-drc" style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:14, overflow:"hidden", touchAction:"none", userSelect:"none" }}>
          <div style={{ background:C.surface2, padding:"10px 12px", display:"flex", alignItems:"center", gap:8 }}>
            <div onMouseDown={e=>startDrag(di,e)} onTouchStart={e=>startDrag(di,e)} style={{ color:"rgba(255,255,255,.3)", fontSize:16, cursor:"grab", flexShrink:0, touchAction:"none" }}>⠿</div>
            <div style={{ width:28, height:28, borderRadius:8, background:tc+"22", border:`1px solid ${tc}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{ti}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{d.date&&<span style={{ color:C.muted, fontFamily:C.mono, fontSize:9, marginRight:6 }}>{d.date}</span>}{d.title}</div>
              <div style={{ fontSize:9, color:tc, fontFamily:C.mono, marginTop:1 }}>🚗 {d.transport} · {d.transportTime}分鐘 | 08:30 → {String(endH).padStart(2,"0")}:{String(endM).padStart(2,"0")}</div>
              {d.tour&&d.ts!=="none"&&<div style={{ fontSize:9, fontFamily:C.mono, color:d.ts==="booked"?C.green:C.accent, marginTop:1 }}>{d.ts==="booked"?"🎟":"⏳"} {d.tour} · {d.ts==="booked"?"已預約":"待確認"}</div>}
            </div>
            <div style={{ display:"flex", gap:5, flexShrink:0 }}>
              <button onClick={()=>addSpot(di)} style={{ background:"rgba(127,200,169,.15)", border:"1px solid rgba(127,200,169,.3)", color:C.green, borderRadius:8, padding:"3px 7px", fontSize:9, fontFamily:C.mono, cursor:"pointer" }}>＋景點</button>
              <button onClick={()=>deleteDay(di)} style={{ background:"rgba(224,112,96,.15)", border:"1px solid rgba(224,112,96,.3)", color:C.red, borderRadius:8, padding:"3px 7px", fontSize:9, cursor:"pointer" }}>✕</button>
            </div>
          </div>
          <div style={{ padding:"8px 12px", display:"flex", flexDirection:"column", gap:5 }}>
            {d.spots.map((spot,si)=>(<div key={si} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 9px", background:C.surface3, borderRadius:9, border:`1px solid ${C.border}` }}>
              <div style={{ width:3, minHeight:28, borderRadius:2, background:tc, flexShrink:0, alignSelf:"stretch" }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <input value={spot.name} onChange={e=>updSpot(di,si,"name",e.target.value)} onClick={e=>e.stopPropagation()} style={{ background:"transparent", border:"none", color:"#fff", fontFamily:C.mono, fontSize:11, fontWeight:500, outline:"none", width:"100%" }}/>
                <div style={{ fontSize:9, color:C.muted, fontFamily:C.mono, marginTop:1 }}>🕐 到達 <span style={{ color:C.green }}>{times[si]?.arrival}</span> · 離開 <span style={{ color:C.accent }}>{times[si]?.departure}</span></div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:3, flexShrink:0 }}>
                <span style={{ fontSize:8, color:C.muted, fontFamily:C.mono }}>分鐘</span>
                <input type="number" value={spot.stay} min={0} max={999} onChange={e=>updSpot(di,si,"stay",e.target.value)} onClick={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()} style={{ width:42, background:C.surface2, border:`1px solid ${C.border2}`, borderRadius:6, color:"#fff", fontFamily:C.mono, fontSize:10, padding:"3px 4px", textAlign:"center", outline:"none" }}/>
              </div>
              <button onClick={()=>delSpot(di,si)} style={{ background:"transparent", border:"none", color:"rgba(255,255,255,.2)", fontSize:13, cursor:"pointer", padding:"0 1px" }}>×</button>
            </div>))}
            <div style={{ fontSize:9, fontFamily:C.mono, color:C.muted, paddingLeft:10, paddingTop:2 }}>🏨 {d.stay}</div>
          </div>
        </div>);
      })}
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
    budget: <BudgetTab trip={trip} onUpdate={onUpdate} />,
    flights: <FlightsTab trip={trip} onUpdate={onUpdate} />,
    checklist: <ChecklistTab trip={trip} onUpdate={onUpdate} />,
    shopping: <ShoppingTab trip={trip} onUpdate={onUpdate} />,
    currency: <CurrencyTab />,
    emergency: <EmergencyTab trip={trip} />,
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:C.bg }}>
      <div style={{ position:"relative", flexShrink:0 }}>
        <HeroTag h={143} trip={trip} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,0.08) 30%,rgba(0,0,0,0.82))" }} />
        <button onClick={onBack} style={{ position:"absolute", top:48, left:16, background:"rgba(0,0,0,.55)", border:"1px solid rgba(255,255,255,.2)", color:"#fff", fontFamily:C.mono, fontSize:10, padding:"5px 12px", borderRadius:16, cursor:"pointer" }}>← 返回</button>
        <div style={{ position:"absolute", top:48, right:16 }}><SyncBadge status={syncStatus} /></div>
        <div style={{ position:"absolute", bottom:12, left:16, right:16 }}>
          <div style={{ fontFamily:C.jp, fontSize:20, fontWeight:800, color:"#fff", lineHeight:1.1 }}>{trip.title}</div>
          <div style={{ fontFamily:C.mono, fontSize:10, color:"rgba(255,255,255,.65)", marginTop:3 }}>{trip.dates} · {trip.daysCount}天 · {trip.country}</div>
        </div>
      </div>
      <div style={{ display:"flex", background:C.surface, borderBottom:`1px solid ${C.border}`, flexShrink:0, overflowX:"auto", scrollbarWidth:"none" }}>
        {INNER_TABS.map(t=>(
          <div key={t.id} onClick={()=>setInnerTab(t.id)} style={{ flexShrink:0, flex:1, minWidth:44, display:"flex", flexDirection:"column", alignItems:"center", gap:1, padding:"7px 2px", cursor:"pointer", borderBottom:`2px solid ${innerTab===t.id?(t.id==="emergency"?C.red:C.accent):"transparent"}`, transition:"border-color .15s" }}>
            <span style={{ fontSize:13 }}>{t.icon}</span>
            <span style={{ fontSize:8, fontFamily:C.mono, color:innerTab===t.id?(t.id==="emergency"?C.red:C.accent):C.muted, letterSpacing:.2 }}>{t.label}</span>
          </div>
        ))}
      </div>
      {trip.alerts?.map((a,i)=>(<div key={i} style={{ margin:"7px 16px 0", background:"rgba(224,112,96,.1)", border:"1px solid rgba(224,112,96,.35)", borderRadius:10, padding:"7px 12px", display:"flex", gap:8, alignItems:"center", flexShrink:0 }}><span style={{ fontSize:13 }}>🔔</span><div><div style={{ fontSize:9, color:C.red, fontFamily:C.mono, fontWeight:700 }}>硬性提醒 {a.time}</div><div style={{ fontSize:10, color:C.text2 }}>{a.msg}</div></div></div>))}
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", padding:"12px 0 80px" }}>{content[innerTab]}</div>
      <div onClick={onOpenAI} style={{ position:"absolute", bottom:14, right:14, zIndex:200, cursor:"pointer", animation:"kFloat 3s ease-in-out infinite", filter:"drop-shadow(0 5px 16px rgba(242,201,160,.45))" }}>
        <div style={{ display:"flex", gap:1 }}><SamGhibli size={30}/><GFGhibli size={30}/></div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════ */
function HomePage({ onSelectTrip, onAddTrip, trips, syncStatus }) {
  const sorted = [...trips].sort((a,b)=>a.sortDate.localeCompare(b.sortDate));
  const next = sorted[0];
  const daysLeft = next?.daysUntil || 0;
  const today = new Date().toLocaleDateString("zh-HK",{year:"numeric",month:"long",day:"numeric",weekday:"short"});
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 24px 0", fontSize:12, fontFamily:C.mono, color:"#fff" }}>
          <span>9:41</span>
          <SyncBadge status={syncStatus} />
        </div>
        <div style={{ padding:"14px 20px 0" }}>
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
        <div style={{ margin:"12px 20px 0", background:C.surface, border:`1px solid ${C.border2}`, borderRadius:16, padding:"12px 16px" }}>
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
      </div>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", paddingBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"16px 20px 10px" }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:C.accent }} />
          <span style={{ fontSize:13, fontWeight:600, color:"#fff" }}>即將出發</span>
          <span style={{ fontFamily:C.mono, fontSize:10, color:C.muted, background:C.surface2, padding:"2px 7px", borderRadius:7 }}>{sorted.length}</span>
          <span style={{ fontSize:10, color:C.muted, fontFamily:C.mono, marginLeft:"auto" }}>📅 按日期排序</span>
        </div>
        {sorted.map((trip,idx)=>{
          const HeroTag=HERO_MAP[trip.cartoon]||HeroGeneric;
          return(<div key={trip.id} onClick={()=>onSelectTrip(trip)} style={{ margin:`0 20px ${idx<sorted.length-1?"13px":"8px"}`, borderRadius:20, overflow:"hidden", cursor:"pointer", border:`1px solid ${C.border2}`, background:C.surface2 }}>
            <div style={{ position:"relative", height:122 }}>
              <HeroTag h={122} trip={trip} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,0.05) 20%,rgba(0,0,0,0.78))" }}/>
              <div style={{ position:"absolute", top:9, left:9, background:C.accent, color:"#000", fontSize:9, fontWeight:700, fontFamily:C.mono, padding:"3px 9px", borderRadius:20, letterSpacing:1 }}>{trip.daysUntil}天後</div>
              <div style={{ position:"absolute", top:9, right:9, fontSize:17 }}>{trip.emoji}</div>
              {trip.hasFlight&&<div style={{ position:"absolute", top:9, right:38, background:"rgba(107,163,224,.2)", border:"1px solid rgba(107,163,224,.4)", fontSize:9, fontFamily:C.mono, color:C.blue, padding:"2px 7px", borderRadius:12 }}>✈️</div>}
              <div style={{ position:"absolute", bottom:9, left:11, right:11 }}>
                <div style={{ fontFamily:C.jp, fontSize:16, fontWeight:700, color:"#fff" }}>{trip.title}</div>
                <div style={{ fontFamily:C.mono, fontSize:9, color:"rgba(255,255,255,.6)", marginTop:2 }}>{trip.dates} · {trip.daysCount}天 · 📍{trip.location}</div>
              </div>
            </div>
            <div style={{ padding:"8px 13px 10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:10 }}>
                <span style={{ fontSize:10, color:C.text2, fontFamily:C.mono }}>{trip.country}</span>
                <span style={{ fontSize:10, color:C.text2, fontFamily:C.mono }}>💰 {trip.budget.currency} ${trip.budget.totalCAD.toLocaleString()}</span>
                <span style={{ fontSize:10, color:C.text2, fontFamily:C.mono }}>📅 {trip.daysCount}天</span>
              </div>
              <span style={{ fontSize:13, color:C.muted }}>›</span>
            </div>
          </div>);
        })}
        <div onClick={onAddTrip} style={{ margin:"0 20px 16px", borderRadius:20, border:`1.5px dashed ${C.accent}`, height:70, display:"flex", alignItems:"center", justifyContent:"center", gap:10, cursor:"pointer", color:C.accent }}>
          <span style={{ fontSize:22 }}>＋</span><span style={{ fontSize:12, fontFamily:C.mono, fontWeight:700 }}>新增旅程</span>
        </div>
        <div style={{ padding:"0 20px" }}>
          <div style={{ fontSize:10, fontFamily:C.mono, color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:9 }}>旅行統計</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[{v:sorted.length.toString(),l:"計劃旅程"},{v:"26",l:"最長行程天"},{v:"3",l:"目的地"}].map(s=>(<div key={s.l} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 8px", textAlign:"center" }}><div style={{ fontFamily:C.jp, fontSize:22, fontWeight:700, color:C.accent, marginBottom:3 }}>{s.v}</div><div style={{ fontFamily:C.mono, fontSize:9, color:C.muted }}>{s.l}</div></div>))}
          </div>
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
    <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", minHeight:"100vh", background:"#111", padding:"20px 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Shippori+Mincho+B1:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}
        input[type=number]{-moz-appearance:textfield}
        input[type=date],input[type=datetime-local]{color-scheme:dark}
        @keyframes kFloat{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-7px) rotate(2deg)}}
        @keyframes tBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        @keyframes magicPop{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.1) rotate(4deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
        ::-webkit-scrollbar{display:none}
      `}</style>
      <div style={{ width:390, height:844, background:C.bg, borderRadius:48, overflow:"hidden", position:"relative", border:"1.5px solid rgba(255,255,255,0.12)", boxShadow:"0 40px 120px rgba(0,0,0,0.8)", fontFamily:C.ui, color:"#fff" }}>
        {screen==="home" && <HomePage onSelectTrip={trip=>navigate("trip",trip)} onAddTrip={()=>setShowWizard(true)} trips={trips} syncStatus={syncStatus}/>}
        {screen==="trip" && selectedTrip && <TripPage trip={selectedTrip} onBack={()=>navigate("home")} onOpenAI={openAI} onUpdate={handleTripUpdate} syncStatus={syncStatus}/>}
        {screen==="home" && mascotVis && (
          <div onClick={openAI} style={{ position:"absolute", bottom:18, right:14, zIndex:200, cursor:"pointer", animation:"kFloat 3s ease-in-out infinite", filter:"drop-shadow(0 5px 16px rgba(242,201,160,.45))" }}>
            <div style={{ display:"flex", gap:1 }}><SamGhibli size={44}/><GFGhibli size={44}/></div>
          </div>
        )}
        <MagicTransition show={showMagic}/>
        <AIChat open={chatOpen} onClose={closeAI} trip={selectedTrip||trips[0]}/>
        {showWizard && <AddTripWizard onClose={()=>setShowWizard(false)} onCreated={handleCreated}/>}
      </div>
    </div>
  );
}
