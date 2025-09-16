

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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Content = result.split(',')[1];
      if (base64Content) {
        resolve(base64Content);
      } else {
        reject(new Error("Could not extract Base64 content from file."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
