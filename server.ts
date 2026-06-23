/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import url from "url";
import http from "http";
import https from "https";

const app = express();
const PORT = 3000;

// Ensure upload directory exists inside public folder so it's clean and accessible
const uploadDir = path.join(process.cwd(), 'public/uploads');
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a secure unique-suffix filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 150 * 1024 * 1024, // Allow files up to 150MB
  }
});

// Parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static routes to serve uploaded files directly
app.use('/uploads', express.static(uploadDir));
app.use('/uploads', express.static(publicDir));
app.use(express.static(publicDir));

// Route to handle individual file uploads with dynamic error catching to avoid HTML responses
app.post('/api/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error during file upload:", err);
      return res.status(400).json({ success: false, error: `Multer physical transport error: ${err.message}` });
    } else if (err) {
      console.error("Unknown file transport error:", err);
      return res.status(500).json({ success: false, error: `File transport write error: ${err.message}` });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file received in transmission stream.' });
      }
      
      // Construct local relative path
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({
        success: true,
        url: fileUrl,
        size: req.file.size,
        filename: req.file.filename
      });
    } catch (innerErr: any) {
      console.error("Upload process error:", innerErr);
      res.status(500).json({ success: false, error: innerErr.message || 'Failure writing node to disk.' });
    }
  });
});

// Database file path and default seeding logic
const oldDbPath = path.join(process.cwd(), 'public/uploads', 'media-db.json');
const dbPath = path.join(process.cwd(), 'public', 'media-db.json');

const DEFAULT_MEDIA_ENTRIES = [
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

// Read database
function readMediaDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      if (fs.existsSync(oldDbPath)) {
        // Safe migration
        fs.copyFileSync(oldDbPath, dbPath);
      } else {
        fs.writeFileSync(dbPath, JSON.stringify(DEFAULT_MEDIA_ENTRIES, null, 2), "utf-8");
        return DEFAULT_MEDIA_ENTRIES;
      }
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read media database:", err);
    return DEFAULT_MEDIA_ENTRIES;
  }
}

// Write database
function writeMediaDb(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to write media database:", err);
  }
}

// REST endpoints to manage persistent media database
app.get('/api/media', (req, res) => {
  const list = readMediaDb();
  res.json(list);
});

app.post('/api/media', (req, res) => {
  try {
    const newEntry = req.body;
    if (!newEntry || !newEntry.id || !newEntry.title) {
      return res.status(400).json({ error: 'Invalid media matrix package.' });
    }
    const currentList = readMediaDb();
    currentList.unshift(newEntry);
    writeMediaDb(currentList);
    res.json({ success: true, entry: newEntry });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Matrix ingestion fault.' });
  }
});

app.delete('/api/media/:id', (req, res) => {
  try {
    const id = req.params.id;
    const currentList = readMediaDb();
    const updated = currentList.filter((item: any) => item.id !== id);
    writeMediaDb(updated);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Matrix purge fault.' });
  }
});

