import { getFarmingVideo, getFarmingVideos } from '@/content/repository';
import { OG_SIZE, shareImage } from '@/lib/seo/og';
import { videoPoster } from '@/lib/video';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Oceania Fertilizers farmer video';

export async function generateStaticParams() {
  const videos = await getFarmingVideos();
  return videos.map((video) => ({ slug: video.slug }));
}

export default async function VideoOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = await getFarmingVideo(slug);
  const poster = video ? videoPoster(video.video, video.poster) : undefined;
  return shareImage({
    label: video?.topic?.title ?? 'Farmer video',
    title: video?.title ?? 'Learn farming together',
    imageUrl: typeof poster?.src === 'string' ? poster.src : undefined,
  });
}
