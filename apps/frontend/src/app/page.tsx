"use client";
import { useTranslate } from "@/hooks";
import { TranslateCard, TranslateRequestForm, useApp } from "@/components";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { Loading } from "@/components/ui/Loading";


export default function Home() {
  // located in different file for cleaner coding
  const { isLoading, translations } =
    useTranslate();
  const { user, selectedTranslation, setSelectedTranslation } = useApp();
  const leftPanelRef = useRef<ImperativePanelHandle>(null) /// czy dobrze???

  useEffect(()=>{
    if (!leftPanelRef.current){
      return;
    }
    if(user){
      leftPanelRef.current?.expand()
    } else {
      leftPanelRef.current?.collapse()
    }
  },[user])

  if (isLoading) {
    return <Loading/>;
  }

  return (
    <main className="flex flex-col h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel collapsible ref={leftPanelRef}>
          <div className="bg-gray-900 w-full h-full flex flex-col space-y-2 p-2">
            {translations.map((item) => {
              return (
                <TranslateCard
                  selected={item.requestId === selectedTranslation?.requestId}
                  onSelected={setSelectedTranslation}
                  key={item.requestId}
                  translateItem={item}
                />
              );
            })}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="p-4">
            <TranslateRequestForm />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
