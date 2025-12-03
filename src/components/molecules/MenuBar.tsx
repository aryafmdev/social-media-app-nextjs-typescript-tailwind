import MenuItem from "../atoms/MenuItem";
import Fab from "../atoms/Fab";

export default function MenuBar() {
  return (
    <div className="rounded-full bg-neutral-900 border border-neutral-800 w-[clamp(320px,90vw,360px)] md:w-[680px] px-5xl md:px-8xl py-xl md:py-2xl flex items-center justify-between">
      <MenuItem icon="lucide:home" label="Home" active />
      <Fab />
      <MenuItem icon="lucide:user" label="Profile" />
    </div>
  );
}

