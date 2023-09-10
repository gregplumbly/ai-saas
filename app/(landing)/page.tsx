import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <>
      <div>LandingPage unprotected</div>
      <Link href="/sign-up">
        <Button variant="outline" className="rounded-full">
          Sign up
        </Button>
      </Link>
      <Link href="/sign-in">
        <Button variant="outline" className="rounded-full">
          Sign in
        </Button>
      </Link>
    </>
  );
};

export default LandingPage;
