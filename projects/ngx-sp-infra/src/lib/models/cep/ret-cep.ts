import { IError } from '../ierror';
import { EnderecoByCep } from './endereco-by-cep';

export class RetCep implements IError {
  public Error: boolean = false;
  public ErrorMessage: string = "";
  public EnderecoByCep: EnderecoByCep = new EnderecoByCep();
}
