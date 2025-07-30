// let hostName: any = window.location.host.includes("localhost")
//   ? `http://${ window.location.host }`
//   : `https://${ window.location.host }`;
  
// export const environment = {
// 	production: false,
// 	hostName: hostName,
//  product: 'PortalNovo',
 
// 	Sp2LocalhostWS: 'http://localhost:44384/api',
//	Sp2LocalhostInfra2AuthWS: 'http://localhost:44401/api',
//	Sp2LocalhostInfra2LoginWS: 'http://localhost:44402/api',

//	SpInfra2AuthWS: `${ hostName }/SisproErpCloud/Service_Private/Infra/SpInfra2AuthWS/api`,
//	SpInfra2LoginWS: `${ hostName }/SisproErpCloud/Service_Private/Infra/SpInfra2LoginWS/api`,
//	SpInfra2ErpWS: `${ hostName }/SisproErpCloud/Service_Private/Infra/SpInfra2ErpWS/api`,

//	// URLs que necessitam de autenticação da infra.
//	needsAuthInfra: new Map<string, string[]>( Object.entries( {
//		"http://localhost:44402/api/*": [ "*" ],
//		[hostName + "/SisproErpCloud/Service_Private/Infra/SpInfra2LoginWS/api/*"]: [ "*" ]
//	} ) ),

//	// URLs que necessitam de autenticação do usuário para funcionar.
//	needsAuthAplic: new Map<string, string[]>( Object.entries( {
//		"http://localhost:44384/api/*": [ "*" ],
//		[hostName + "/SisproErpCloud/Service_Private/Infra/SpInfra2ErpWS/api/*"]: [ "*" ],
//	} ) )

// };
