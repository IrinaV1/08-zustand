'use client';
import css from './NoteForm.module.css';
import { useId } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createNote, NewNote } from '@/lib/api';
import { NoteTag } from '@/types/note';
import { useRouter } from 'next/navigation';

export default function NoteForm() {
  const router = useRouter();
  const handleCancel = () => router.push('/notes/filter/all');
  const fieldId = useId();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
      toast.success('Note created!');
      router.back();
    },
    onError() {
      toast.error('Failed to create note.');
    },
  });

  const handleSubmit = (formData: FormData) => {
    const values = Object.fromEntries(formData);

    const note: NewNote = {
      title: values.title as string,
      content: values.content as string,
      tag: values.tag as NoteTag,
    };
    mutation.mutate(note);
  };
  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          className={css.input}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select id={`${fieldId}-tag`} name="tag" className={css.select}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          onClick={handleCancel}
          type="button"
          className={css.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
