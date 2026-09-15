import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ScanLine, Shield, Users, BookOpen, Clock, BarChart3, 
  Cpu, CheckCircle2, ArrowRight, Sparkles, Database, Lock, 
  Layers, CheckCheck, PlayCircle, Github, ExternalLink, Globe
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const features = [
    { title: "Face Recognition", desc: "High-accuracy biometric face detection and verification using 128-d deep neural embeddings.", icon: Cpu, color: "#2563eb" },
    { title: "Automated Attendance", desc: "Instant automated student attendance logging with zero manual roll call overhead.", icon: CheckCheck, color: "#10b981" },
    { title: "Faculty Management", desc: "Complete faculty allocation to MCA, BCA, B.Tech, and M.Tech departments.", icon: Users, color: "#7c3aed" },
    { title: "Student Management", desc: "Comprehensive student roster with roll numbers, semesters, and face enrollment tracking.", icon: BookOpen, color: "#06b6d4" },
    { title: "Course-wise Attendance", desc: "Strict course and division boundary isolation preventing cross-course scanning errors.", icon: Layers, color: "#f59e0b" },
    { title: "Real-time Attendance", desc: "Live camera scanner with instant visual verification HUD and duplicate scan blocking.", icon: Clock, color: "#ec4899" },
    { title: "Attendance Analytics", desc: "Daily, monthly, and yearly visual attendance trends with CSV export and print preview.", icon: BarChart3, color: "#3b82f6" },
    { title: "Secure PostgreSQL Database", desc: "Full relational database with encrypted authentication and audit trail tracking.", icon: Database, color: "#6366f1" },
  ];

  const steps = [
    { num: "01", title: "Register Student", desc: "Create a student profile with Roll No, Course, Semester, and Division." },
    { num: "02", title: "Enroll Student Face", desc: "Capture real-time biometric face landmarks using the camera studio." },
    { num: "03", title: "Scan Face", desc: "Faculty launches live camera session in the lecture hall." },
    { num: "04", title: "Auto-Mark Attendance", desc: "System recognizes eligible students, marks Present, and flags unknown faces." },
  ];

  const benefits = [
    "Saves valuable faculty lecture time by eliminating manual paper registers",
    "Completely eliminates proxy attendance and human recording errors",
    "Strict unknown person detection prevents unauthorized classroom access",
    "Real-time instant synchronization across Admin and Faculty portals",
    "Course-wise, faculty-wise, and student-wise automated attendance monitoring",
    "Comprehensive monthly and yearly trend reports exportable to CSV format"
  ];

  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', minHeight: '100vh' }}>
      {/* Landing Navbar */}
      <nav className="navbar navbar-expand-lg bg-white sticky-top py-3 border-bottom shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <ScanLine size={24} />
            </div>
            <div>
              <span className="brand-font" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                SmartAttend<span style={{ color: '#2563eb' }}>AI</span>
              </span>
              <span className="d-none d-sm-inline-block ms-2 badge bg-primary-subtle text-primary border border-primary-subtle">
                AI Automation
              </span>
            </div>
          </Link>

          <button 
            className="navbar-toggler border-0 p-2" 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="landingNav">
            <ul className="navbar-nav mx-auto my-3 my-lg-0 fw-semibold gap-lg-3">
              <li className="nav-item"><a className="nav-link text-slate-700" href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
              <li className="nav-item"><a className="nav-link text-slate-700" href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
              <li className="nav-item"><a className="nav-link text-slate-700" href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a></li>
              <li className="nav-item"><a className="nav-link text-slate-700" href="#benefits" onClick={() => setMobileMenuOpen(false)}>Benefits</a></li>
            </ul>
            <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 pt-2 pt-lg-0 border-top border-lg-0">
              <a 
                href="https://github.com/vinithirani/smart-attendance-system" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-outline-dark btn-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 fw-semibold rounded-3"
                title="View Source on GitHub"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
              <Link to="/login" className="btn btn-primary-custom px-4 d-flex align-items-center justify-content-center gap-2">
                Login to Portal <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-gradient py-4 py-lg-6">
        <div className="container py-2 py-md-4">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-7">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <div className="hero-badge">
                  <Sparkles size={16} /> AI-Powered Academic Automation
                </div>
                <div className="badge bg-dark text-white border px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00df8f' }}></span>
                  <span>Vercel Edge Ready</span>
                </div>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.15, fontWeight: 800, color: '#0f172a' }} className="mb-3">
                Smart Attendance System Using <span style={{ color: '#2563eb' }}>Face Recognition</span>
              </h1>
              <p className="lead text-muted mb-4" style={{ fontSize: '1.05rem', maxWidth: '600px' }}>
                Automated, accurate and secure attendance management powered by AI-based face recognition. Built with role-separated portals for Admin/HOD and Faculty.
              </p>
              
              <div className="d-flex flex-wrap gap-2 gap-sm-3 mb-4">
                <Link to="/login" className="btn btn-primary-custom px-4 py-3 hero-cta-btn" style={{ fontSize: '1rem' }}>
                  Login to System <ArrowRight size={18} />
                </Link>
                <a 
                  href="https://github.com/vinithirani/smart-attendance-system" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-outline-dark px-4 py-3 hero-cta-btn d-inline-flex align-items-center gap-2 rounded-3 fw-semibold shadow-sm"
                  style={{ fontSize: '1rem', background: '#ffffff', borderColor: '#cbd5e1' }}
                >
                  <Github size={18} /> View Repository
                </a>
                <a href="#how-it-works" className="btn btn-secondary-custom px-4 py-3 hero-cta-btn" style={{ fontSize: '1rem' }}>
                  <PlayCircle size={18} /> Explore System
                </a>
              </div>

              {/* Highlights - Compact 3-col responsive stats */}
              <div className="hero-stats-row mb-4 mb-lg-0">
                <div className="hero-stat-card">
                  <div className="hero-stat-val text-primary">99.2%</div>
                  <div className="hero-stat-lbl">Face Recognition Precision</div>
                </div>
                <div className="hero-stat-card">
                  <div className="hero-stat-val text-success">&lt; 0.5s</div>
                  <div className="hero-stat-lbl">Instant Attendance Marking</div>
                </div>
                <div className="hero-stat-card">
                  <div className="hero-stat-val" style={{ color: '#7c3aed' }}>100%</div>
                  <div className="hero-stat-lbl">Proxy Prevention</div>
                </div>
              </div>
            </div>

            {/* Visual AI Graphic */}
            <div className="col-lg-5">
              <div className="hero-visual-card">
                <div className="hero-image-frame">
                  <img 
                    src="/hero-male-employee.jpg" 
                    alt="Employee Facial Biometric Scan"
                  />
                  
                  {/* Realtime Detection HUD Overlay Box */}
                  <div className="hero-hud-reticle">
                    <div className="corner-tl"></div>
                    <div className="corner-tr"></div>
                    <div className="corner-bl"></div>
                    <div className="corner-br"></div>
                    <div className="laser-scan-line"></div>
                  </div>

                  {/* Recognition Live Badge */}
                  <div className="hero-status-pill">
                    <div className="d-flex align-items-center gap-1 gap-sm-2">
                      <span className="text-success fw-bold">✓</span>
                      <span className="fw-semibold text-truncate">Face Biometric Verified</span>
                    </div>
                    <span className="badge bg-success px-2 py-1 flex-shrink-0">99.8% Match</span>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
                    <span className="small fw-semibold text-muted">Biometric AI Engine Active</span>
                  </div>
                  <span className="badge bg-primary">PostgreSQL Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-white border-top border-bottom">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="hero-badge mb-2">Comprehensive Capabilities</span>
            <h2 className="brand-font" style={{ fontSize: '2.2rem' }}>State-of-the-Art System Features</h2>
            <p className="text-muted">Designed for real-world college workflows, providing end-to-end automation from student registration to analytics.</p>
          </div>

          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="custom-card h-100 p-4 border transition-all">
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: `${f.color}15`,
                      color: f.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <f.icon size={24} />
                  </div>
                  <h5 className="fw-bold mb-2">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step How It Works Section */}
      <section id="how-it-works" className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="hero-badge mb-2">Simple 4-Step Workflow</span>
            <h2 className="brand-font" style={{ fontSize: '2.2rem' }}>How the Smart Attendance Works</h2>
            <p className="text-muted">Intuitive biometric attendance flow designed for faculty and academic administrators.</p>
          </div>

          <div className="row g-4">
            {steps.map((s, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="custom-card bg-white h-100 p-4 position-relative">
                  <div 
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: '#e2e8f0',
                      lineHeight: 1,
                      marginBottom: '0.5rem'
                    }}
                  >
                    {s.num}
                  </div>
                  <h5 className="fw-bold mb-2 text-primary">{s.title}</h5>
                  <p className="text-muted small mb-0">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Benefits */}
      <section id="benefits" className="py-5 bg-white border-top">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="hero-badge mb-2">Why Switch to AI Attendance?</span>
              <h2 className="brand-font mb-4" style={{ fontSize: '2.2rem' }}>
                Key Benefits for Academic Institutions
              </h2>
              <div className="d-flex flex-column gap-3">
                {benefits.map((b, i) => (
                  <div key={i} className="d-flex align-items-start gap-3">
                    <div className="text-success mt-1">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="fw-medium text-slate-700">{b}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 rounded-4 bg-slate-900 text-white shadow-xl">
                <h4 className="fw-bold text-white mb-3">Technology & Cloud Stack</h4>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <span className="badge bg-primary px-3 py-2">React.js 18</span>
                  <span className="badge bg-info text-dark px-3 py-2">FastAPI Python</span>
                  <span className="badge bg-success px-3 py-2">PostgreSQL Database</span>
                  <span className="badge bg-secondary px-3 py-2">Computer Vision AI</span>
                  <span className="badge bg-warning text-dark px-3 py-2">Bootstrap 5</span>
                  <span className="badge bg-dark border border-secondary text-light px-3 py-2 d-inline-flex align-items-center gap-1">
                    <Github size={13} /> GitHub Actions CI/CD
                  </span>
                  <span className="badge bg-light text-dark px-3 py-2 d-inline-flex align-items-center gap-1">
                    ▲ Vercel Edge Hosting
                  </span>
                </div>
                <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="small text-slate-400 mb-1">Academic Project Scope</div>
                  <div className="fw-semibold text-white">MCA Final Year Project — AI Automation Domain</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-5 border-top border-slate-800">
        <div className="container">
          <div className="row g-4 justify-content-between">
            <div className="col-lg-4">
              <div className="brand-font text-white mb-2" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Smart Attendance System Using Face Recognition
              </div>
              <p className="small text-slate-400">
                AI-Powered Smart Attendance Management System automating classroom verification and faculty check-ins.
              </p>
              <div className="d-flex flex-wrap gap-2 mt-3">
                <a 
                  href="https://github.com/vinithirani/smart-attendance-system" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill"
                  style={{ fontSize: '0.8rem' }}
                >
                  <Github size={14} /> GitHub Repository
                </a>
                <a 
                  href="https://frontend-five-tan-77.vercel.app" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill"
                  style={{ fontSize: '0.8rem' }}
                >
                  ▲ Deployed on Vercel
                </a>
              </div>
            </div>

            <div className="col-lg-2">
              <div className="text-white fw-bold mb-3">Courses Supported</div>
              <ul className="list-unstyled small d-flex flex-column gap-1">
                <li>MCA (Master of Computer Apps)</li>
                <li>BCA (Bachelor of Computer Apps)</li>
                <li>B.Tech (Computer Science)</li>
                <li>M.Tech (AI & Data Science)</li>
              </ul>
            </div>

            <div className="col-lg-3">
              <div className="text-white fw-bold mb-3">Faculty Cohort</div>
              <ul className="list-unstyled small d-flex flex-column gap-1">
                <li>• Devanshi Patel (MCA Lead)</li>
                <li>• Risha Tiwari (BCA Lead)</li>
                <li>• Dhruv Patel (B.Tech Lead)</li>
                <li>• Shyam Chavda (M.Tech Lead)</li>
              </ul>
            </div>

            <div className="col-lg-3">
              <div className="text-white fw-bold mb-3">Resources & Deployment</div>
              <ul className="list-unstyled small d-flex flex-column gap-2">
                <li>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 text-decoration-none d-flex align-items-center gap-1 hover-text-white">
                    <Github size={14} /> GitHub Source Code <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-slate-400 text-decoration-none d-flex align-items-center gap-1 hover-text-white">
                    ▲ Vercel Cloud Hosting <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <Link to="/login" className="text-slate-400 text-decoration-none d-flex align-items-center gap-1 hover-text-white">
                    <Shield size={14} /> System Portals Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-4 mt-4 border-top border-slate-800 small text-slate-500">
            © {new Date().getFullYear()} Smart Attendance System Using Face Recognition. Academic MCA Project. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
