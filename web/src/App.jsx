import React, { useState } from 'react'
import HandController from './components/HandController'
import { Monitor, Mouse, Download, Cpu, ShieldCheck, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

function App() {
  const [lastAction, setLastAction] = useState('Wait for detection...')

  const handleGesture = (action, data) => {
    if (action === 'scroll') {
      window.scrollBy(0, data.delta);
      setLastAction(`Scrolling...`);
      return;
    }

    setLastAction(`${action.toUpperCase()} at ${Math.round(data.x)}, ${Math.round(data.y)}`);

    if (action === 'click' || action === 'double-click' || action === 'right-click') {
      const element = document.elementFromPoint(data.x, data.y);
      if (element) {
        if (action === 'right-click') {
          // Trigger context menu or custom behavior
          element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
        } else if (action === 'double-click') {
          element.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        } else {
          element.click();
        }
        element.style.transform = 'scale(0.95)';
        setTimeout(() => element.style.transform = '', 100);
      }
    }
  }

  return (
    <div className="app-container">
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>

      {/* Header */}
      <nav className="glass" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={24} color="var(--neon-blue)" />
          <span style={{ fontWeight: 800, letterSpacing: '2px', fontSize: '1.2rem' }}>AERO MOUSE</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#demo" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Demo</a>
          <a href="#guide" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Guide</a>
          <button className="btn-primary"
            onClick={() => document.getElementById('download').scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '0.5rem 1.5rem' }}>
            Get Local App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Control Your World,<br />With a Wave.
        </motion.h1>
        <p className="subtitle">
          Experience the future of human-computer interaction with AI-driven<br />
          hand gesture recognition. No hardware. No limits.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
          <button className="btn-primary" onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })}>
            Try Online Demo
          </button>
          <button className="glass"
            onClick={() => document.getElementById('guide').scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '1rem 2rem', borderRadius: '50px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
            View Documentation
          </button>
        </div>
      </section>

      {/* Quick Start Guide Section */}
      <section id="guide" style={{ marginBottom: '8rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Quick Start Guide</h2>
        <div className="glass glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div>
              <h4 style={{ color: 'var(--neon-blue)', marginBottom: '1rem' }}>1. Positioning</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Keep your hand 1-3 feet away from the camera in a well-lit area.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--neon-blue)', marginBottom: '1rem' }}>2. Movement</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Point with your index finger. The cursor follows its tip.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--neon-blue)', marginBottom: '1rem' }}>3. Interaction</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pinch thumb and index together to perform a "Virtual Click".</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--neon-blue)', marginBottom: '1rem' }}>4. Troubleshooting</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>If tracking stops, pull your hand out of frame and bring it back.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" style={{ marginBottom: '8rem' }}>
        <div className="glass glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Live Neural Interface</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Our proprietary neural engine maps your hand landmarks to 3D space in real-time.
              <b>Note:</b> This demo controls a <i>virtual cursor</i> inside this tab. To control your actual Windows mouse, use the Local Controller below.
            </p>

            <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid var(--neon-blue)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--neon-blue)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>System Status</p>
              <p style={{ fontWeight: 500, fontFamily: 'monospace' }}>{lastAction}</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="glass btn-demo" style={{ flex: 1, padding: '1rem', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Option Alpha</button>
              <button className="glass btn-demo" style={{ flex: 1, padding: '1rem', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Option Beta</button>
            </div>
          </div>

          <HandController onGesture={handleGesture} />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ marginBottom: '8rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Why Aero Mouse?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div className="glass glass-card">
            <Monitor size={32} color="var(--neon-blue)" style={{ marginBottom: '1.5rem' }} />
            <h3>Zero Latency</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Optimized WebAssembly execution for real-time 60FPS tracking.</p>
          </div>
          <div className="glass glass-card">
            <Cpu size={32} color="var(--neon-purple)" style={{ marginBottom: '1.5rem' }} />
            <h3>Edge AI</h3>
            <p style={{ color: 'var(--text-secondary)' }}>All processing happens in your browser. Your data never leaves your device.</p>
          </div>
          <div className="glass glass-card">
            <ShieldCheck size={32} color="#00ff62" style={{ marginBottom: '1.5rem' }} />
            <h3>Secure Control</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Failsafe triggers ensure you always have total manual override.</p>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="glass" style={{ padding: '4rem', textAlign: 'center', background: 'linear-gradient(45deg, rgba(0, 243, 255, 0.05), rgba(188, 19, 254, 0.05))' }}>
        <Download size={48} style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready for System Control?</h2>
        <p className="subtitle">
          Due to browser security, websites cannot control your PC's cursor directly. <br />
          Download the <b>local Python bridge</b> to unlock full system-wide hand control.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto 3rem', textAlign: 'left' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
            <div style={{ background: 'var(--neon-blue)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', marginBottom: '1rem' }}>1</div>
            <h4 style={{ color: 'var(--neon-blue)', marginBottom: '0.5rem' }}>Extract ZIP</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Right-click the downloaded file and select "Extract All".</p>
          </div>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
            <div style={{ background: 'var(--neon-purple)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', marginBottom: '1rem' }}>2</div>
            <h4 style={{ color: 'var(--neon-purple)', marginBottom: '0.5rem' }}>Run Setup</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Double-click the <b>setup.bat</b> file in the folder.</p>
          </div>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
            <div style={{ background: '#00ff62', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', marginBottom: '1rem' }}>3</div>
            <h4 style={{ color: '#00ff62', marginBottom: '0.5rem' }}>Grant Access</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>If Windows warns you, click "More Info" then "Run Anyway".</p>
          </div>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
            <div style={{ background: '#ffde00', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', marginBottom: '1rem' }}>4</div>
            <h4 style={{ color: '#ffde00', marginBottom: '0.5rem' }}>Use & Exit</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Start waving! To stop, move your physical mouse to any corner of the screen or press <b>Esc</b>.</p>
          </div>
        </div>

        <button className="btn-primary"
          onClick={() => {
            const repoUrl = "https://github.com/Fawaz-cmd/aero-mouse";
            if (repoUrl.includes("YOUR_USERNAME")) {
              alert("Please update the repository URL in App.jsx to your own GitHub repo to enable the download!");
            } else {
              window.open(`${repoUrl}/archive/refs/heads/main.zip`, '_blank');
            }
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', margin: '0 auto' }}>
          <Download size={20} />
          Download Controller (.ZIP)
        </button>
      </section>

      <footer style={{ marginTop: '8rem', padding: '4rem 0', borderTop: '1px solid var(--glass-border)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '0.5rem' }}>© 2026 Aero Mouse AI. All rights reserved.</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Developed with ❤️ by <span style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>Fawaz</span>
        </p>
      </footer>

      <style jsx>{`
        h3 { margin-bottom: 1rem; font-size: 1.3rem; }
        .btn-demo:hover { background: rgba(0, 243, 255, 0.1); border-color: var(--neon-blue); }
      `}</style>
    </div >
  )
}

export default App
