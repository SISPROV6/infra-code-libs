export interface AuthToken {
  __ip: string;
  __tenantId: number;
  __infraUsuarioId: string;
  __infraEstabId: string;
  __infraEstabNome: string;
  __infraEmpresaId: string;
  __infraEmpresaNome: string;
  __user: string;
  __userName: string;
  __authToken: string;
  __tokenPayload: TokenPayload;
  __dominio: string;
  __isExternalLogin: boolean;
}

export interface TokenPayload {
  userId: string;
  userName: string;
  sub: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
  tenantId: number;
  dominio: string;
}