// import React from 'react'

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
    const { authStatus } = useAuthenticator()
    const navigate = useNavigate();

    useEffect(() => {
        if (authStatus === 'authenticated') {
            navigate('/') 
        }
    }, [authStatus, navigate])

    if (authStatus === 'authenticated') {
        return <p>Redirecting...</p>
    }
    
    return <Authenticator />
}

export default Auth;