/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryType = 
  | 'Movies'
  | 'Series'
  | 'Hollywood'
  | 'Bollywood'
  | 'Computer-Tech'
  | 'PC-Apps'
  | 'Android-Apps';

export interface MediaEntry {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: CategoryType;
  videoUrl: string;
  downloadUrl: string;
  rating: number;
  releaseYear: string;
  fileSize: string;
  developerOrStudio: string;
  isFeatured?: boolean;
  tags: string[];
}

export interface Comment {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface AdminUser {
  username: string;
  role: 'admin';
}
