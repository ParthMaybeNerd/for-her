import { AudioProvider } from "./components/AudioManager";
import StoryShell from "./components/StoryShell";
import "./App.css";

export default function App() {
  return (
    <AudioProvider>
      <StoryShell />
    </AudioProvider>
  );
}
