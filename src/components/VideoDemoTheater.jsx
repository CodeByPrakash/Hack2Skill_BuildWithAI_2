import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Globe2, 
  MapPin, 
  Mic, 
  Bot, 
  Sliders, 
  Search, 
  BarChart3, 
  ShieldCheck,
  CheckCircle2,
  Tv,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  X,
  Radio,
  HelpCircle
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { BRICS_COUNTRIES } from '../data/bricsData';
import confetti from 'canvas-confetti';

export default function VideoDemoTheater({ onSelectTab, onSelectCountry, activeCountryCode, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const timerRef = useRef(null);

  const SCENES = [
    {
      id: 1,
      title: "Scene 1: The Geopolitical Problem & Track 1 Vision",
      duration: 16,
      tab: 'map',
      country: 'IN',
      voiceover: "Governments across BRICS+ nations spend over three trillion dollars annually on infrastructure. Yet, up to thirty-eight percent is misallocated due to fragmented citizen queues and static spreadsheets. Welcome to BRICS InfraPulse AI—a scalable Digital Public Good bridging citizen demand with sovereign capital allocation.",
      arrowPointer: {
        target: 'top-center',
        arrowDirection: 'up',
        label: 'Select any BRICS+ Nation here to instantly localize datasets 👆',
        badge: '🇮🇳 India • 🇧🇷 Brazil • 🇿🇦 South Africa'
      },
      popups: [
        { text: '🌐 Track 1: AI for DPI & Governance' },
        { text: '🏆 Theme: BRICS Innovation' }
      ]
    },
    {
      id: 2,
      title: "Scene 2: Multi-Layer Geospatial Intelligence & Deficit Fusion",
      duration: 18,
      tab: 'map',
      country: 'BR',
      voiceover: "Our interactive GIS engine fuses real-time citizen demand hotspots with census demographic vulnerability and baseline infrastructure deficit indices. Policymakers can drill down into any state—from Uttar Pradesh to the Brazilian Sertão or the Eastern Cape—instantly surfacing high-urgency water, road, and power crises.",
      arrowPointer: {
        target: 'top-right-controls',
        arrowDirection: 'up',
        label: 'Toggle GIS Layers: Demand Hotspots, Demographics & Infra Deficits 👉',
        badge: '🗺️ Multi-Layer Spatial Telemetry'
      },
      popups: [
        { text: '🗺️ GIS Spatial Fusion: Demand Hotspots × Census Vulnerability' },
        { text: '📍 Live Anonymized Citizen Outage Telemetry' }
      ]
    },
    {
      id: 3,
      title: "Scene 3: Multilingual Voice & WhatsApp DPI Ingestion",
      duration: 20,
      tab: 'intake_channels',
      country: 'IN',
      triggerConfetti: true,
      voiceover: "Inclusion is our core principle. Non-literate and rural citizens don't need complex forms. They simply speak in their native dialect—via Voice Speech-to-Text, WhatsApp, or a 2G SMS Gateway. Our edge NLU normalizes the dialect, scores urgency from 1 to 100, and issues an unalterable SHA-256 cryptographic verification token.",
      arrowPointer: {
        target: 'center-left',
        arrowDirection: 'down',
        label: 'Interactive WhatsApp DPI Bot & Rural 2G/3G SMS Gateway 👇',
        badge: '🎙️ Voice STT & Dialect Normalization'
      },
      popups: [
        { text: '🎙️ Zero-Friction Voice STT • 40+ Native Dialects' },
        { text: '🔒 SHA-256 Cryptographic DPI Token Receipt' }
      ]
    },
    {
      id: 4,
      title: "Scene 4: Policymaker AI Co-Pilot & Bankable Proposals",
      duration: 20,
      tab: 'copilot',
      country: 'IN',
      voiceover: "Here is where the magic happens for ministers. Our AI Co-Pilot uses explainable Multi-Criteria Decision Analysis to convert raw citizen complaints into structured, bankable project proposals—complete with local currency budgets, targeted beneficiaries, and UN SDG alignment. With one click, ministers can export formal, cabinet-ready Policy Briefs.",
      arrowPointer: {
        target: 'center-right',
        arrowDirection: 'left',
        label: 'Explainable MCDA Decision Breakdown & One-Click PDF Brief Export 👈',
        badge: '🤖 AI Priority Score (94.8/100)'
      },
      popups: [
        { text: '🤖 MCDA Decision Math: Priority = 0.30·Demand + 0.25·Deficit...' },
        { text: '📄 One-Click Printable Executive Briefs (PDF)' }
      ]
    },
    {
      id: 5,
      title: "Scene 5: 'What-If' Capital Scenario & Pareto Simulator",
      duration: 18,
      tab: 'simulator',
      country: 'IN',
      voiceover: "Budget planning is no longer guesswork. Our Pareto Knapsack Simulator lets planners test capital constraints in real-time. As the budget slider moves, the AI algorithm dynamically optimizes capital distribution to maximize human lives impacted per dollar spent—eliminating spatial bias and slashing fiscal waste by 42%.",
      arrowPointer: {
        target: 'center-top',
        arrowDirection: 'down',
        label: 'Drag Budget Slider to Dynamically Rebalance National Capital 👇',
        badge: '📊 Pareto Knapsack Optimization'
      },
      popups: [
        { text: '📊 Dynamic Pareto Knapsack Optimization' },
        { text: '⚡ -42% Fiscal Waste vs Traditional Tenders' }
      ]
    },
    {
      id: 6,
      title: "Scene 6: 6-Stage Citizen Tracker & 100% DPGA Compliance",
      duration: 18,
      tab: 'tracker',
      country: 'IN',
      voiceover: "Citizens enjoy full transparency through our 6-stage tracker. And because BRICS InfraPulse AI is built as a true Digital Public Good, it is 100% compliant with the DPGA 9 Core Criteria, featuring open JSON-LD schemas and Beckn-DPI cross-border interoperability.",
      arrowPointer: {
        target: 'center-left',
        arrowDirection: 'down',
        label: 'End-to-End Cryptographic Audit Trail (Ingested ➔ Construction) 👇',
        badge: '🔍 6-Stage Governance Pipeline'
      },
      popups: [
        { text: '🔍 6-Stage Cryptographic Governance Lifecycle' },
        { text: '🛡️ 100% UN DPGA & Beckn Compliant' }
      ]
    },
    {
      id: 7,
      title: "Scene 7: Closing Vision & Team TechDrive Call to Action",
      duration: 16,
      tab: 'map',
      country: 'IN',
      triggerConfetti: true,
      voiceover: "BRICS InfraPulse AI transforms silent citizen suffering into sovereign infrastructure intelligence. Scalable. Multilingual. Open. Sovereign. Built for Code for Communities 2.0 by Team TechDrive. Thank you!",
      arrowPointer: {
        target: 'top-center',
        arrowDirection: 'up',
        label: 'Transforming 3.6 Billion Citizen Voices into Sovereign Infrastructure 👆',
        badge: '🏆 Team TechDrive'
      },
      popups: [
        { text: '🌐 BRICS InfraPulse AI • Digital Public Infrastructure' },
        { text: '🏆 Built by Team TechDrive • Hack2Skill' }
      ]
    }
  ];

  const currentScene = SCENES[currentSceneIdx];

  // Play / Pause toggle
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  // Execution cycle
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      speechService.stop();
      return;
    }

    const scene = SCENES[currentSceneIdx];
    
    // Switch tabs & country
    onSelectTab(scene.tab);
    if (scene.country) onSelectCountry(scene.country);

    if (scene.triggerConfetti) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    }

    if (!isAudioMuted) {
      speechService.speak(scene.voiceover, 'en-US');
    }

    let elapsed = 0;
    const intervalMs = 100;
    const totalMs = scene.duration * 1000;

    timerRef.current = setInterval(() => {
      elapsed += intervalMs;
      setProgressPct((elapsed / totalMs) * 100);

      if (elapsed >= totalMs) {
        clearInterval(timerRef.current);
        if (currentSceneIdx < SCENES.length - 1) {
          setCurrentSceneIdx(prev => prev + 1);
          setProgressPct(0);
        } else {
          setIsPlaying(false);
          setProgressPct(100);
        }
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSceneIdx, isAudioMuted]);

  const handleNextScene = () => {
    if (currentSceneIdx < SCENES.length - 1) {
      setCurrentSceneIdx(prev => prev + 1);
      setProgressPct(0);
    }
  };

  const handleReset = () => {
    setCurrentSceneIdx(0);
    setProgressPct(0);
    setIsPlaying(true);
  };

  // Pointer positioning logic based on target
  const getPointerStyle = (target) => {
    switch (target) {
      case 'top-center':
        return { top: '80px', left: '50%', transform: 'translateX(-50%)' };
      case 'top-right-controls':
        return { top: '140px', right: '480px' };
      case 'center-left':
        return { top: '240px', left: '160px' };
      case 'center-right':
        return { top: '220px', right: '120px' };
      case 'center-top':
        return { top: '180px', left: '50%', transform: 'translateX(-50%)' };
      default:
        return { top: '120px', left: '50%', transform: 'translateX(-50%)' };
    }
  };

  return (
    <>
      {/* 1. DYNAMIC ANIMATED ARROW MARKING & EXPLANATION CALLOUT */}
      {currentScene.arrowPointer && (
        <div 
          className="animated-pointer-callout animate-fade-in"
          style={{
            position: 'fixed',
            zIndex: 2200,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            ...getPointerStyle(currentScene.arrowPointer.target),
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Animated Bouncing Arrow */}
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(2, 132, 199, 0.45), 0 0 15px rgba(255,255,255,0.8)',
            border: '2px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '800',
            animation: 'bounceFloat 2s infinite ease-in-out'
          }}>
            <span className="live-pulse-dot" style={{ background: '#38bdf8' }}></span>
            <span>{currentScene.arrowPointer.label}</span>
          </div>

          <span className="badge badge-emerald" style={{ fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            ✨ {currentScene.arrowPointer.badge}
          </span>
        </div>
      )}

      {/* 2. CINEMA-STYLE CLOSED CAPTION SUBTITLES (High Legibility Black/Charcoal Pill) */}
      <div 
        className="cinema-subtitles-bar animate-fade-in"
        style={{
          position: 'fixed',
          bottom: '86px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2300,
          width: '90%',
          maxWidth: '920px',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '16px',
          padding: '12px 20px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(2, 132, 199, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#0284c7',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 10px rgba(2, 132, 199, 0.6)'
        }}>
          <Volume2 size={16} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#38bdf8' }}>
              CC • Realistic Neural Female AI Narrator [{currentScene.title.split(':')[0]}]
            </span>
            <span className="badge badge-amber" style={{ padding: '1px 6px', fontSize: '9px' }}>Natural Pitch & Cadence</span>
          </div>
          <div style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '500', lineHeight: 1.45, letterSpacing: '0.2px' }}>
            "{currentScene.voiceover}"
          </div>
        </div>

        {/* Small Pop-Up Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          {currentScene.popups.map((p, idx) => (
            <span key={idx} className="badge badge-cyan" style={{ fontSize: '9px', padding: '3px 8px' }}>
              {p.text}
            </span>
          ))}
        </div>
      </div>

      {/* 3. SLEEK NON-INTRUSIVE MINI-CONTROL PLAYER BAR (Bottom Floating Bar) */}
      <div 
        className="mini-theater-player-bar animate-fade-in"
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2300,
          width: '90%',
          maxWidth: '920px',
          background: '#ffffff',
          border: '2px solid #ffffff',
          borderRadius: '30px',
          padding: '8px 20px',
          boxShadow: 'var(--clay-shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-emerald" style={{ fontSize: '10px' }}>
            SCENE {currentSceneIdx + 1} / {SCENES.length}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#1c1917' }}>
            {currentScene.title.split(':')[1] || currentScene.title}
          </span>
        </div>

        {/* Mini Progress Line */}
        <div style={{
          flex: 1,
          height: '5px',
          background: '#e7e2d6',
          borderRadius: '3px',
          overflow: 'hidden',
          maxWidth: '240px'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPct}%`,
            background: 'linear-gradient(to right, #0284c7 0%, #059669 100%)',
            borderRadius: '3px',
            transition: 'width 0.1s linear'
          }} />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button 
            className="btn btn-secondary btn-sm" 
            style={{ padding: '6px 10px', fontSize: '11px' }}
            onClick={() => setIsAudioMuted(prev => !prev)}
            title={isAudioMuted ? "Unmute Voiceover" : "Mute Voiceover"}
          >
            {isAudioMuted ? <VolumeX size={14} className="text-rose-600" /> : <Volume2 size={14} className="text-emerald-600" />}
          </button>

          <button 
            className="btn btn-secondary btn-sm" 
            style={{ padding: '6px 10px' }}
            onClick={handleReset} 
            title="Restart Tour"
          >
            <RotateCcw size={14} />
          </button>

          <button 
            className={`btn btn-sm ${isPlaying ? 'btn-emerald' : 'btn-primary'}`} 
            style={{ padding: '6px 16px', fontSize: '12px' }}
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm" 
            style={{ padding: '6px 10px' }}
            onClick={handleNextScene} 
            disabled={currentSceneIdx >= SCENES.length - 1}
            title="Next Scene"
          >
            <SkipForward size={14} />
          </button>

          {onClose && (
            <button 
              className="btn btn-ghost btn-sm" 
              style={{ padding: '6px' }}
              onClick={onClose}
              title="Close Video Tour Mode"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Floating Bounce Animation CSS */}
      <style>{`
        @keyframes bounceFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </>
  );
}
