
//tipo que contém os dados colhidos na fiscalização
export type TaxiFiscalizado = {
    nomePermissionario: string,
    cotaxPermissionario: string,
    vencimentoPermissionario: string,
    nomeCondutor: string,
    cotaxCondutor: string,
    vencimentoCondutor: string,
    ponto: string,
    selo: string,
    prefixo: string,
    placa: string,
    status: string,
    numeroDocumento?: string,
    observacoes?: string,
    horario: string
}

export type fiscalizacaoFechada = {
    nome: string;
    matricula: number;
    fiscalizados: TaxiFiscalizado[];
    data: string;
}