import { IError } from "./ierror";

/** Usada para um retorno simples que possua apenas uma mensagem de feedback */
export class RetFeedbackMessage implements IError {
  Error: boolean = false;
  ErrorMessage: string = "";
  FeedbackMessage: string = "";
}