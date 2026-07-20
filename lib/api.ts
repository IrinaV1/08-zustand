import { Note, NoteTag } from '@/types/note';
import axios from 'axios';

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
axios.defaults.headers.common.Authorization = `Bearer ${myKey}`;

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}
export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function fetchNotes(
  search: string = '',
  page: number = 1,
  perPage: number = 12,
  tag?: NoteTag
): Promise<NotesHttpResponse> {
  const response = await axios.get<NotesHttpResponse>('/notes', {
    params: {
      search,
      page,
      perPage,
      tag,
    },
  });

  return response.data;
}

export async function createNote(note: NewNote): Promise<Note> {
  const response = await axios.post<Note>('/notes', note);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
}
