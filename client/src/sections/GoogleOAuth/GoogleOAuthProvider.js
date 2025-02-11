// GoogleOAuthProvider.js
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleOAuthWrapper  ({ children })  {
    const GOOGLE_CLIENT_ID = "662438855225-uvlgie8hgffe81po8egbjolmjpaddqs0.apps.googleusercontent.com";

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {children}
        </GoogleOAuthProvider>
    );
};
