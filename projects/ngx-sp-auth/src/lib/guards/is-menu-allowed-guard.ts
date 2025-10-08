import { Injectable } from '@angular/core';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { MenuServicesService } from '../components/menu-lateral/menu-services.service';

@Injectable(
  { providedIn: 'root' }
)
export class IsMenuAllowedlGuard  {

  constructor(
    private router: Router,
    private _menuService: MenuServicesService
  ) { }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    let route: string = _route.routeConfig?.path === undefined ? "" : _route.routeConfig?.path;
  
    return this.isMenuAllowedGuard(route);
  }

  private navigateToError(): UrlTree {
    let notAllowed: UrlTree = this.router.parseUrl("/error-menu-not-allowed");

    return notAllowed;
  }

  //  Valida a permissão do Menu
  private async isMenuAllowedGuard(route: string): Promise<boolean | UrlTree> {
    const menuAllowed: boolean = await this.handleIsMenuAllowed(route);

    if (!menuAllowed) {
      return this.navigateToError();
    }

    return menuAllowed;
  }

  // Handle para ver se o menu é permitido.
  private async handleIsMenuAllowed(route: string): Promise<boolean> {
 
    try
    {
      let response: boolean = false;

      await this.IsMenuAllowed(route)
        .then(res => {
          response = res;
          return response;
        })
        .catch(err => {
          throw new Error(err);
        });
      
      return response;
    }
    catch (error) {
      return false;
    }

  }

  // Retorna se o menu é permitido.
  private IsMenuAllowed(route: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this._menuService.isMenuAllowed(route).subscribe({
        next: response => {
          resolve(response.IsMenuAllowed);
        },
        error: error => {
          reject(error);
        }

      });
    });

  }

}
