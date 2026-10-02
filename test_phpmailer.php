<?php
/**
 * Test PHPMailer Script for Smart Attendance System
 * Demonstrates real "Attendance Successful" & "Student Can't Attend Today (Absent)" emails.
 */
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

function sendTestEmail($type = 'present') {
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

        $mail->CharSet = 'UTF-8';
        $mail->isHTML(true);
        $mail->setFrom('vickyhirani8842@gmail.com', 'SmartAttend AI System');
        $mail->addAddress('vickyhirani8842@gmail.com', 'Vicky Hirani');

        $student_name = "Vicky Hirani";
        $enrollment_no = "EN2024MCA501";
        $subject = "Cloud Computing & AI Architecture";
        $course = "MCA";
        $semester = 2;
        $division = "A";
        $date = date('Y-m-d');
        $time = date('h:i A');

        $total = 50;
        $present = 32;
        $absent = 18;
        $rate = 64;

        if ($type === 'present') {
            // ATTENDANCE SUCCESSFUL (TODAY'S ATTENDANCE COMPLETED)
            $mail->Subject = "✅ Attendance Successful: Today's Attendance Completed - {$subject}";
            $mail->Body = "
            <div style='font-family: Arial, sans-serif; background: #f8fafc; padding: 20px;'>
                <div style='max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);'>
                    <div style='background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 24px; text-align: center;'>
                        <h2 style='margin:0; font-size: 22px;'>Smart Attendance System</h2>
                        <p style='margin:6px 0 0; opacity:0.95; font-size: 14px;'>Attendance Completed Notice</p>
                    </div>
                    <div style='padding: 24px; color: #1e293b; line-height: 1.6;'>
                        <p>Dear <strong>{$student_name}</strong> (Roll No: <code>{$enrollment_no}</code>),</p>
                        <p>Your attendance for today's lecture has been successfully recorded in the university system:</p>
                        
                        <div style='text-align: center; margin: 18px 0;'>
                            <span style='background: #ecfdf5; color: #065f46; border: 2px solid #a7f3d0; padding: 12px 24px; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;'>
                                ✓ ATTENDANCE SUCCESSFUL (TODAY'S ATTENDANCE COMPLETED)
                            </span>
                        </div>

                        <table style='width: 100%; border-collapse: collapse; margin: 18px 0; background: #f8fafc; border-radius: 8px; padding: 12px;'>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Subject:</td><td><strong>{$subject}</strong></td></tr>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Class:</td><td>{$course} - Semester {$semester} (Division {$division})</td></tr>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Date & Time:</td><td>{$date} at {$time}</td></tr>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Biometric Status:</td><td><span style='color:#059669; font-weight: bold;'>AI Face Verified Match</span></td></tr>
                        </table>

                        <div style='background: #f1f5f9; border-radius: 8px; padding: 18px; margin: 20px 0; border: 1px solid #e2e8f0;'>
                            <div style='font-weight: bold; margin-bottom: 12px; color: #334155; font-size: 14px;'>📊 Total Class Attendance Summary Today</div>
                            <table style='width: 100%; text-align: center;'>
                                <tr>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #0f172a;'>{$total}</div><div style='font-size: 12px; color: #64748b;'>Total Students</div></td>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #10b981;'>{$present}</div><div style='font-size: 12px; color: #64748b;'>Present Today</div></td>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #ef4444;'>{$absent}</div><div style='font-size: 12px; color: #64748b;'>Absent Today</div></td>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #2563eb;'>{$rate}%</div><div style='font-size: 12px; color: #64748b;'>Overall Rate</div></td>
                                </tr>
                            </table>
                        </div>

                        <p style='font-size: 12px; color: #64748b; margin-top: 20px;'>
                            This is an automated biometric confirmation from Smart Attendance System.
                        </p>
                    </div>
                </div>
            </div>";
        } else {
            // STUDENT CAN'T ATTEND TODAY (ABSENT)
            $mail->Subject = "⚠️ Attendance Alert: Student Can't Attend Today's Class - {$subject}";
            $mail->Body = "
            <div style='font-family: Arial, sans-serif; background: #f8fafc; padding: 20px;'>
                <div style='max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);'>
                    <div style='background: linear-gradient(135deg, #ef4444, #b91c1c); color: white; padding: 24px; text-align: center;'>
                        <h2 style='margin:0; font-size: 22px;'>Smart Attendance System</h2>
                        <p style='margin:6px 0 0; opacity:0.95; font-size: 14px;'>Evening Absence Notification Alert</p>
                    </div>
                    <div style='padding: 24px; color: #1e293b; line-height: 1.6;'>
                        <p>Dear <strong>{$student_name}</strong> (Roll No: <code>{$enrollment_no}</code>),</p>
                        <p>This is to inform you that you were marked as <strong>ABSENT</strong> for today's class:</p>
                        
                        <div style='text-align: center; margin: 18px 0;'>
                            <span style='background: #fef2f2; color: #991b1b; border: 2px solid #fecaca; padding: 12px 24px; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;'>
                                ✗ TODAY THIS STUDENT CAN'T ATTEND THE CLASS (ABSENT)
                            </span>
                        </div>

                        <table style='width: 100%; border-collapse: collapse; margin: 18px 0; background: #f8fafc; border-radius: 8px; padding: 12px;'>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Subject:</td><td><strong>{$subject}</strong></td></tr>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Class:</td><td>{$course} - Semester {$semester} (Division {$division})</td></tr>
                            <tr><td style='color: #64748b; padding: 8px 12px;'>Date:</td><td>{$date}</td></tr>
                        </table>

                        <div style='background: #f1f5f9; border-radius: 8px; padding: 18px; margin: 20px 0; border: 1px solid #e2e8f0;'>
                            <div style='font-weight: bold; margin-bottom: 12px; color: #334155; font-size: 14px;'>📊 Total Class Attendance Summary Today</div>
                            <table style='width: 100%; text-align: center;'>
                                <tr>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #0f172a;'>{$total}</div><div style='font-size: 12px; color: #64748b;'>Total Students</div></td>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #10b981;'>{$present}</div><div style='font-size: 12px; color: #64748b;'>Present Today</div></td>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #ef4444;'>{$absent}</div><div style='font-size: 12px; color: #64748b;'>Absent Today</div></td>
                                    <td><div style='font-size: 20px; font-weight: bold; color: #2563eb;'>{$rate}%</div><div style='font-size: 12px; color: #64748b;'>Overall Rate</div></td>
                                </tr>
                            </table>
                        </div>

                        <div style='background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #92400e;'>
                            ⚠️ <strong>Attendance Requirement:</strong> Maintaining minimum 75% aggregate attendance is required. Please attend all upcoming lectures.
                        </div>
                    </div>
                </div>
            </div>";
        }

        echo "Sending {$type} email...\n";
        $mail->send();
        echo ">>> SUCCESS: {$type} email sent successfully to {$mail->getToAddresses()[0][0]} <<<\n";
        return true;
    } catch (Exception $e) {
        echo ">>> ERROR sending {$type} email: {$mail->ErrorInfo}\n";
        return false;
    }
}

// Send Attendance Successful email
echo "--- Testing Attendance Successful (Present) Email ---\n";
sendTestEmail('present');
