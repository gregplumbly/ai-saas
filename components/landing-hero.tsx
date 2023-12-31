"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export const LandingHero = () => {
    const { isSignedIn } = useAuth();

    return (
        <div className="text-white font-bold py-36 text-center space-y-5">
            <div className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl space-y-5 font-extrabold">
                <h1>Playing with AI apis and Nextjs </h1>
                <div className="my-8 py-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    <TypewriterComponent
                        options={{
                            strings: [
                                "Chatbot (gpt-3.5-turbo)",
                                "Code help (gpt-3.5-turbo)",
                                "Image Generation(gpt-3.5-turbo)",
                                "Video Generation(zeroscope-v2-xl)",
                                "Music Generation(riffusion)",
                            ],
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </div>
            </div>
            <div className="text-sm md:text-xl font-light text-zinc-400">
                Create content using AI.
            </div>
            <div>
                <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                    <Button
                        variant="premium"
                        className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
                    >
                        Start Generating For Free
                    </Button>
                </Link>
            </div>
            <div className="text-zinc-400 text-xs md:text-sm font-normal">
                No credit card required.
            </div>
        </div>
    );
};
