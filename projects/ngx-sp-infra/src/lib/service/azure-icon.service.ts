import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { catchError, from, map, mergeMap, Observable, of, shareReplay, tap, toArray } from 'rxjs';

export interface IconEntry {
  name: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class AzureIconService {

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  private _iconCache = new Map<string, string>();
  private _iconFetchCache = new Map<string, Observable<IconEntry | undefined>>();

  private _containerClient: ContainerClient;
  private _azureUrls = {
    storageUrl: 'https://sisprostorage.blob.core.windows.net',
    containerName: 'sispro-storage-svgs',
  };
  // #endregion PRIVATE

  // #endregion ==========> PROPERTIES <==========


  constructor(private _http: HttpClient, private _sanitizer: DomSanitizer) {
    const blobServiceClient = new BlobServiceClient( this._azureUrls.storageUrl );
    this._containerClient = blobServiceClient.getContainerClient(this._azureUrls.containerName);
  }


  // #region ==========> API METHODS <==========

  // #region GET

  /** Listar todos os ícones encontrados no container
   * @returns Um Observable com a lista de ícones.
  */
  public listIcons(): Observable<IconEntry[]> {
    // Listar os blobs do container e mapear para o formato IconEntry
    return from(this._containerClient.listBlobsFlat())
      .pipe(
        mergeMap(async (blobIter) => blobIter),
        map(({ name }) => ({
          name,
          url: `${this._azureUrls.storageUrl}/${this._azureUrls.containerName}/${name}`
        } as IconEntry )),
        toArray()
      );
  }

  /** Buscar um ícone específico pelo nome (exato ou parcial)
   * @param name Nome do ícone a ser buscado
   * @returns Um Observable com o ícone encontrado ou undefined
   */
  // public getIcon(name: string): Observable<IconEntry | undefined> {
  //   const normalized = name.endsWith('.svg') ? name : name + '.svg';

  //   // ✅ Early synchronous check to avoid REST call
  //   const cached = this._iconCache.get(normalized);
  //   if (cached) return of({ name, url: cached });

  //   // 🔁 If not cached, fetch full list (yes, a bit heavy if done often)
  //   return this.listIcons().pipe(
  //     map((icons) => {
  //       const found = icons.find(icon => icon.name === normalized);

  //       if (found) this._iconCache.set(found.name, found.url);
  //       return found;
  //     })
  //   );
  // }


  /**
   * Busca o ícone pelo nome, retornando um Observable com os dados simplificados do ícone.
   * Se o ícone não for encontrado, retorna um Observable com undefined.
   * @param name Nome do ícone a ser buscado
   * @returns Um Observable com o ícone encontrado ou undefined
   */
  public getIcon(name: string): Observable<IconEntry | undefined> {
    const normalized = name.endsWith('.svg') ? name : name + '.svg';

    // Se já houver um Observable no cache, o retorna
    const existing$ = this._iconFetchCache.get(normalized);
    if (existing$) return existing$;

    // 2) Caso contrário, construa-o uma vez, armazene-o e retorne-o:
    const url = `${this._azureUrls.storageUrl}/${this._azureUrls.containerName}/${normalized}`;

    const fetch$ = this._http.get(url, { responseType: 'text' }).pipe(
      map(() => ({ name: normalized, url } as IconEntry)),
      tap(() => {  }),
      catchError(err => {
        console.error(`[AzureIconService] Failed to load ${normalized}`, err);
        return of(undefined);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this._iconFetchCache.set(normalized, fetch$);
    return fetch$;
  }


  // public getIconSimplified(name: string): Observable<IconEntry | undefined> {
  //   const normalized = name.endsWith('.svg') ? name : name + '.svg';

  //   console.log("normalized", normalized);
  //   console.log("iconCache", this._iconCache);

  //   const cached = this._iconCache.get(normalized);
  //   if (cached) return of({ name: normalized, url: cached });

  //   const url = `${this._azureUrls.storageUrl}/${this._azureUrls.containerName}/${normalized}`;
  //   console.log(url);

  //   return this._http.get(url, { responseType: 'text' }).pipe(
  //     tap(svgText => {
  //       console.log("tap", svgText);
  //       this._iconCache.set(normalized, url);
  //     }),
  //     map(svgText => {
  //       console.log("map", svgText);
  //       return {
  //         name: normalized,
  //         url: url
  //       };
  //     }),
  //     catchError((err) => {
  //       console.error(`[IconService] Failed to load ${normalized}:`, err);
  //       return of(undefined); // fail silently or handle gracefully
  //     }),
  //     shareReplay(1)
  //   );
  // }


  // public async listFiles(): Promise<IconEntry[]> {
  //   let result: IconEntry[] = [];

  //   let blobs = this._containerClient.listBlobsFlat();
  //   for await (const blob of blobs) {
  //     result.push({
  //       name: blob.name,
  //       url: `${this._azureUrls.storageUrl}/${this._azureUrls.containerName}/${blob.name}`
  //     });
  //   }

  //   return result;
  // }

  // #endregion GET

  // #endregion ==========> API METHODS <==========


  // #region ==========> UTILS <==========
  // [...]
  // #endregion ==========> UTILS <==========

}
