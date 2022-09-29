
//tipo que contém os dados colhidos na fiscalização
export type fiscalizado = {
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
    observacoes?: string,
    horario: string
}

export type fiscalizacaoFechada = {
    nome: string;
    matricula: number;
    fiscalizados: fiscalizado[];
    data: string;
}