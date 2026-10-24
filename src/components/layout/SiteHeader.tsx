'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ArrowRightIcon, CloseIcon, MenuIcon } from '@/components/brand/icons';
import { Wordmark } from '@/components/brand/Wordmark';
import { ButtonLink } from '@/components/ui/Button';
import { contactLink, mobileNav, partnerLink, primaryNav } from '@/lib/site';

function isCurrent(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Condense the header once the top of the page leaves the viewport.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry?.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Close the menu after navigation.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const openMenu = () => dialogRef.current?.showModal();
  const closeMenu = () => dialogRef.current?.close();

  return (
    <>
      <span ref={sentinelRef} aria-hidden="true" className="absolute top-0 left-0 h-px w-px" />
      <header
        data-scrolled={scrolled ? '' : undefined}
        className="sticky top-0 z-40 border-b border-transparent bg-transparent transition-[background-color,border-color] duration-300 data-scrolled:border-[color:var(--line)] data-scrolled:bg-ivory-50"
      >
        <div className="container-site flex h-[var(--header-height)] items-center justify-between gap-6">
          <Link href="/" className="-my-2 py-2">
            <Wordmark size="md" />
            <span className="sr-only">, home</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {primaryNav.map((item) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? 'page' : undefined}
                      className="link-quiet text-[0.9375rem] font-medium text-ink-900"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <Link href={partnerLink.href} className="link-quiet text-[0.9375rem] font-medium text-forest-800">
              {partnerLink.label}
            </Link>
            <ButtonLink href={contactLink.href} size="sm">
              {contactLink.label}
            </ButtonLink>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={openMenu}
            aria-haspopup="dialog"
            aria-controls="site-menu"
            className="-mr-2 inline-flex min-h-11 items-center gap-2 px-2 text-[0.9375rem] font-medium text-ink-900 lg:hidden"
          >
            <span>Menu</span>
            <MenuIcon />
          </button>
        </div>
      </header>

      <dialog
        id="site-menu"
        ref={dialogRef}
        aria-label="Site menu"
        data-animate=""
        data-lock-scroll=""
        onClose={() => menuButtonRef.current?.focus()}
        className="on-dark m-0 h-dvh max-h-none w-full max-w-none bg-botanical-950 p-0 text-ivory-50 backdrop:bg-transparent lg:hidden"
      >
        <div className="flex min-h-full flex-col">
          <div className="container-site flex h-[var(--header-height)] shrink-0 items-center justify-between">
            <Link href="/" onClick={closeMenu}>
              <Wordmark tone="ivory" size="md" />
              <span className="sr-only">, home</span>
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              className="-mr-2 inline-flex min-h-11 items-center gap-2 px-2 text-[0.9375rem] font-medium"
            >
              <span>Close</span>
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="Mobile" className="container-site flex-1 pt-6 pb-10">
            <ol className="rule-on-dark">
              {mobileNav.map((item) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-[color:var(--line-on-dark)]">
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={current ? 'page' : undefined}
                      className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 py-4"
                    >
                      <span>
                        <span className="block font-display text-[1.75rem] leading-tight font-bold">{item.label}</span>
                        {item.description ? (
                          <span className="type-caption mt-1 block text-sage-300">{item.description}</span>
                        ) : null}
                      </span>
                      <ArrowRightIcon className="text-gold-300 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </dialog>
    </>
  );
}
