/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MediaEntry, CategoryType } from '../types';

export const CATEGORIES: CategoryType[] = [
  'Movies',
  'Series',
  'Hollywood',
  'Bollywood',
  'Computer-Tech',
  'PC-Apps',
  'Android-Apps'
];

export const CATEGORY_DESCRIPTIONS: Record<CategoryType, string> = {
  'Movies': 'Feature-length cinematic sci-fi adventures and cyberpunk thrillers.',
  'Series': 'Multi-episode high-impact sagas exploring the cyberspace frontier.',
  'Hollywood': 'High-budget western cinematic masterpieces and futuristic action.',
  'Bollywood': 'Epic futuristic stories with rich culture, technological revolutions, and cyberpunk drama.',
  'Computer-Tech': 'Underground documentation, hacking lectures, and deep hardware architecture guides.',
  'PC-Apps': 'Powerful system utilities, secure terminal tools, and cyberpunk PC software.',
  'Android-Apps': 'Mobile neural interfaces, holographic sync apps, and neon mobile decrypters.'
};

const DEFAULT_MEDIA_ENTRIES: MediaEntry[] = [
  {
    id: 'neo-tokyo-2099',
    title: 'NEO-TOKYO: NEURAL EXTINCTION',
    description: 'In the neon-drenched corridors of Neo-Tokyo, a renegade deck-runner uncovers a corporate neural virus threatening to delete the memories of civilization. To stop it, they must jack into the Forbidden Core and face a hyper-intelligent AI entity.',
    thumbnail: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=800&q=80',
    category: 'Movies',
    videoUrl: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c022f733efd97aa9d77a06c54784a0d8&profile_id=165&oauth2_token_id=57447761',
    downloadUrl: '#',
    rating: 4.8,
    releaseYear: '2099',
    fileSize: '4.2 GB',
    developerOrStudio: 'Aetheria Pictures',
    isFeatured: true,
    tags: ['Cyberpunk', 'Neo-Tokyo', 'Action', 'Sci-Fi']
  },
  {
    id: 'synth-rider',
    title: 'SYNTH-RIDER: CYBER HIGHERS',
    description: 'Across the endless neon expressways of Kepler Prime, a synthetic courier delivers illegal cybernetic memory shards. When one delivery contains a state secret, they become targets of the planetary defense grid.',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    category: 'Series',
    videoUrl: 'https://player.vimeo.com/external/538571057.sd.mp4?s=6956637e1088ceee6a666579fc915ab94759cd8f&profile_id=165&oauth2_token_id=57447761',
    downloadUrl: '#',
    rating: 4.6,
    releaseYear: '2026',
    fileSize: '1.8 GB / Episode',
    developerOrStudio: 'Neon-Drift Laboratories',
    isFeatured: true,
    tags: ['Synthwave', 'Neon', 'Race', 'Thriller']
  },
  {
    id: 'cyber-metropolis',
    title: 'CYBER METROPOLIS: CORRUPT CODES',
    description: 'A stellar english blockbusting sci-fi thriller detailing a corporate conspiracy inside an AI tower. A security specialist accidentally detects a rogue routine that has hijacked the city\'s life-support mainframes.',
    thumbnail: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&w=800&q=80',
    category: 'Hollywood',
    videoUrl: 'https://player.vimeo.com/external/540092305.sd.mp4?s=d3ee23b08709ca8101a8fe55cffdf8ebf250cf4f&profile_id=165&oauth2_token_id=57447761',
    downloadUrl: '#',
    rating: 4.5,
    releaseYear: '2025',
    fileSize: '3.6 GB',
    developerOrStudio: 'Metro-Grid Studios',
    isFeatured: false,
    tags: ['AI Conspiracy', 'Thriller', 'Intense', 'Action']
  },
  {
    id: 'dumyara-awakening',
    title: 'DUMYARA: DIGITAL REBEL',
    description: 'In the glowing sprawl of Future New Delhi, a cybernetically-enhanced warrior triggers an uprising against totalitarian network overlords. Bringing together ancient code-chants and futuristic high-speed plasma blades.',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    category: 'Bollywood',
    videoUrl: 'https://player.vimeo.com/external/494252668.sd.mp4?s=a76d1e433f524e107df681e5b8a6d6556e792c39&profile_id=165&oauth2_token_id=57447761',
    downloadUrl: '#',
    rating: 4.9,
    releaseYear: '2026',
    fileSize: '5.1 GB',
    developerOrStudio: 'Chakra Cyberscapes',
    isFeatured: false,
    tags: ['Epic', 'Revolution', 'Cyborg', 'Futuristic']
  },
  {
    id: 'hacking-the-system',
    title: 'TERMINAL DECRYPT: UNDERGROUND HACKING',
    description: 'An elite security expert takes you deep into the underground world of hardware hacking. Learn real-time buffer overflows, logic board bypasses, and decrypting classified firmware packages safely in simulated zones.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    category: 'Computer-Tech',
    videoUrl: 'https://player.vimeo.com/external/482255747.sd.mp4?s=d00465c4ec90b20cb3dd7d2280d9af904fa85f9c&profile_id=165&oauth2_token_id=57447761',
    downloadUrl: '#',
    rating: 4.7,
    releaseYear: '2026',
    fileSize: '820 MB',
    developerOrStudio: 'Black Hat Academics',
    isFeatured: false,
    tags: ['Cybersecurity', 'Terminal', 'Datacenter', 'Hardware']
  },
  {
    id: 'quantum-os-v4',
    title: 'QUANTUM OS: DECENTRALIZED WORKSTATION',
    description: 'The ultimate decentralized workspace environment application. Features sandboxed compiler modules, built-in SSH encryptors with custom visual flows, neural node overclocks, and beautiful vintage HUD widgets.',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    category: 'PC-Apps',
    videoUrl: 'https://player.vimeo.com/external/517602124.sd.mp4?s=fb1403c80a58faeef4fcbf21f92c300f22adbbe3&profile_id=165&oauth2_token_id=57447761',
    downloadUrl: '#',
    rating: 4.9,
    releaseYear: '2026',
    fileSize: '154 MB (ZIP)',
    developerOrStudio: 'BJU-Core Systems',
    isFeatured: false,
    tags: ['Workspace', 'Terminal', 'Developer', 'HUD']
  },
  {
    id: 'neural-link-mobile',
    title: 'NEURAL-GRID: HOLOGRAPHIC VIEW',
    description: 'Track, debug, and monitor server grids globally from your Android device. Connects seamlessly with VR headsets to render network telemetry in gorgeous real-time 3D neon charts.',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    category: 'Android-Apps',
    videoUrl: 'https://player.vimeo.com/external/435674703.sd.mp4?s=7f5255470ab758837e72152843efc7d7e7939c36&profile_id=165&oauth2_token_id=57447761',
    downloadUrl: '#',
    rating: 4.4,
    releaseYear: '2026',
    fileSize: '45 MB (APK)',
    developerOrStudio: 'Hyperwave Mobile Co',
    isFeatured: false,
    tags: ['Diagnostic', 'Network', 'Mobile', 'Hologram']
  }
];

