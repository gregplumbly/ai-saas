"use client";

import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Music, Send } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";

import { formSchema } from "./constants";

const MusicPage = () => {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  interface UserGeneration {
    url: string;
    prompt: string;
  }
  const [userGenerations, setUserGenerations] = useState<UserGeneration[]>([]);
  const proModal = useProModal();
  const router = useRouter();
  const [music, setMusic] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/userGenerations?userId=${userId}`)
        .then((response) => response.json())
        .then((data) => setUserGenerations(data.userGenerations));
      console.log("requesting fresh data from api");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);

      axios
        .post("/api/music", values)
        .then((response) => {
          setMusic(response.data.audio);
          form.reset();
        })
        .catch((error) => {
          if (error?.response?.status === 403) {
            proModal.onOpen();
          } else {
            toast.error("Something went wrong.");
          }
        })
        .finally(() => {
          router.refresh();
        });
    } catch (error: any) {
      toast.error("Something went wrong.");
    }
  };

  console.log(userGenerations);

  return (
    <div>
      <Heading
        title="Music Generation"
        description="Turn your prompt into music."
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />

      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
              rounded-lg 
              border 
              w-full 
              p-4 
              px-3 
              md:px-6 
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Piano solo"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              type="submit"
              disabled={isLoading}
              size="icon"
            >
              Generate
            </Button>
          </form>
        </Form>
        {isLoading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {!music && !isLoading && <Empty label="Make a new generation" />}

        <div>
          {userGenerations.map((generation, index) => (
            <div key={index}>
              {/* Render your generation data here. For example: */}
              <p className="mt-4">{generation.prompt}</p>
              <audio controls className="w-full mt-2">
                <source src={generation.url} />
              </audio>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
