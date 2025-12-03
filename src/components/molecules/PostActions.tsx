import ActionCount from "../atoms/ActionCount";
import { Icon } from "@iconify/react";

export default function PostActions() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3xl">
        <ActionCount icon="lucide:heart" count={20} />
        <ActionCount icon="lucide:message-circle" count={20} />
        <ActionCount icon="lucide:send" count={20} />
      </div>
      <button className="text-neutral-25">
        <Icon icon="lucide:bookmark" />
      </button>
    </div>
  );
}

