'use client';

import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { PiDownloadSimple } from 'react-icons/pi';

import { personalInfo, resumePath, socialLinks } from '@/data/personal';
import { highlightTerms } from '@/lib/highlightTerms';

import PanelShell from './PanelShell';

const ICONS = { github: FaGithub, linkedin: FaLinkedin } as const;
const LINK_CLASS =
  'hive-chip flex min-h-11 items-center gap-2 border border-hive-line bg-hive-cyan/5 px-4 font-mono text-xs uppercase tracking-[0.2em] text-hive-cyan transition-colors hover:bg-hive-cyan hover:text-hive-bg';

export default function AboutPanel(): React.JSX.Element {
  const [firstName, ...lastNames] = personalInfo.name.split(' ');

  return (
    <PanelShell code="01 // IDENTITY" title="About">
      <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-center sm:gap-10">
        <div className="hex-clip h-52 w-[11.25rem] shrink-0 bg-gradient-to-b from-hive-ice to-hive-cyan/40 p-0.5 md:h-64 md:w-[13.85rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/images/portrait.jpeg"
            alt={personalInfo.name}
            className="hex-clip h-full w-full object-cover"
          />
        </div>

        <div className="text-center sm:text-left">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-hive-muted">Hi there!</p>
          <p className="mt-2 font-display text-3xl font-bold leading-tight text-hive-ice md:text-4xl">
            I am <span className="glow-text text-hive-cyan">{firstName}</span>
            <span className="glow-text block text-hive-cyan">{lastNames.join(' ')}</span>
          </p>
          <p className="mt-3 text-lg font-light uppercase tracking-[0.25em] text-hive-ice md:text-xl">
            {personalInfo.title}
          </p>

          <ul className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            {socialLinks.map((link) => {
              const Icon = ICONS[link.icon];
              return (
                <li key={link.label}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                    <Icon className="text-lg" />
                    {link.label}
                  </a>
                </li>
              );
            })}
            <li>
              <a href={resumePath} download="sebastian-misiewicz-resume.pdf" className={LINK_CLASS}>
                <PiDownloadSimple className="text-lg" />
                Resume
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-9 space-y-4 border-l-2 border-hive-cyan/40 pl-5 text-[1.05rem] font-light leading-relaxed">
        {personalInfo.bio.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{highlightTerms(paragraph, personalInfo.highlightedTerms)}</p>
        ))}
      </div>
    </PanelShell>
  );
}
