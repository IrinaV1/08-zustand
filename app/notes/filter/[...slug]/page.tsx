import css from './Notes.module.css';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import { NoteTag } from '@/types/note';
import { Metadata } from 'next';

interface NotesProps {
  params: Promise<{
    slug: string[];
  }>;
}
export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];
  return {
    title: tag === 'all' ? 'Posts - All Users' : `Posts - User ${tag}`,
    description:
      tag === 'all'
        ? 'List of posts from all users'
        : `List of posts from user ${tag}`,
    openGraph: {
      title: tag === 'all' ? 'Posts - All Users' : `Posts - User ${tag}`,
      description:
        tag === 'all'
          ? 'List of posts from all users'
          : `List of posts from user ${tag}`,
      url: 'https://08-zustand-one-jade.vercel.app/',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: tag === 'all' ? 'Posts - All Users' : `Posts - User ${tag}`,
        },
      ],
    },
  };
}
export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;

  const tag = slug[0] === 'all' ? undefined : (slug[0] as NoteTag);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, tag],
    queryFn: () => fetchNotes('', 1, 12, tag),
  });

  return (
    <div className={css.app}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </div>
  );
}
