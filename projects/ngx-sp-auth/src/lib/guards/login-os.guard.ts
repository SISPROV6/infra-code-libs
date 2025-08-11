import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

/** Protege a página de processamento de login integrado OS, só permite acessá-la se o payload for informado corretamente. */
@Injectable(
  { providedIn: 'root' }
)
export class LoginOSGuard {

  constructor(
    private _router: Router,
    private _loginOSService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const payload = route.queryParamMap.get('payload');

    if (payload && payload.trim().length > 0) {
      return true;
    }
    else {
      this._loginOSService.setPendingWarning('Login integrado falhou: o parâmetro "payload" está inválido ou ausente');
      return this._router.parseUrl('/auth/login');
    }
  }

};
