import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';

import { NgxPaginationModule } from 'ngx-pagination';

import { InfraEstabelecimentoFavoritoDefault, InfraModule, MessageService } from 'ngx-sp-infra';
import { LibCustomMenuService } from '../../../../custom/lib-custom-menu.service';
import { AuthStorageService } from '../../../../storage/auth-storage.service';
import { AuthUtilService } from '../../../../utils/auth-utils.service';
import { MenuServicesService } from '../../menu-services.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FavoritarModel } from '../../model/favoritarModel';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'selecao-estabelecimentos-modal',
    templateUrl: './selecao-estabelecimentos-modal.component.html',
    styleUrls: ['./selecao-estabelecimentos-modal.component.scss'],
    imports: [
        NgxPaginationModule,
        InfraModule,
        CommonModule,
        TooltipModule
    ]
})
export class SelecaoEstabelecimentosModalComponent implements OnInit {
  constructor(
    private _authStorageService: AuthStorageService,
    private _customMenuService: LibCustomMenuService,
    private _menuServicesService: MenuServicesService,
    private _messageService: MessageService,
    private _bsModalService: BsModalService,
    private _authUtilService: AuthUtilService
  ) { }

  async ngOnInit() {

    await this.getEstabelecimentos("");

  }

  // #region ==========> PROPERTIES <==========

  // #region PRIVATE
  // [...]
  // #endregion PRIVATE

  // #region PUBLIC
  @Output() public onClose = new EventEmitter<any>();
  @Output() public onSelected = new EventEmitter<any>();

  public $estabelecimentosList?: InfraEstabelecimentoFavoritoDefault[];

  public page: number = 1;
  public itemsPerPage: number = 10;

  public favoritarModel: FavoritarModel = new FavoritarModel();

  public response_messages = {
    'emptyMessage': 'Consulta não retornou registros...',
    'totalMessage': 'Linhas encontradas.'
  };
  // #endregion PUBLIC

  // #endregion ==========> PROPERTIES <==========


  // #region ==========> FORM BUILDER <==========

  // #region DATA
  // [...]
  // #endregion DATA

  // #region VALIDATORS
  // [...]
  // #endregion VALIDATORS

  // #endregion ==========> FORM BUILDER <==========


  // #region ==========> SERVICES <==========

  // #region PREPARATION

  public refreshList(pesquisa: string): void {
    this.getEstabelecimentos(pesquisa);
  }

  private async getEstabelecimentos(pesquisa: string = ""): Promise<void> {

    this.$estabelecimentosList = undefined;

    try {
      const response = await firstValueFrom(
        this._menuServicesService.getEstabelecimentosModalList(
          this._authStorageService.infraUsuarioId,
          pesquisa
        )
      );

      this.$estabelecimentosList = response.InfraEstabelecimentos;

      this.resetPagination(this.$estabelecimentosList);

      if (response.InfraEstabelecimentos.length == 0) {
        this._messageService.showAlertDanger(this.response_messages.emptyMessage);
      }

    } catch (error) {
      this._authUtilService.showHttpError(error);
      this.$estabelecimentosList = [];
    }
  }

  public favoritar(isFavorite: boolean, estabId: string): void {

   const estabelecimento = this.$estabelecimentosList?.find(id => id.ID == estabId)

    this.favoritarModel.Tenant_Id = estabelecimento!.TENANT_ID;
    this.favoritarModel.InfraEstabFavoritoId = estabelecimento!.ESTABFAVORITOID;
    this.favoritarModel.Id = estabelecimento!.ID;
    this.favoritarModel.Is_Default = estabelecimento!.IS_DEFAULT;

    this._menuServicesService.Favoritar(isFavorite, this.favoritarModel).subscribe({
      next: () => {

        estabelecimento!.IS_FAVORITE = isFavorite;

      },
      error: error => {
        this._authUtilService.showHttpError(error);

        this.$estabelecimentosList = [];
      }
    })
  }

  // #endregion PREPARATION

  // #region GET
  // [...]
  // #endregion GET

  // #region CREATE OR UPDATE

  /**
   * Atualiza o estado do Estabelecimento, informando se ele é Padrão ou não.
   * @param estabID ID do Estabelecimento a ser alterado
   * @param isDefault Informa se ele é Padrão ou não
   */
  public defineDefaultEstabelecimento(estabID: string, isDefault: boolean): void {

    this.closeModalEstabelecimento(2);

    this._menuServicesService.defineDefaultEstabelecimento(estabID, this._authStorageService.infraUsuarioId, isDefault).subscribe({
      next: () => {
        
        this.getEstabelecimentos("");

        isDefault
          ? this._messageService.showAlertSuccess('Novo estabelecimento definido como padrão para o usuário')
          : this._messageService.showAlertSuccess('Estabelecimento padrão removido para o usuário');
      },
      error: error => {
        this._authUtilService.showHttpError(error);
      }
    })
  }

  // #endregion CREATE OR UPDATE

  // #region DELETE
  // [...]
  // #endregion DELETE

  // #endregion ==========> SERVICES <==========


  // #region ==========> UTILITIES <==========

  /**
   * Envia um sinal ao componente pai com o ID e Nome do Estabelecimento selecionado no Modal
   * @param estabID ID do Estabelecimento que será enviado
   * @param estabNome Nome do Estabelecimento que será enviado
   */
  public selectEstabelecimento(estabID: string, estabNome: string): void {

    // * Método customizado para emissão de evento ao trocar de estabelecimento
    this._customMenuService.menuEmitEstabelecimentoEvent();

    this.onSelected.emit(estabID + " - " + estabNome);
  }


  /**
   * Realiza uma nova pesquisa no banco para atualizar a lista a cada 3 caracteres digitados
   * @param pesquisa Texto do input de pesquisa
   */
  public updateSearch(pesquisa: string): void {
    pesquisa.length % 3 == 0
      ? this.getEstabelecimentos(pesquisa)
      : null;
  }

  /**
   * Verifica se a string passada é alfanumérica.
   * @param str String que será verificada
   * @returns TRUE se for alfanumérica, caso contrário FALSE.
   */
  private isAlphanumeric(str: string) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) &&  // (0-9)
        !(code > 64 && code < 91) &&  // (A-Z)
        !(code > 96 && code < 123)) { // (a-z)

        return false;
      }
    }
    return true;
  };

  /** Modifica a quantidade de itens a ser mostrada na lista.
   * @param event parâmetro de evento que irá selecionar a nova quantidade.
   */
  public onSelectChange(event: any) {
    this.itemsPerPage = parseInt(event.target.value, 10);
    this.page = 1;
  }

  /** Reseta a paginação da listagem.
  */
  public resetPagination(list: any[]): void {
    // Cálculo para encontrar o valor inicial do index da página atual
    const startIndex = (this.page - 1) * this.itemsPerPage;

    // Condição para resetar o valor da paginação
    if (list.length <= startIndex) {
      this.page = 1;
    }
  }
  // #endregion ==========> UTILITIES <==========

  // #region ==========> MODALS <==========

  public closeSelf() {
    this.onClose.emit();
  }

  public openModalEstabelecimento(template: TemplateRef<any>, id: number) {
    this._bsModalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      ignoreBackdropClick: false,
      keyboard: false,
      id: id,
    });
  }

  /** Função simples com o objetivo de fechar os modais que estiverem abertos (baseados pelo ID).
   */
  public closeModalEstabelecimento(id: number) {
    this._bsModalService.hide(id);
  }

  // #endregion ==========> MODALS <==========

}
