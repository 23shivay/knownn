// //import { resend } from "lib/resend";
// import { Resend } from 'resend';
// import VerificationEmail from "../emails/VerificationEmail";
// import { ApiResponse } from '../types/ApiResponse';

// const resend = new Resend('re_S8DKH4Ec_4qQ5UivpLEJPs89j15QAiyuX');
// export async function sendVerificationEmail(
//   email: string, 
//   verifyCode: string
// ): Promise<ApiResponse> {
//   try {
//     await resend.emails.send({
//       from: 'onboarding@resend.dev',
//       to: email,
//       subject: 'Knownn Verification Code',
//        html: `<p>Congrats on sending your <strong>Knownn ${verifyCode}</strong>!</p>`

//     });
//     return { success: true, message: 'Verification email sent successfully.' };
//   } catch (emailError) {
//     console.error('Error sending verification email:', emailError);
//     return { success: false, message: 'Failed to send verification email.' };
//   }
// }


import VerificationEmail from 'emails/VerificationEmail';
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail
    pass: process.env.GMAIL_APP_PASSWORD // Your App Password
  }
});

export async function sendVerificationEmail(email: string, verifyCode: string) {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER, // Must be the same as `user`
      to: email,
      subject: 'Knownn Verification Code',
       html: ` <Head>
  <title>Verification Code</title>
  <Font
    fontFamily="Roboto"
    fallbackFontFamily="Verdana"
    webFont={{
      url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
      format: 'woff2',
    }}
    fontWeight={400}
    fontStyle="normal"
  />
</Head>
<Preview>Here&apos;s your verification code: ${verifyCode}</Preview>
<Body style={{ textAlign: 'center', fontFamily: 'Roboto, Verdana, sans-serif' }}>
  <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
    <Section>
      <Row>
        <Column>
          <Heading as="h2" style={{ marginBottom: '10px' }}>Hello,</Heading>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text style={{ fontSize: '16px', marginBottom: '10px' }}>
            Thank you for registering. Please use the following verification code to complete your registration:
          </Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
            ${verifyCode}
          </Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text style={{ fontSize: '14px', color: '#666' }}>
            If you did not request this code, please ignore this email.
          </Text>
        </Column>
      </Row>
    </Section>
  </Container>
</Body>
`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send verification email.' };
  }
}


