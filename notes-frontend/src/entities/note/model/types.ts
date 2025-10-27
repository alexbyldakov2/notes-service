export interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNoteData {
    title: string;
    content: string;
}