// Robust attachment-based stream dispatcher bypassing CORS and mobile Safari/Chrome iframe download limits
app.get('/api/download', async (req, res) => {
  try {
    const targetUrl = req.query.url as string;
    let fileName = (req.query.name as string) || 'BJU_VERSE_DOWNLOAD';
    
    if (!targetUrl) {
      return res.status(400).send('No target url specified.');
    }

    // Clean fileName for safe storage headers
    fileName = fileName.replace(/[/\\?%*:|"<>\s]/g, '_');
    
    // Auto-detect extension based on URL and append if missing
    let ext = '.mp4';
    const lowerUrl = targetUrl.toLowerCase();
    if (lowerUrl.includes('.apk')) ext = '.apk';
    else if (lowerUrl.includes('.exe')) ext = '.exe';
    else if (lowerUrl.includes('.zip')) ext = '.zip';
    else if (lowerUrl.includes('.pdf')) ext = '.pdf';
    else if (lowerUrl.includes('.txt')) ext = '.txt';
    else if (lowerUrl.includes('.png')) ext = '.png';
    else if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg')) ext = '.jpg';

    if (!fileName.toLowerCase().endsWith('.apk') && 
        !fileName.toLowerCase().endsWith('.exe') && 
        !fileName.toLowerCase().endsWith('.zip') && 
        !fileName.toLowerCase().endsWith('.txt') && 
        !fileName.toLowerCase().endsWith('.mp4') && 
        !fileName.toLowerCase().endsWith('.png') && 
        !fileName.toLowerCase().endsWith('.jpg')) {
      fileName += ext;
    }

    // Simulation file dynamic compiler
    if (targetUrl.startsWith('simulation-app:')) {
      const appFileName = targetUrl.replace('simulation-app:', '');
      const virtualContent = `====================================================================
BJU-NET MATRIX TERMINAL // AUTOMATED INSTALLER REPORT
====================================================================

MODULE: ${fileName.toUpperCase()}
ORIGINAL SOURCE BINARY: ${appFileName}
DECRYPTION STATUS: SIGNED & AUTHORIZED

[SYSTEM NOTES]
- Integrity handshake validated (100% safe).
- Virtual node mapping succeeded.
- Target device context identified: Mobile/PC client node.

--------------------------------------------------------------------
SYS_LOG: Decoupled matrix core index... Ok.
SYS_LOG: Linked native dependencies... Ok.
SYS_LOG: System binary loaded successfully at local terminal.
--------------------------------------------------------------------

This is a simulated deployment signature block for testing purposes.
Enjoy exploring your new digital asset pipeline in the BJU-Verse matrix!`;
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName.replace(/\.mp4$/, '_setup.txt')}"`);
      return res.send(virtualContent);
    }

    // Check if targetUrl contains local uploads or is a local root file
    let isLocal = false;
    let localRelPath = '';

    if (targetUrl) {
      if (targetUrl.includes('/uploads/')) {
        isLocal = true;
        const idx = targetUrl.indexOf('/uploads/');
        localRelPath = targetUrl.substring(idx + 1); // e.g. "uploads/123.mp4"
      } else if (targetUrl.startsWith('uploads/')) {
        isLocal = true;
        localRelPath = targetUrl;
      } else if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('blob:') && !targetUrl.startsWith('data:') && !targetUrl.startsWith('simulation-app:')) {
        isLocal = true;
        localRelPath = targetUrl.replace(/^\//, ''); // e.g. "file-123.mp4"
      }
    }

    if (isLocal) {
      // Find where the file exists: in public/ or in public/uploads/
      let absolutePath = path.join(process.cwd(), 'public', localRelPath);
      
      if (!fs.existsSync(absolutePath) && !localRelPath.startsWith('uploads/')) {
        // Fallback to checking public/uploads directory
        const fallbackPath = path.join(process.cwd(), 'public/uploads', localRelPath);
        if (fs.existsSync(fallbackPath)) {
          absolutePath = fallbackPath;
        }
      } else if (!fs.existsSync(absolutePath) && localRelPath.startsWith('uploads/')) {
        // Extract root filename from uploads/file.ext and check directly in public/
        const rootFilename = localRelPath.replace(/^uploads\//, '');
        const fallbackPath = path.join(process.cwd(), 'public', rootFilename);
        if (fs.existsSync(fallbackPath)) {
          absolutePath = fallbackPath;
        }
      }

      if (fs.existsSync(absolutePath)) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        // Express sendFile handles the header types, sizes, ranges and downloads flawlessly
        return res.sendFile(absolutePath);
      } else {
        return res.status(404).send('Resource has been deleted or expired.');
      }
    }

    // Remote HTTP/HTTPS assets stream proxy bypasses CORS completely 
    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      const parsedUrl = url.parse(targetUrl);
      const requester = targetUrl.startsWith('https://') ? https : http;

      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');

      // Request stream delegation
      const opt = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      };

      const connector = requester.get(targetUrl, opt, (stream: any) => {
        // Handle basic redirects (301, 302)
        if (stream.statusCode && (stream.statusCode === 301 || stream.statusCode === 302) && stream.headers.location) {
          const redirectUrl = stream.headers.location;
          const finalRequester = redirectUrl.startsWith('https://') ? https : http;
          
          return finalRequester.get(redirectUrl, opt, (redirectStream: any) => {
            if (redirectStream.headers['content-length']) {
              res.setHeader('Content-Length', redirectStream.headers['content-length']);
            }
            if (redirectStream.headers['content-type']) {
              res.setHeader('Content-Type', redirectStream.headers['content-type']);
            }
            redirectStream.pipe(res);
          }).on('error', (e: any) => {
            console.error("Proxy redirect pipeline crash:", e);
            res.status(500).send("External redirect network connection timed out.");
          });
        }
        
        // Forward standard stream metadata to prevent chrome "couldnotdownload / network issue" halts
        if (stream.headers['content-length']) {
          res.setHeader('Content-Length', stream.headers['content-length']);
        }
        if (stream.headers['content-type']) {
          res.setHeader('Content-Type', stream.headers['content-type']);
        }

        // Pipe stream directly 
        stream.pipe(res);
      });

      connector.on('error', (e: any) => {
        console.error("Proxy main connection crash:", e);
        res.status(500).send("External proxy stream connection timed out.");
      });
      return;
    }

    return res.status(400).send('Invalid file protocol.');
  } catch (err: any) {
    console.error("Global stream dispatcher panic:", err);
    res.status(500).send(err.message || 'Stream dispatcher panic.');
  }
});

async function startServer() {
  // Vite dev server middleware integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built files
    const distPath = path.join(process.cwd(), 'dist');
    const publicPath = path.join(process.cwd(), 'public');
    app.use(express.static(distPath));
    app.use(express.static(publicPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BJU-VERSE SERVER] Online at http://0.0.0.0:${PORT}`);
  });
}

startServer();
