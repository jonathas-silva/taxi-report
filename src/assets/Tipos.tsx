
//tipo que contém os dados colhidos na fiscalização
export type fiscalizado = {
    nomePermissionario: string,
    cotaxPermissionario: number,
    vencimentoPermissionario: string,
    nomeCondutor: string,
    cotaxCondutor: number,
    vencimentoCondutor: string,
    ponto: number,
    selo: string,
    prefixo: number,
    placa: string,
    status: string,
    observacoes?: string,
    horario: string
}