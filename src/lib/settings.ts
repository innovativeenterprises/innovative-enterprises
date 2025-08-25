
export interface AppSettings {
    translationAssignmentMode: 'direct' | 'tender';
}

export const initialSettings: AppSettings = {
    translationAssignmentMode: 'direct',
};
