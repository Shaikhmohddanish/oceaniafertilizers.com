import type { FarmingVideo, VideoPresenterRole } from '@/content/types';

export const presenterRoles: Record<VideoPresenterRole, string> = {
  farmer: 'Farmer',
  agronomist: 'Agronomist',
  team: 'Oceania team',
};

/** "A turmeric grower, Farmer, Sangli, Maharashtra / Marathi": who speaks, where, and in which language. */
export function presenterLine(video: Pick<FarmingVideo, 'presenter' | 'role' | 'district' | 'state' | 'language'>): string {
  const who = [video.presenter, presenterRoles[video.role], video.district, video.state].filter(Boolean).join(', ');
  return `${who} / ${video.language}`;
}
