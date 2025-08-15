export interface ICustomEnvironmentService {

    // Propriedades Customizadas do Environment
	get production(): boolean,

	get hostName(): string,

    get product(): string,
	
	get Sp2LocalhostInfra2AuthWS(): string,

	get Sp2LocalhostInfra2LoginWS(): string,

	get Sp2LocalhostWS(): string,

	get SpInfra2AuthWS(): string,

	get SpInfra2LoginWS(): string,

	get SpInfra2ErpWS(): string,

    get needsAuthInfra(): Map<string, string[]>,
	
    get needsAuthAplic(): Map<string, string[]>
}