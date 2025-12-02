export default function HelperText({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="text-sm text-red-500 mt-xxs">{text}</p>;
}

