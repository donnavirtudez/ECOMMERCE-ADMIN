import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen bg-[#F0F0F0] flex justify-center items-center">
      <SignUp />
    </div>
  );
}
