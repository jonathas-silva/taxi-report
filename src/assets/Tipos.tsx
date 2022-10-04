
//tipo que contém os dados colhidos na fiscalização
export type TaxiFiscalizado = {
    nomePermissionario: string,
    cotaxPermissionario: number | undefined,
    vencimentoPermissionario: string,
    nomeCondutor: string,
    cotaxCondutor: number | undefined,
    vencimentoCondutor: string,
    ponto: number | undefined,
    selo: string,
    prefixo: number | undefined,
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