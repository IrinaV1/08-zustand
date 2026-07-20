'use client';

import Modal from '@/components/Modal/Modal';
import { useParams } from 'next/navigation';
import css from './NotePreview.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function NotePreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const close = () => router.back();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;

  if (isError || !note) return <p>Something went wrong.</p>;

  const formattedDate = note.updatedAt
    ? `Updated at: ${note.updatedAt}`
    : `Created at: ${note.createdAt}`;
  return (
    <Modal onClose={close}>
      <main className={css.main}>
        <div className={css.container}>
          <button onClick={close} className={css.backBtn}>
            Back
          </button>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{formattedDate}</p>
          </div>
        </div>
      </main>
    </Modal>
  );
}
