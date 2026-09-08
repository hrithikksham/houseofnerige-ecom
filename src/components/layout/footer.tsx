import Image from "next/image";
import Link from "next/link";

import { Button, Input } from "@/components/ui";
import { Container } from "@/components/ui/container";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Exchange & Return Policy", href: "/returns" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      {/* ================= DESKTOP ================= */}
      <div className="relative hidden overflow-hidden md:block">
        {/* Background artwork - preserves original image ratio */}
        <Image
          src="/images/footer/footer-desktop.png"
          alt=""
          width={2400}
          height={1000}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-fill"
          aria-hidden="true"
        />

        {/* Desktop content */}
        <Container className="relative z-10 min-h-[720px] pt-16 lg:min-h-[820px] lg:pt-20">
          <div className="grid grid-cols-[1.1fr_1.5fr_1fr_1.2fr] gap-10 lg:gap-14">
            {/* Brand */}
            <div className="flex flex-col">
              <Link href="/" className="inline-block w-fit">
                <Image
                  src="/images/logo/nerige-logos.png"
                  alt="Nerige Sarees"
                  width={320}
                  height={120}
                  className="h-auto w-40 lg:w-48"
                />
              </Link>

              <div className="mt-10 flex gap-6 text-sm text-primary">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="transition-colors hover:text-terracotta"
                >
                  Facebook
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="transition-colors hover:text-terracotta"
                >
                  Instagram
                </a>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                About the House
              </h3>

              <div className="mt-6 space-y-4 text-sm leading-7 text-primary/85 lg:text-base">
                <p>
                  <strong className="font-semibold text-primary">
                    Nerige Sarees
                  </strong>
                  {" — "}
                  Timeless sarees rooted in tradition and thoughtfully curated
                  for today.
                </p>

                <p>
                  <strong className="font-semibold text-primary">Email:</strong>{" "}
                  contact@houseofnerige.com
                </p>

                <p>
                  <strong className="font-semibold text-primary">
                    Chat on WhatsApp:
                  </strong>{" "}
                  Coming soon
                </p>

                <p>
                  <strong className="font-semibold text-primary">
                    Business Hours:
                  </strong>{" "}
                  9 AM to 6 PM
                </p>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Quick Links
              </h3>

              <nav className="mt-6 flex flex-col items-start gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-primary/85 transition-colors hover:text-terracotta lg:text-base"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Keep in Touch
              </h3>

              <p className="mt-6 text-sm leading-7 text-primary/85 lg:text-base">
                Subscribe and receive exclusive stories, new arrivals, and
                thoughtful updates from Nerige Sarees.
              </p>

              <form className="mt-6 space-y-3">
                <Input
                  type="email"
                  placeholder="Your e-mail address"
                  aria-label="Email address"
                  className="min-h-12 bg-background/90"
                />

                <Button
                  type="submit"
                  variant="secondary"
                  className="min-h-12 w-full uppercase tracking-[0.16em]"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="absolute left-0 right-0 top-[520px] px-6 lg:top-[600px]">
            <div className="border-t border-primary/15 pt-5">
              <p className="text-xs text-primary/70">
                © {new Date().getFullYear()} Nerige Sarees. All rights
                reserved.
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="relative overflow-hidden md:hidden">
        {/* Mobile background artwork */}
        <Image
          src="/images/footer/footer-mobiles.png"
          alt=""
          width={1000}
          height={1600}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-fill"
          aria-hidden="true"
        />

        {/* Mobile content */}
        <Container className="relative z-10 min-h-[1200px] py-12">
          <div className="space-y-10">
            {/* Brand */}
            <div>
              <Link href="/" className="inline-block">
                <Image
                  src="/images/logo/nerige-logos.png"
                  alt="Nerige Sarees"
                  width={320}
                  height={120}
                  className="h-auto w-40"
                />
              </Link>

              <div className="mt-8 flex gap-6 text-sm text-primary">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="transition-colors hover:text-terracotta"
                >
                  Facebook
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="transition-colors hover:text-terracotta"
                >
                  Instagram
                </a>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                About the House
              </h3>

              <div className="mt-5 space-y-4 text-sm leading-7 text-primary/85">
                <p>
                  <strong className="text-primary">Nerige Sarees</strong>
                  {" — "}
                  Timeless sarees rooted in tradition and thoughtfully curated
                  for today.
                </p>

                <p>
                  <strong className="text-primary">Email:</strong>{" "}
                  contact@houseofnerige.com
                </p>

                <p>
                  <strong className="text-primary">Chat on WhatsApp:</strong>{" "}
                  Coming soon
                </p>

                <p>
                  <strong className="text-primary">Business Hours:</strong>{" "}
                  9 AM to 6 PM
                </p>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Quick Links
              </h3>

              <nav className="mt-5 flex flex-col items-start gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-primary/85 transition-colors hover:text-terracotta"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>


            {/* Copyright */}
            <div className="border-t border-primary/15 pt-5">
              <p className="text-xs text-primary/70">
                © {new Date().getFullYear()} Nerige Sarees. All rights
                reserved.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}