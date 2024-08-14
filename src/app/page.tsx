import { Viewport } from "~/components/viewport";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { Container } from "~/components/transforms/container";
import { IconButton } from "~/components/ui/button";
import { SiGithub } from "@icons-pack/react-simple-icons";

export default function HomePage() {
  return (
    <main>
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        <ResizablePanel defaultSize={25} className="min-w-[300px] max-w-xl">
          <div className="flex h-full items-center justify-center">
            <Container />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} className="min-w-40">
          <div className="flex h-full items-center justify-center">
            <Viewport />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <div className="absolute right-3 top-3">
        <a href="https://github.com/a3ng7n/transform-viewer">
          <IconButton>
            <SiGithub />
          </IconButton>
        </a>
      </div>
    </main>
  );
}
