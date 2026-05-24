"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";

  return (
    <header className="fixed top-0 w-full border-b border-[#1f2d1f] bg-[#0a0a0a]/80 backdrop-blur-md z-50">
      <nav className="w-full px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/image.png"
            alt="FastCare"
            width={180}
            height={50}
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-2">

          {!isSignedIn ? (
            <>
              <button onClick={() => signIn()} className="border border-[#1f2d1f] text-[#f0fdf4] hover:border-green-800 hover:text-green-400 px-5 py-2.5 rounded-xl transition">
                Sign In
              </button>

              <Link href="/sign-up">
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl transition">
                  Get Started
                </button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">{session?.user?.name || session?.user?.email}</span>
              <button onClick={() => signOut()} className="border border-[#1f2d1f] text-[#f0fdf4] hover:border-red-800 hover:text-red-400 px-4 py-2 rounded-xl transition">
                Sign Out
              </button>
            </div>
          )}

        </div>
      </nav>
    </header>
  );
};

export default Header;
