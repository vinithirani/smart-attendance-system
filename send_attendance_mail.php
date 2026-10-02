<?php

if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

function getMailerInstance() {
    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'vickyhirani8842@gmail.com';
        $mail->Password   = 'yadb bizm klwg ihbt';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->Timeout    = 20;

        // SSL options to ensure compatibility with Windows/WAMP/XAMPP PHP local environments
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
        error_log("PHPMailer Init Error: " . $e->getMessage());
        return null;
    }
}

/**
 * Send Attendance Notification Email to Student
 */
function sendStudentAttendanceEmail($studentData, $sessionData, $overallStats) {
    $mail = getMailerInstance();
    if (!$mail) return false;

    $is_present = ($studentData['status'] === 'present');
    $student_name = htmlspecialchars($studentData['name'] ?? 'Student');
    $enrollment_no = htmlspecialchars($studentData['enrollment_number'] ?? 'N/A');
    $subject = htmlspecialchars($sessionData['subject'] ?? 'Cloud Computing & AI Architecture');
    $course = htmlspecialchars($sessionData['course'] ?? 'MCA');
    $semester = $sessionData['semester'] ?? 2;
    $division = $sessionData['division'] ?? 'A';
    $date = $sessionData['date'] ?? date('Y-m-d');
    $time = $studentData['attendance_time'] ?? date('h:i A');

    $total = $overallStats['total_enrolled'] ?? 50;
    $present = $overallStats['present_count'] ?? 32;
    $absent = $overallStats['absent_count'] ?? 18;
    $rate = $overallStats['attendance_rate'] ?? round(($present / max(1, $total)) * 100);

    try {
        $to_email = !empty($studentData['email']) ? $studentData['email'] : 'vickyhirani8842@gmail.com';
        $mail->addAddress($to_email, $student_name);

        if ($is_present) {
            // PRESENT EMAIL TEMPLATE
            $mail->Subject = "✅ Attendance Confirmed: {$subject} - {$date}";
            $mail->Body = "
            <div style='font-family: Arial, sans-serif; background: #f8fafc; padding: 20px;'>
                <div style='max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);'>
                    <div style='background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 24px; text-align: center;'>
                        <h2 style='margin:0; font-size: 22px;'>Smart Attendance System</h2>
                        <p style='margin:6px 0 0; opacity:0.95; font-size: 14px;'>Daily Attendance Confirmation Notice</p>
                    </div>
                    <div style='padding: 24px; color: #1e293b; line-height: 1.6;'>
                        <p>Dear <strong>{$student_name}</strong> (Roll No: <code>{$enrollment_no}</code>),</p>
                        <p>Your attendance for today's lecture has been successfully recorded in the university portal:</p>
                        
                        <div style='text-align: center; margin: 18px 0;'>
                            <span style='background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 10px 22px; border-radius: 25px; font-weight: bold; font-size: 15px; display: inline-block;'>
                                ✓ TODAY'S ATTENDANCE COMPLETED (PRESENT)
                            </span>
                        </div>

                        <table style='width: 100%; border-collapse: collapse; margin: 18px 0; background: #f8fafc; border-radius: 8px; padding: 12px;'>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Subject:</td><td><strong>{$subject}</strong></td></tr>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Course & Division:</td><td>{$course} - Semester {$semester} (Div {$division})</td></tr>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Date & Timestamp:</td><td>{$date} at {$time}</td></tr>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Verification Mode:</td><td><span style='color:#059669; font-weight:600;'>AI Face Recognition Match</span></td></tr>
                        </table>

                        <div style='background: #f1f5f9; border-radius: 8px; padding: 18px; margin: 20px 0; border: 1px solid #e2e8f0;'>
                            <div style='font-weight: bold; margin-bottom: 12px; color: #334155; font-size: 14px;'>📊 Total Class Attendance Summary</div>
                            <table style='width: 100%; text-align: center;'>
                                <tr>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #0f172a;'>{$total}</div><div style='font-size: 12px; color: #64748b;'>Total Enrolled</div></td>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #10b981;'>{$present}</div><div style='font-size: 12px; color: #64748b;'>Present Today</div></td>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #ef4444;'>{$absent}</div><div style='font-size: 12px; color: #64748b;'>Absent Today</div></td>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #2563eb;'>{$rate}%</div><div style='font-size: 12px; color: #64748b;'>Overall Attendance</div></td>
                                </tr>
                            </table>
                        </div>

                        <p style='font-size: 12px; color: #64748b; margin-top: 20px;'>
                            This is an automated notification generated by the Smart Attendance AI System. No signature required.
                        </p>
                    </div>
                </div>
            </div>";
        } else {
            // ABSENT EMAIL TEMPLATE
            $mail->Subject = "⚠️ Attendance Notice: Absent for {$subject} on {$date}";
            $mail->Body = "
            <div style='font-family: Arial, sans-serif; background: #f8fafc; padding: 20px;'>
                <div style='max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);'>
                    <div style='background: linear-gradient(135deg, #ef4444, #b91c1c); color: white; padding: 24px; text-align: center;'>
                        <h2 style='margin:0; font-size: 22px;'>Smart Attendance System</h2>
                        <p style='margin:6px 0 0; opacity:0.95; font-size: 14px;'>Class Absence Notification Alert</p>
                    </div>
                    <div style='padding: 24px; color: #1e293b; line-height: 1.6;'>
                        <p>Dear <strong>{$student_name}</strong> (Roll No: <code>{$enrollment_no}</code>),</p>
                        <p>This is to inform you that you were marked as <strong>ABSENT</strong> for today's lecture:</p>
                        
                        <div style='text-align: center; margin: 18px 0;'>
                            <span style='background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; padding: 10px 22px; border-radius: 25px; font-weight: bold; font-size: 15px; display: inline-block;'>
                                ✗ TODAY THIS STUDENT CAN'T ATTEND THE CLASS (ABSENT)
                            </span>
                        </div>

                        <table style='width: 100%; border-collapse: collapse; margin: 18px 0; background: #f8fafc; border-radius: 8px; padding: 12px;'>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Subject:</td><td><strong>{$subject}</strong></td></tr>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Course & Division:</td><td>{$course} - Semester {$semester} (Div {$division})</td></tr>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Date:</td><td>{$date}</td></tr>
                        </table>

                        <div style='background: #f1f5f9; border-radius: 8px; padding: 18px; margin: 20px 0; border: 1px solid #e2e8f0;'>
                            <div style='font-weight: bold; margin-bottom: 12px; color: #334155; font-size: 14px;'>📊 Total Class Attendance Summary</div>
                            <table style='width: 100%; text-align: center;'>
                                <tr>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #0f172a;'>{$total}</div><div style='font-size: 12px; color: #64748b;'>Total Enrolled</div></td>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #10b981;'>{$present}</div><div style='font-size: 12px; color: #64748b;'>Present Today</div></td>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #ef4444;'>{$absent}</div><div style='font-size: 12px; color: #64748b;'>Absent Today</div></td>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #2563eb;'>{$rate}%</div><div style='font-size: 12px; color: #64748b;'>Overall Attendance</div></td>
                                </tr>
                            </table>
                        </div>

                        <div style='background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #92400e; margin-top: 15px;'>
                            ⚠️ <strong>Important Notice:</strong> Maintaining a minimum of 75% aggregate attendance is mandatory. Please contact your subject faculty if you believe this is in error.
                        </div>

                        <p style='font-size: 12px; color: #64748b; margin-top: 20px;'>
                            This is an automated notification generated by the Smart Attendance AI System.
                        </p>
                    </div>
                </div>
            </div>";
        }

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mail Send Error for student {$student_name}: " . $mail->ErrorInfo);
        return false;
    }
}

