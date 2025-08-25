
export interface AppSettings {
    translationAssignmentMode: 'direct' | 'tender' | 'builtin';
}

export const initialSettings: AppSettings = {
    translationAssignmentMode: 'direct',
};
