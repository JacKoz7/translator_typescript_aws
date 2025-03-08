"use client";
import { useTranslate } from "@/hooks";
import { TranslateCard, TranslateRequestForm, useApp } from "@/components";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  // located in different file for cleaner coding
  const { isLoading, translations, deleteTranslation, isDeleting } =
    useTranslate();
  const { selectedTranslation, setSelectedTranslation } = useApp();

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  return (
    <main className="flex flex-col h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
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