// Handler when called via HTTP POST or CLI
if (php_sapi_name() === 'cli' || (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST')) {
    // Enable CORS for frontend invocations
    if (php_sapi_name() !== 'cli') {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0);
        }
    }

    $input = [];
    if (php_sapi_name() !== 'cli') {
        $raw = file_get_contents('php://input');
        if (!empty($raw)) {
            $input = json_decode($raw, true) ?: [];
        }
    } else if (isset($argv[1])) {
        $input = json_decode($argv[1], true) ?: [];
    }

    $students = $input['students'] ?? [
        ['name' => 'Bhavesh Gohil', 'enrollment_number' => 'EN2024MCA509', 'email' => 'vickyhirani8842@gmail.com', 'status' => 'present', 'attendance_time' => date('h:i A')],
        ['name' => 'Amit Sharma', 'enrollment_number' => 'EN2024MCA510', 'email' => 'vickyhirani8842@gmail.com', 'status' => 'absent']
    ];
    $session = $input['session'] ?? [
        'subject' => 'Cloud Computing & AI Architecture', 
        'course' => 'MCA', 
        'semester' => 2, 
        'division' => 'A', 
        'date' => date('Y-m-d')
    ];
    $stats = $input['stats'] ?? [
        'total_enrolled' => count($students), 
        'present_count' => count(array_filter($students, function($s){ return ($s['status'] ?? '') === 'present'; })), 
        'absent_count' => count(array_filter($students, function($s){ return ($s['status'] ?? '') !== 'present'; })), 
        'attendance_rate' => 64
    ];

    $results = ['present_sent' => 0, 'absent_sent' => 0, 'failed' => 0];
    foreach ($students as $stu) {
        $ok = sendStudentAttendanceEmail($stu, $session, $stats);
        if ($ok) {
            if (($stu['status'] ?? '') === 'present') {
                $results['present_sent']++;
            } else {
                $results['absent_sent']++;
            }
        } else {
            $results['failed']++;
        }
    }

    header('Content-Type: application/json');
    echo json_encode([
        'success' => true, 
        'message' => "Successfully processed attendance emails via PHPMailer", 
        'results' => $results,
        'stats' => $stats
    ]);
}
?>
