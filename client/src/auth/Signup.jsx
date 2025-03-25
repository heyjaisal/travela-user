import Signup from "./signup-form";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh md:grid-cols-2">
      <div className="flex flex-col gap-4 p-1 md:p-1">
        <div className="flex justify-center gap-2 md:justify-start"></div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Signup />
          </div>
        </div>
      </div>
      <div className="relative hidden md:block bg-muted">
        <img
          src="https://images.unsplash.com/photo-1638547908152-a8406fc38d21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzA4fHxkaWdpdGFsfGVufDB8fDB8fHww"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
