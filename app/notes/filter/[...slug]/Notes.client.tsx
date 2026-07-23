'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import css from './Notes.module.css';
import { fetchNotes } from '@/lib/api';

import { useState } from 'react';

import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';

import { Toaster } from 'react-hot-toast';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import { NoteTag } from '@/types/note';
import Link from 'next/link';

interface NotesClientProps {
  tag: NoteTag | undefined;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

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

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      <Toaster position="top-right" />

      {data?.notes.length === 0 && <p>No notes found.</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
