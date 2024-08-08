import { Viewport } from "~/components/viewport";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { Container } from "~/components/transforms/container";

export default function HomePage() {
  return (
    <main>
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-center justify-center">
            <Container />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full items-center justify-center">
            <Viewport />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main >
  );
}

