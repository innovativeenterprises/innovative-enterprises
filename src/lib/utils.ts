
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fileToDataURI = (file: File): Promise<string> => {
    if (!file) {
        return Promise.reject(new Error("No file provided."));
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

export const fileToText = (file: File): Promise<string> => {
    if (!file) {
        return Promise.reject(new Error("No file provided."));
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file, 'UTF-8'); // Specify encoding
    });
};

export const fileToBase64ContentOnly = (file: File): Promise<string> => {
    if (!file) {
        return Promise.reject(new Error("No file provided."));
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                return reject(new Error('File could not be read as a string.'));
            }
            const result = reader.result as string;
            // The result includes the full data URI prefix, e.g., "data:image/jpeg;base64,".
            // We only want the content after the comma.
            const base64Content = result.split(',')[1];
            if(base64Content) {
                resolve(base64Content);
            } else {
                reject(new Error('Could not extract base64 content from data URI.'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
