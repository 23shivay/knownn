import bcrypt from "bcryptjs";
import db from "@repo/db/client";
import { sendVerificationEmail } from "../../../helpers/sendVerificationEmail";

export async function POST(request: Request) {
  try {
    const { email, password, gender } = await request.json();

    // Validate input
    if (!email || !password || !gender) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    // Check if email is already registered
    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      if (existingUser.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Email is already registered and verified",
          }),
          { status: 400 }
        );
      } else {
        // If the email is already registered but not verified, update the existing user
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        const orgName = email.split("@")[1];

        await db.user.update({
          where: { email },
          data: {
            password: hashedPassword,
            gender,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            organizationName: orgName,
          },
        });

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, verifyCode);

        if (!emailResponse.success) {
          return new Response(
            JSON.stringify({
              success: false,
              message: emailResponse.message,
            }),
            { status: 500 }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: "User updated successfully. Please verify your email",
          }),
          { status: 200 }
        );
      }
    } else {
      // If the email is not registered, create a new user
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const orgName = email.split("@")[1];

      // Ensure organization exists or create it
      await db.organization.upsert({
        where: { name: orgName },
        update: {},
        create: { name: orgName },
      });

      const newUser = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          gender,
          isVerified: false,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          organizationName: orgName,
        },
      });

      // Send verification email
      const emailResponse = await sendVerificationEmail(email, verifyCode);

      if (!emailResponse.success) {
        return new Response(
          JSON.stringify({
            success: false,
            message: emailResponse.message,
          }),
          { status: 500 }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "User registered successfully. Please verify your email",
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error registering user", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while registering the user.",
      }),
      { status: 500 }
    );
  }
}
