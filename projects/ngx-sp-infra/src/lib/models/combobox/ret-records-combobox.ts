import { RecordCombobox } from './record-combobox';

export class RetRecordsCombobox {
  Error: boolean = false;
  ErrorMessage: string = "";
  Records: RecordCombobox[] = [];
}

export class RetRecordCombobox {
  Error: boolean = false;
  ErrorMessage: string = "";
  Record: RecordCombobox = new RecordCombobox();
}
