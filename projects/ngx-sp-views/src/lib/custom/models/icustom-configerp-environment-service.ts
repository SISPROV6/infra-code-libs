export interface ICustomConfigERPEnvironmentService {

	// Propriedades Customizadas do Environment
	get production(): boolean,

	get hostName(): string,

	get product(): string,

	get Sp2LocalhostWS(): string,

	get SpInfra2ConfigErpWS(): string,
	
	get SpInfra2QueueWS(): string,

	get SpCrp2InfraWS(): string,

	get needsAuthInfra(): Map<string, string[]>,

	get needsAuthAplic(): Map<string, string[]>
}