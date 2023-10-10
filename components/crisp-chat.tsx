"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("aeeef02a-7f6e-49e8-8dbb-d76094f0c69b");
    }, []);

    return null;
};
