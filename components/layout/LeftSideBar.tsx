"use client";

import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { navLinks } from "@/lib/constants";

const LeftSideBar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-[#F0F0F0] shadow-xl max-lg:hidden">
      <Image src="/BJ.png" alt="logo" width={150} height={70} />

      <div className="flex flex-col gap-12">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium ${
              pathname === link.url ? "text-[#4E71FF]" : "text-[#616161]"
            }`}
          >
            {link.icon} <p>{link.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4 text-body-medium items-center">
        <UserButton afterSignOutUrl="/sign-in" />
        <p className="text-[#616161]">
          {user ? `${user.firstName} ${user.lastName}` : "Edit Profile"}
        </p>
      </div>
    </div>
  );
};

export default LeftSideBar;
