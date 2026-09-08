"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

import { Button, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAIL = "admin@houseofnerige.com";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError || !data.user) {
        setError("Invalid email or password.");
        return;
      }

      if (
        data.user.email?.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
      ) {
        await supabase.auth.signOut();

        setError(
          "You are not authorized to access the administration."
        );

        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError(
        "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1ea] px-6 py-12">
      <section className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/logo/nerige-logos.png"
            alt="House of Nerige Sarees"
            width={300}
            height={120}
            priority
            className="h-auto w-[210px] object-contain"
          />
        </div>

        {/* Heading */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#8a7158]">
            Administration
          </p>

          <h1 className="mt-4 font-serif text-4xl tracking-tight text-[#2f2924]">
            Welcome back
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#766a60]">
            Sign in to manage Nerige Sarees.
          </p>
        </div>

        {/* Login card */}
        <div className="mt-10 rounded-[22px] border border-[#dfd6ca] bg-[#faf8f4] p-6 shadow-[0_12px_40px_rgba(73,55,35,0.05)] sm:p-8">
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[11px] font-medium text-[#5f554c]"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#a19386]"
                  strokeWidth={1.5}
                />

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="admin@houseofnerige.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="h-12 rounded-xl border-[#ddd3c6] bg-[#f4f0e9] pl-11 text-sm text-[#2f2924] placeholder:text-[#a79c91] focus-visible:ring-1 focus-visible:ring-[#8a7158]/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[11px] font-medium text-[#5f554c]"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#a19386]"
                  strokeWidth={1.5}
                />

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="h-12 rounded-xl border-[#ddd3c6] bg-[#f4f0e9] pl-11 text-sm text-[#2f2924] placeholder:text-[#a79c91] focus-visible:ring-1 focus-visible:ring-[#8a7158]/30"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="group mt-2 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#6f4a36] text-xs font-medium uppercase tracking-[0.16em] text-white shadow-none transition-all hover:bg-[#5f3d2c] disabled:opacity-60"
            >
              <span>
                {loading
                  ? "Signing in..."
                  : "Enter Administration"}
              </span>

              {!loading && (
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <LockKeyhole
            className="size-3.5 text-[#a19386]"
            strokeWidth={1.5}
          />

          <p className="text-[10px] tracking-[0.08em] text-[#93867a]">
            Secure administrator access
          </p>
        </div>
      </section>
    </main>
  );
}