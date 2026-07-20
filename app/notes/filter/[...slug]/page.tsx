import css from './Notes.module.css';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import { NoteTag } from '@/types/note';

interface NotesProps {
  params: Promise<{
    slug: string[];
  }>;
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
