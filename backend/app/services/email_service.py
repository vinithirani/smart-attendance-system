import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from typing import Dict, Any, List
import logging

logger = logging.getLogger("attendance_mailer")

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "vickyhirani8842@gmail.com"
SMTP_PASSWORD = "yadb bizm klwg ihbt"

def build_present_email_html(student_name: str, enrollment_no: str, subject: str, course: str, semester: int, division: str, date_str: str, time_str: str, stats: Dict[str, Any]) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }}
            .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }}
            .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 24px; text-align: center; }}
            .content {{ padding: 24px; line-height: 1.6; }}
            .status-badge {{ display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 14px; }}
            .stats-box {{ background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0; }}
            .stats-grid {{ display: flex; justify-content: space-around; text-align: center; }}
            .stat-item {{ padding: 8px; }}
            .stat-val {{ font-size: 18px; font-weight: bold; color: #0f172a; }}
            .stat-lbl {{ font-size: 12px; color: #64748b; text-transform: uppercase; }}
            .footer {{ background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; font-size: 12px; color: #64748b; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <h2 style="margin: 0; font-size: 22px;">Smart Attendance System</h2>
                <p style="margin: 6px 0 0; opacity: 0.9; font-size: 14px;">Attendance Confirmation Notice</p>
            </div>
            <div class="content">
                <p>Dear <strong>{student_name}</strong> (Roll No: <code>{enrollment_no}</code>),</p>
                <p>
                    Your attendance for today's lecture has been successfully recorded as:
                </p>
                <div style="text-align: center; margin: 16px 0;">
                    <span class="status-badge">✓ PRESENT (Verified via AI Face Recognition)</span>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
                    <tr><td style="padding: 6px 0; color: #64748b;">Subject:</td><td style="font-weight: bold;">{subject}</td></tr>
                    <tr><td style="padding: 6px 0; color: #64748b;">Course & Class:</td><td>{course} - Sem {semester} ({division})</td></tr>
                    <tr><td style="padding: 6px 0; color: #64748b;">Date & Time:</td><td>{date_str} at {time_str}</td></tr>
                </table>

                <div class="stats-box">
                    <div style="font-weight: bold; font-size: 13px; color: #334155; margin-bottom: 8px;">📊 Class Attendance Summary Today</div>
                    <table style="width: 100%; text-align: center;">
                        <tr>
                            <td class="stat-item"><div class="stat-val">{stats.get('total_enrolled', 0)}</div><div class="stat-lbl">Total Students</div></td>
                            <td class="stat-item"><div class="stat-val" style="color: #10b981;">{stats.get('present_count', 0)}</div><div class="stat-lbl">Present</div></td>
                            <td class="stat-item"><div class="stat-val" style="color: #ef4444;">{stats.get('absent_count', 0)}</div><div class="stat-lbl">Absent</div></td>
                            <td class="stat-item"><div class="stat-val" style="color: #2563eb;">{stats.get('attendance_rate', 0)}%</div><div class="stat-lbl">Attendance Rate</div></td>
                        </tr>
                    </table>
                </div>

                <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
                    This is an automated academic confirmation from SmartAttendAI.
                </p>
            </div>
            <div class="footer">
                Smart Attendance System • Institutional Biometric Security • Powered by AI Face Recognition
            </div>
        </div>
    </body>
    </html>
    """

def build_absent_email_html(student_name: str, enrollment_no: str, subject: str, course: str, semester: int, division: str, date_str: str, stats: Dict[str, Any]) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }}
            .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }}
            .header {{ background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color: white; padding: 24px; text-align: center; }}
            .content {{ padding: 24px; line-height: 1.6; }}
            .status-badge {{ display: inline-block; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 14px; }}
            .stats-box {{ background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0; }}
            .stats-grid {{ display: flex; justify-content: space-around; text-align: center; }}
            .stat-item {{ padding: 8px; }}
            .stat-val {{ font-size: 18px; font-weight: bold; color: #0f172a; }}
            .stat-lbl {{ font-size: 12px; color: #64748b; text-transform: uppercase; }}
            .footer {{ background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; font-size: 12px; color: #64748b; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <h2 style="margin: 0; font-size: 22px;">Smart Attendance System</h2>
                <p style="margin: 6px 0 0; opacity: 0.9; font-size: 14px;">Class Absence Notification Alert</p>
            </div>
            <div class="content">
                <p>Dear <strong>{student_name}</strong> (Roll No: <code>{enrollment_no}</code>),</p>
                <p>
                    You were marked as <strong>ABSENT</strong> for today's scheduled lecture:
                </p>
                <div style="text-align: center; margin: 16px 0;">
                    <span class="status-badge">✗ ABSENT — Class Attendance Not Recorded</span>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
                    <tr><td style="padding: 6px 0; color: #64748b;">Subject:</td><td style="font-weight: bold;">{subject}</td></tr>
                    <tr><td style="padding: 6px 0; color: #64748b;">Course & Class:</td><td>{course} - Sem {semester} ({division})</td></tr>
                    <tr><td style="padding: 6px 0; color: #64748b;">Date:</td><td>{date_str}</td></tr>
                </table>

                <div class="stats-box">
                    <div style="font-weight: bold; font-size: 13px; color: #334155; margin-bottom: 8px;">📊 Class Attendance Summary Today</div>
                    <table style="width: 100%; text-align: center;">
                        <tr>
                            <td class="stat-item"><div class="stat-val">{stats.get('total_enrolled', 0)}</div><div class="stat-lbl">Total Students</div></td>
                            <td class="stat-item"><div class="stat-val" style="color: #10b981;">{stats.get('present_count', 0)}</div><div class="stat-lbl">Present</div></td>
                            <td class="stat-item"><div class="stat-val" style="color: #ef4444;">{stats.get('absent_count', 0)}</div><div class="stat-lbl">Absent</div></td>
                            <td class="stat-item"><div class="stat-val" style="color: #2563eb;">{stats.get('attendance_rate', 0)}%</div><div class="stat-lbl">Attendance Rate</div></td>
                        </tr>
                    </table>
                </div>

                <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 12px; margin: 16px 0; font-size: 13px; color: #92400e;">
                    ⚠️ <em>Please ensure regular attendance to maintain the mandatory 75% institutional requirement. If you were present, contact your faculty member immediately.</em>
                </div>
            </div>
            <div class="footer">
                Smart Attendance System • Institutional Biometric Security • Powered by AI Face Recognition
            </div>
        </div>
    </body>
    </html>
    """

def send_single_email(to_email: str, subject: str, html_body: str) -> bool:
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"SmartAttend AI <{SMTP_USER}>"
        msg["To"] = to_email

        part = MIMEText(html_body, "html")
        msg.attach(part)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, [to_email], msg.as_string())
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False

def send_session_attendance_emails(students_roster: List[Dict[str, Any]], session_info: Dict[str, Any]) -> Dict[str, Any]:
    present_sent = 0
    absent_sent = 0
    errors = []

    total_enrolled = session_info.get("total_enrolled", len(students_roster))
    present_count = session_info.get("present_count", len([s for s in students_roster if s.get("status") == "present"]))
    absent_count = session_info.get("absent_count", total_enrolled - present_count)
    rate = round((present_count / total_enrolled * 100)) if total_enrolled > 0 else 0

    stats = {
        "total_enrolled": total_enrolled,
        "present_count": present_count,
        "absent_count": absent_count,
        "attendance_rate": rate
    }

    subject_name = session_info.get("subject", "Cloud Computing & AI Architecture")
    course_name = session_info.get("course_name", "MCA")
    semester = session_info.get("semester", 2)
    division = session_info.get("division", "A")
    date_str = session_info.get("date", datetime.now().strftime("%Y-%m-%d"))
    time_str = session_info.get("time", datetime.now().strftime("%I:%M %p"))

    for student in students_roster:
        student_name = student.get("name", "Student")
        enrollment_no = student.get("enrollment_number", "EN2024MCA001")
        student_email = student.get("email") or SMTP_USER # fallback to sender for testing if student email blank
        status = student.get("status", "absent")

        if status == "present":
            email_subject = f"✅ Attendance Confirmed: {subject_name} - {date_str}"
            html_content = build_present_email_html(
                student_name=student_name,
                enrollment_no=enrollment_no,
                subject=subject_name,
                course=course_name,
                semester=semester,
                division=division,
                date_str=date_str,
                time_str=student.get("attendance_time") or time_str,
                stats=stats
            )
            success = send_single_email(student_email, email_subject, html_content)
            if success:
                present_sent += 1
            else:
                errors.append(student_name)
        else:
            email_subject = f"⚠️ Attendance Notice: Absent in {subject_name} - {date_str}"
            html_content = build_absent_email_html(
                student_name=student_name,
                enrollment_no=enrollment_no,
                subject=subject_name,
                course=course_name,
                semester=semester,
                division=division,
                date_str=date_str,
                stats=stats
            )
            success = send_single_email(student_email, email_subject, html_content)
            if success:
                absent_sent += 1
            else:
                errors.append(student_name)

    return {
        "success": True,
        "present_emails_sent": present_sent,
        "absent_emails_sent": absent_sent,
        "total_emails_sent": present_sent + absent_sent,
        "stats": stats,
        "errors": errors
    }
