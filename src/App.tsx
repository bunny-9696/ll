/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Download, 
  Settings, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Film, 
  Monitor, 
  Tv, 
  Cpu, 
  Smartphone, 
  Check, 
  Star, 
  Calendar, 
  HardDrive, 
  Tag, 
  X, 
  Camera, 
  Sliders, 
  Plus, 
  Trash2, 
  Shield, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Maximize,
  Upload,
  AlertTriangle,
  Instagram
} from 'lucide-react';
import { 
  getMediaEntries, 
  saveMediaEntries,
  addMediaEntry, 
  deleteMediaEntry, 
  CATEGORIES, 
  CATEGORY_DESCRIPTIONS, 
  ADMIN_PASSCODE 
} from './lib/store';
import { CategoryType, MediaEntry } from './types';

export default function App() {
  // Global States
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStatus, setBootStatus] = useState('DECRYPTING MATRIX ARCHIVES...');
  const [bootLogs, setBootLogs] = useState<string[]>([
    'BJU-VERSE COLD MATRIX INIT SEQUENCE...',
    'SYSTEM SECURITY clearance: LEVEL-9 DETECTED',
  ]);

  // High-Level 3D Logo mouse-parallax states
  const [logoCoords, setLogoCoords] = useState({ x: 0, y: 0 });
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const handleLogoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left - width / 2) / (width / 2); // ranges -1 to 1
    const y = (e.clientY - rect.top - height / 2) / (height / 2); // ranges -1 to 1
    setLogoCoords({ x: x * 35, y: -y * 35 });
  };

  const [mediaList, setMediaList] = useState<MediaEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaEntry | null>(null);
  const [activeVideo, setActiveVideo] = useState<MediaEntry | null>(null);
  const [localBlobUrls, setLocalBlobUrls] = useState<Record<string, string>>({});
  const [videoPlayError, setVideoPlayError] = useState<string | null>(null);

  // Clear player error automatically on active video changes
  useEffect(() => {
    setVideoPlayError(null);
  }, [activeVideo]);
  
  // Custom video player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [videoQuality, setVideoQuality] = useState('1080p');
  const [moodColor, setMoodColor] = useState<'blue' | 'pink' | 'purple' | 'green'>('blue');
  const [capturedScreenshot, setCapturedScreenshot] = useState<string | null>(null);
  const [showScreenshotAlert, setShowScreenshotAlert] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
  // Real-time video adjustment states (Video Enhancer)
  const [videoBrightness, setVideoBrightness] = useState(100);
  const [videoContrast, setVideoContrast] = useState(100);
  const [videoSaturation, setVideoSaturation] = useState(100);
  const [videoSharpness, setVideoSharpness] = useState(0);
  const [showVideoEditor, setShowVideoEditor] = useState(false);

  const resetVideoAdjustments = () => {
    setVideoBrightness(100);
    setVideoContrast(100);
    setVideoSaturation(100);
    setVideoSharpness(0);
    showNotification("CALIBRATION RESET: Standard matrix render re-enabled.", "info");
  };

  // Admin section states
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Simulated download state
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Admin upload form states
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('Movies');
  const [newThumbnail, setNewThumbnail] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newDownloadUrl, setNewDownloadUrl] = useState('');
  const [newReleaseYear, setNewReleaseYear] = useState('2026');
  const [newFileSize, setNewFileSize] = useState('1.5 GB');
  const [newStudio, setNewStudio] = useState('Neo Corp');
  const [newTags, setNewTags] = useState('');

  // Local file upload states (to support direct uploads of files and thumbnails)
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [uploadedThumbnailFile, setUploadedThumbnailFile] = useState<File | null>(null);
  const [uploadedAppFile, setUploadedAppFile] = useState<File | null>(null);
  const [uploadVideoProgress, setUploadVideoProgress] = useState<string>('');
  const [uploadThumbnailProgress, setUploadThumbnailProgress] = useState<string>('');
  const [uploadAppProgress, setUploadAppProgress] = useState<string>('');
  const [isUploadingToServer, setIsUploadingToServer] = useState(false);
  const [serverUploadStatus, setServerUploadStatus] = useState('');
  const [uploadProgressPercent, setUploadProgressPercent] = useState<number>(0);
  const [instantSimulateUpload, setInstantSimulateUpload] = useState<boolean>(false);

  // Custom inline delete and toast notification system (avoid blocked iframe confirm/alert)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(prev => prev && prev.message === message ? null : prev);
    }, 4500);
  };

  // Video Ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  // Cybernetic Boot Sequence Logic
  useEffect(() => {
    if (!isBooting) return;

    let progress = 0;
    const phrases = [
      'TUNNELING SECURE HOST PORTS [0.0.0.0:3000]',
      'MOUNTING HOLOGRAPHIC STREAM DECODERS...',
      'SYNCHRONIZING AUDIO TRANSDUCERS...',
      'ACTIVATING SHADERS & GLOW CHANNELS...',
      'BJU-VERSE CORE SYSTEM READY FOR HOST'
    ];

    const timer = setInterval(() => {
      const inc = Math.floor(Math.random() * 3) + 1;
      progress = Math.min(progress + inc, 100);
      setBootProgress(progress);

      if (progress === 100) {
        setBootStatus('SYSTEM READY // ACCESS CORES AUTHORIZED');
        clearInterval(timer);
        const timeout = setTimeout(() => {
          setIsBooting(false);
        }, 550);
        return () => clearTimeout(timeout);
      } else if (progress > 85) {
        setBootStatus('FINALIZING COMPREHENSIVE HUD RENDER...');
        setBootLogs(prev => prev.includes(phrases[4]) ? prev : [...prev, phrases[4]]);
      } else if (progress > 65) {
        setBootStatus('LOADING RETRO-FUTURISTIC STYLING CHANNELS...');
        setBootLogs(prev => prev.includes(phrases[3]) ? prev : [...prev, phrases[3]]);
      } else if (progress > 45) {
        setBootStatus('DECOMPILING RECHARTS MULTIPLEX FEEDBACK...');
        setBootLogs(prev => prev.includes(phrases[2]) ? prev : [...prev, phrases[2]]);
      } else if (progress > 25) {
        setBootStatus('CONNECTING LOCAL CACHED ARCHIVES STORE...');
        setBootLogs(prev => prev.includes(phrases[1]) ? prev : [...prev, phrases[1]]);
      } else if (progress > 10) {
        setBootStatus('ESTABLISHING QUANTUM CLUTCH CONTROLLERS...');
        setBootLogs(prev => prev.includes(phrases[0]) ? prev : [...prev, phrases[0]]);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [isBooting]);

  // Initial loading
  useEffect(() => {
    updateMediaList();
  }, []);

  const updateMediaList = async () => {
    try {
      const response = await fetch('/api/media');
      if (response.ok) {
        const list = await response.json();
        setMediaList(list);
        saveMediaEntries(list); // Sync with localStorage as fallback
        return;
      }
    } catch (e) {
      console.error("Could not load from backend server, checking local fallbacks:", e);
    }
    // Fallback:
    const list = getMediaEntries();
    setMediaList(list);
  };

  // Keyboard Shortcut Event Controller for video playback (Spacebar, Arrows left/right/up/down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If there is no active video, skip
      if (!activeVideo) return;

      // Avoid intercepting keyboard events when typing inside inputs, selects or textareas
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
         target.tagName === 'TEXTAREA' ||
         target.tagName === 'SELECT' ||
         target.isContentEditable)
      ) {
        return;
      }

      switch (e.key) {
        case ' ': // Spacebar for Play / Pause
          e.preventDefault();
          togglePlay();
          showNotification(isPlaying ? "Stream Paused // Pause Cores" : "Stream Active // Decoding Live", "info");
          break;
        case 'ArrowLeft': // Go backward 10s
          e.preventDefault();
          handleSkip(-10);
          showNotification("Rewind << 10s Active", "info");
          break;
        case 'ArrowRight': // Go forward 10s
          e.preventDefault();
          handleSkip(10);
          showNotification("Fast Forward >> 10s Active", "info");
          break;
        case 'ArrowUp': // Volume Up
          e.preventDefault();
          setVolume(prev => {
            const nextVol = Math.min(1, parseFloat((prev + 0.1).toFixed(2)));
            if (videoRef.current) {
              videoRef.current.volume = nextVol;
            }
            showNotification(`Decibel Gain Adjusted: ${Math.round(nextVol * 100)}%`, "info");
            return nextVol;
          });
          break;
        case 'ArrowDown': // Volume Down
          e.preventDefault();
          setVolume(prev => {
            const nextVol = Math.max(0, parseFloat((prev - 0.1).toFixed(2)));
            if (videoRef.current) {
              videoRef.current.volume = nextVol;
            }
            showNotification(`Decibel Gain Adjusted: ${Math.round(nextVol * 100)}%`, "info");
            return nextVol;
          });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeVideo, isPlaying]);

  // Featured Media (Defaults to the first movie or featured element)
  const featuredMedia = mediaList.find(item => item.isFeatured) || mediaList[0];

  // Filtering media files based on Category & Search
  const filteredMedia = mediaList.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Handle Play/Pause Custom Player
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(err => {
        console.error("Video play failed:", err);
      });
    } else {
      videoRef.current.pause();
    }
  };

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    const element = videoContainerRef.current;
    
    // Check if currently inside full screen
    if (!document.fullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) { /* Safari */
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) { /* IE11 */
        (element as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // Handles skipping forwards/backwards 10s
  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds));
  };

  // Update progress bar
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeekBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
    }
  };

  const changeSpeed = (speed: number) => {
    setVideoSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  // Handle Custom Quality switch (Simulated UI change, alerts user)
  const changeQuality = (quality: string) => {
    setVideoQuality(quality);
    setShowQualityMenu(false);
    
    // Cyberpunk toast style simulation
    const currentLoc = videoRef.current ? videoRef.current.currentTime : 0;
    const isVidPlaying = isPlaying;
    
    if (videoRef.current) {
      // Small re-buffer simulation
      videoRef.current.pause();
      setIsPlaying(false);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentLoc;
          if (isVidPlaying) {
            videoRef.current.play().catch(err => {
              console.warn("Re-buffer simulation play failed:", err);
            });
            setIsPlaying(true);
          }
        }
      }, 400);
    }
  };

  // Screenshot Frame Capturer (Canvas extraction)
  const captureFrame = () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 360;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Add futuristic water-stamp
        ctx.fillStyle = '#00f0ff';
        ctx.font = 'bold 16px "Space Grotesk", sans-serif';
        ctx.fillText('BJU-VERSE INTEGRATED CAPTURE', 20, canvas.height - 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText(`SECURE UNIT DECRYPTOR // ${new Date().toLocaleTimeString()}`, 20, canvas.height - 20);

        const dataUrl = canvas.toDataURL('image/png');
        setCapturedScreenshot(dataUrl);
        setShowScreenshotAlert(true);
        setTimeout(() => setShowScreenshotAlert(false), 3000);
      }
    } catch (e) {
      console.warn("Screenshot capture limitation inside frames: ", e);
      // Fallback elegant notification warning user
      showNotification("Holographic feed screenshot captured! (Canvas protection active)", "info");
    }
  };

  // Triggering native or streaming real physical item download (highly robust for PC and Mobile)
  const handleDownload = async (media: MediaEntry) => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    
    const fileName = media.title;
    let url = media.downloadUrl || media.videoUrl;
    if (!url || url === '#' || url.trim() === '') {
      url = media.videoUrl;
    }

    // Direct Browser Download interface for blob and local memory files
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      try {
        showNotification(`ESTABLISHING QUANTUM LINK: Opening direct data channel...`, "info");
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName.endsWith('.apk') || fileName.endsWith('.exe') ? fileName : `${fileName}.mp4`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          setIsDownloading(false);
          setDownloadProgress(null);
          showNotification(`DOWNLOAD COMPLETE: Local binary saved directly.`, "success");
        }, 1000);
        return;
      } catch (err) {
        console.warn("Direct blob download failed, falling back to window:", err);
        window.open(url, '_blank');
        setIsDownloading(false);
        setDownloadProgress(null);
        return;
      }
    }

    try {
      showNotification(`ESTABLISHING QUANTUM LINK: Opening data channel for "${fileName}"...`, "info");
      
      // High-fidelity cyber decoding progress bar simulation (extremely visually pleasing)
      let current = 0;
      const interval = setInterval(() => {
        current += Math.floor(Math.random() * 15) + 14;
        if (current >= 100) {
          setDownloadProgress(100);
          clearInterval(interval);
          
          // Trigger the robust download via attachment proxy
          // Trigger direct stream download bypassing iframe restriction via top-level context
          const downloadEndpoint = `/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(fileName)}`;
          window.open(downloadEndpoint, '_blank');

          setTimeout(() => {
            setIsDownloading(false);
            setDownloadProgress(null);
            showNotification(`TRANSMISSION INITIALIZED: Secure payload delivered for "${fileName}".`, "success");
          }, 1200);
        } else {
          setDownloadProgress(current);
        }
      }, 80);
    } catch (err: any) {
      console.warn("Direct proxy transmission fault, trying fallback anchor:", err);
      const downloadEndpoint = `/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(fileName)}`;
      window.open(downloadEndpoint, '_blank');
      
      setIsDownloading(false);
      setDownloadProgress(null);
      showNotification(`DIRECT DOWNLOAD TRIGGERED: Check your device notifications for files!`, "success");
    }
  };

  // Handles secure passcode verification state
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSCODE) {
      setIsAdminAuthenticated(true);
      setAdminError('');
    } else {
      setAdminError('FIREWALL DETECTED: INVALID SECURITY DECRYPTION BADGE');
    }
  };

  // Format Helper for Time
  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle local video file selection
  const handleVideoFileChange = (file: File) => {
    setUploadedVideoFile(file);
    
    // Auto-calculate size
    const sizeInMB = file.size / (1024 * 1024);
    const readableSize = sizeInMB > 1000 
      ? `${(sizeInMB / 1024).toFixed(1)} GB` 
      : `${sizeInMB.toFixed(1)} MB`;
    setNewFileSize(readableSize);

    // Auto-populate title if empty
    if (!newTitle) {
      const cleanFileName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").toUpperCase();
      setNewTitle(cleanFileName);
    }

    // Generate Object URL for high-performance direct playback
    const localUrl = URL.createObjectURL(file);
    setNewVideoUrl(localUrl);
    setUploadVideoProgress(`LINK ACTIVE: "${file.name}" loaded successfully.`);
  };

  // Handle local thumbnail image selection
  const handleThumbnailFileChange = (file: File) => {
    setUploadedThumbnailFile(file);
    setUploadThumbnailProgress('Processing image...');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setNewThumbnail(reader.result);
        setUploadThumbnailProgress(`Success: Image uploaded successfully.`);
      }
    };
    reader.onerror = () => {
      setUploadThumbnailProgress('Failed to read image.');
    };
    reader.readAsDataURL(file);
  };

  // Handle local application/document binary selection
  const handleAppFileChange = (file: File) => {
    setUploadedAppFile(file);
    
    // Auto-calculate file size for app package
    const sizeInMB = file.size / (1024 * 1024);
    const readableSize = sizeInMB > 1000 
      ? `${(sizeInMB / 1024).toFixed(1)} GB` 
      : `${sizeInMB.toFixed(1)} MB`;
    setNewFileSize(readableSize);

    // Auto-populate title if empty
    if (!newTitle) {
      const cleanFileName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").toUpperCase();
      setNewTitle(cleanFileName);
    }

    setNewDownloadUrl(file.name);
    setUploadAppProgress(`READY TO TRANSMIT: "${file.name}" linked.`);
  };

  // Helper helper to upload files physically with accurate real-time percentage progress bar tracking
  const uploadFileWithXhr = (file: File, fieldName: string, onProgress: (pct: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append(fieldName, file);

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress(pct);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 350) {
          try {
            const res = JSON.parse(xhr.responseText);
            if (res.success && res.url) {
              resolve(res.url);
            } else {
              reject(new Error(res.error || 'Server rejected configuration template.'));
            }
          } catch {
            reject(new Error('Parser collision on server package.'));
          }
        } else {
          reject(new Error(`Transponder responded with code ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network transceiver lost. High-Speed telemetry blocked.'));
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  };

  // Admin: create custom file entry
  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) {
      showNotification("Missing essential parameters to launch digital nodes.", "error");
      return;
    }

    setIsUploadingToServer(true);
    setUploadProgressPercent(0);
    setServerUploadStatus('INITIALIZING SECURE TRANSMISSION HANDSHAKE...');

    let finalizedVideoUrl = newVideoUrl || 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c022f733efd97aa9d77a06c54784a0d8&profile_id=165&oauth2_token_id=57447761';
    let finalizedThumbnailUrl = newThumbnail || 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=800&q=80';
    let finalizedDownloadUrl = newDownloadUrl;

    try {
      const hasUploadedFiles = !!(uploadedVideoFile || uploadedThumbnailFile || uploadedAppFile);
      if (instantSimulateUpload && !hasUploadedFiles) {
        // High-fidelity instant simulation pipeline (Recommended: zero-latency visual overlay)
        const phases = [
          { status: 'DECRYPTING APP METADATA...', pct: 15 },
          { status: 'BUNDLING ENCRYPTED RESOURCE PACKS...', pct: 40 },
          { status: 'MOUNTING NEURAL STORAGE SHARDS...', pct: 75 },
          { status: 'SIGNING SECURITY CERTIFICATES...', pct: 95 },
          { status: 'TRANSMISSION INTEGRATION COMPLETE!', pct: 100 }
        ];

        for (const phase of phases) {
          setServerUploadStatus(phase.status);
          setUploadProgressPercent(phase.pct);
          // Wait 300ms for authentic tech cadence
          await new Promise(r => setTimeout(r, 260));
        }

        if (uploadedVideoFile && newVideoUrl.startsWith('blob:')) {
          finalizedVideoUrl = newVideoUrl; // Keep active high-performance blob url
        }
        if (uploadedThumbnailFile && newThumbnail.startsWith('data:')) {
          finalizedThumbnailUrl = newThumbnail; // Keep local base64 
        }
        if (uploadedAppFile) {
          finalizedDownloadUrl = `simulation-app:${uploadedAppFile.name}`;
        }
      } else {
        // Core network transceiver physical loop
        if (hasUploadedFiles && instantSimulateUpload) {
          setServerUploadStatus('LOCAL FILE DETECTED: AUTO-UPGRADING TO PERMANENT CLOUD TRANSMISSION...');
          await new Promise(r => setTimeout(r, 800));
        }

        // 1. Upload Video File physically to node server if present
        if (uploadedVideoFile) {
          setServerUploadStatus(`UPLOADING STREAM NODE: "${uploadedVideoFile.name}" (${(uploadedVideoFile.size / (1024 * 1024)).toFixed(1)} MB)... PLEASE KEEP THIS SCREEN ACTIVE.`);
          try {
            const uploadedUrl = await uploadFileWithXhr(uploadedVideoFile, 'file', (pct) => {
              setUploadProgressPercent(pct);
              setServerUploadStatus(`UPLOADING STREAM NODE: "${uploadedVideoFile.name}"... [${pct}% COMPLETED]`);
            });
            finalizedVideoUrl = uploadedUrl;
          } catch (err: any) {
            throw new Error(`Video payload collision: ${err.message || 'transceiver fault'}`);
          }
        }

        // 2. Upload Thumbnail File physically to node server if present
        if (uploadedThumbnailFile) {
          setServerUploadStatus(`UPLOADING VISUAL COVER: "${uploadedThumbnailFile.name}"...`);
          setUploadProgressPercent(0);
          try {
            const uploadedUrl = await uploadFileWithXhr(uploadedThumbnailFile, 'file', (pct) => {
              setUploadProgressPercent(pct);
              setServerUploadStatus(`UPLOADING VISUAL COVER: "${uploadedThumbnailFile.name}"... [${pct}% COMPLETED]`);
            });
            finalizedThumbnailUrl = uploadedUrl;
          } catch (err: any) {
            throw new Error(`Visual cover collision: ${err.message || 'transceiver fault'}`);
          }
        }

        // 3. Upload App/Package binary physically to node server if present
        if (uploadedAppFile) {
          setServerUploadStatus(`UPLOADING APP FILE PACKAGE: "${uploadedAppFile.name}" (${(uploadedAppFile.size / (1024 * 1024)).toFixed(1)} MB)...`);
          setUploadProgressPercent(0);
          try {
            const uploadedUrl = await uploadFileWithXhr(uploadedAppFile, 'file', (pct) => {
              setUploadProgressPercent(pct);
              setServerUploadStatus(`UPLOADING APP FILE PACKAGE: "${uploadedAppFile.name}"... [${pct}% COMPLETED]`);
            });
            finalizedDownloadUrl = uploadedUrl;
          } catch (err: any) {
            throw new Error(`App Package core collision: ${err.message || 'transceiver fault'}`);
          }
        }
      }

      setServerUploadStatus('SYNCING METADATA WITH LOCAL TRANS-GRID ARCHIVES...');

      const tagsArray = newTags 
         ? newTags.split(',').map(t => t.trim()) 
         : ['Syndicate', 'BJU-Net'];

      const uniqueId = 'user-' + Date.now().toString(36) + '-' + newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const added: MediaEntry = {
        id: uniqueId,
        title: newTitle,
        description: newDescription,
        category: newCategory,
        thumbnail: finalizedThumbnailUrl,
        videoUrl: finalizedVideoUrl,
        downloadUrl: finalizedDownloadUrl || finalizedVideoUrl, // Allow direct download of physical file
        rating: parseFloat((Math.random() * (5.0 - 4.1) + 4.1).toFixed(1)),
        releaseYear: newReleaseYear || '2026',
        fileSize: newFileSize || '1.4 GB',
        developerOrStudio: newStudio || 'Indie Network Labs',
        tags: tagsArray
      };

      // Persistent sync on the node server so it works 100% on reload
      try {
        await fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(added)
        });
      } catch (err) {
        console.error("Failed server database sync:", err);
      }

      if (uploadedVideoFile && newVideoUrl.startsWith('blob:')) {
        setLocalBlobUrls(prev => ({
          ...prev,
          [uniqueId]: newVideoUrl
        }));
      }

      addMediaEntry(added);
      await updateMediaList();

      // Auto navigate user to focus on newly added content instantly in its category
      setSelectedCategory(newCategory);
      setSelectedMedia(added); // Show the dedicated details screen of the added item
      setShowAdminModal(false); // Close the admin dialog
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewThumbnail('');
      setNewVideoUrl('');
      setNewDownloadUrl('');
      setNewTags('');
      setNewFileSize('1.5 GB');
      setUploadedVideoFile(null);
      setUploadedThumbnailFile(null);
      setUploadedAppFile(null);
      setUploadVideoProgress('');
      setUploadThumbnailProgress('');
      setUploadAppProgress('');
      showNotification(`TRANSMISSION LOADED: Added "${added.title}" to digital matrix in "${newCategory}". Decrypted and visible immediately!`, "success");
    } catch (e: any) {
      console.error(e);
      showNotification(`TRANSMISSION CORRUPT: ${e.message || 'Node compilation failure.'}`, "error");
    } finally {
      setIsUploadingToServer(false);
      setUploadProgressPercent(0);
    }
  };

  const handleDeleteMediaDirect = async (id: string, name: string) => {
    try {
      await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error("Failed server database delete sync:", e);
    }
    deleteMediaEntry(id);
    await updateMediaList();
    if (selectedMedia?.id === id) setSelectedMedia(null);
    if (activeVideo?.id === id) {
      setActiveVideo(null);
      setIsPlaying(false);
    }
    setDeleteConfirmId(null);
    showNotification(`PURGED PERMANENTLY: "${name}" removed from digital matrix archives.`, "success");
  };

  // Map category to aesthetic icons
  const getCategoryIcon = (cat: CategoryType) => {
    switch(cat) {
      case 'Movies': return <Film className="w-5 h-5 text-neon-blue" id="category-icon-movies" />;
      case 'Series': return <Tv className="w-5 h-5 text-neon-pink" id="category-icon-series" />;
      case 'Hollywood': return <Monitor className="w-5 h-5 text-neon-purple" id="category-icon-hollywood" />;
      case 'Bollywood': return <Sparkles className="w-5 h-5 text-neon-green" id="category-icon-bollywood" />;
      case 'Computer-Tech': return <Cpu className="w-5 h-5 text-neon-blue" id="category-icon-comptech" />;
      case 'PC-Apps': return <HardDrive className="w-5 h-5 text-neon-pink" id="category-icon-pcapps" />;
      case 'Android-Apps': return <Smartphone className="w-5 h-5 text-neon-green" id="category-icon-androidapps" />;
    }
  };

  // Get color wrappers
  const getMoodBorderClass = () => {
    switch(moodColor) {
      case 'blue': return 'neon-border-blue border-neon-blue/80';
      case 'pink': return 'neon-border-pink border-neon-pink/80';
      case 'purple': return 'neon-border-purple border-neon-purple/80';
      case 'green': return 'neon-border-green border-neon-green/80';
    }
  };

  const getMoodGlowClass = () => {
    switch(moodColor) {
      case 'blue': return 'shadow-[0_0_30px_rgba(0,240,255,0.3)] border-neon-blue/40';
      case 'pink': return 'shadow-[0_0_30px_rgba(255,0,127,0.3)] border-neon-pink/40';
      case 'purple': return 'shadow-[0_0_30px_rgba(157,78,221,0.3)] border-neon-purple/40';
      case 'green': return 'shadow-[0_0_30px_rgba(57,255,20,0.3)] border-neon-green/40';
    }
  };

  return (
    <div id="bju-verse-app" className="min-h-screen bg-[#050508] text-gray-100 font-sans selection:bg-neon-pink selection:text-white relative overflow-x-hidden pb-20 cyber-grid">
      
      {/* 4-5 SECOND HIGH-ADVANCED BRAND INTRO SEQUENCE */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            id="intro-splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 bg-[#030305] z-50 flex flex-col justify-between p-6 md:p-12 overflow-hidden cyber-grid select-none"
          >
            {/* Scanlines Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30" />
            
            {/* Top Bar: Aesthetic System Specs */}
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 border-b border-white/5 pb-4 z-20">
              <div className="flex items-center space-x-3">
                <span className="h-2 w-2 rounded-full bg-neon-pink animate-ping" />
                <span className="tracking-widest">LIVE TRANS_CORE: ONLINE</span>
              </div>
              <div className="tracking-widest hidden sm:block">HOST: //0.0.0.0:3000 // DECRYPT LEVEL 9</div>
              <div className="tracking-wider">SYS_TIME: {new Date().toLocaleTimeString()}</div>
            </div>

            {/* Main Center Area: Logo and Glowing Orb with 3D PERSPECTIVE */}
            <div 
              className="flex-1 flex flex-col items-center justify-center relative my-8 z-20 w-full"
              style={{ perspective: 1500, transformStyle: "preserve-3d" }}
              onMouseMove={handleLogoMouseMove}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => {
                setIsLogoHovered(false);
                setLogoCoords({ x: 0, y: 0 });
              }}
            >
              {/* Outer Pulsing Cyber Ring - gently rotates in flat space or Z space */}
              <div className="absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full border border-dashed border-neon-blue/10 animate-[spin_60s_linear_infinite]" style={{ transform: "translateZ(-100px)" }} />
              <div className="absolute w-56 h-56 sm:w-80 sm:h-80 rounded-full border border-double border-neon-pink/5 animate-[spin_35s_linear_infinite_reverse]" style={{ transform: "translateZ(-150px)" }} />
              
              {/* Pulsing Light Glow Core in Background */}
              <div className="absolute w-44 h-44 rounded-full bg-neon-blue/10 filter blur-[50px] animate-pulse" style={{ transform: "translateZ(-80px)" }} />

              {/* 3D Singularity Atmospheric Orbital Rings */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible" style={{ transformStyle: "preserve-3d" }}>
                {/* Ring A: Transverse Cyan Orbiter */}
                <div 
                  className="absolute w-[350px] h-[350px] sm:w-[460px] sm:h-[460px] rounded-full border border-dashed border-neon-blue/30 flex items-center justify-center animate-[spin_16s_linear_infinite]"
                  style={{ 
                    transform: "rotateX(72deg) rotateY(15deg) translateZ(0px)",
                    transformStyle: "preserve-3d" 
                  }}
                >
                  {/* Glowing core particle nodes orbiting */}
                  <div className="absolute top-0 w-3.5 h-3.5 bg-neon-blue rounded-full shadow-[0_0_15px_#00f0ff,0_0_30px_#00f0ff] animate-pulse" style={{ transform: "translateZ(10px)" }} />
                  <div className="absolute bottom-0 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                </div>

                {/* Ring B: Polar Pink/Purple Orbiter */}
                <div 
                  className="absolute w-[300px] h-[300px] sm:w-[390px] sm:h-[390px] rounded-full border-2 border-dotted border-neon-pink/25 flex items-center justify-center animate-[spin_12s_linear_infinite_reverse]"
                  style={{ 
                    transform: "rotateX(-60deg) rotateY(-35deg) translateZ(0px)",
                    transformStyle: "preserve-3d" 
                  }}
                >
                  {/* Glowing core particle nodes orbiting */}
                  <div className="absolute left-0 w-3 h-3 bg-neon-pink rounded-full shadow-[0_0_15px_#ff007f,0_0_30px_#ff007f] animate-pulse" style={{ transform: "translateZ(15px)" }} />
                  <div className="absolute right-0 w-1.5 h-1.5 bg-white rounded-full" />
                </div>

                {/* Ring C: Equatorial Green Quantum Orbit */}
                <div 
                  className="absolute w-[400px] h-[400px] sm:w-[540px] sm:h-[540px] rounded-full border border-double border-neon-green/20 flex items-center justify-center animate-[spin_22s_linear_infinite]"
                  style={{ 
                    transform: "rotateX(15deg) rotateY(82deg) translateZ(0px)",
                    transformStyle: "preserve-3d" 
                  }}
                >
                  {/* Glowing core particle nodes orbiting */}
                  <div className="absolute right-0 w-2.5 h-2.5 bg-neon-green rounded-full shadow-[0_0_12px_#39ff14,0_0_24px_#39ff14] animate-pulse" style={{ transform: "translateZ(5px)" }} />
                  <div className="absolute left-0 w-2 w-2 bg-neon-purple rounded-full shadow-[0_0_10px_#9d4edd]" />
                </div>
              </div>

              {/* Advanced Interactive 3D Parallax Logo Container */}
              <motion.div 
                style={{ 
                  transformStyle: "preserve-3d",
                  perspective: 1200
                }}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={isLogoHovered ? {
                  scale: 1.05,
                  rotateX: logoCoords.y,
                  rotateY: logoCoords.x,
                  opacity: 1,
                } : {
                  scale: 1,
                  rotateX: [0, -10, 8, -5, 0],
                  rotateY: [0, 12, -15, 10, 0],
                  rotateZ: [0, 1, -1.5, 0.5, 0],
                  opacity: 1,
                }}
                transition={isLogoHovered ? {
                  type: "spring",
                  stiffness: 140,
                  damping: 14,
                  mass: 0.5
                } : {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-64 h-64 sm:w-80 sm:h-80 bg-[#07070d]/80 border border-white/10 rounded-[32px] p-6 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl cursor-pointer group"
              >
                {/* 3D Glass Reflection Overlay (TranslateZ: 10px) */}
                <div 
                  className="absolute inset-[1px] bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-[31px] pointer-events-none" 
                  style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }} 
                />

                {/* Tech Corner brackets (TranslateZ: 15px) */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-neon-blue/60" style={{ transform: "translateZ(15px)" }} />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-neon-blue/60" style={{ transform: "translateZ(15px)" }} />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-neon-blue/60" style={{ transform: "translateZ(15px)" }} />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-neon-blue/60" style={{ transform: "translateZ(15px)" }} />

                {/* Deep Core Glow (TranslateZ: -25px) */}
                <div 
                  className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 blur-2xl opacity-70"
                  style={{ transform: "translateZ(-25px)" }}
                />

                {/* Layer 3D: Cyber GRID inside the card (TranslateZ: 25px) */}
                <div 
                  className="absolute inset-8 rounded-2xl border border-white/5 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none opacity-40"
                  style={{ transform: "translateZ(25px)" }}
                />

                {/* Floating Metallic Logo Marks (TranslateZ: 60px & translateZ: 45px for Stereo Stereoscopic 3D glitch) */}
                <div 
                  className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center transition-all duration-300"
                  style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
                >
                  {/* Neon Blue Backing Layer (Stereo Depth Offset) */}
                  <div 
                    className="absolute inset-0 text-neon-blue filter drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]"
                    style={{ transform: "translateZ(-15px) translateX(-3px) translateY(-2px)" }}
                  >
                    <svg className="w-full h-full animate-pulse" viewBox="0 0 100 100" fill="currentColor">
                      <polygon points="20,15 80,15 80,40 50,55 80,70 80,85 20,85" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="20" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Bright Neon Pink Core Layer (Main Surface) */}
                  <div 
                    className="absolute inset-0 text-neon-pink filter drop-shadow-[0_0_15px_rgba(255,0,127,0.7)]"
                    style={{ transform: "translateZ(10px) translateX(2px) translateY(1px)" }}
                  >
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                      <polygon points="20,15 80,15 80,40 50,55 80,70 80,85 20,85" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="20" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Sparkling Floating Quantum Orbiter (TranslateZ: 95px!) */}
                  <div 
                    className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white,0_0_20px_#00f0ff] animate-ping"
                    style={{ transform: "translateZ(95px)" }}
                  />
                  <div 
                    className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]"
                    style={{ transform: "translateZ(95px)" }}
                  />
                  <div 
                    className="absolute bottom-3 left-4 w-1.5 h-1.5 bg-neon-green rounded-full shadow-[0_0_8px_#39ff14] animate-pulse"
                    style={{ transform: "translateZ(80px)" }}
                  />
                </div>

                {/* Floating Technical HUD metrics (TranslateZ: 40px) */}
                <div 
                  className="absolute bottom-6 left-6 right-6 flex justify-between text-[8px] font-mono text-gray-500 tracking-wider uppercase border-t border-white/5 pt-3"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <span>MODEL // ANTIGRAVITY</span>
                  <span className="text-neon-pink animate-pulse">LNK_SYS_9</span>
                </div>
              </motion.div>

              {/* Title & Slogan */}
              <div className="text-center mt-6 z-20">
                <motion.h1 
                  initial={{ letterSpacing: "0.1em", opacity: 0 }}
                  animate={{ letterSpacing: "0.35em", opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-2xl sm:text-4xl font-extrabold tracking-[0.35em] text-white uppercase neon-text-blue pl-4"
                >
                  BJU-VERSE
                </motion.h1>
                <p className="text-[10px] font-mono tracking-widest text-[#ff007f] uppercase font-semibold mt-2 neon-text-pink animate-pulse">
                  CYBERNETIC TRANSMISSION CORE // SYSTEM INIT
                </p>
              </div>
            </div>

            {/* Bottom Section: Progress Bar and Live Logging Stream */}
            <div className="space-y-6 z-20">
              {/* Dynamic Progress Unit */}
              <div className="max-w-xl mx-auto w-full space-y-2">
                <div className="flex justify-between items-end text-xs font-mono">
                  <span className="text-neon-blue animate-pulse max-w-[75%] truncate">{bootStatus}</span>
                  <span className="text-neon-pink font-bold">{bootProgress}%</span>
                </div>
                
                {/* Micro Styled Progress Bar */}
                <div className="w-full h-2.5 bg-black/60 border border-white/10 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${bootProgress}%` }}
                    transition={{ ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-full relative shadow-[0_0_12px_rgba(0,240,255,0.5)]"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white animate-pulse" />
                  </motion.div>
                </div>
              </div>

              {/* Simulated Command-line Logs Terminal */}
              <div className="max-w-xl mx-auto w-full bg-black/40 border border-white/5 rounded-xl p-3 h-28 overflow-y-auto font-mono text-[9px] text-gray-500 scrollbar-thin select-text">
                <div className="flex items-center space-x-1.5 text-neon-green/90 mb-1">
                  <span>$</span>
                  <span className="uppercase font-bold">SYSTEM INTEGRITY LOGS</span>
                </div>
                {bootLogs.map((log, index) => (
                  <div key={index} className="flex space-x-2 py-0.5 hover:text-white transition-all duration-300 animate-[fade-in_0.3s_ease]">
                    <span className="text-gray-600">[{1000 + index * 42}]</span>
                    <span className="text-gray-400 capitalize">{log}</span>
                  </div>
                ))}
              </div>

              {/* Bypass Control Indicator */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsBooting(false)}
                  className="bg-black/60 hover:bg-black text-neon-blue hover:text-neon-pink border border-neon-blue/20 hover:border-neon-pink px-4 py-2 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,127,0.3)] cursor-pointer"
                >
                  [ BYPASS SYSTEM BOOT // SKIP INTRO ]
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD FLOAT NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in pointer-events-none w-auto max-w-[90%]">
          <div className={`px-6 py-3 rounded-full border backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.85)] font-mono text-[11px] flex items-center space-x-2.5 ${
            notification.type === 'success' 
              ? 'bg-black/90 text-neon-green border-neon-green/40 shadow-[0_0_15px_rgba(57,255,20,0.35)]' 
              : notification.type === 'error'
              ? 'bg-black/90 text-neon-pink border-neon-pink/40 shadow-[0_0_15px_rgba(255,0,127,0.35)]'
              : 'bg-black/90 text-neon-blue border-neon-blue/40 shadow-[0_0_15px_rgba(0,240,255,0.35)]'
          }`}>
            <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse text-neon-pink" />
            <span className="font-bold tracking-wider uppercase text-center leading-relaxed">{notification.message}</span>
          </div>
        </div>
      )}

      {/* FULL-SCREEN SECURE PHYSICAL SERVER UPLOADER OVERLAY */}
      <AnimatePresence>
        {isUploadingToServer && (
          <motion.div 
            id="server-upload-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030305]/95 backdrop-blur-lg p-6 select-none"
          >
            {/* Ambient Backing Glow Orbs */}
            <div className="absolute w-72 h-72 rounded-full bg-neon-pink/15 filter blur-[80px] animate-pulse pointer-events-none" />
            <div className="absolute w-80 h-80 rounded-full bg-neon-blue/10 filter blur-[100px] animate-pulse delay-700 pointer-events-none" />
            
            {/* Ingest box container */}
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xl glassmorphism border-2 border-neon-blue/40 rounded-[32px] p-8 md:p-10 relative overflow-hidden text-center shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col items-center"
            >
              {/* Tech Bracket corners */}
              <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-neon-pink/55" />
              <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-neon-pink/55" />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-neon-pink/55" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-neon-pink/55" />

              {/* Pulsing Uploader Core (Spinning outer ring and pulsing upload arrow) */}
              <div className="relative w-24 h-24 flex items-center justify-center mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-neon-blue animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-1.5 rounded-full border-2 border-dotted border-neon-pink/55 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-4 rounded-full bg-black border border-white/5 shadow-inner flex items-center justify-center">
                  <Upload className="w-8 h-8 text-neon-blue animate-bounce" />
                </div>
              </div>

              {/* Core System Status */}
              <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink uppercase">
                SERVER UPLINK SECURED
              </h2>
              <p className="text-[10px] font-mono text-[#39ff14] tracking-widest uppercase font-bold mt-1">
                // FULL MULTIPART STREAMING COMMITTED
              </p>

              {/* Animated Core Status Message */}
              <div className="bg-black/70 border border-white/5 rounded-2xl p-5 w-full mt-6 flex flex-col justify-center items-center">
                <div className="flex items-center space-x-2 text-neon-pink text-xs font-mono mb-2 uppercase animate-pulse">
                  <Cpu className="w-4 h-4 text-neon-pink animate-spin" />
                  <span>TRANSTRONIC PROCESSOR ACTIVE</span>
                </div>
                <p className="text-xs text-gray-300 font-mono text-center tracking-wide leading-relaxed uppercase select-text h-10 overflow-y-auto w-full">
                  {serverUploadStatus}
                </p>
              </div>

              {/* Dynamic Upload Progress Bar */}
              <div className="w-full mt-5 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono px-1">
                  <span className="text-neon-blue uppercase text-[10px] tracking-wider">Upload Transmission Core</span>
                  <span className="text-neon-green font-bold text-xs">{uploadProgressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-black/60 border border-white/10 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${uploadProgressPercent}%` }}
                    className="h-full bg-gradient-to-r from-neon-green via-neon-blue to-neon-pink rounded-full relative shadow-[0_0_12px_rgba(57,255,20,0.5)]"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white animate-pulse" />
                  </motion.div>
                </div>
              </div>

              {/* Bottom security directive warning */}
              <div className="mt-8 text-[9px] font-mono text-gray-500 tracking-widest uppercase flex items-center justify-center space-x-2">
                <Shield className="w-3.5 h-3.5 text-neon-pink" />
                <span>CYBER INGEST CORES BURNING // DO NOT REFRESH OR CLOSE CONNECTION</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOWING BACKGROUND ORBS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-neon-pink/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-neon-purple/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* HEADER SECTION */}
      <header id="main-header" className="sticky top-0 z-40 glassmorphism border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center space-x-10">
          {/* Futuristic Glowing SVG Logo */}
          <div 
            id="main-logo-container" 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => { setSelectedCategory('All'); setSelectedMedia(null); setActiveVideo(null); }}
          >
            <div className="relative w-10 h-10 flex items-center justify-center bg-black rounded-lg border border-neon-blue/40 group-hover:border-neon-pink group-hover:shadow-[0_0_15px_rgba(255,0,127,0.6)] transition-all duration-500">
              <svg className="w-8 h-8 text-neon-blue group-hover:text-neon-pink transition-all duration-500" viewBox="0 0 100 100" fill="currentColor">
                <polygon points="20,15 80,15 80,40 50,55 80,70 80,85 20,85" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="20" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              </svg>
              <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-neon-blue to-neon-pink opacity-0 group-hover:opacity-35 blur transition-opacity duration-500" />
            </div>
            
            <div className="flex flex-col">
              <h1 id="brand-title" className="text-xl md:text-2xl font-black tracking-widest bg-gradient-to-r from-neon-blue via-white to-neon-pink bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                BJU-VERSE
              </h1>
              <span className="text-[9px] font-mono tracking-widest text-neon-blue neon-text-blue opacity-85">NEON GRID INTEL // CLIENT V1.2</span>
            </div>
          </div>

          {/* Animated Instagram Follow Admin Section */}
          <a
            href="https://www.instagram.com/__soulmate.143?igsh=MWRxM2E1bjZhcmNjaQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:from-[#fd1d1d] hover:to-[#833ab4] text-white px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black font-mono tracking-wider sm:tracking-widest shadow-[0_0_15px_rgba(253,29,29,0.5)] hover:shadow-[0_0_25px_rgba(131,58,180,0.8)] border border-white/20 hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse shrink-0"
            title="Auto-Follow Admin on Instagram"
          >
            <Instagram className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            <span className="tracking-widest uppercase">FOLLOW ADMIN</span>
          </a>

          {/* Mini navigation shortcuts */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-400">
            <button 
              onClick={() => { setSelectedCategory('All'); setSelectedMedia(null); }}
              className={`hover:text-white transition-colors duration-200 ${selectedCategory === 'All' ? 'text-neon-blue font-semibold scale-105' : ''}`}
            >
              Matrix Room
            </button>
            <button 
              onClick={() => { setSelectedCategory('Movies'); setSelectedMedia(null); }}
              className={`hover:text-white transition-colors duration-200 ${selectedCategory === 'Movies' ? 'text-neon-blue font-semibold scale-105' : ''}`}
            >
              Feature Movies
            </button>
            <button 
              onClick={() => { setSelectedCategory('PC-Apps'); setSelectedMedia(null); }}
              className={`hover:text-white transition-colors duration-200 ${selectedCategory === 'PC-Apps' ? 'text-neon-blue font-semibold scale-105' : ''}`}
            >
              PC Softwares
            </button>
            <button 
              onClick={() => { setSelectedCategory('Android-Apps'); setSelectedMedia(null); }}
              className={`hover:text-white transition-colors duration-200 ${selectedCategory === 'Android-Apps' ? 'text-neon-blue font-semibold scale-105' : ''}`}
            >
              Holo APKs
            </button>
          </nav>
        </div>

        {/* Global Search bar + Admin settings access */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neon-blue opacity-50" />
            <input 
              id="header-search-bar"
              type="text"
              placeholder="Search movies, software, codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm w-64 text-gray-200 outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all duration-500 font-mono"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button 
            id="admin-settings-button"
            onClick={() => setShowAdminModal(true)}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-neon-pink text-gray-400 hover:text-neon-pink hover:shadow-[0_0_8px_rgba(255,0,127,1)] transition-all duration-300 relative group"
            title="Secure Admin Link"
          >
            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-pink"></span>
            </span>
          </button>
        </div>
      </header>

      {/* MOBILE CONSOLE SEARCH FIELD */}
      <div className="px-4 mt-3 block md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neon-blue opacity-50" />
          <input 
            type="text"
            placeholder="Search BJU-VERSE matrix..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-gray-200 outline-none focus:border-neon-blue transition-all duration-300 font-mono"
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">

        {/* ======================================================
            ACTIVE EMBEDDED CUSTOM NEON VIDEO PLAYER (THE MASTERPIECE) 
           ======================================================= */}
        {activeVideo && (
          <section id="custom-neon-player-section" className="mb-10 transition-all duration-500 scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs uppercase font-mono tracking-widest text-[#9d4edd]">CYBERNETIC COIL MOOD INTERFACE Active</span>
              </div>
              <button 
                onClick={() => { setActiveVideo(null); setIsPlaying(false); }}
                className="flex items-center space-x-1.5 text-xs text-neon-pink bg-neon-pink/10 hover:bg-neon-pink/20 px-3 py-1.5 rounded-full border border-neon-pink/30 hover:shadow-[0_0_8px_rgba(255,0,127,0.4)] transition-all duration-300"
              >
                <X className="w-4 h-4" />
                <span>Disconnect Stream</span>
              </button>
            </div>

            {/* Neon Custom Player Envelope */}
            <div 
              ref={videoContainerRef}
              id="plyr-master-shell" 
              className={`relative overflow-hidden rounded-2xl bg-black border transition-all duration-500 ${getMoodBorderClass()} ${getMoodGlowClass()}`}
            >
              {/* Actual Video Tag with hardware-accelerated filters */}
              <video
                ref={videoRef}
                src={localBlobUrls[activeVideo.id] || activeVideo.videoUrl}
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={(e) => {
                  console.error("Video player error event:", e);
                  setVideoPlayError("SIGNAL STREAM LOST: Cross-origin sandbox rules or unsupported file codecs blocked default playback. Try bypassing or streaming directly below!");
                }}
                className="w-full h-auto aspect-video cursor-pointer"
                style={{
                  filter: `${videoSharpness > 0 ? 'url(#cyber-sharpen-filter) ' : ''}brightness(${videoBrightness}%) contrast(${videoContrast}%) saturate(${videoSaturation}%)`
                }}
                playsInline
                autoPlay
              />

              {videoPlayError && (
                <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                  <AlertTriangle className="w-12 h-12 text-neon-pink mb-3 animate-bounce" />
                  <h3 className="text-sm font-black font-mono text-neon-pink uppercase tracking-widest mb-2">SIGNAL CORRUPTED // STREAM BLOCKED</h3>
                  <p className="text-xs text-gray-300 font-mono max-w-md leading-relaxed mb-4">
                    {videoPlayError}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => {
                        // Bypass stream through our local proxy endpoint
                        const bypassUrl = `/api/download?url=${encodeURIComponent(activeVideo.videoUrl)}&name=${encodeURIComponent(activeVideo.title)}`;
                        setVideoPlayError(null);
                        if (videoRef.current) {
                          videoRef.current.src = bypassUrl;
                          videoRef.current.load();
                          videoRef.current.play().catch(err => console.warn("Video bypass playback started with exception:", err));
                        }
                      }}
                      className="px-4 py-2 bg-neon-blue text-black font-mono font-black text-[10px] uppercase rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-white hover:text-black transition-all"
                    >
                      [ BYPASS FILE LIMITATIONS / STREAM FROM CLOUD ]
                    </button>
                    
                    <button
                      onClick={() => {
                        window.open(localBlobUrls[activeVideo.id] || activeVideo.videoUrl, '_blank');
                      }}
                      className="px-4 py-2 bg-transparent text-neon-pink font-mono font-bold text-[10px] uppercase rounded-lg border border-neon-pink/40 hover:bg-neon-pink/10 transition-all"
                    >
                      [ OPEN STREAM NATIVELY IN NEW WINDOW ]
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic hardware SVG Sharpening Filter Core */}
              <svg className="absolute w-0 h-0 pointer-events-none" style={{ position: 'absolute', top: -9999 }}>
                <defs>
                  <filter id="cyber-sharpen-filter" colorInterpolationFilters="sRGB">
                    <feConvolveMatrix 
                      order="3" 
                      kernelMatrix={`0 -${videoSharpness} 0 -${videoSharpness} ${1 + 4 * videoSharpness} -${videoSharpness} 0 -${videoSharpness} 0`} 
                      preserveAlpha="true" 
                    />
                  </filter>
                </defs>
              </svg>

              {/* High-Tech Video Calibrator Editor HUD Overlay */}
              <AnimatePresence>
                {showVideoEditor && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-4 bottom-20 bg-black/95 backdrop-blur-md rounded-2xl border border-neon-blue/40 p-4 md:p-6 z-30 flex flex-col justify-between overflow-y-auto shadow-[0_0_30px_rgba(0,240,255,0.2)]"
                  >
                    <div>
                      {/* Calibrator Title Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <Sliders className="w-4 h-4 text-neon-blue animate-pulse" />
                          <span className="text-xs font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink uppercase">
                            VIDEO CALIBRATOR CORE
                          </span>
                        </div>
                        <button
                          onClick={() => setShowVideoEditor(false)}
                          className="p-1 rounded-full bg-white/5 border border-white/10 hover:border-neon-pink text-gray-400 hover:text-white transition-all text-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[10px] font-mono text-[#39ff14]/80 tracking-wide uppercase mb-4">
                        // CALIBRATING ACTIVE SCREEN FILTER CHANNELS AT 60FPS
                      </p>

                      {/* Calibrator Grid Adjusters */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-2">
                        {/* 1. BRIGHTNESS ADJUSTMENT */}
                        <div className="space-y-2 bg-white/5 border border-white/5 p-3 rounded-xl">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-gray-400 font-semibold tracking-wider">BRIGHTNESS (DECRYPT GAIN)</span>
                            <span className="text-neon-blue font-bold font-mono">{videoBrightness}%</span>
                          </div>
                          <input 
                            type="range"
                            min="50"
                            max="200"
                            value={videoBrightness}
                            onChange={(e) => setVideoBrightness(parseInt(e.target.value))}
                            className="w-full h-1.5 rounded-lg bg-white/10 appearance-none cursor-pointer accent-neon-blue"
                          />
                          <div className="flex justify-between text-[8px] font-mono text-gray-500">
                            <span>DARK [50%]</span>
                            <span>NORMAL [100%]</span>
                            <span>BRIGHT [200%]</span>
                          </div>
                        </div>

                        {/* 2. CONTRAST ADJUSTMENT */}
                        <div className="space-y-2 bg-white/5 border border-white/5 p-3 rounded-xl">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-gray-400 font-semibold tracking-wider">CONTRAST (THRESHOLD GAIN)</span>
                            <span className="text-neon-blue font-bold font-mono">{videoContrast}%</span>
                          </div>
                          <input 
                            type="range"
                            min="50"
                            max="200"
                            value={videoContrast}
                            onChange={(e) => setVideoContrast(parseInt(e.target.value))}
                            className="w-full h-1.5 rounded-lg bg-white/10 appearance-none cursor-pointer accent-neon-blue"
                          />
                          <div className="flex justify-between text-[8px] font-mono text-gray-500">
                            <span>SOFT [50%]</span>
                            <span>STANDARD [100%]</span>
                            <span>HIGH-CONTRAST [200%]</span>
                          </div>
                        </div>

                        {/* 3. SATURATION ADJUSTMENT */}
                        <div className="space-y-2 bg-white/5 border border-white/5 p-3 rounded-xl">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-gray-400 font-semibold tracking-wider">SATURATION (COLOR CHROMA)</span>
                            <span className="text-neon-pink font-bold font-mono">{videoSaturation}%</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="200"
                            value={videoSaturation}
                            onChange={(e) => setVideoSaturation(parseInt(e.target.value))}
                            className="w-full h-1.5 rounded-lg bg-white/10 appearance-none cursor-pointer accent-neon-pink"
                          />
                          <div className="flex justify-between text-[8px] font-mono text-gray-500">
                            <span>MONOCHROME [0%]</span>
                            <span>NATURAL [100%]</span>
                            <span>VIVID COLOR [200%]</span>
                          </div>
                        </div>

                        {/* 4. REAL HARDWARE SHARPNESS ADJUSTMENT */}
                        <div className="space-y-2 bg-white/5 border border-white/5 p-3 rounded-xl">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-gray-400 font-semibold tracking-wider">SHARPNESS (CONVOLVE CLARITY)</span>
                            <span className="text-neon-green font-bold font-mono">{Math.round(videoSharpness * 100)}%</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="3"
                            step="0.2"
                            value={videoSharpness}
                            onChange={(e) => setVideoSharpness(parseFloat(e.target.value))}
                            className="w-full h-1.5 rounded-lg bg-white/10 appearance-none cursor-pointer accent-neon-green"
                          />
                          <div className="flex justify-between text-[8px] font-mono text-gray-500">
                            <span>SMOOTH [0%]</span>
                            <span>CRYSTAL LENS [150%]</span>
                            <span>MAX REALITY SHARP [300%]</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reset settings row */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-4">
                      <button
                        onClick={resetVideoAdjustments}
                        className="text-[10px] font-mono text-neon-pink hover:text-white uppercase tracking-wider bg-neon-pink/10 hover:bg-neon-pink/30 px-3 py-1 rounded transition-all"
                      >
                        [ RESTORE PRESETS / RESET CORES ]
                      </button>
                      <span className="text-[8px] font-mono text-gray-500 uppercase">
                        // LATENCY DETECTOR: ACTIVE PASS-THROUGH
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Big play button centered overlays (visible on pause) */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center border border-neon-blue shadow-[0_0_20px_rgba(0,240,255,0.8)] animate-pulse">
                    <Play className="w-8 h-8 text-neon-blue fill-neon-blue ml-1" />
                  </div>
                </div>
              )}

              {/* Interactive Player Glass overlay HUD */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col space-y-3 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
                
                {/* Seek Bar */}
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-neon-blue">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeekBarChange}
                    className="flex-1 h-1.5 rounded-lg bg-white/20 appearance-none cursor-pointer accent-neon-pink hover:accent-neon-blue transition-all"
                    style={{
                      background: `linear-gradient(to right, #ff007f ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`
                    }}
                  />
                  <span className="text-xs font-mono text-gray-400">{formatTime(duration)}</span>
                </div>

                {/* Sub Controls Panel */}
                <div className="flex items-center justify-between">
                  {/* Left Controls */}
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={togglePlay} 
                      className="p-1.5 hover:text-neon-blue hover:scale-110 transition-all text-white"
                      title={isPlaying ? "Pause Stream" : "Initiate Stream"}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                    </button>

                    <button 
                      onClick={() => handleSkip(-10)} 
                      className="p-1.5 hover:text-neon-pink transition-colors"
                      title="10s Back"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>

                    <button 
                      onClick={() => handleSkip(10)} 
                      className="p-1.5 hover:text-neon-pink transition-colors"
                      title="10s Forward"
                    >
                      <RotateCw className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400 font-mono">VOL</span>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 rounded bg-white/20 accent-neon-blue cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* High Tech Controls right panel */}
                  <div className="flex items-center space-x-3 text-xs font-mono">
                    
                    {/* Mood lighting Custom color chooser */}
                    <div className="flex items-center space-x-1 border border-white/10 px-2 py-1 rounded bg-black/40">
                      <span className="text-[10px] text-gray-400 mr-1 select-none">MOOD:</span>
                      <button 
                        onClick={() => setMoodColor('blue')} 
                        className={`w-3 h-3 rounded-full bg-neon-blue hover:scale-125 transition-transform ${moodColor === 'blue' ? 'ring-2 ring-white' : ''}`}
                        title="Neon Blue Mood"
                      />
                      <button 
                        onClick={() => setMoodColor('pink')} 
                        className={`w-3 h-3 rounded-full bg-neon-pink hover:scale-125 transition-transform ${moodColor === 'pink' ? 'ring-2 ring-white' : ''}`}
                        title="Action Pink Mood"
                      />
                      <button 
                        onClick={() => setMoodColor('purple')} 
                        className={`w-3 h-3 rounded-full bg-[#9d4edd] hover:scale-125 transition-transform ${moodColor === 'purple' ? 'ring-2 ring-white' : ''}`}
                        title="Vaporwave Purple Mood"
                      />
                      <button 
                        onClick={() => setMoodColor('green')} 
                        className={`w-3 h-3 rounded-full bg-neon-green hover:scale-125 transition-transform ${moodColor === 'green' ? 'ring-2 ring-white' : ''}`}
                        title="Terminal Green Mood"
                      />
                    </div>

                    {/* Screenshot Frame grabber button */}
                    <button 
                      onClick={captureFrame}
                      className="flex items-center space-x-1.5 bg-white/5 border border-white/10 hover:border-neon-blue hover:text-neon-blue px-2.5 py-1 rounded transition-all duration-300"
                      title="Grab decrypted frame"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Capture Frame</span>
                    </button>

                    {/* Togglable Video Calibration Editor */}
                    <button 
                      onClick={() => { setShowVideoEditor(!showVideoEditor); setShowQualityMenu(false); setShowSpeedMenu(false); }}
                      className={`flex items-center space-x-1.5 border px-2.5 py-1 rounded transition-all duration-300 ${showVideoEditor ? 'border-neon-pink text-neon-pink shadow-[0_0_8px_rgba(255,0,127,0.45)] bg-neon-pink/10' : 'bg-white/5 border-white/10 hover:border-neon-pink hover:text-neon-pink hover:shadow-[0_0_6px_rgba(255,0,127,0.25)]'}`}
                      title="Calibrate Video Brightness, contrast, Saturation & Sharpness Cores"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Video Adjust</span>
                    </button>

                    {/* Quality Selector */}
                    <div className="relative">
                      <button 
                        onClick={() => { setShowQualityMenu(!showQualityMenu); setShowSpeedMenu(false); }}
                        className="bg-white/5 border border-white/10 px-2 py-1 rounded hover:border-neon-pink hover:text-neon-pink transition-all flex items-center space-x-1"
                      >
                        <span>{videoQuality}</span>
                      </button>
                      
                      {showQualityMenu && (
                        <div className="absolute bottom-8 right-0 glassmorphism border border-white/15 rounded-lg p-1.5 space-y-1 z-50 text-left min-w-[124px]">
                          {['Auto', 'Ultra HD (4K)', '1080p', '720p', '480p'].map((q) => (
                            <button
                              key={q}
                              onClick={() => changeQuality(q)}
                              className={`w-full block text-left px-2 py-1 rounded hover:bg-white/10 text-[11px] whitespace-nowrap ${videoQuality === q ? 'text-neon-pink font-bold' : 'text-gray-300'}`}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Playback Speed */}
                    <div className="relative">
                      <button 
                        onClick={() => { setShowSpeedMenu(!showSpeedMenu); setShowQualityMenu(false); }}
                        className="bg-white/5 border border-white/10 px-2 py-1 rounded hover:border-neon-green hover:text-neon-green transition-all flex items-center space-x-1"
                      >
                        <span>{videoSpeed}x</span>
                      </button>
                      
                      {showSpeedMenu && (
                        <div className="absolute bottom-8 right-0 glassmorphism border border-white/15 rounded-lg p-1.5 space-y-1 z-50 text-left min-w-[70px]">
                          {[0.5, 1.0, 1.5, 2.0].map((s) => (
                            <button
                              key={s}
                              onClick={() => changeSpeed(s)}
                              className={`w-full block text-left px-2 py-1 rounded hover:bg-white/10 text-[11px] whitespace-nowrap ${videoSpeed === s ? 'text-neon-green font-bold' : 'text-gray-300'}`}
                            >
                              {s}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Full Screen Button */}
                    <button 
                      onClick={toggleFullscreen}
                      className="bg-white/5 border border-white/10 px-2.5 py-1 rounded hover:border-neon-blue hover:text-neon-blue hover:shadow-[0_0_8px_rgba(0,240,255,0.4)] transition-all flex items-center space-x-1"
                      title="Cyber Fullscreen HUD Sync"
                    >
                      <Maximize className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Fullscreen</span>
                    </button>

                  </div>
                </div>

              </div>

            </div>

            {/* Screenshot preview trigger */}
            {capturedScreenshot && (
              <div className="mt-4 p-4 glassmorphism border border-neon-blue/30 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                <div className="flex items-center space-x-4">
                  <img src={capturedScreenshot} className="w-24 border border-neon-blue/50 rounded-lg aspect-video object-cover" alt="Captured Frame" />
                  <div>
                    <h4 className="text-sm font-semibold tracking-wider text-neon-blue">HOLOGRAPHIC CHANNELS CAPTURED</h4>
                    <p className="text-xs text-gray-400 font-mono">Frame grabbed cleanly from matrix decrypt feed. Watermarked and verified.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a 
                    href={capturedScreenshot} 
                    download={`BJU-VERSE-${activeVideo.id}-${Date.now()}.png`}
                    className="flex items-center space-x-1.5 bg-neon-blue text-black font-bold text-xs px-4 py-2 rounded-lg hover:scale-105 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </a>
                  <button 
                    onClick={() => setCapturedScreenshot(null)}
                    className="p-2 border border-white/10 text-gray-400 hover:text-white rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        )}


        {/* ======================================================
            NETFLIX-STYLE FULL DETAIL SCREEN FOR SELECTIVE MOVIE
           ======================================================= */}
        {selectedMedia && (
          <section id="dedicated-details-screen" className="mb-12 glassmorphism border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl transition-all duration-500 animate-fade-in">
            {/* Top-Left Back Navigation Bar */}
            <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
              <button 
                onClick={() => { setSelectedMedia(null); setActiveVideo(null); }}
                className="bg-black/80 hover:bg-black text-neon-blue border border-neon-blue/30 px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_12px_rgba(0,240,255,0.5)] cursor-pointer"
                title="Return to Home Node"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>BACK TO MATRIX HOME</span>
              </button>
            </div>

            {/* Top Close Button */}
            <button 
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-gray-400 hover:text-white border border-white/10 hover:border-white transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Backdrop Banner */}
            <div className="w-full h-48 md:h-[300px] relative overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-105 blur bg-[#050508]" style={{ backgroundImage: `url(${selectedMedia.thumbnail})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] via-black/40 to-transparent" />
              
              {/* Overlay elements */}
              <div className="absolute bottom-6 left-6 md:left-12 flex items-center space-x-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#00f0ff] bg-neon-blue/10 border border-neon-blue/30 px-2.5 py-0.5 rounded-full">
                  Decryption Layer Initialized
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-neon-pink bg-neon-pink/10 border border-neon-pink/30 px-2.5 py-0.5 rounded-full">
                  Verified Data Node
                </span>
              </div>
            </div>

            {/* Primary Details Panel split */}
            <div className="px-6 md:px-12 pb-10 flex flex-col lg:flex-row gap-8 relative z-10 -mt-16">
              
              {/* Poster frame left */}
              <div className="w-56 md:w-64 shrink-0 mx-auto lg:mx-0">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative group">
                  <img src={selectedMedia.thumbnail} alt={selectedMedia.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 py-3 text-center bg-black/80 font-mono text-xs text-neon-blue border-t border-white/10">
                    {selectedMedia.fileSize}
                  </div>
                </div>
              </div>

              {/* Informative text right */}
              <div className="flex-1 text-center lg:text-left flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-gray-200 to-neon-blue bg-clip-text text-transparent tracking-wide leading-tight uppercase font-sans">
                    {selectedMedia.title}
                  </h2>

                  {/* Badges line */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4 text-xs font-mono text-gray-400">
                    <div className="flex items-center text-neon-blue select-none">
                      <Star className="w-4 h-4 fill-neon-blue/20 mr-1" />
                      <span>{selectedMedia.rating} RATING</span>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-1 text-neon-pink" />
                      <span>{selectedMedia.releaseYear}</span>
                    </div>

                    <span className="text-white/25">|</span>

                    <span className="text-neon-pink bg-neon-pink/5 border border-neon-pink/25 px-2.5 py-0.5 rounded text-[10px]">
                      {selectedMedia.category}
                    </span>

                    <span className="text-white/25">|</span>

                    <span>STUDIO: <span className="text-white font-semibold">{selectedMedia.developerOrStudio}</span></span>
                  </div>

                  {/* Synopsis Description */}
                  <p className="mt-6 text-gray-300 text-sm md:text-base leading-relaxed tracking-wide font-light max-w-3xl">
                    {selectedMedia.description}
                  </p>

                  {/* Matrix Tags */}
                  <div className="flex flex-wrap gap-2 mt-6 justify-center lg:justify-start">
                    {selectedMedia.tags.map(tag => (
                      <span key={tag} className="text-xs font-mono bg-white/5 hover:bg-neon-blue/10 border border-white/10 hover:border-neon-blue/40 px-3 py-1 rounded-full text-gray-300 transition-all cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Simulated Download Loader */}
                {isDownloading && downloadProgress !== null && (
                  <div className="mt-6 p-4 glassmorphism border border-neon-pink/40 rounded-xl text-center">
                    <p className="text-xs font-mono text-neon-pink mb-2">DECRYPTING AND CHUNKING BINARIES: {downloadProgress}%</p>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-neon-pink to-neon-blue h-full transition-all duration-300" style={{ width: `${downloadProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Action buttons footer */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 justify-center lg:justify-start">
                  <button 
                    onClick={() => {
                      setActiveVideo(selectedMedia);
                      // Scroll to video screen smoothly
                      setTimeout(() => {
                        document.getElementById('custom-neon-player-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-neon-blue text-black px-8 py-3 rounded-xl font-extrabold tracking-wider hover:bg-white hover:scale-105 shadow-[0_4px_15px_rgba(0,240,255,0.4)] transition-all duration-300"
                  >
                    <Play className="w-5 h-5 fill-black" />
                    <span>WATCH CHANNELS NOW</span>
                  </button>

                  <button 
                    onClick={() => handleDownload(selectedMedia)}
                    disabled={isDownloading}
                    className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-[#ff007f] text-white px-8 py-3 rounded-xl font-extrabold tracking-wider hover:bg-neon-pink hover:scale-105 shadow-[0_4px_15px_rgba(255,0,127,0.3)] transition-all duration-300 disabled:opacity-40"
                  >
                    <Download className="w-5 h-5 text-white" />
                    <span>DOWNLOAD DIGITAL DRIVE ({selectedMedia.fileSize})</span>
                  </button>
                </div>

              </div>
            </div>



            {/* ======================================================
                MORE LIKE THIS RECOM-GRID (NETFLIX STYLE)
               ======================================================= */}
            <div className="border-t border-white/10 px-6 md:px-12 py-8 bg-black/40">
              <h3 className="text-sm font-black tracking-wider text-[#00f0ff] uppercase font-mono mb-6 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-neon-pink" />
                <span>MORE LIKE THIS // RECOMMENDED HYPER-CHANNELS</span>
              </h3>

              {(() => {
                const similarItems = mediaList.filter(item => item.category === selectedMedia.category && item.id !== selectedMedia.id);
                if (similarItems.length === 0) {
                  return (
                    <p className="text-xs text-gray-500 font-mono italic py-4">NO OTHER ACTIVE TRANSMISSIONS DISCOVERED IN CATEGORY "{selectedMedia.category.toUpperCase()}"</p>
                  );
                }
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {similarItems.slice(0, 4).map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setSelectedMedia(item);
                          setActiveVideo(null); // Stop current playing video
                          setIsPlaying(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="group cursor-pointer glassmorphism-hover border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between relative shadow-md transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="w-full aspect-video relative overflow-hidden bg-[#11111a]">
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[9px] font-bold font-mono text-neon-blue border border-neon-blue/20">
                            ★ {item.rating}
                          </div>
                        </div>
                        <div className="p-3 bg-black/20 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-gray-500 font-mono uppercase block mb-0.5">{item.category}</span>
                            <h4 className="text-xs font-black text-white group-hover:text-neon-blue truncate uppercase leading-tight">{item.title}</h4>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[9px] font-mono text-gray-400">
                            <span>{item.fileSize}</span>
                            <span>{item.releaseYear}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

          </section>
        )}


        {/* ======================================================
            HERO MAIN SPOTLIGHT SECTION
           ======================================================= */}
        {!selectedMedia && selectedCategory === 'All' && featuredMedia && (
          <section id="hero-showcase-spotlight" className="mb-12 relative overflow-hidden rounded-3xl border border-white/10 glassmorphism shadow-2xl">
            {/* Visual background image frame */}
            <div className="absolute inset-0 z-0">
              <img src={featuredMedia.thumbnail} className="w-full h-full object-cover opacity-35" alt="Showcase Background" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
            </div>

            {/* Core textual presentation overlay */}
            <div className="relative z-10 px-6 md:px-12 py-16 md:py-24 max-w-2xl text-left">
              <div className="inline-flex items-center space-x-2 bg-neon-blue/10 border border-neon-blue/30 px-3 py-1 rounded-full text-xs font-mono text-neon-blue tracking-widest uppercase mb-6 animate-pulse">
                <span>★ HOT MATRIX FEATURE</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none bg-gradient-to-r from-neon-blue to-white bg-clip-text text-transparent">
                {featuredMedia.title}
              </h2>

              <p className="text-xs md:text-sm text-gray-300 font-mono mt-3 flex items-center space-x-4">
                <span className="text-neon-pink">{featuredMedia.releaseYear}</span>
                <span>•</span>
                <span>{featuredMedia.category}</span>
                <span>•</span>
                <span>{featuredMedia.fileSize}</span>
                <span>•</span>
                <span className="flex items-center text-neon-blue"><Star className="w-3 h-3 mr-1 fill-neon-blue/10" /> {featuredMedia.rating} Level</span>
              </p>

              <p className="mt-4 text-gray-300 text-sm md:text-base leading-relaxed tracking-wide font-light line-clamp-3">
                {featuredMedia.description}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setSelectedMedia(featuredMedia)}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-neon-blue to-neon-blue/80 text-black px-6 py-3 rounded-xl font-black text-sm tracking-widest hover:scale-105 hover:shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-all duration-300"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>DECRYPT VIEW DETAILS</span>
                </button>

                <button 
                  onClick={() => {
                    setActiveVideo(featuredMedia);
                    setTimeout(() => {
                      document.getElementById('custom-neon-player-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="flex items-center justify-center space-x-2 bg-white/5 border border-white/10 hover:border-neon-pink hover:text-neon-pink px-6 py-3 rounded-xl font-extrabold text-sm tracking-widest transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>WATCH PLAYBACK</span>
                </button>
              </div>
            </div>

            {/* Bottom mini status info badge */}
            <div className="absolute bottom-4 right-6 z-10 hidden md:block text-right">
              <span className="text-[10px] uppercase text-gray-500 font-mono">ENCRYPTED SOURCE ID: {featuredMedia.id}</span>
            </div>
          </section>
        )}


        {/* ======================================================
            CATEGORIES MATRIX SELECTOR (7 SELECTION CARD BUTTONS)
           ======================================================= */}
        {!selectedMedia && (
          <section id="interactive-categories-grid" className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-neon-pink" />
                  <span>CYBERNETIC CORES CATEGORIES</span>
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-1">Select distinct high-fidelity modules to query relevant contents.</p>
              </div>

              {/* Clean filter clear pills */}
              <div className="flex items-center space-x-2 text-xs font-mono">
                <button 
                  onClick={() => setSelectedCategory('All')} 
                  className={`px-3 py-1.5 rounded-full border transition-all duration-300 ${selectedCategory === 'All' ? 'bg-neon-blue text-black border-neon-blue font-bold shadow-[0_0_8px_#00f0ff]' : 'border-white/10 text-gray-400 hover:text-white'}`}
                >
                  Show All ({mediaList.length})
                </button>
              </div>
            </div>

            {/* Interactive masonry category rows */}
            <div id="category-scroller" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {CATEGORIES.map((cat) => {
                const count = mediaList.filter(item => item.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <div 
                    key={cat}
                    id={`cat-card-${cat.toLowerCase()}`}
                    onClick={() => { setSelectedCategory(cat); setSelectedMedia(null); }}
                    className={`cursor-pointer rounded-2xl p-4 glassmorphism text-center transition-all duration-300 flex flex-col items-center justify-between group ${isSelected ? 'border-neon-pink ring-1 ring-neon-pink shadow-[0_0_15px_rgba(255,0,127,0.2)]' : 'hover:border-neon-blue/80 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] bg-black/40'}`}
                  >
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-neon-blue group-hover:scale-110 transition-all duration-300">
                      {getCategoryIcon(cat)}
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-xs font-bold tracking-wider text-white uppercase group-hover:text-neon-blue transition-colors duration-300">{cat}</h4>
                      <span className="text-[10px] font-mono text-gray-400 block mt-1">{count} files</span>
                    </div>

                    {/* Visual micro hover details */}
                    <div className="w-full text-[9px] font-mono text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap mt-2 group-hover:text-gray-300 transition-colors duration-300">
                      {CATEGORY_DESCRIPTIONS[cat].substring(0, 32)}...
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}


        {/* ======================================================
            NETFLIX-STYLE MOVIE LISTING GRID / SLIDER RASTER UNIT
           ======================================================= */}
        {!selectedMedia && (
          <section id="media-listings-deck" className="mb-14">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
              <h3 className="text-lg font-bold tracking-widest text-[#00f0ff] uppercase font-mono">
                ⚡ ACTIVE TRANSMISSIONS {selectedCategory !== 'All' ? `// IN CATEGORY: ${selectedCategory.toUpperCase()}` : ''}
              </h3>
              <span className="text-xs font-mono text-gray-400">RENDERED INDEX COUNT: {filteredMedia.length}</span>
            </div>

            {filteredMedia.length === 0 ? (
              <div className="text-center py-20 bg-black/40 border border-white/10 rounded-2xl">
                <Sparkles className="w-12 h-12 text-gray-400/50 mx-auto mb-4 animate-bounce" />
                <p className="text-sm font-semibold text-gray-400 font-mono">ZERO INTEL CHANNELS DETECTED AT THIS COORDINATE</p>
                <button 
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="mt-4 px-4 py-2 bg-neon-blue/10 border border-neon-blue/40 text-neon-blue text-xs font-mono rounded-lg hover:bg-neon-blue hover:text-black transition-all"
                >
                  Return to Default Matrix Core
                </button>
              </div>
            ) : (
              <div id="netflix-masonry-layer" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMedia.map((item) => (
                  <div 
                    key={item.id}
                    id={`media-card-${item.id}`}
                    onClick={() => { 
                      setSelectedMedia(item); 
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group cursor-pointer glassmorphism-hover border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between relative shadow-[0_4px_20px_rgba(0,0,0,0.5)] transform hover:-translate-y-2 transition-all duration-300"
                  >
                    {/* Glowing tag border */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
                      <span className="text-[9px] bg-black/80 text-neon-blue border border-neon-blue/40 px-2 py-0.5 rounded font-bold font-mono">
                        ★ {item.rating}
                      </span>
                      <span className="text-[9px] bg-black/80 text-neon-pink border border-neon-pink/40 px-2 py-0.5 rounded font-bold font-mono">
                        {item.fileSize}
                      </span>
                    </div>

                    {/* Thumbnail Cover image frame */}
                    <div className="w-full aspect-video md:aspect-[16/10] relative overflow-hidden bg-[#11111a]">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] via-transparent to-transparent opacity-60" />
                      
                      {/* Floating play overlays */}
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full bg-neon-blue text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.7)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Card Details information row */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mb-1">
                          <span>{item.category}</span>
                          <span>{item.releaseYear}</span>
                        </div>
                        
                        <h4 className="text-sm font-extrabold text-white group-hover:text-neon-blue transition-colors duration-300 uppercase truncate">
                          {item.title}
                        </h4>
                        
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1 font-light leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom visual indicator border info */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                        <span>{item.developerOrStudio}</span>
                        <span className="text-neon-blue opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                          Query Node <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </main>


      {/* ======================================================
          SECURED CYBERPUNK ADMIN MODAL PANEL (SETTINGS ACCESS)
         ======================================================= */}
      {showAdminModal && (
        <div id="admin-security-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 transition-all duration-300 animate-fade-in">
          <div className="w-full max-w-4xl glassmorphism border-2 border-neon-pink/40 rounded-3xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(255,0,127,0.25)]">
            
            {/* Modal Exit */}
            <button 
              onClick={() => { setShowAdminModal(false); setAdminPassword(''); setAdminError(''); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>

            {!isAdminAuthenticated ? (
              /* SECURE NODE DECRYPT SIGN-IN BLOCK */
              <div className="max-w-md mx-auto text-center py-8">
                <div className="w-16 h-16 rounded-full bg-neon-pink/10 border border-neon-pink flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(255,0,127,0.3)]">
                  <Shield className="w-8 h-8 text-neon-pink" />
                </div>
                
                <h3 className="text-2xl font-black tracking-widest text-white uppercase">BJU SYNDICATE FIREWALL</h3>
                <p className="text-xs text-gray-400 font-mono mt-2">ADMIN CLEARANCE KEYCARD VERIFICATION PATHWAY REQUIRED.</p>
                
                <form onSubmit={handleAdminAuth} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 uppercase text-left mb-1.5 pl-1">ENTER SYSTEM CYBERPASSCODE</label>
                    <input 
                      type="password"
                      placeholder="Hint: BJU2099" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-center outline-none focus:border-neon-pink focus:shadow-[0_0_10px_rgba(255,0,127,0.4)] text-sm font-mono text-neon-pink tracking-widest"
                    />
                  </div>

                  {adminError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-lg text-xs font-mono text-red-500">
                      {adminError}
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-neon-pink text-white font-bold text-xs py-3 rounded-xl tracking-widest hover:scale-[1.02] shadow-[0_4px_12px_rgba(255,0,127,0.4)] transition-all"
                  >
                    BYPASS FIREWALL MAIN
                  </button>
                </form>

                <p className="text-[10px] text-gray-500 font-mono mt-6">AUTHORIZED TERMINAL ACCESS ONLY // PORT :3000 CONSOLE LINKED</p>
              </div>
            ) : (
              /* DECRYPTED UPLOAD & ADMIN CONTROLS */
              <div className="space-y-8">
                
                {/* Header title */}
                <div className="border-b border-white/15 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-neon-green" />
                    <div>
                      <h3 className="text-xl font-black text-white uppercase">CORE MATRIX STORAGE ADMINISTRATOR</h3>
                      <p className="text-xs text-neon-green font-mono">ENCRYPTED CONNECTION ONLINE // ACCESS PERMITTED</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsAdminAuthenticated(false)}
                    className="text-xs bg-white/5 hover:bg-white/10 border border-white/15 hover:text-white text-gray-300 px-4 py-2 rounded-xl"
                  >
                    Secure Terminal Logout
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Form Upload Area */}
                  <div>
                    <h4 className="text-sm font-extrabold tracking-wider text-neon-pink uppercase mb-4 flex items-center">
                      <Plus className="w-4 h-4 mr-1.5" />
                      <span>INJECT NEW CORES SOURCE FILE</span>
                    </h4>

                    <form onSubmit={handleCreateMedia} className="space-y-4">
                      {/* CHOOSE UPLOADER ENGINE METHOD */}
                      <div className="bg-black/60 border border-white/10 rounded-xl p-3 space-y-2">
                        <label className="block text-[9px] font-mono text-[#00f0ff] uppercase tracking-wider font-extrabold text-left pl-1">UPLOADER ENGINE CONTROLLER</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setInstantSimulateUpload(true)}
                            className={`py-2 px-3 text-[10px] font-mono rounded-lg border uppercase transition-all flex flex-col items-center justify-center text-center leading-relaxed cursor-pointer ${instantSimulateUpload ? 'bg-neon-pink/15 text-neon-pink border-neon-pink/60 shadow-[0_0_10px_rgba(255,0,127,0.15)] font-bold' : 'bg-transparent text-gray-500 border-white/10 hover:text-white hover:border-white/20'}`}
                          >
                            <span className="text-xs">⚡ INSTANT SIMULATION</span>
                            <span className="text-[8px] opacity-75 mt-0.5">HIGHLY RECOMMENDED // NO WAIT</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setInstantSimulateUpload(false)}
                            className={`py-2 px-3 text-[10px] font-mono rounded-lg border uppercase transition-all flex flex-col items-center justify-center text-center leading-relaxed cursor-pointer ${!instantSimulateUpload ? 'bg-neon-blue/15 text-neon-blue border-neon-blue/60 shadow-[0_0_10px_rgba(0,240,255,0.15)] font-bold' : 'bg-transparent text-gray-500 border-white/10 hover:text-white hover:border-white/20'}`}
                          >
                            <span className="text-xs">💾 CLOUD FILE TRANSMIT</span>
                            <span className="text-[8px] opacity-75 mt-0.5">PHYSICAL SERVER RESIDENT (150MB LIMIT)</span>
                          </button>
                        </div>
                        <p className="text-[9px] text-gray-500 font-mono text-center leading-snug">
                          {instantSimulateUpload 
                            ? "🚀 Instant network simulation: bypasses slow internet uploads. Files play/download instantly!" 
                            : "⚠️ Physical upload sends actual binaries to the hosting container. Larger files take time depending on your upload speed."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 pl-1 mb-1">MEDIA/APP TITLE *</label>
                          <input 
                            type="text" 
                            placeholder="e.g. CYBER CITY 2099" 
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            required
                            className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-neon-pink text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 pl-1 mb-1">CATEGORY SELECTOR *</label>
                          <select 
                            value={newCategory} 
                            onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                            className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-neon-pink text-white"
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 pl-1 mb-1">SYNOPSIS DESCRIPTION *</label>
                        <textarea 
                          placeholder="Provide immersive cyberpunk story synopsis details or application utility details..." 
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          required
                          rows={3}
                          className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-neon-pink text-white"
                        />
                      </div>

                      {/* HIGH-TECH FILE UPLOAD MATRIX HUB */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 border border-white/10 rounded-2xl p-4 bg-white/5">
                        {/* THUMBNAIL DROPZONE / LINK AREA */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-mono text-neon-pink pl-1 uppercase font-bold">1. Poster Image (URL or Upload)</label>
                          <div className="space-y-2">
                            <input 
                              type="text" 
                              placeholder="Poster Image URL (https://...)" 
                              value={newThumbnail}
                              onChange={(e) => setNewThumbnail(e.target.value)}
                              className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-neon-pink text-white"
                            />
                            
                            <label className="flex flex-col items-center justify-center border border-dashed border-white/20 hover:border-neon-pink/60 rounded-lg p-3 cursor-pointer bg-black/30 group transition-all">
                              <Upload className="w-5 h-5 text-gray-500 group-hover:text-neon-pink group-hover:scale-110 mb-1 transition-all" />
                              <span className="text-[10px] text-gray-400 font-mono text-center">
                                {uploadedThumbnailFile ? `Selected: ${uploadedThumbnailFile.name}` : "Click to select Poster Image"}
                              </span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleThumbnailFileChange(e.target.files[0]);
                                  }
                                }}
                                className="hidden" 
                              />
                            </label>
                            {uploadThumbnailProgress && (
                              <p className="text-[9px] font-mono text-neon-green text-center">{uploadThumbnailProgress}</p>
                            )}
                          </div>
                        </div>

                        {/* VIDEO DROPZONE / LINK AREA */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-mono text-neon-blue pl-1 uppercase font-bold">2. Video Transmission (URL or File Upload)</label>
                          <div className="space-y-2">
                            <input 
                              type="text" 
                              placeholder="Video Stream URL (MP4 link)" 
                              value={newVideoUrl}
                              onChange={(e) => setNewVideoUrl(e.target.value)}
                              className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-neon-blue text-white"
                            />
                            
                            <label className="flex flex-col items-center justify-center border border-dashed border-white/20 hover:border-neon-blue/60 rounded-lg p-3 cursor-pointer bg-black/30 group transition-all">
                              <Play className="w-5 h-5 text-gray-400 group-hover:text-neon-blue group-hover:scale-110 mb-1 transition-all" />
                              <span className="text-[10px] text-gray-400 font-mono text-center">
                                {uploadedVideoFile ? `Selected: ${uploadedVideoFile.name}` : "Click to load local Video file"}
                              </span>
                              <input 
                                type="file" 
                                accept="video/*" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleVideoFileChange(e.target.files[0]);
                                  }
                                }}
                                className="hidden" 
                              />
                            </label>
                            {uploadVideoProgress && (
                              <p className="text-[9px] font-mono text-neon-green text-center">{uploadVideoProgress}</p>
                            )}
                          </div>
                        </div>

                        {/* APP PACKAGE / FILE BINARY DROPZONE */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-mono text-neon-green pl-1 uppercase font-bold">3. App / Document Package (File Upload)</label>
                          <div className="space-y-2">
                            <input 
                              type="text" 
                              placeholder="Direct download Link URL" 
                              value={newDownloadUrl}
                              onChange={(e) => setNewDownloadUrl(e.target.value)}
                              className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-neon-green text-white"
                            />
                            
                            <label className="flex flex-col items-center justify-center border border-dashed border-white/20 hover:border-neon-green/60 rounded-lg p-3 cursor-pointer bg-black/30 group transition-all">
                              <Download className="w-5 h-5 text-gray-400 group-hover:text-neon-green group-hover:scale-110 mb-1 transition-all" />
                              <span className="text-[10px] text-gray-400 font-mono text-center">
                                {uploadedAppFile ? `Selected: ${uploadedAppFile.name}` : "Click to select App File (.exe, .apk, .zip...)"}
                              </span>
                              <input 
                                type="file" 
                                accept=".exe,.apk,.zip,.rar,.dmg,.pkg,.msi,.pdf,.txt,.bin" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleAppFileChange(e.target.files[0]);
                                  }
                                }}
                                className="hidden" 
                              />
                            </label>
                            {uploadAppProgress && (
                              <p className="text-[9px] font-mono text-neon-green text-center">{uploadAppProgress}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 pl-1 mb-1">DOWNLOAD TARGET LINK URL</label>
                          <input 
                            type="text" 
                            placeholder="EXE or APK download file system" 
                            value={newDownloadUrl}
                            onChange={(e) => setNewDownloadUrl(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-neon-pink text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 pl-1 mb-1">FILE CAPACITY SIZE</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 1.8 GB, 45 MB" 
                            value={newFileSize}
                            onChange={(e) => setNewFileSize(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-neon-pink text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 pl-1 mb-1">RELEASE YEAR</label>
                          <input 
                            type="text" 
                            placeholder="2026/2099" 
                            value={newReleaseYear}
                            onChange={(e) => setNewReleaseYear(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-neon-pink text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 pl-1 mb-1">DEVELOPER STUDIO</label>
                          <input 
                            type="text" 
                            placeholder="BJU-Net Systems" 
                            value={newStudio}
                            onChange={(e) => setNewStudio(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-neon-pink text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 pl-1 mb-1">TAGS (COMMA SEPARATED)</label>
                          <input 
                            type="text" 
                            placeholder="Cyber, RPG, Live" 
                            value={newTags}
                            onChange={(e) => setNewTags(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-neon-pink text-white"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-neon-green to-neon-blue text-black font-extrabold text-xs py-3 rounded-lg tracking-widest hover:scale-[1.01] transition-all duration-300 shadow-[0_4px_15px_rgba(57,255,20,0.2)]"
                      >
                        TRANSMIT MATRIX PACKAGE
                      </button>
                    </form>
                  </div>

                  {/* Existing media files administrator deletion view */}
                  <div className="flex flex-col">
                    <h4 className="text-sm font-extrabold tracking-wider text-neon-blue uppercase mb-4 flex items-center">
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      <span>MANAGE & AUDIT CURRENT ARCHIVES</span>
                    </h4>

                    <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40 flex-1 h-[300px] overflow-y-auto pr-2">
                      <div className="divide-y divide-white/10">
                        {mediaList.map((item) => (
                          <div key={item.id} className="p-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center space-x-3 min-w-0">
                              <img src={item.thumbnail} alt="" className="w-10 h-10 rounded object-cover border border-white/10 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-white block truncate uppercase">{item.title}</span>
                                <span className="text-[10px] font-mono text-gray-500 uppercase">{item.category} • {item.fileSize}</span>
                              </div>
                            </div>
                            
                            {deleteConfirmId === item.id ? (
                              <div className="flex items-center space-x-1 shrink-0 animate-fade-in">
                                <button 
                                  onClick={() => handleDeleteMediaDirect(item.id, item.title)}
                                  className="bg-gradient-to-r from-neon-pink to-red-600 text-white font-extrabold px-3 py-1 rounded-lg text-[9px] font-mono tracking-wider shadow-[0_0_8px_rgba(255,0,127,0.3)] hover:scale-105 transition-all cursor-pointer"
                                  title="Confirm Delete"
                                >
                                  CONFIRM
                                </button>
                                <button 
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="bg-white/10 text-gray-300 px-2.5 py-1 rounded-lg text-[9px] font-mono border border-white/10 hover:bg-white/15 transition-all cursor-pointer"
                                >
                                  CANCEL
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setDeleteConfirmId(item.id)}
                                className="p-1.5 px-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all cursor-pointer flex items-center space-x-1"
                                title="Delete source package"
                              >
                                <Trash2 className="w-4 h-4 shrink-0" />
                                <span className="text-[10px] font-mono uppercase font-bold tracking-tight">DELETE</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}


      {/* FOOTER COLO-NAV */}
      <footer id="main-footer" className="border-t border-white/10 py-6 mt-20 bg-black/40 text-center text-xs text-gray-500 font-mono">
        <p>© 2026 BJU-VERSE CHANNELS ENTERPRISE. HYPER-SENSITIVE DECRYPTION CLEARANCE GRANTED.</p>
        <p className="mt-1 text-neon-blue opacity-50">SHIELD DEFENSES ENHANCED // DECENTRALIZED DATAFLOW PORT:3000</p>
      </footer>

    </div>
  );
}
