import type { ProjectEntry } from '@/types';

export const projects: ProjectEntry[] = [
  {
    company: 'SecureCo, Inc.',
    title: 'iOS Client Demo',
    description:
      'I initially developed SecureCo CONNECT VPN client as a prototype to rapidly showcase our network capabilities, but it quickly grew into a fully functional application.',
    thumbnail: '/assets/images/thumbnails/ios.jpg',
    videoUrl: 'https://www.youtube.com/embed/r4OrayDG5k0',
  },
  {
    company: 'SecureCo, Inc.',
    title: 'Android Client Demo',
    description:
      "Similarly to iOS app, I've been tasked to rapidly prototype SecureCo CONNECT client as an initial proof of concept, which later turned into a consumer-facing product.",
    thumbnail: '/assets/images/thumbnails/android.jpg',
    videoUrl: 'https://www.youtube.com/embed/BaY8iDENMx4',
  },
  {
    company: 'SecureCo, Inc.',
    title: 'MacOS Client Demo',
    description:
      'Once our mobile clients were functional, we quickly realized that we need SecureCo CONNECT MacOS client as well. Although many UI elements were ported over, it was very educational developing my very first system extension.',
    thumbnail: '/assets/images/thumbnails/macos.jpg',
    videoUrl: 'https://www.youtube.com/embed/ROUbkq4S7ZA',
  },
  {
    company: 'SecureCo, Inc.',
    title: 'Mesh Simulator Demo',
    description:
      'This was quite an interesting project. Many cool frameworks have been utilized to develop SecureCo Mesh Visualizer such as D3.js, MaterialUI and React.',
    thumbnail: '/assets/images/thumbnails/simulator.jpg',
    videoUrl: 'https://www.youtube.com/embed/bddTjAx_l44',
  },
  {
    company: 'SecureCo, Inc.',
    title: 'Customer Portal Demo',
    description:
      'A customer portal was designed with flexibility in mind, giving users full control over their entire organization as far as managing licenses, endpoints, groups, users, policies and suborganizations.',
    thumbnail: '/assets/images/thumbnails/admin-portal.jpg',
    videoUrl: 'https://www.youtube.com/embed/E991YEpPX2o',
  },
  {
    company: 'PeerStream, Inc.',
    title: 'Firetalk Mobile App',
    description:
      'The idea behind Firetalk was to provide an always-on live streaming app for a new generation of broadcasters. It was an iOS and Web solution where we had 3 developers in total working on this project. I was the lead developer on iOS side.',
    thumbnail: '/assets/images/thumbnails/firetalk.jpg',
    images: [
      '/assets/images/firetalk/img-firetalk-1.png',
      '/assets/images/firetalk/img-firetalk-2.png',
      '/assets/images/firetalk/img-firetalk-3.png',
      '/assets/images/firetalk/img-firetalk-4.png',
    ],
  },
];
