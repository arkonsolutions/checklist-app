export interface IAppVersion {
    id: string;
    versionNumber: string;
    publishDate: string;
    externalStoreUri: string;
    fileSizeBytes: number;
    fileContentType: string;
    changeLog: string;
}