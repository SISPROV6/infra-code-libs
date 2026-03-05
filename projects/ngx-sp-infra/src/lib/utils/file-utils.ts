/**
 * Classe estática com métodos utilitários para uso na leitura, conversão e upload de arquivos
*/
export class FileUtils {

  /** Recebe o tamanho de um arquivo em bytes e retorna string formatada valor e sufixo correspondente.
   * 
   * @example
   * 4174 => "4.08 KB"
   * 3661 => "3.58 KB"
  */
  public static convertfileSize(bytes: number): string {
    if (bytes === 0) return '0 bytes';

    const k = 1024;
    const dm = 2 < 0 ? 0 : 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  /**
   * Converte um arquivo formato 'File' para string base64.
   * Útil principalmente para envios ao backend
   * 
   * @param file Arquivo a ser convertido
   * @returns String base64 do conteúdo do arquivo
  */
  public static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) { reject('Arquivo vazio ou inválido.') }

      const reader = new FileReader();
      reader.onload = () => {

        // O resultado é uma Data URL (exemplo.: "data:image/png;base64,iVBORw0KGg...")
        // Remove-se o "data:..." e retorna somente a string Base64 em si.
        const base64String = reader.result!.toString().replace(/^data:(.*,)?/, '');
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // lê o conteúdo do arquivo
    });
  };


  /**
   * Converte uma string JSON em um objeto Javascript File.
   * 
   * @param json JSON que será convertido
   * @param name Nome do arquivo (deve conter a extensão '.json')
   * @returns Objeto 'File' criado com base no JSON informado
  */
  public static JSONToFile(json: string, name: string): File {
    try {
      let fileData = JSON.parse(json);

      if (typeof File !== 'undefined') {
        const fileContentArray = [ JSON.stringify(fileData) ]; // Conteúdo deve ser um array de Blobs
        const filename = name;
        const mimeType = 'application/json';

        // Cria o objeto de File em si
        const myFile = new File(fileContentArray, filename, {
          type: mimeType,
          lastModified: Date.now() // Opcional: define a data de última modificação para a data atual
        });

        return myFile;
      }
      else {
        throw new Error("O construtor File não está disponível neste ambiente (exemplo.: Node.js)");
      }
    }
    catch (err) {
      throw new Error(`Ocorreu um erro ao criar o objeto de File: ${ err }`);
    }
  }

}