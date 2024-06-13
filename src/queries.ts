import axios from "axios";
import { INote } from "./types";

const API_URL = import.meta.env.VITE_API_URL;
const VITE_SESSION_KEY = import.meta.env.VITE_SESSION_KEY;
const BASE_URL = `${API_URL}/${VITE_SESSION_KEY}`;

export const fetchNotes = async () => {
  const response = await axios.get<INote[]>(`${BASE_URL}/notes`);

  return response.data;
};

export const fetchNote = async (noteId: number) => {
  const response = await axios.get<INote | null>(`${BASE_URL}/notes/${noteId}`);

  return response.data;
};

export const postNote = async (body: string): Promise<INote> => {
  const response = await axios.post(`${BASE_URL}/notes`, { body });

  return response.data;
};

export const putNote = async ({
  noteId,
  body,
}: {
  noteId: number;
  body: string;
}): Promise<INote> => {
  const response = await axios.put(`${BASE_URL}/notes/${noteId}`, { body });

  return response.data;
};

export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);

  return response.data;
};
