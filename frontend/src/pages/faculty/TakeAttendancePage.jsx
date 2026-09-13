import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, CheckCircle2, AlertTriangle, Play, Square, 
  RefreshCw, Sparkles, Clock, UserX, User, 
  Check, ShieldCheck, Zap, Users, AlertCircle, ArrowRight,
  Volume2, VolumeX, Pause, RefreshCcw, UserPlus
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function TakeAttendancePage() {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  // Session & Academic Info
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(1);
  const [semester, setSemester] = useState(2);
  const [division, setDivision] = useState('A');
  const [subject, setSubject] = useState('Cloud Computing & AI Architecture');
  const [session, setSession] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Real-time Session KPI stats
  const [totalStudents, setTotalStudents] = useState(50);
  const [presentCount, setPresentCount] = useState(32);
  const [absentCount, setAbsentCount] = useState(18);
  const [attendanceRate, setAttendanceRate] = useState(64);

  // Recognition / Scanner State Machine
  // state: 'READY' | 'DETECTING' | 'VERIFIED' | 'ALREADY_PRESENT' | 'UNKNOWN' | 'MULTIPLE_FACES' | 'CAMERA_ERROR'
  const [scannerState, setScannerState] = useState('READY');
  const [detectedStudent, setDetectedStudent] = useState(null);
  const [faceCount, setFaceCount] = useState(0); // 0, 1, or 2+
  const [isProcessing, setIsProcessing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enrolled student simulation pool
  const [enrolledPool, setEnrolledPool] = useState([]);
  const [currentPoolIndex, setCurrentPoolIndex] = useState(0);

  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Session, Faculty & Enrolled Database
  useEffect(() => {
    async function init() {
      try {
        const [facs, crs, activeSess, studentsRes] = await Promise.all([
          api.getFaculty(),
          api.getCourses(),
          api.getActiveSession(),
          api.getStudents({ course_id: 1, semester: 2 })
        ]);

        const me = facs.find(f => f.email === user?.email || f.name === user?.name) || facs[0];
        setFaculty(me);
        setCourses(crs);

        // Filter active enrolled students for this course
        const enrolledStudents = studentsRes.filter(s => s.status === 'active' && s.face_enrolled);
        setEnrolledPool(enrolledStudents);

        if (activeSess) {
          setSession(activeSess);
          setSelectedCourseId(activeSess.course_id);
          setSemester(activeSess.semester);
          setDivision(activeSess.division);
          setSubject(activeSess.subject);
          setTotalStudents(activeSess.total_enrolled || 50);
          setPresentCount(activeSess.present_count || 32);
          setAbsentCount(activeSess.absent_count || 18);
          const rate = activeSess.total_enrolled ? Math.round((activeSess.present_count / activeSess.total_enrolled) * 100) : 64;
          setAttendanceRate(rate);
        } else {
          // Auto create active session
          const newSess = await api.startAttendanceSession({
            faculty_id: me?.id || 1,
            course_id: 1,
            semester: 2,
            division: 'A',
            subject: 'Cloud Computing & AI Architecture'
          }, user);
          setSession(newSess);
          setTotalStudents(50);
          setPresentCount(32);
          setAbsentCount(18);
          setAttendanceRate(64);
        }
        await startCamera();
      } catch (e) {
        console.error("Init live attendance error:", e);
      }
    }
    init();
  }, [user]);

  // Start Camera Feed
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera fallback active:", err);
      setCameraActive(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // Play synthetic tone on scan
  const playBeep = (type = 'success') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      if (type === 'success') {
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime); // Low A3
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {}
  };

  // ==========================================
  // CORE FACE RECOGNITION LOGIC (1 AT A TIME)
  // ==========================================

  // CASE 1 & CASE 3: Scan single enrolled student face
  const handleScanSingleEnrolled = async (specificStudent = null) => {
    if (isProcessing || isPaused) return;

    setIsProcessing(true);
    setScannerState('DETECTING');
    setFaceCount(1);

    // Pick next student in rotation or specific student
    let target = specificStudent;
    if (!target) {
      if (enrolledPool.length > 0) {
        target = enrolledPool[currentPoolIndex % enrolledPool.length];
        setCurrentPoolIndex(prev => prev + 1);
      } else {
        target = {
          id: 101,
          name: "Bhavesh Gohil",
          enrollment_number: "EN2024MCA509",
          student_id: "STU-MCA-509",
          course_name: "MCA",
          semester: 2
        };
      }
    }

    try {
      if (session) {
        const res = await api.recognizeFace(session.id, "matched_enrolled", target.id);
        
        if (res.already_marked) {
          playBeep('success');
          setScannerState('ALREADY_PRESENT');
          setDetectedStudent({
            name: target.name,
            enrollment_number: target.enrollment_number,
            student_id: target.student_id || `STU-MCA-${target.id}`,
            course: target.course_name || 'MCA',
            semester: target.semester || 2,
            confidence: '98.8%',
            status: 'PRESENT',
            recordedAt: res.recognition_time || currentTime,
            alreadyPresent: true
          });
          addToast(`✓ ${target.name} is already recorded Present`, 'info');
        } else {
          playBeep('success');
          setScannerState('VERIFIED');
          const timeRecorded = new Date().toLocaleTimeString();
          setDetectedStudent({
            name: target.name,
            enrollment_number: target.enrollment_number,
            student_id: target.student_id || `STU-MCA-${target.id}`,
            course: target.course_name || 'MCA',
            semester: target.semester || 2,
            confidence: '98.8%',
            status: 'PRESENT',
            recordedAt: timeRecorded,
            alreadyPresent: false
          });

          // Update real-time stats
          setPresentCount(prev => Math.min(totalStudents, prev + 1));
          setAbsentCount(prev => Math.max(0, prev - 1));
          setAttendanceRate(prev => Math.min(100, Math.round(((presentCount + 1) / totalStudents) * 100)));
          addToast(`✓ Verified & Marked Present: ${target.name}`, 'success');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // CASE 2: Unknown Person (Face not in database)
  const handleTestUnknownPerson = async () => {
    if (isProcessing || isPaused) return;

    setIsProcessing(true);
    setScannerState('DETECTING');
    setFaceCount(1);

    setTimeout(() => {
      playBeep('error');
      setScannerState('UNKNOWN');
      setDetectedStudent(null);
      addToast('⚠️ UNKNOWN PERSON: Face not found in database. Attendance NOT marked.', 'warning');
      setIsProcessing(false);
    }, 400);
  };

  // CASE 4: Multiple Faces Detected (2+ People) -> Block Scanner
  const handleTestMultipleFaces = () => {
    if (isPaused) return;
    playBeep('error');
    setFaceCount(2);
    setScannerState('MULTIPLE_FACES');
    setDetectedStudent(null);
    addToast('⚠️ MULTIPLE FACES DETECTED: Attendance blocked. Please keep only 1 student.', 'error');
  };

  // CASE 5: No Face in Frame (Ready State)
  const handleResetFrame = () => {
    setFaceCount(0);
    setScannerState('READY');
    setDetectedStudent(null);
  };

  // Switch Course / Class
  const handleSwitchClass = async (courseId) => {
    try {
      const c = courses.find(item => item.id === Number(courseId));
      if (!c) return;
      setSelectedCourseId(c.id);
      const newSub = c.id === 1 ? 'Cloud Computing & AI Architecture' : `${c.course_code} Core Architecture`;
      setSubject(newSub);
      
      const newSess = await api.startAttendanceSession({
        faculty_id: faculty?.id || 1,
        course_id: c.id,
        semester: c.id === 3 ? 4 : 2,
        division: 'A',
        subject: newSub
      }, user);
      
      setSession(newSess);
      handleResetFrame();
      addToast(`Switched Live Session to ${c.course_name}!`, 'info');
    } catch (e) {
      addToast('Failed to switch class', 'error');
    }
  };

  // Refresh Session
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (session) {
        const res = await api.getSessionRoster(session.id);
        if (res.session) {
          setPresentCount(res.session.present_count || presentCount);
          setAbsentCount(res.session.absent_count || absentCount);
        }
      }
      addToast('Session data synchronized', 'info');
    } catch (e) {
      addToast('Refresh failed', 'error');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // End Session
  const handleEndSession = async () => {
    if (!session) return;
    try {
      await api.endAttendanceSession(session.id, user);
      stopCamera();
      addToast('Attendance session finalized & saved successfully!', 'success');
      navigate('/faculty/dashboard');
    } catch (e) {
      addToast('Failed to end session', 'error');
    }
  };

  return (
    <div className="pb-5">
      {/* ================= 1. TOP HEADER ================= */}
      <div className="custom-card p-3 mb-4 bg-white border-0 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          {/* Faculty Portal & Course Info */}
          <div className="d-flex align-items-center gap-3">
            <div 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
              }}
            >
              <Camera size={24} />
            </div>

            <div>
              <div className="d-flex align-items-center gap-2 mb-0.5">
                <span className="badge bg-primary px-2 py-0.5" style={{ fontSize: '0.72rem' }}>
                  FACULTY PORTAL
                </span>
                <h5 className="fw-bold text-dark mb-0 brand-font">{subject}</h5>
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-0.5 small d-flex align-items-center gap-1">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} className="spin"></span>
                  LIVE ATTENDANCE
                </span>
              </div>
              <div className="text-muted small">
                Class: <strong>MCA - Sem {semester} ({division})</strong> • Faculty: <strong>{faculty?.name || 'Devanshi Patel'}</strong> • Session Time: <strong>{currentTime}</strong>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Class Switcher */}
            <select 
              className="form-select form-select-sm fw-bold border-secondary-subtle"
              style={{ width: 'auto' }}
              value={selectedCourseId}
              onChange={(e) => handleSwitchClass(Number(e.target.value))}
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.course_code} - Sem {c.id === 3 ? 4 : 2}</option>
              ))}
            </select>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn btn-light border btn-sm px-2.5 py-2 text-secondary"
              title="Refresh Session"
            >
              <RefreshCw size={15} className={isRefreshing ? 'spin' : ''} />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="btn btn-light border btn-sm px-2.5 py-2 text-secondary"
              title={soundEnabled ? "Mute Sound" : "Enable Sound"}
            >
              {soundEnabled ? <Volume2 size={15} className="text-primary" /> : <VolumeX size={15} />}
            </button>

            {/* End Session Button */}
            <button 
              onClick={handleEndSession}
              className="btn btn-danger btn-sm px-3 py-2 fw-bold d-flex align-items-center gap-1 shadow-sm"
            >
              <Square size={14} /> End Session
            </button>
          </div>
        </div>
      </div>

      {/* ================= 2. SESSION STATISTICS KPI CARDS ================= */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="custom-card p-3 bg-white border-0 shadow-sm d-flex align-items-center gap-3">
            <div className="stat-icon-wrapper bg-primary-subtle text-primary" style={{ width: '44px', height: '44px' }}>
              <Users size={22} />
            </div>
            <div>
              <div className="text-muted small fw-semibold" style={{ fontSize: '0.74rem' }}>TOTAL STUDENTS</div>
              <h4 className="fw-bold text-dark mb-0">{totalStudents}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="custom-card p-3 bg-white border-0 shadow-sm d-flex align-items-center gap-3">
            <div className="stat-icon-wrapper bg-success-subtle text-success" style={{ width: '44px', height: '44px' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="text-success small fw-semibold" style={{ fontSize: '0.74rem' }}>PRESENT</div>
              <h4 className="fw-bold text-success mb-0">{presentCount}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="custom-card p-3 bg-white border-0 shadow-sm d-flex align-items-center gap-3">
            <div className="stat-icon-wrapper bg-warning-subtle text-warning" style={{ width: '44px', height: '44px' }}>
              <AlertCircle size={22} />
            </div>
            <div>
              <div className="text-warning small fw-semibold" style={{ fontSize: '0.74rem' }}>ABSENT</div>
              <h4 className="fw-bold text-dark mb-0">{absentCount}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="custom-card p-3 bg-white border-0 shadow-sm d-flex align-items-center gap-3">
            <div className="stat-icon-wrapper bg-info-subtle text-info" style={{ width: '44px', height: '44px' }}>
              <Zap size={22} />
            </div>
            <div>
              <div className="text-info small fw-semibold" style={{ fontSize: '0.74rem' }}>ATTENDANCE RATE</div>
              <h4 className="fw-bold text-primary mb-0">{attendanceRate}%</h4>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. MAIN WORKSPACE: LARGE SCANNER + CURRENT STUDENT ================= */}
      <div className="row g-4">
        {/* ================= LEFT / CENTER: LARGE AI CAMERA SCANNER ================= */}
        <div className="col-lg-7">
          <div className="custom-card p-3 bg-white border-0 shadow-sm">
            {/* Scanner Area Header */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center gap-2">
                <span 
                  style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: scannerState === 'MULTIPLE_FACES' ? '#ef4444' : '#10b981'
                  }}
                  className="spin"
                ></span>
                <span className="fw-bold small text-dark">LIVE AI FACE RECOGNITION</span>
              </div>
              
              {/* Face Count Status Pill */}
              <span 
                className={`badge px-2.5 py-1 ${
                  scannerState === 'MULTIPLE_FACES' ? 'bg-danger text-white' :
                  scannerState === 'READY' ? 'bg-secondary text-white' :
                  'bg-success text-white'
                }`}
                style={{ fontSize: '0.74rem' }}
              >
                {scannerState === 'MULTIPLE_FACES' ? '2 FACES DETECTED' :
                 scannerState === 'READY' ? 'NO FACE DETECTED' :
                 '1 FACE DETECTED'}
              </span>
            </div>

            {/* Dark Camera Viewport Area */}
            <div className="scanner-viewport-container mb-3 position-relative" style={{ minHeight: '440px' }}>
              <video 
                ref={videoRef} 
                playsInline 
                muted 
                className="video-feed"
              />

              {/* Scanner Top Status Banner */}
              <div 
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  right: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  zIndex: 20
                }}
              >
                <span className="badge bg-dark bg-opacity-75 text-white border border-secondary px-2.5 py-1 small d-flex align-items-center gap-1.5">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38bdf8' }}></span>
                  SINGLE-STUDENT BIOMETRIC LOCK
                </span>
                <span className="badge bg-dark bg-opacity-75 text-slate-300 border border-secondary px-2.5 py-1 small">
                  98.8% THRESHOLD
                </span>
              </div>

              {/* ================= CASE 4: MULTIPLE FACES DETECTED (BLOCKED STATE) ================= */}
              {scannerState === 'MULTIPLE_FACES' && (
                <>
                  {/* Dual Warning Detection Boxes */}
                  <div className="multi-face-box" style={{ width: '150px', height: '180px', top: '25%', left: '15%' }}></div>
                  <div className="multi-face-box" style={{ width: '150px', height: '180px', top: '25%', right: '15%' }}></div>

                  {/* Blocked Overlay Banner */}
                  <div className="scanner-blocked-overlay">
                    <div className="text-center p-4 bg-dark bg-opacity-90 rounded-4 border border-danger shadow-lg" style={{ maxWidth: '380px' }}>
                      <AlertTriangle size={48} className="text-danger mb-2" />
                      <h5 className="fw-bold text-white mb-1">MULTIPLE FACES DETECTED</h5>
                      <p className="text-danger-subtle small mb-3">
                        Only one student can stand in front of the camera. Attendance is strictly blocked.
                      </p>
                      <button 
                        onClick={handleResetFrame}
                        className="btn btn-outline-light btn-sm px-3 py-1.5 fw-semibold"
                      >
                        Reset to 1 Student
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ================= SINGLE FACE BOUNDING BOX (CASES 1, 2, 3, 5) ================= */}
              {scannerState !== 'MULTIPLE_FACES' && (
                <div 
                  className={`scanner-target-box ${
                    (scannerState === 'VERIFIED' || scannerState === 'ALREADY_PRESENT') ? 'success' : 
                    scannerState === 'UNKNOWN' ? 'unknown' : ''
                  }`}
                  style={{ zIndex: 15 }}
                >
                  {/* TOP FLOATING NAME LABEL OVER THE SQUARE */}
                  <div 
                    className={`face-square-label-top ${
                      (scannerState === 'VERIFIED' || scannerState === 'ALREADY_PRESENT') ? 'label-success' :
                      scannerState === 'UNKNOWN' ? 'label-unknown' : ''
                    }`}
                  >
                    {scannerState === 'VERIFIED' && (
                      <>
                        <CheckCircle2 size={16} className="text-white" />
                        <span>✓ {detectedStudent?.name}</span>
                      </>
                    )}
                    {scannerState === 'ALREADY_PRESENT' && (
                      <>
                        <CheckCircle2 size={16} className="text-white" />
                        <span>✓ {detectedStudent?.name}</span>
                      </>
                    )}
                    {scannerState === 'UNKNOWN' && (
                      <>
                        <AlertTriangle size={16} className="text-white" />
                        <span>UNKNOWN PERSON</span>
                      </>
                    )}
                    {scannerState === 'DETECTING' && (
                      <>
                        <RefreshCw size={14} className="spin text-white" />
                        <span>Analyzing Face...</span>
                      </>
                    )}
                    {scannerState === 'READY' && (
                      <>
                        <Zap size={15} className="text-info" />
                        <span>SCAN READY</span>
                      </>
                    )}
                  </div>

                  {/* Corner Reticles */}
                  <div className="corner-tl"></div>
                  <div className="corner-tr"></div>
                  <div className="corner-bl"></div>
                  <div className="corner-br"></div>
                  {scannerState === 'READY' && <div className="laser-scan-line"></div>}

                  {/* BOTTOM FLOATING STATUS LABEL ON THE SQUARE */}
                  <div 
                    className={`face-square-label-bottom ${
                      (scannerState === 'VERIFIED' || scannerState === 'ALREADY_PRESENT') ? 'label-success' :
                      scannerState === 'UNKNOWN' ? 'label-unknown' : ''
                    }`}
                  >
                    {scannerState === 'VERIFIED' && (
                      <span>{detectedStudent?.confidence || '98.8%'} MATCH</span>
                    )}
                    {scannerState === 'ALREADY_PRESENT' && (
                      <span>ALREADY RECORDED</span>
                    )}
                    {scannerState === 'UNKNOWN' && (
                      <span>NOT ENROLLED</span>
                    )}
                    {scannerState === 'DETECTING' && (
                      <span>Verifying identity...</span>
                    )}
                    {scannerState === 'READY' && (
                      <span>NO FACE DETECTED</span>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Instruction Tag */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '0',
                  right: '0',
                  textAlign: 'center',
                  zIndex: 20
                }}
              >
                <span className="badge bg-dark bg-opacity-80 text-white px-3 py-1.5" style={{ fontSize: '0.75rem', letterSpacing: '0.02em' }}>
                  Please stand one student at a time in front of camera
                </span>
              </div>
            </div>

            {/* Clean Minimal Scan Controls */}
            <div className="p-3 bg-light rounded-3 border">
              <div className="d-flex align-items-center justify-content-between mb-2.5">
                <span className="small fw-bold text-dark">Scanner Face Controls:</span>
                <span className="text-muted" style={{ fontSize: '0.74rem' }}>Processes strictly 1 person at a time</span>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {/* 1. Scan Student Button (Cycles Bhavesh Gohil, Vinit Hirani, etc.) */}
                <button
                  type="button"
                  onClick={() => handleScanSingleEnrolled()}
                  disabled={isProcessing}
                  className="btn btn-success btn-sm fw-bold px-3 py-2 d-flex align-items-center gap-1.5 shadow-sm flex-fill"
                >
                  <Camera size={16} />
                  <span>{isProcessing ? 'Verifying...' : '📸 Scan Student (1 Face)'}</span>
                </button>

                {/* 2. Test Unknown Face Button */}
                <button
                  type="button"
                  onClick={handleTestUnknownPerson}
                  disabled={isProcessing}
                  className="btn btn-outline-danger btn-sm px-3 py-2 fw-bold d-flex align-items-center gap-1"
                  title="Test unknown person rejection"
                >
                  <UserX size={15} />
                  <span>Test Unknown Face</span>
                </button>

                {/* 3. Test Multiple Faces Button */}
                <button
                  type="button"
                  onClick={handleTestMultipleFaces}
                  className="btn btn-outline-warning text-dark btn-sm px-3 py-2 fw-bold d-flex align-items-center gap-1"
                  title="Test multiple faces blocked condition"
                >
                  <Users size={15} />
                  <span>Test 2+ Faces</span>
                </button>

                {/* 4. Reset Frame Button */}
                <button
                  type="button"
                  onClick={handleResetFrame}
                  className="btn btn-light border btn-sm px-3 py-2 text-secondary"
                  title="Clear face frame"
                >
                  <RefreshCcw size={15} />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: CURRENT STUDENT PANEL ================= */}
        <div className="col-lg-5">
          <div className="custom-card p-4 bg-white border-0 shadow-sm h-100 d-flex flex-column justify-content-between">
            <div>
              {/* Header Title */}
              <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck size={20} className="text-primary" />
                  <h6 className="fw-bold text-dark mb-0 brand-font">CURRENT STUDENT</h6>
                </div>
                <span className="badge bg-light text-dark border px-2 py-1" style={{ fontSize: '0.72rem' }}>
                  Live Identity Feed
                </span>
              </div>

              {/* ================= STATE 5: READY / NO STUDENT DETECTED ================= */}
              {scannerState === 'READY' && (
                <div className="text-center py-5">
                  <div 
                    className="mx-auto mb-3"
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      background: '#f1f5f9',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <User size={38} />
                  </div>
                  <h5 className="fw-bold text-dark mb-1">READY TO SCAN</h5>
                  <p className="text-muted small mb-0" style={{ maxWidth: '280px', margin: '0 auto' }}>
                    Waiting for one student... Position face inside the camera frame.
                  </p>
                </div>
              )}

              {/* ================= STATE: DETECTING / ANALYZING ================= */}
              {scannerState === 'DETECTING' && (
                <div className="text-center py-5">
                  <div 
                    className="mx-auto mb-3"
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <RefreshCw size={36} className="spin" />
                  </div>
                  <h5 className="fw-bold text-dark mb-1">DETECTING FACE...</h5>
                  <p className="text-muted small mb-0">
                    Extracting biometric facial embedding and matching database...
                  </p>
                </div>
              )}

              {/* ================= STATE 1 & 3: ENROLLED STUDENT VERIFIED / ALREADY PRESENT ================= */}
              {(scannerState === 'VERIFIED' || scannerState === 'ALREADY_PRESENT') && detectedStudent && (
                <div>
                  {/* Verified Header Badge */}
                  <div className={`p-2.5 rounded-3 mb-3 d-flex align-items-center justify-content-between ${
                    scannerState === 'ALREADY_PRESENT' ? 'bg-primary-subtle text-primary border border-primary-subtle' :
                    'bg-success-subtle text-success border border-success-subtle'
                  }`}>
                    <div className="d-flex align-items-center gap-2 fw-bold" style={{ fontSize: '0.85rem' }}>
                      <CheckCircle2 size={18} />
                      <span>{scannerState === 'ALREADY_PRESENT' ? '✓ ALREADY PRESENT' : '✓ FACE VERIFIED'}</span>
                    </div>
                    <span className="badge bg-white text-dark border px-2 py-0.5" style={{ fontSize: '0.72rem' }}>
                      Confidence: {detectedStudent.confidence}
                    </span>
                  </div>

                  {/* Student Avatar & Full Name */}
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border mb-3">
                    <div 
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                        flexShrink: 0
                      }}
                    >
                      {detectedStudent.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <h5 className="fw-bold text-dark mb-0">{detectedStudent.name}</h5>
                      <span className="badge bg-dark text-white px-2 py-0.5" style={{ fontSize: '0.72rem' }}>
                        {detectedStudent.course} - Sem {detectedStudent.semester}
                      </span>
                    </div>
                  </div>

                  {/* Student Detailed Information Table */}
                  <div className="p-3 bg-white border rounded-3 mb-3">
                    <div className="row g-2" style={{ fontSize: '0.84rem' }}>
                      <div className="col-5 text-muted">Roll Number:</div>
                      <div className="col-7 fw-bold text-dark font-monospace">{detectedStudent.enrollment_number}</div>

                      <div className="col-5 text-muted">Student ID:</div>
                      <div className="col-7 fw-bold text-dark">{detectedStudent.student_id}</div>

                      <div className="col-5 text-muted">Course / Sem:</div>
                      <div className="col-7 fw-semibold text-dark">{detectedStudent.course} - Semester {detectedStudent.semester}</div>

                      <div className="col-5 text-muted">Recognition:</div>
                      <div className="col-7 fw-bold text-success">{detectedStudent.confidence} Match</div>

                      <div className="col-5 text-muted">Attendance:</div>
                      <div className="col-7">
                        <span className="badge bg-success px-2 py-1 fw-bold" style={{ fontSize: '0.75rem' }}>
                          PRESENT
                        </span>
                      </div>

                      <div className="col-5 text-muted">Recorded At:</div>
                      <div className="col-7 fw-bold text-dark">{detectedStudent.recordedAt}</div>
                    </div>
                  </div>

                  {scannerState === 'ALREADY_PRESENT' && (
                    <div className="p-2.5 bg-light rounded-3 border text-muted small text-center mb-2">
                      ℹ️ Attendance already recorded for this student in current session.
                    </div>
                  )}
                </div>
              )}

              {/* ================= STATE 2: UNKNOWN PERSON ================= */}
              {scannerState === 'UNKNOWN' && (
                <div className="text-center py-4">
                  <div 
                    className="mx-auto mb-3"
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 14px rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    <UserX size={38} />
                  </div>

                  <div className="badge bg-danger px-3 py-1.5 mb-2 fw-bold" style={{ fontSize: '0.85rem' }}>
                    ⚠️ UNKNOWN PERSON
                  </div>

                  <h6 className="fw-bold text-dark mb-1">Face Not Found in Enrolled Database</h6>
                  <p className="text-danger small mb-4">
                    This person is not registered for this course. Attendance cannot be marked.
                  </p>

                  <button
                    onClick={() => navigate('/faculty/enroll')}
                    className="btn btn-primary-custom btn-sm px-4 py-2 fw-bold d-inline-flex align-items-center gap-1.5 shadow"
                  >
                    <UserPlus size={16} /> Enroll Student
                  </button>
                </div>
              )}

              {/* ================= STATE 4: MULTIPLE FACES (BLOCKED) ================= */}
              {scannerState === 'MULTIPLE_FACES' && (
                <div className="text-center py-4">
                  <div 
                    className="mx-auto mb-3"
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      background: 'rgba(234, 88, 12, 0.1)',
                      color: '#ea580c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Users size={38} />
                  </div>

                  <div className="badge bg-warning text-dark px-3 py-1.5 mb-2 fw-bold" style={{ fontSize: '0.85rem' }}>
                    ⚠️ SCANNING BLOCKED
                  </div>

                  <h6 className="fw-bold text-dark mb-1">Multiple People Detected</h6>
                  <p className="text-muted small mb-3">
                    Only one student is allowed in front of camera. Identity recognition is disabled.
                  </p>

                  <div className="p-2.5 bg-danger-subtle text-danger border border-danger-subtle rounded-3 small fw-semibold">
                    Please ask others to step away from the camera.
                  </div>
                </div>
              )}
            </div>

            {/* Right Card Footer Info */}
            <div className="pt-3 border-top d-flex justify-content-between align-items-center text-muted small" style={{ fontSize: '0.74rem' }}>
              <span>Strict 1-to-1 Biometric Matching</span>
              <span>Session ID: #{session?.id || 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
