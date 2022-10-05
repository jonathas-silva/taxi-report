//tipo que contém os dados colhidos na fiscalização
export type aplicativoFiscalizado = {
    nome: string,
    local: string,
    horario: string,
    aplicativo: string,
    placa: string,
    modelo: string,
    cor: string,
    letraCnh: string,
    ear: string,
    qrCode: string,
    status: string,
    observacoes?: string,
    aitp?: string,
    trav?: string
}

export type fiscalizacaoFechadaApp = {
    nome: string;
    matricula: number;
    fiscalizados: aplicativoFiscalizado[];
    data: string;
}