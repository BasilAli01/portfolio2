import { useState, useEffect, useRef, Children, cloneElement } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════
   GLOBAL STYLES — Earthy Dark Palette
═══════════════════════════════════════════════════ */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --terracotta: #D4856A;
    --teal:       #4E8B7D;
    --crimson:    #8B3A3A;
    --navy:       #0D1F1E;
    --charcoal:   #2A2430;
    --cream:      #EDE4C8;
    --taupe:      #8B7355;
    --burgundy:   #5C2229;
    --black:      #0A0F0A;
    --slate:      #3D5C52;

    /* Semantic mappings */
    --bg:           #0A0F0A;
    --surface:      #0D1F1E;
    --surface-2:    #2A2430;
    --glass:        rgba(237,228,200,0.04);
    --glass-border: rgba(237,228,200,0.1);
    --text:         #EDE4C8;
    --muted:        #8B7355;
    --accent:       #D4856A;
    --accent-2:     #4E8B7D;
    --accent-3:     #8B3A3A;
  }

  html { scroll-behavior: smooth; }
  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--slate); border-radius: 2px; }

  /* ── PIXEL BLAST BG ── */
  .hero-section { position: relative; min-height: 100vh; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
  .pixel-blast-container { width: 100%; height: 100%; display: block; }
  .hero-bg::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(10,15,10,0.5) 0%,
      rgba(10,15,10,0.2) 40%,
      rgba(10,15,10,0.9) 100%
    );
    pointer-events: none;
  }

  /* Background texture */
  .bg-grid {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(78,139,125,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(78,139,125,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .orb { position: fixed; border-radius: 50%; filter: blur(130px); pointer-events: none; z-index: 0; }
  .orb-1 { width: 500px; height: 500px; background: rgba(92,34,41,0.2);  top: -100px; right: -100px; }
  .orb-2 { width: 400px; height: 400px; background: rgba(78,139,125,0.12); bottom: 10%; left: -100px; }
  .orb-3 { width: 300px; height: 300px; background: rgba(212,133,106,0.08); top: 50%; right: 20%; }

  /* ── HERO ── */
  .hero {
    min-height: 100vh; display: flex; align-items: center;
    padding: 120px 60px 140px;
    max-width: 1200px; margin: 0 auto;
    position: relative; z-index: 1;
  }
  .hero-content { flex: 1; }

  .hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Oxanium', monospace; font-size: 0.7rem;
    letter-spacing: 3px; text-transform: uppercase; color: var(--accent);
    border: 1px solid rgba(212,133,106,0.35);
    background: rgba(212,133,106,0.07);
    padding: 6px 16px; border-radius: 2px; margin-bottom: 32px;
  }
  .hero-tag::before {
    content: ''; display: block; width: 6px; height: 6px;
    background: var(--accent); border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .hero-name-block {
    font-family: 'Oxanium', monospace;
    font-size: clamp(3rem, 7vw, 6rem);
    font-weight: 800; line-height: 1.05; margin-bottom: 8px;
  }

  .grad-char {
    background: linear-gradient(135deg, var(--cream) 0%, var(--terracotta) 50%, var(--teal) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    display: inline-block;
  }

  .hero-sub {
    font-size: 1.05rem; font-weight: 300; color: var(--muted);
    margin: 24px 0 40px; max-width: 480px; line-height: 1.7; min-height: 4.5em;
  }

  .encrypted-char { color: var(--teal); opacity: 0.75; }

  .hero-cta { display: flex; gap: 16px; flex-wrap: wrap; }

  .btn-primary {
    font-family: 'Oxanium', monospace; font-size: 0.8rem;
    font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    padding: 14px 32px; border-radius: 4px; cursor: pointer;
    text-decoration: none; display: inline-block;
    background: linear-gradient(135deg, var(--terracotta), var(--crimson));
    color: var(--cream); border: none; transition: opacity 0.3s, transform 0.2s;
  }
  .btn-primary:hover { opacity: 0.85; transform: translateY(-2px); }

  .btn-outline {
    font-family: 'Oxanium', monospace; font-size: 0.8rem;
    font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    padding: 13px 32px; border-radius: 4px; cursor: pointer;
    text-decoration: none; display: inline-block;
    background: rgba(10,15,10,0.4); backdrop-filter: blur(8px);
    color: var(--teal); border: 1px solid rgba(78,139,125,0.4); transition: all 0.3s;
  }
  .btn-outline:hover { background: rgba(78,139,125,0.08); border-color: var(--teal); transform: translateY(-2px); }

  /* Avatar */
  .hero-visual { flex: 0 0 300px; display: flex; align-items: center; justify-content: center; margin-left: 80px; }
  .avatar-ring { position: relative; width: 260px; height: 260px; }
  .avatar-ring::before {
    content: ''; position: absolute; inset: -3px; border-radius: 50%;
    background: conic-gradient(var(--terracotta), var(--teal), var(--crimson), var(--taupe), var(--terracotta));
    animation: spin 8s linear infinite; z-index: -1;
  }
  .avatar-ring::after { content: ''; position: absolute; inset: 2px; border-radius: 50%; background: var(--bg); z-index: -1; }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .avatar-inner {
    width: 100%; height: 100%; border-radius: 50%;
    background: linear-gradient(135deg, rgba(92,34,41,0.4), rgba(78,139,125,0.25));
    display: flex; align-items: center; justify-content: center;
  }
  .avatar-initials {
    font-family: 'Oxanium', monospace; font-size: 4rem; font-weight: 800;
    background: linear-gradient(135deg, var(--cream), var(--terracotta));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  /* ── SECTIONS ── */
  .section-label {
    font-family: 'Oxanium', monospace; font-size: 0.65rem;
    letter-spacing: 4px; text-transform: uppercase; color: var(--accent); margin-bottom: 12px;
  }
  .section-title {
    font-family: 'Oxanium', monospace;
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; margin-bottom: 60px; color: var(--cream);
  }
  .section-title span {
    background: linear-gradient(135deg, var(--teal), var(--terracotta));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .container { max-width: 1200px; margin: 0 auto; padding: 100px 60px; position: relative; z-index: 1; }

  /* ── SKILLS ── */
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
  .skill-chip {
    background: var(--glass); border: 1px solid var(--glass-border);
    border-radius: 12px; padding: 20px 16px; text-align: center; transition: all 0.3s; cursor: default;
  }
  .skill-chip:hover {
    border-color: var(--terracotta); background: rgba(212,133,106,0.07);
    transform: translateY(-4px); box-shadow: 0 8px 32px rgba(212,133,106,0.12);
  }
  .skill-icon { font-size: 1.8rem; margin-bottom: 10px; }
  .skill-name { font-family: 'Oxanium', monospace; font-size: 0.75rem; font-weight: 600; letter-spacing: 1px; color: var(--cream); }
  .skill-level { height: 2px; background: rgba(237,228,200,0.08); border-radius: 1px; margin-top: 12px; overflow: hidden; }
  .skill-level-fill { height: 100%; border-radius: 1px; background: linear-gradient(90deg, var(--terracotta), var(--teal)); transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }

  /* ── PROJECTS ── */
  .project-card-stack {
    background: rgba(13,31,30,0.6);
    border: 1px solid rgba(237,228,200,0.08);
    backdrop-filter: blur(20px); border-radius: 24px;
    padding: 52px 60px; min-height: 300px;
    display: flex; align-items: center; gap: 60px;
    position: relative; overflow: hidden;
  }
  .project-card-stack::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--terracotta), transparent);
  }
  .project-card-number {
    font-family: 'Oxanium', monospace; font-size: 6rem; font-weight: 800;
    line-height: 1; flex-shrink: 0; opacity: 0.1; user-select: none; color: var(--cream);
  }
  .project-card-content { flex: 1; }
  .project-badge {
    font-family: 'Oxanium', monospace; font-size: 0.6rem;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 4px 12px; border-radius: 2px; display: inline-block; margin-bottom: 20px;
  }
  .badge-game { background: rgba(92,34,41,0.3); color: #C4747A; border: 1px solid rgba(92,34,41,0.5); }
  .badge-web  { background: rgba(78,139,125,0.15); color: var(--teal); border: 1px solid rgba(78,139,125,0.35); }
  .project-card-stack h3 { font-family: 'Oxanium', monospace; font-size: 1.9rem; font-weight: 700; margin-bottom: 16px; color: var(--cream); }
  .project-card-stack p { font-size: 0.95rem; color: var(--muted); line-height: 1.8; margin-bottom: 24px; }
  .project-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag { font-family: 'Oxanium', monospace; font-size: 0.65rem; letter-spacing: 1px; color: var(--taupe); border: 1px solid rgba(139,115,85,0.2); border-radius: 4px; padding: 4px 10px; }
  .project-award { display: flex; align-items: center; gap: 6px; margin-top: 16px; font-size: 0.78rem; color: var(--terracotta); font-family: 'Oxanium', monospace; font-weight: 600; }
  .project-dots { display: flex; gap: 8px; justify-content: center; margin-top: 28px; }
  .project-dot { height: 4px; border-radius: 2px; transition: all 0.35s; }

  /* ── EXPERIENCE ── */
  .experience-timeline { position: relative; padding-left: 32px; }
  .experience-timeline::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 0; width: 1px; background: linear-gradient(to bottom, var(--teal), transparent); }
  .exp-item { position: relative; margin-bottom: 48px; }
  .exp-item:last-child { margin-bottom: 0; }

  .exp-item::before { content: ''; position: absolute; left: -37px; top: 6px; width: 10px; height: 10px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 16px rgba(78,139,125,0.6); }
  .exp-date { font-family: 'Oxanium', monospace; font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
  .exp-title { font-family: 'Oxanium', monospace; font-size: 1.15rem; font-weight: 700; color: var(--cream); margin-bottom: 4px; }
  .exp-org { font-size: 0.85rem; color: var(--teal); margin-bottom: 10px; font-weight: 500; }
  .exp-desc { font-size: 0.9rem; color: var(--muted); line-height: 1.8; }
  .exp-highlight { display: flex; align-items: flex-start; gap: 10px; font-size: 0.85rem; color: var(--muted); margin-bottom: 6px; }
  .exp-highlight::before { content: '→'; color: var(--terracotta); flex-shrink: 0; }

  /* ── CONTACT ── */
  .contact-wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
  .contact-info h3 { font-family: 'Oxanium', monospace; font-size: 1.5rem; font-weight: 700; color: var(--cream); margin-bottom: 16px; }
  .contact-info p { color: var(--muted); line-height: 1.8; margin-bottom: 32px; }
  .contact-link { display: flex; align-items: center; gap: 12px; color: var(--text); text-decoration: none; padding: 14px 0; border-bottom: 1px solid var(--glass-border); transition: color 0.3s; font-size: 0.9rem; }
  .contact-link:hover { color: var(--terracotta); }
  .contact-link-icon { font-size: 1.1rem; }
  .contact-link-label { font-family: 'Oxanium', monospace; font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 2px; }
  .contact-form { display: flex; flex-direction: column; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-label { font-family: 'Oxanium', monospace; font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }
  .form-input, .form-textarea {
    background: rgba(13,31,30,0.6); border: 1px solid var(--glass-border);
    border-radius: 8px; padding: 14px 16px; color: var(--cream);
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; transition: border-color 0.3s; resize: none;
  }
  .form-input:focus, .form-textarea:focus { border-color: var(--terracotta); box-shadow: 0 0 0 2px rgba(212,133,106,0.1); }
  .form-textarea { min-height: 120px; }

  /* ── DOCK ── */
  .dock-outer { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; align-items: flex-end; overflow: visible; }
  .dock-panel {
  display: flex;
  align-items: center;
  gap: 10px;

  background: rgba(10,15,10,0.9);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(237,228,200,0.1);
  border-radius: 999px;

  padding: 10px 14px;
  max-width: calc(100vw - 32px);
  overflow-x: auto;
  scrollbar-width: none;
}
.dock-panel::-webkit-scrollbar { display: none; }

.dock-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  cursor: pointer;
  position: relative;

  padding: 10px 14px;        /* this is what makes text fit */
  background: rgba(237,228,200,0.04);
  border: 1px solid rgba(237,228,200,0.08);

  transition: background 0.2s, border-color 0.2s;
  flex-shrink: 0;
  outline: none;
  transform-origin: bottom center;
}

.dock-icon {
  font-family: 'Oxanium', monospace;  /* match your name */
  font-weight: 800;
  letter-spacing: 1px;
  font-size: 0.8rem;
  line-height: 1;
  color: var(--cream);
  text-transform: uppercase;
}

  .dock-label {
    position: absolute; top: -38px; left: 50%;
    background: rgba(10,15,10,0.95); backdrop-filter: blur(12px);
    border: 1px solid rgba(237,228,200,0.1); border-radius: 6px; padding: 4px 10px;
    font-family: 'Oxanium', monospace; font-size: 0.65rem;
    letter-spacing: 1px; text-transform: uppercase; color: var(--terracotta);
    white-space: nowrap; pointer-events: none;
  }

  /* ── FOOTER ── */
  footer {
    position: relative; z-index: 1; text-align: center; padding: 40px 60px 120px;
    border-top: 1px solid var(--glass-border);
    font-family: 'Oxanium', monospace; font-size: 0.7rem;
    letter-spacing: 2px; color: var(--muted); text-transform: uppercase;
  }

  /* ── REVEAL ── */
  .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }

  @media (max-width: 900px) {
    .hero { flex-direction: column; padding: 120px 24px 80px; }
    .hero-visual { margin-left: 0; margin-top: 48px; }
    .container { padding: 80px 24px; }
    .contact-wrapper { grid-template-columns: 1fr; }
    .project-card-stack { flex-direction: column; gap: 20px; padding: 32px; }
    .project-card-number { font-size: 3.5rem; }
  }
`;

/* ═══════════════════════════════════════════════════
   PIXEL BLAST — now in terracotta/teal palette
═══════════════════════════════════════════════════ */
const SHAPE_MAP = { square: 0, circle: 1, triangle: 2, diamond: 3 };
const MAX_CLICKS = 10;
const VERTEX_SRC = `void main() { gl_Position = vec4(position, 1.0); }`;
const FRAGMENT_SRC = `
precision highp float;
uniform vec3  uColor; uniform vec2 uResolution; uniform float uTime;
uniform float uPixelSize; uniform float uScale; uniform float uDensity;
uniform float uPixelJitter; uniform int uEnableRipples;
uniform float uRippleSpeed; uniform float uRippleThickness; uniform float uRippleIntensity;
uniform float uEdgeFade; uniform int uShapeType;
const int SHAPE_SQUARE=0; const int SHAPE_CIRCLE=1; const int SHAPE_TRIANGLE=2; const int SHAPE_DIAMOND=3;
const int MAX_CLICKS=10;
uniform vec2 uClickPos[MAX_CLICKS]; uniform float uClickTimes[MAX_CLICKS];
out vec4 fragColor;
float Bayer2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}
#define Bayer4(a) (Bayer2(.5*(a))*0.25+Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25+Bayer2(a))
float hash11(float n){return fract(sin(n)*43758.5453);}
float vnoise(vec3 p){
  vec3 ip=floor(p);vec3 fp=fract(p);
  float n000=hash11(dot(ip+vec3(0,0,0),vec3(1,57,113)));float n100=hash11(dot(ip+vec3(1,0,0),vec3(1,57,113)));
  float n010=hash11(dot(ip+vec3(0,1,0),vec3(1,57,113)));float n110=hash11(dot(ip+vec3(1,1,0),vec3(1,57,113)));
  float n001=hash11(dot(ip+vec3(0,0,1),vec3(1,57,113)));float n101=hash11(dot(ip+vec3(1,0,1),vec3(1,57,113)));
  float n011=hash11(dot(ip+vec3(0,1,1),vec3(1,57,113)));float n111=hash11(dot(ip+vec3(1,1,1),vec3(1,57,113)));
  vec3 w=fp*fp*fp*(fp*(fp*6.-15.)+10.);
  float x00=mix(n000,n100,w.x);float x10=mix(n010,n110,w.x);float x01=mix(n001,n101,w.x);float x11=mix(n011,n111,w.x);
  return mix(mix(x00,x10,w.y),mix(x01,x11,w.y),w.z)*2.-1.;
}
float fbm2(vec2 uv,float t){
  vec3 p=vec3(uv*uScale,t);float amp=1.;float freq=1.;float sum=1.;
  for(int i=0;i<5;++i){sum+=amp*vnoise(p*freq);freq*=1.25;amp*=1.;}
  return sum*.5+.5;
}
float maskCircle(vec2 p,float cov){float r=sqrt(cov)*.25;float d=length(p-.5)-r;float aa=.5*fwidth(d);return cov*(1.-smoothstep(-aa,aa,d*2.));}
float maskTriangle(vec2 p,vec2 id,float cov){bool flip=mod(id.x+id.y,2.)>.5;if(flip)p.x=1.-p.x;float r=sqrt(cov);float d=p.y-r*(1.-p.x);float aa=fwidth(d);return cov*clamp(.5-d/aa,0.,1.);}
float maskDiamond(vec2 p,float cov){float r=sqrt(cov)*.564;return step(abs(p.x-.49)+abs(p.y-.49),r);}
void main(){
  vec2 fragCoord=gl_FragCoord.xy-uResolution*.5;
  float aspectRatio=uResolution.x/uResolution.y;
  vec2 pixelId=floor(fragCoord/uPixelSize);
  vec2 pixelUV=fract(fragCoord/uPixelSize);
  float cellPixelSize=8.*uPixelSize;
  vec2 cellCoord=floor(fragCoord/cellPixelSize)*cellPixelSize;
  vec2 uv=cellCoord/uResolution*vec2(aspectRatio,1.);
  float base=fbm2(uv,uTime*.05)*.5-.65;
  float feed=base+(uDensity-.5)*.3;
  if(uEnableRipples==1){
    for(int i=0;i<MAX_CLICKS;++i){
      vec2 pos=uClickPos[i]; if(pos.x<0.)continue;
      vec2 cuv=(((pos-uResolution*.5-cellPixelSize*.5)/(uResolution)))*vec2(aspectRatio,1.);
      float t=max(uTime-uClickTimes[i],0.);
      float r=distance(uv,cuv);
      float ring=exp(-pow((r-uRippleSpeed*t)/uRippleThickness,2.));
      float atten=exp(-1.*t)*exp(-10.*r);
      feed=max(feed,ring*atten*uRippleIntensity);
    }
  }
  float bayer=Bayer8(fragCoord/uPixelSize)-.5;
  float bw=step(.5,feed+bayer);
  float h=fract(sin(dot(floor(fragCoord/uPixelSize),vec2(127.1,311.7)))*43758.5453);
  float coverage=bw*(1.+(h-.5)*uPixelJitter);
  float M;
  if(uShapeType==SHAPE_CIRCLE) M=maskCircle(pixelUV,coverage);
  else if(uShapeType==SHAPE_TRIANGLE) M=maskTriangle(pixelUV,pixelId,coverage);
  else if(uShapeType==SHAPE_DIAMOND) M=maskDiamond(pixelUV,coverage);
  else M=coverage;
  if(uEdgeFade>0.){
    vec2 norm=gl_FragCoord.xy/uResolution;
    float edge=min(min(norm.x,norm.y),min(1.-norm.x,1.-norm.y));
    M*=smoothstep(0.,uEdgeFade,edge);
  }
  vec3 c=uColor;
  vec3 srgb=mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(0.0031308,c));
  fragColor=vec4(srgb,M);
}`;

function PixelBlast() {
  const containerRef = useRef(null);
  const threeRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || threeRef.current) return;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.domElement.style.cssText = "width:100%;height:100%;";
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearAlpha(0);
    container.appendChild(renderer.domElement);
    const uniforms = {
      uResolution: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#D4856A") }, // terracotta pixels
      uClickPos: { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
      uClickTimes: { value: new Float32Array(MAX_CLICKS) },
      uShapeType: { value: 1 }, // circles
      uPixelSize: { value: 4 * renderer.getPixelRatio() },
      uScale: { value: 2.2 },
      uDensity: { value: 0.8 },
      uPixelJitter: { value: 0.25 },
      uEnableRipples: { value: 1 },
      uRippleSpeed: { value: 0.26 },
      uRippleThickness: { value: 0.13 },
      uRippleIntensity: { value: 0.75 },
      uEdgeFade: { value: 0.2 },
    };
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SRC, fragmentShader: FRAGMENT_SRC,
      uniforms, transparent: true, depthTest: false, depthWrite: false, glslVersion: THREE.GLSL3,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);
    const setSize = () => {
      renderer.setSize(container.clientWidth || 1, container.clientHeight || 1, false);
      uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
      uniforms.uPixelSize.value = 4 * renderer.getPixelRatio();
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    let clickIx = 0;
    const onPointerDown = e => {
      const rect = renderer.domElement.getBoundingClientRect();
      const sx = renderer.domElement.width / rect.width;
      const sy = renderer.domElement.height / rect.height;
      uniforms.uClickPos.value[clickIx].set((e.clientX - rect.left) * sx, (rect.height - (e.clientY - rect.top)) * sy);
      uniforms.uClickTimes.value[clickIx] = uniforms.uTime.value;
      clickIx = (clickIx + 1) % MAX_CLICKS;
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown, { passive: true });
    const clock = new THREE.Clock();
    const offset = Math.random() * 1000;
    let raf;
    const animate = () => {
      uniforms.uTime.value = offset + clock.getElapsedTime() * 0.3;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    threeRef.current = { renderer, material, ro, raf, quad };
    return () => {
      ro.disconnect(); cancelAnimationFrame(raf);
      quad.geometry.dispose(); material.dispose(); renderer.dispose();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
      threeRef.current = null;
    };
  }, []);
  return <div ref={containerRef} className="pixel-blast-container" />;
}

/* ═══════════════════════════════════════════════════
   SPLIT TEXT
═══════════════════════════════════════════════════ */
function SplitTextReveal({ text, delayStart = 0 }) {
  return (
    <span style={{ display: "block" }}>
      {text.split("").map((char, i) => (
        <motion.span key={i} className="grad-char"
          initial={{ opacity: 0, y: 70, rotateX: -90, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, delay: delayStart + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", transformOrigin: "bottom center", perspective: "400px" }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   DECRYPTED TEXT
═══════════════════════════════════════════════════ */
function DecryptedText({ text, speed = 22 }) {
  const [display, setDisplay] = useState(() => Array.from(text).map(() => " "));
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  const chars = useRef("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()");

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    // reset every run
    setDisplay(Array.from(text).map(() => " "));

    let idx = 0;
    let cycles = 0;

    const randChar = () => chars.current[Math.floor(Math.random() * chars.current.length)];

    const iv = setInterval(() => {
      setDisplay(prev => {
        const next = [...prev];

        // scramble everything from idx onward
        for (let j = idx; j < text.length; j++) {
          next[j] = text[j] === " " ? " " : randChar();
        }

        // every 3 cycles, lock the next real character
        cycles++;
        if (cycles >= 3) {
          cycles = 0;
          if (idx < text.length) {
            next[idx] = text[idx];
            idx++;
          }
        }

        return next;
      });

      // hard snap at the end (prevents “never fully fixes”)
      if (idx >= text.length) {
        setDisplay(Array.from(text));
        clearInterval(iv);
      }
    }, speed);

    return () => clearInterval(iv);
  }, [started, text, speed]);

  return (
    <span ref={ref} style={{ display: "inline-block", whiteSpace: "pre-wrap" }}>
      {display.map((char, i) => (
        <span key={i} className={char !== text[i] && char !== " " ? "encrypted-char" : ""}>
          {char}
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   SCROLL STACK
═══════════════════════════════════════════════════ */
function ScrollStack({ projects }) {
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);
  useEffect(() => {
    const fn = () => {
      const el = wrapRef.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const prog = Math.max(0, Math.min(1, -rect.top / (el.offsetHeight - window.innerHeight)));
      setActive(Math.min(projects.length - 1, Math.floor(prog * projects.length)));
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [projects.length]);
  return (
    <div ref={wrapRef} style={{ height: `${projects.length * 85}vh`, position: "relative" }}>
      <div style={{ position: "sticky", top: "18vh" }}>
        <AnimatePresence mode="wait">
          <motion.div key={active} className="project-card-stack"
            initial={{ opacity: 0, y: 48, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
            <div className="project-card-number">0{active + 1}</div>
            <div className="project-card-content">
              <span className={`project-badge ${projects[active].badgeClass}`}>{projects[active].badge}</span>
              <h3>{projects[active].title}</h3>
              <p>{projects[active].desc}</p>
              <div className="project-tags">{projects[active].tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              {projects[active].award && <div className="project-award">{projects[active].award}</div>}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="project-dots">
          {projects.map((_, i) => (
            <div key={i} className="project-dot" style={{ width: i === active ? 28 : 8, background: i === active ? "var(--terracotta)" : "rgba(237,228,200,0.12)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DOCK
═══════════════════════════════════════════════════ */
function DockLabel({ children, isHovered }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const u = isHovered.on("change", v => setVisible(v === 1)); return u; }, [isHovered]);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: -10 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.18 }} className="dock-label">
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
function DockItem({ children, onClick, mouseX, spring, distance, magnification, baseItemSize }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const md = useTransform(mouseX, v => {
    const r = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return v - r.x - r.width / 2;
  });

  // Scale instead of forcing square width/height
  const maxScale = magnification / baseItemSize; // e.g. 64/44 = 1.45
  const scale = useSpring(
    useTransform(md, [-distance, 0, distance], [1, maxScale, 1]),
    spring
  );

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onClick={onClick}
      className="dock-item"
      tabIndex={0}
    >
      {Children.map(children, c => cloneElement(c, { isHovered }))}
    </motion.div>
  );
}

function DockIcon({ children }) { return <div className="dock-icon">{children}</div>; }
function AppDock({ items }) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const SP = { mass: 0.1, stiffness: 150, damping: 12 };
  const BASE = 44; const MAG = 64; const PH = 64;
  const height = useSpring(useTransform(isHovered, [0, 1], [PH, Math.max(256, MAG + MAG / 2 + 4)]), SP);
  return (
    <motion.div style={{ height, scrollbarWidth: "none" }} className="dock-outer">
      <motion.div onMouseMove={({ pageX }) => { isHovered.set(1); mouseX.set(pageX); }} onMouseLeave={() => { isHovered.set(0); mouseX.set(Infinity); }} className="dock-panel" style={{ height: PH }}>
        {items.map((item, i) => (
          <DockItem key={i} onClick={item.onClick} mouseX={mouseX} spring={SP} distance={160} magnification={MAG} baseItemSize={BASE}>
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }), { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}
function useSkillBars() {
  useEffect(() => {
    const fills = document.querySelectorAll(".skill-level-fill");
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.level + "%"; io.unobserve(e.target); } }), { threshold: 0.3 });
    fills.forEach(el => { el.style.width = "0%"; io.observe(el); });
    return () => io.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
const skills = [
  { name: "Java",    icon: "☕", level: 85 },
  { name: "JavaFX",  icon: "🖼️", level: 80 },
  { name: "Python",  icon: "🐍", level: 70 },
  { name: "HTML",    icon: "🌐", level: 75 },
  { name: "CSS",     icon: "🎨", level: 70 },
  { name: "React",   icon: "⚛️", level: 50 },
  { name: "Git",     icon: "🔧", level: 75 },
  { name: "AI / ML", icon: "🤖", level: 60 },
];
const projects = [
  { title: "Walking in the Rain", badge: "Game", badgeClass: "badge-game", desc: "An immersive 2D interactive experience built with JavaFX — animated sprites, procedural rain, triggered events, and spatial audio that pull the player into the moment.", tags: ["JavaFX", "Java", "Animation", "Audio"] },
  { title: "Greed's Gambit", badge: "Game", badgeClass: "badge-game", desc: "Award-winning team game for OOP II. I architected the full backend game logic and state management while collaborating across a cross-functional team.", tags: ["JavaFX", "Java", "OOP", "Team Lead"], award: "🏆 2nd Place — Best Theme" },
  { title: "Portfolio Website", badge: "Web", badgeClass: "badge-web", desc: "Evolved from a static HTML/CSS site into this futuristic React experience — constantly improving as new skills are acquired. You're looking at v2.", tags: ["React", "HTML", "CSS", "Design"] },
];
const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
const dockItems = [
  { icon: "Home", label: "About",      onClick: () => scrollTo("about") },
  { icon: "Skills", label: "Skills",     onClick: () => scrollTo("skills") },
  { icon: "Projects", label: "Projects",   onClick: () => scrollTo("projects") },
  { icon: "Experience", label: "Experience", onClick: () => scrollTo("experience") },
  { icon: "Contact", label: "Contact",    onClick: () => scrollTo("contact") },
];

/* ═══════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════ */
export default function Portfolio() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  useReveal(); useSkillBars();
  const handleSubmit = e => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 3000); setFormData({ name: "", email: "", message: "" }); };

  return (
    <>
      <style>{globalStyles}</style>
      <div className="bg-grid" />
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

      {/* HERO */}
      <section id="about" className="hero-section">
        <div className="hero-bg"><PixelBlast /></div>
        <div className="hero">
          <div className="hero-content">
            <motion.div className="hero-tag" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              Available for opportunities
            </motion.div>
            <div className="hero-name-block">
              <SplitTextReveal text="Basil" delayStart={0.4} />
              <SplitTextReveal text="Muhammad Ali" delayStart={0.65} />
            </div>
            <p className="hero-sub">
              <DecryptedText text="3rd Year Software Engineering student at AlFaisal University — building games, web experiences, and teaching the next generation about AI." speed={18} />
            </p>
            <motion.div className="hero-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2, duration: 0.6 }}>
              <a href="#projects" className="btn-primary">View Projects</a>
              <a href="#contact" className="btn-outline">Get in Touch</a>
            </motion.div>
          </div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <div className="avatar-ring">
              <div className="avatar-inner"><span className="avatar-initials">BA</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="container">
          <p className="section-label reveal">Tech Stack</p>
          <h2 className="section-title reveal reveal-delay-1">Skills & <span>Expertise</span></h2>
          <div className="skills-grid">
            {skills.map((s, i) => (
              <div key={s.name} className={`skill-chip reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="skill-icon">{s.icon}</div>
                <div className="skill-name">{s.name}</div>
                <div className="skill-level"><div className="skill-level-fill" data-level={s.level} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="container" style={{ paddingBottom: 48 }}>
          <p className="section-label reveal">Portfolio</p>
          <h2 className="section-title reveal reveal-delay-1" style={{ marginBottom: 16 }}>Featured <span>Projects</span></h2>
          <p className="reveal reveal-delay-2" style={{ color: "var(--muted)", fontSize: "0.85rem", fontFamily: "Oxanium, monospace", letterSpacing: "1px" }}>↓ Scroll to explore</p>
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
          <ScrollStack projects={projects} />
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="container">
          <p className="section-label reveal">Background</p>
          <h2 className="section-title reveal reveal-delay-1">My <span>Experience</span></h2>
          <div className="experience-timeline">
            <div className="exp-item reveal reveal-delay-2">
              <div className="exp-date">Summer 2024</div>
              <div className="exp-title">Instructor — AI Enrichment Program</div>
              <div className="exp-org">AlFaisal University</div>
              <div className="exp-desc">Designed and delivered AI curriculum to middle and high school students, translating complex concepts into engaging, age-appropriate lessons.</div>
              <div style={{ marginTop: 12 }}>
                <div className="exp-highlight">Improved public speaking and technical communication skills</div>
                <div className="exp-highlight">Gained a new academic lens as educator rather than student</div>
                <div className="exp-highlight">Covered foundational AI concepts: ML, neural nets, ethics</div>
              </div>
            </div>
           
            <div className="exp-item reveal reveal-delay-3">
              <div className="exp-date">May 2025 — August 2025</div>
              <div className="exp-title">Search O Pal</div>
              <div className="exp-org">Lahore, Pakistan</div>
              <div className="exp-desc">Summer Internship that involved working on with AI concepts specifically in search and recommendation systems.</div>
              <div style={{ marginTop: 12 }}>
                <div className="exp-highlight">Built a search and recommendation system using Python and TensorFlow</div>
                <div className="exp-highlight">Learnt and applied best practices in software engineering and AI development</div>
                <div className="exp-highlight">Gained experience in working with large datasets and optimizing performance</div>
              </div>
            </div>
             <div className="exp-item reveal reveal-delay-3">
              <div className="exp-date">2022 — Present</div>
              <div className="exp-title">B.Sc. Software Engineering</div>
              <div className="exp-org">AlFaisal University, Riyadh</div>
              <div className="exp-desc">Focused on OOP, data structures, game development, and full-stack web technologies. Consistently building projects that bridge theory and practice.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="container">
          <p className="section-label reveal">Let's Connect</p>
          <h2 className="section-title reveal reveal-delay-1">Get in <span>Touch</span></h2>
          <div className="contact-wrapper">
            <div className="contact-info reveal reveal-delay-2">
              <h3>Open to new opportunities</h3>
              <p>Whether you're looking for an intern, a collaborator, or just want to talk tech — my inbox is open.</p>
              <a href="mailto:BasilAsghar2001@gmail.com" className="contact-link"><span className="contact-link-icon">✉️</span><span><span className="contact-link-label">Email</span>BasilAsghar2001@gmail.com</span></a>
              <a href="https://www.linkedin.com/in/basil-ali-992344200/" className="contact-link" target="_blank" rel="noreferrer"><span className="contact-link-icon">💼</span><span><span className="contact-link-label">LinkedIn</span>basil-ali-992344200</span></a>
              <a href="https://github.com/BasilAli01" className="contact-link" target="_blank" rel="noreferrer"><span className="contact-link-icon">🐙</span><span><span className="contact-link-label">GitHub</span>BasilAli01</span></a>
            </div>
            <form className="contact-form reveal reveal-delay-3" onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Name</label><input className="form-input" type="text" placeholder="Your name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="your@email.com" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-textarea" placeholder="Tell me what's on your mind..." required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} /></div>
              <button type="submit" className="btn-primary" style={{ width: "100%", textAlign: "center" }}>{sent ? "✓ Message Sent!" : "Send Message →"}</button>
            </form>
          </div>
        </div>
      </section>

      <footer><span>© 2025 Basil Muhammad Ali &nbsp;·&nbsp; Designed & built with ⚡</span></footer>
      <AppDock items={dockItems} />
    </>
  );
}