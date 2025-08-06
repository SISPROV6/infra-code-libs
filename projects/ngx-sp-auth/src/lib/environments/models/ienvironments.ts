export interface IEnvironments {
	production: boolean,
	hostName: string,
    product: string,
	
	Sp2LocalhostInfra2AuthWS: string,
	Sp2LocalhostInfra2LoginWS: string,
	Sp2LocalhostWS: string,

	SpInfra2AuthWS: string,
	SpInfra2LoginWS: string,
	SpInfra2ErpWS: string,

    needsAuthInfra: Map<string, string[]>,
    needsAuthAplic: Map<string, string[]>
}