import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_ID,
  process.env.GOOGLE_SECRET,
  "http://localhost:3000/api/auth/google"
);

export const getGoogleUrl = () => {
  const scopes = [
    "openid",
    "profile",
    "email",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    // If you only need one scope you can pass it as a string
    scope: scopes,
  });
  return url;
};

export const getGoogleTokens = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  const data = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=${tokens.id_token}`
  )
    .then((res) => res.json())
    .then((data) => data);

  const info = { email: data.email, providedAccountId: data.user_id };
  return { tokens, info };
};
