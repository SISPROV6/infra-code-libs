export class ContainerTabsModel {
  name: string = "";
  visible: boolean = true;
  available: boolean = true;
  type: 'text' | 'link' = "text";
  linkText?: string = "";
}