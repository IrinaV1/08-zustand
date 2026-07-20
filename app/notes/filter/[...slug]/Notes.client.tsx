'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import css from './Notes.module.css';
import { fetchNotes } from '@/lib/api';

import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import NoteForm from '@/components/NoteForm/NoteForm';
import { Toaster } from 'react-hot-toast';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import { NoteTag } from '@/types/note';

interface NotesClientProps {
  tag: NoteTag | undefined;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', searchQuery, currentPage, tag],
    queryFn: () => fetchNotes(searchQuery, currentPage, 12, tag),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Failed to load notes.</p>;
  }

  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={updateSearchQuery} />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>
      <Toaster position="top-right" />

      {data?.notes.length === 0 && <p>No notes found.</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isOpenModal && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
