import db from "@repo/db/client"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    const decodedUsername = decodeURIComponent(email);

    // Find the user by email
    const user = await db.user.findUnique({
      where: {
        email: decodedUsername,
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User not found',
        }),
        { status: 404 }
      );
    }

    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      await db.user.update({
        where: { email: decodedUsername },
        data: { isVerified: true },
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Account verified successfully',
        }),
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return new Response(
        JSON.stringify({
          success: false,
          message:
            'Verification code has expired. Please sign up again to get a new code.',
        }),
        { status: 400 }
      );
    } else {
      // Code is incorrect
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Incorrect verification code',
        }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error verifying user',
      }),
      { status: 500 }
    );
  }
}