// Memory storage fallback for environments where localStorage is blocked (such as sandboxed cross-origin iframes)
const memoryStorage: Record<string, string> = {};

const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.warn("Storage warning: Access to localStorage is blocked. Falling back to memory storage.", e);
    }
    return memoryStorage[key] || null;
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn("Storage warning: Access to localStorage is blocked. Falling back to memory storage.", e);
    }
    memoryStorage[key] = value;
  }
};

// Helper to load/save custom entries in localStorage
export function getMediaEntries(): MediaEntry[] {
  const stored = safeStorage.getItem('bju_verse_media');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  // If not set, initialize with default
  safeStorage.setItem('bju_verse_media', JSON.stringify(DEFAULT_MEDIA_ENTRIES));
  return DEFAULT_MEDIA_ENTRIES;
}

export function saveMediaEntries(entries: MediaEntry[]) {
  safeStorage.setItem('bju_verse_media', JSON.stringify(entries));
}

export function addMediaEntry(entry: MediaEntry) {
  const current = getMediaEntries();
  current.unshift(entry); // Newest on top
  saveMediaEntries(current);
}

export function deleteMediaEntry(id: string) {
  const current = getMediaEntries();
  const filtered = current.filter(item => item.id !== id);
  saveMediaEntries(filtered);
}

// User-authored Comments local system
export interface Comment {
  id: string;
  mediaId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export function getComments(mediaId: string): Comment[] {
  const stored = safeStorage.getItem(`bju_comments_${mediaId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  
  // Dummy starting reviews
  const defaults: Comment[] = [
    {
      id: 'c1',
      mediaId,
      userName: 'Kenshiro_C90',
      text: 'Visual fidelity is stunning! Standard 60fps loads immediately on my rig.',
      timestamp: '2 hours ago'
    },
    {
      id: 'c2',
      mediaId,
      userName: 'cyber_romance',
      text: 'Absolutely insane. Playback speeds work flawlessly.',
      timestamp: 'Yesterday'
    }
  ];
  return defaults;
}

export function addComment(comment: Comment) {
  const current = getComments(comment.mediaId);
  current.unshift(comment);
  safeStorage.setItem(`bju_comments_${comment.mediaId}`, JSON.stringify(current));
}

// Security Passcode Auth - Cyber style
export const ADMIN_PASSCODE = 'bunny@96.96'; // Secure custom passcode requested by operator
