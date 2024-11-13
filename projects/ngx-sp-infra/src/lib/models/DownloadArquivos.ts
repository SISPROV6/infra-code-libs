export class DownloadArquivos{
    Error: boolean = false;
    ErrorMessage: string = "";
    FileName: string = "";
    File: string = "";
}

export interface DownloadArq{
    Error: boolean;
    ErrorMessage: string;
    DownloadArquivos: DownloadArquivos;
}