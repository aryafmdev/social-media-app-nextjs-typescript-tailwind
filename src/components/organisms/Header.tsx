import Brand from "../atoms/Brand";
import IconButton from "../atoms/IconButton";
import Avatar from "../atoms/Avatar";
import SearchBar from "../molecules/SearchBar";

type Variant =
  | "before-login"
  | "before-login-mobile"
  | "open-auth-mobile"
  | "search"
  | "after-login"
  | "after-login-mobile"
  | "mobile-profile";

export default function Header({ variant = "before-login" }: { variant?: Variant }) {
  const base = "bg-black border-b border-neutral-900";
  const desktop = "w-[1440px] h-[80px] px-[120px] gap-[124px]";
  const mobile = "w-[393px] h-[64px] px-[16px] gap-[124px]";

  if (variant === "open-auth-mobile") {
    return (
      <header className={`${base} w-[393px] h-[120px] flex flex-col items-start p-0`}>
        <div className="w-full flex flex-row justify-between items-center px-[16px]">
          <Brand />
          <div className="flex items-center gap-md">
            <IconButton>🔍</IconButton>
            <IconButton>≡</IconButton>
          </div>
        </div>
        <div className="w-full px-[16px] mt-md flex items-center gap-md">
          <button className="rounded-full border border-neutral-700 text-neutral-25 px-3xl py-sm">Login</button>
          <button className="rounded-full bg-primary-200 text-neutral-25 px-3xl py-sm">Register</button>
        </div>
      </header>
    );
  }

  if (variant === "search") {
    return (
      <header className={`${base} ${mobile} flex flex-row items-center`}>
        <SearchBar />
      </header>
    );
  }

  if (variant === "before-login") {
    return (
      <header className={`${base} ${desktop} flex flex-row justify-between items-center`}>
        <Brand />
        <div className="flex-1 flex justify-center">
          <div className="w-[600px]">
            <SearchBar />
          </div>
        </div>
        <div className="flex items-center gap-xl">
          <button className="rounded-full border border-neutral-700 text-neutral-25 px-3xl py-sm">Login</button>
          <button className="rounded-full bg-primary-200 text-neutral-25 px-3xl py-sm">Register</button>
        </div>
      </header>
    );
  }

  if (variant === "before-login-mobile") {
    return (
      <header className={`${base} ${mobile} flex flex-row justify-between items-center`}>
        <Brand />
        <div className="flex items-center gap-md">
          <IconButton>🔍</IconButton>
          <IconButton>≡</IconButton>
        </div>
      </header>
    );
  }

  if (variant === "after-login") {
    return (
      <header className={`${base} ${desktop} flex flex-row justify-between items-center`}>
        <Brand />
        <div className="flex-1 flex justify-center">
          <div className="w-[600px]">
            <SearchBar />
          </div>
        </div>
        <div className="flex items-center gap-md">
          <IconButton>🔍</IconButton>
          <Avatar />
          <span className="text-neutral-25 font-medium">John Doe</span>
        </div>
      </header>
    );
  }

  if (variant === "after-login-mobile") {
    return (
      <header className={`${base} ${mobile} flex flex-row justify-between items-center`}>
        <Brand />
        <div className="flex items-center gap-md">
          <IconButton>🔍</IconButton>
          <Avatar />
        </div>
      </header>
    );
  }

  if (variant === "mobile-profile") {
    return (
      <header className={`${base} ${mobile} flex flex-row justify-between items-center`}>
        <button className="text-neutral-25">←</button>
        <div className="flex items-center gap-md">
          <span className="text-neutral-25">John Doe</span>
          <Avatar />
        </div>
      </header>
    );
  }

  return null;
}

