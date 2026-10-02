<?php
/**
 * Smart Attendance System - 5:00 PM Evening Absent Students Notification Script
 * 
 * Automatically sends evening notices to students who did not attend today's classes.
 * Configured with Gmail SMTP & PHPMailer.
 */

if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function getEveningMailer() {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'vickyhirani8842@gmail.com';
        $mail->Password   = 'yadb bizm klwg ihbt';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->Timeout    = 20;

        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ];

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->setFrom('vickyhirani8842@gmail.com', 'SmartAttend AI System');
        return $mail;
    } catch (Exception $e) {
        return null;
    }
}

function sendEveningAbsentAlert($student, $session, $stats) {
    $mail = getEveningMailer();
    if (!$mail) return false;

    $student_name = htmlspecialchars($student['name'] ?? 'Student');
    $enrollment_no = htmlspecialchars($student['enrollment_number'] ?? 'N/A');
    $subject = htmlspecialchars($session['subject'] ?? 'Cloud Computing & AI Architecture');
    $course = htmlspecialchars($session['course'] ?? 'MCA');
    $semester = $session['semester'] ?? 2;
    $division = $session['division'] ?? 'A';
    $date = $session['date'] ?? date('Y-m-d');

    $total = $stats['total_enrolled'] ?? 50;
    $present = $stats['present_count'] ?? 32;
    $absent = $stats['absent_count'] ?? 18;
    $rate = $stats['attendance_rate'] ?? round(($present / max(1, $total)) * 100);

    try {
        $to_email = !empty($student['email']) ? $student['email'] : 'vickyhirani8842@gmail.com';
        $mail->addAddress($to_email, $student_name);

        $mail->Subject = "⚠️ Evening Attendance Alert: Student Can't Attend Today's Class ({$date})";
        $mail->Body = "
        <div style='font-family: Arial, sans-serif; background: #f8fafc; padding: 20px;'>
            <div style='max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);'>
                <div style='background: linear-gradient(135deg, #ef4444, #b91c1c); color: white; padding: 24px; text-align: center;'>
                    <h2 style='margin:0; font-size: 22px;'>Smart Attendance System</h2>
                    <p style='margin:6px 0 0; opacity:0.95; font-size: 14px;'>Evening 5:00 PM Absence Alert</p>
                </div>
                <div style='padding: 24px; color: #1e293b; line-height: 1.6;'>
                    <p>Dear <strong>{$student_name}</strong> (Roll No: <code>{$enrollment_no}</code>),</p>
                    <p>This is an automated evening notification that you were marked <strong>ABSENT</strong> for today's classes:</p>
                    
                    <div style='text-align: center; margin: 18px 0;'>
                        <span style='background: #fef2f2; color: #991b1b; border: 2px solid #fecaca; padding: 12px 24px; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;'>
                            ✗ TODAY THIS STUDENT CAN'T ATTEND THE CLASS (ABSENT)
                        </span>
                    </div>

                    <table style='width: 100%; border-collapse: collapse; margin: 18px 0; background: #f8fafc; border-radius: 8px; padding: 12px;'>
                        <tr><td style='color: #64748b; padding: 8px 12px;'>Subject:</td><td><strong>{$subject}</strong></td></tr>
                        <tr><td style='color: #64748b; padding: 8px 12px;'>Class:</td><td>{$course} - Semester {$semester} (Division {$division})</td></tr>
                        <tr><td style='color: #64748b; padding: 8px 12px;'>Date:</td><td>{$date} (Evening Status)</td></tr>
                    </table>

                    <div style='background: #f1f5f9; border-radius: 8px; padding: 18px; margin: 20px 0; border: 1px solid #e2e8f0;'>
                        <div style='font-weight: bold; margin-bottom: 12px; color: #334155; font-size: 14px;'>📊 Total Class Attendance Summary Today</div>
                        <table style='width: 100%; text-align: center;'>
                            <tr>
                                <td><div style='font-size: 20px; font-weight: bold; color: #0f172a;'>{$total}</div><div style='font-size: 12px; color: #64748b;'>Total Enrolled</div></td>
                                <td><div style='font-size: 20px; font-weight: bold; color: #10b981;'>{$present}</div><div style='font-size: 12px; color: #64748b;'>Present Today</div></td>
                                <td><div style='font-size: 20px; font-weight: bold; color: #ef4444;'>{$absent}</div><div style='font-size: 12px; color: #64748b;'>Absent Today</div></td>
                                <td><div style='font-size: 20px; font-weight: bold; color: #2563eb;'>{$rate}%</div><div style='font-size: 12px; color: #64748b;'>Overall Rate</div></td>
                            </tr>
                        </table>
                    </div>

                    <div style='background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #92400e;'>
                        ⚠️ <strong>Reminder:</strong> Please ensure regular attendance to maintain 75% eligibility criteria.
                    </div>
                </div>
            </div>
        </div>";

        $mail->send();
        echo "[5:00 PM ALERT] Sent absence notice to {$student_name} ({$to_email})\n";
        return true;
    } catch (Exception $e) {
        echo "[ERROR] Failed sending to {$student_name}: {$mail->ErrorInfo}\n";
        return false;
    }
}

// CLI or Web Execution
if (php_sapi_name() === 'cli' || (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST')) {
    echo "=== Running 5:00 PM Evening Absent Notification Routine ===\n";
    
    // Sample / Live Absent Students list for today
    $absent_students = [
        ['name' => 'Amit Sharma', 'enrollment_number' => 'EN2024MCA510', 'email' => 'vickyhirani8842@gmail.com']
    ];
    $session = ['subject' => 'Cloud Computing & AI Architecture', 'course' => 'MCA', 'semester' => 2, 'division' => 'A', 'date' => date('Y-m-d')];
    $stats = ['total_enrolled' => 50, 'present_count' => 32, 'absent_count' => 18, 'attendance_rate' => 64];

    $sent = 0;
    foreach ($absent_students as $stu) {
        if (sendEveningAbsentAlert($stu, $session, $stats)) {
            $sent++;
        }
    }

    echo "Completed: {$sent} absent notification(s) dispatched.\n";
}
?>
