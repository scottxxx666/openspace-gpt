"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { useEffect } from "react";

export const Assistant = () => {
  const runtime1 = useChatRuntime({
    api: "/api/chat",
    body: { model: "gemini-2.5" },
  });
  const runtime2 = useChatRuntime({
    api: "/api/chat",
    body: { model: "grok" },
  });

  useEffect(() => {
    runtime1.thread.unstable_on("initialize", () => {
      const s = runtime1.thread.getState()
      console.log("initialize1", s);
    });
    runtime1.thread.unstable_on("run-start", () => {
      const s = runtime1.thread.getState()
      console.log("run-start1", s);
      runtime2.thread.append("You are a professional teacher. For the following given user's questions and AI's answers, plz validate and improve it.")
    });
    runtime1.thread.unstable_on("run-end", () => {
      console.log("run-end1");
      const {messages} = runtime1.thread.getState()
      const lastMessage = messages[messages.length - 1].content[0].text
      const firstMessage = messages[0].content[0].text
      runtime2.thread.append(` User question: ${firstMessage} \n
      AI answer: ${lastMessage} \n`)
    })
    runtime2.thread.unstable_on("initialize", () => {
      const s = runtime2.thread.getState()
      console.log("initialize2", s);
    })
    runtime2.thread.unstable_on("run-end", () => {
      console.log("run-end3");
      const a = runtime2.thread.getState()
      console.log("thread state3", a);
    })
  }, [runtime1, runtime2]);

  return (
    <div className="flex w-full h-dvh">
      <div className="w-1/2">
        <AssistantRuntimeProvider runtime={runtime1}>
          <div className="grid h-full grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
            <ThreadList/>
            <Thread/>
          </div>
        </AssistantRuntimeProvider>
      </div>
      <div className="w-1/2">
        <AssistantRuntimeProvider runtime={runtime2}>
          <div className="grid h-full grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
            <ThreadList/>
            <Thread/>
          </div>
        </AssistantRuntimeProvider>
      </div>
    </div>
  );};
