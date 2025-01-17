import Link from "next/link";
import AuthButtons from "./auth-buttons";

const Navbar = async () => {
  return (
    <nav className="flex justify-between items-center py-3 px-4 fixed top-0 left-0 right-0 z-50 bg-slate-100">
      <Link href="/" className="text-xl font-bold">
        Better Auth
      </Link>
      <AuthButtons />
    </nav>
  );
};

export default Navbar;
