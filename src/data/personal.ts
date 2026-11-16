import type { SocialLink } from '@/types';

export const personalInfo = {
  name: 'Sebastian Misiewicz',
  title: 'Software Developer',
  bio: [
    'With over sixteen years of experience in software development, I specialize in delivering high-quality mobile and web solutions. My expertise primarily focuses on native mobile app development for iOS, macOS, and Android, as well as creating dynamic and responsive web applications.',
    'I have a strong background in building and deploying React Native apps that work seamlessly across multiple platforms, while also leveraging native technologies to deliver optimized, platform-specific features. Throughout my career, I have contributed to a wide range of projects, from consumer-facing mobile apps to complex enterprise web applications, always prioritizing clean, maintainable code and performance.',
    'I am passionate about using the latest technologies to create exceptional apps that provide outstanding user experiences. Whether developing for mobile or web platforms, I am dedicated to building scalable, user-centric solutions that meet both business and user needs.',
  ],
  highlightedTerms: ['iOS', 'macOS', 'Android', 'React Native'],
} as const;

export const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    url: 'https://github.com/smisiewicz',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sebastian-misiewicz-8b545b24/',
    icon: 'linkedin',
  },
];

export const resumePath = '/assets/sebastian-misiewicz-resume.pdf';
