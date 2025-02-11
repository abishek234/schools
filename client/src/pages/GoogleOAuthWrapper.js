import React from "react";
import { GoogleOAuthWrapper,GoogleMeetScheduler } from "../sections/GoogleOAuth";

export default function GMeet  ()  {
    return (
        <GoogleOAuthWrapper>
            <GoogleMeetScheduler />
        </GoogleOAuthWrapper>
    );
};


