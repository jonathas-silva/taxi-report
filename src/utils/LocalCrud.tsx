/*Funções para abstrair o processo de CRUD das informações do formulário para o localStorage*/
/*Armazenado em 'resultados' um lista do tipo TaxiFiscalizado[]*/

import {TaxiFiscalizado} from "../assets/TiposTaxi";
import {aplicativoFiscalizado} from "../assets/TiposAplicativo";


//UTILS
function postFiscalizacaoTaxi(fiscalizacao: TaxiFiscalizado[]) {
    localStorage.setItem("resultados", JSON.stringify(fiscalizacao));
}

function postFiscalizacaoAplicativo(fiscalizacao: aplicativoFiscalizado[]) {
    localStorage.setItem("resultadosAplicativo", JSON.stringify(fiscalizacao));
}

//GET
//Retorna uma lista armazenada em 'resultados' em localStorage
//se não houver uma lista em 'resultados', retorna uma lista vazia
export function getFiscalizacaoTaxi(): TaxiFiscalizado[] {
    let resultadoLista: TaxiFiscalizado[] = [];

    //hasOwnProperty nos informa se há essa lista no localStorage ou ainda não
    if (localStorage.hasOwnProperty("resultados")) {
        resultadoLista = JSON.parse(localStorage.getItem("resultados") || "");
    }


    return resultadoLista;
}

export function getFiscalizacaoAplicativo(): aplicativoFiscalizado[] {
    let resultadoLista: aplicativoFiscalizado[] = [];

    //hasOwnProperty nos informa se há essa lista no localStorage ou ainda não
    if (localStorage.hasOwnProperty("resultadosAplicativo")) {
        resultadoLista = JSON.parse(localStorage.getItem("resultadosAplicativo") || "");
    }


    return resultadoLista;
}

/*Recupera a lista da fiscalização em local storage,
* insere uma nova entrada nessa lista e salva novamente*/
export function putFiscalizacaoTaxi(fiscalizacao: TaxiFiscalizado) {
    let resultadoLista: TaxiFiscalizado[] = getFiscalizacaoTaxi();

    resultadoLista.push(fiscalizacao);

    postFiscalizacaoTaxi(resultadoLista);
}

export function atualizarFiscalizacaoTaxi(fiscalizacao: TaxiFiscalizado, indice: number) {
    let resultadoLista: TaxiFiscalizado[] = getFiscalizacaoTaxi();
    resultadoLista[indice] = fiscalizacao;

    postFiscalizacaoTaxi(resultadoLista);
}

export function putFiscalizacaoAplicativo(fiscalizacao: aplicativoFiscalizado) {
    let resultadoLista: aplicativoFiscalizado[] = getFiscalizacaoAplicativo();

    resultadoLista.push(fiscalizacao);

    postFiscalizacaoAplicativo(resultadoLista);
}




export function deletarEntradaTaxi(index: number) {
    console.log("   Chegamos até o deletarEntradaTaxi(). Index = " + index);
    let resultadoLista: TaxiFiscalizado[] = getFiscalizacaoTaxi();

    resultadoLista.splice(index, 1);

    postFiscalizacaoTaxi(resultadoLista);
}

export function deletarEntradaAplicativo(index: number) {
    console.log("   Chegamos até o deletarEntradaTaxi(). Index = " + index);
    let resultadoLista: aplicativoFiscalizado[] = getFiscalizacaoAplicativo();

    resultadoLista.splice(index, 1);

    postFiscalizacaoAplicativo(resultadoLista);
}

export function limparTaxi() {
    localStorage.removeItem("resultados");
}

export function limparAplicativo() {
    localStorage.removeItem("resultadosAplicativo");
}
