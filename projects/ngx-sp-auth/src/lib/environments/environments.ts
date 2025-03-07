// let hostName: any = window.location.hostname.includes("localhost")
//   ? `http://${ window.location.hostname }`
//   : `https://${ window.location.hostname }`;
  
// export const environment = {
// 	production: false,
// 	hostName: hostName,

// 	Sp2LocalhostWS: 'http://localhost:44384/api',

// 	SpInfra2ConfigWS: `${ hostName }/SisproErpCloud/Service_Private/Infra/SpInfra2ConfigWS/api`,
// 	SpInfra2LoginWS: `${ hostName }/SisproErpCloud/Service_Private/Infra/SpInfra2LoginWS/api`,
// 	SpInfra2ErpWS: `${ hostName }/SisproErpCloud/Service_Private/Infra/SpInfra2ErpWS/api`,
	
// 	// URLs que necessitam de autenticação da infra.
// 	needsAuthInfra: new Map<string, string[]>( Object.entries( {
// 		[hostName + "/SisproErpCloud/Service_Private/Infra/SpInfra2LoginWS/api/*"]: [ "*" ]
// 	} ) ),

// 	// URLs que necessitam de autenticação do usuário para funcionar.
// 	needsAuthAplic: new Map<string, string[]>( Object.entries( {
// 		"http://localhost:44384/api/*": [ "*" ],
// 		[hostName + "/SisproErpCloud/Service_Private/Infra/SpInfra2ErpWS/api/*"]: [ "*" ],
// 		[hostName + "/SisproErpCloud/Service_Private/Corporativo/SpCrp2CodigosPagamentoWS/api/*"]: [ "*" ],
// 		[hostName + "/SisproErpCloud/Service_Private/Corporativo/SpCrp2ConfigPeriodoWS/api/*"]: [ "*" ],
// 		[hostName + "/SisproErpCloud/Service_Private/Corporativo/SpCrp2CrpPessoaWS/api/*"]: [ "*" ],
// 		[hostName + "/SisproErpCloud/Service_Private/Corporativo/SpCrp2GeraisWS/api/*"]: [ "*" ],
// 		[hostName + "/SisproErpCloud/Service_Private/Corporativo/SpCrp2IBPTWS/api/*"]: [ "*" ],
// 		[hostName + "/SisproErpCloud/Service_Private/Corporativo/SpCrp2InfraWS/api/*"]: ["*"],
// 		[hostName + "/SisproErpCloud/Service_Private/Corporativo/SpCrp2SeqWS/api/*"]: ["*"]
// 	} ) )

// };
