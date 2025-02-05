import { resend } from "lib/resend";
import VerificationEmail from "../emails/VerificationEmail";
import { ApiResponse } from '../types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'dev@hiteshchoudhary.com',
      to: email,
      subject: 'Mystery Message Verification Code',
      react: VerificationEmail({  otp: verifyCode }),
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}