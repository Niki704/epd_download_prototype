import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import packageJson from "../../../package.json";

const appVersion = `v${packageJson.version}`;
const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-slate-950 to-slate-950/95 py-8 sm:py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        {/* Main Footer Content */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/main-logo.png"
                alt="Education Publications Department"
                width={751}
                height={102}
                className="h-auto w-32 sm:w-40"
              />
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              A modern archive for educational publications and learning
              materials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="#top"
                  className="text-sm text-white/70 transition-colors hover:text-accent-purple flex items-center gap-1.5"
                >
                  Browse Materials
                </Link>
              </li>
              <li>
                <Link
                  href="#top"
                  className="text-sm text-white/70 transition-colors hover:text-accent-purple flex items-center gap-1.5"
                >
                  Search Archive
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Niki704/epd_download_prototype.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 transition-colors hover:text-accent-purple inline-flex items-center gap-1.5"
                >
                  <Image
                    src="/github.png"
                    alt="GitHub"
                    width={14}
                    height={14}
                    className="shrink-0 opacity-90"
                  />
                  GitHub
                  <ExternalLink size={12} className="opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              About
            </h3>
            <ul className="space-y-2.5">
              <li>
                <p className="text-sm text-white/70 leading-relaxed">
                  This prototype is designed to showcase the latest educational
                  materials provided by the Educational Publication Department.
                </p>
              </li>
            </ul>
          </div>

          {/* Contact / Info */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Creator
            </h3>
            <div className="space-y-3">
              <p className="text-sm font-medium text-white">Niklesh</p>
              <Link
                href="https://github.com/Niki704"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-accent-purple transition-all text-sm font-medium group"
              >
                <Image
                  src="/github.png"
                  alt="GitHub"
                  width={16}
                  height={16}
                  className="shrink-0 opacity-90 group-hover:opacity-100 transition-opacity"
                />
                View on GitHub
              </Link>
              <div className="pt-2">
                <p className="text-xs text-white/60">Supervised by</p>
                <p className="text-sm font-medium text-white/80">
                  K.D.Lal Chandrasiri
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p>
              &copy; {currentYear} Education Publications Department. All rights
              reserved.
            </p>
            <div className="hidden sm:flex gap-4">
              <span className="text-white/40 cursor-not-allowed">
                Privacy Policy
              </span>
              <span className="text-white/20">•</span>
              <span className="text-white/40 cursor-not-allowed">
                Terms of Use
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 font-mono">
              {appVersion}
            </span>
            <span className="text-white/40">•</span>
            <p className="text-xs">
              Made with <span className="text-accent-purple">♥</span> for
              education
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
