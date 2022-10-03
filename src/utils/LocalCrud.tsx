/*Funções para abstrair o processo de CRUD das informações do formulário para o localStorage*/
/*Armazenado em 'resultados' um lista do tipo fiscalizado[]*/

import {fiscalizado} from "../assets/Tipos";



//UTILS
function postFiscalizacao(fiscalizacao: fiscalizado[]){
    localStorage.setItem("resultados", JSON.stringify(fiscalizacao));
}

//GET
//Retorna uma lista armazenada em 'resultados' em localStorage
//se não houver uma lista em 'resultados', retorna uma lista vazia
export function getFiscalizacao():fiscalizado[]{
    let resultadoLista: fiscalizado[] = new Array;

   //hasOwnProperty nos informa se há essa lista no localStorage ou ainda não
    if(localStorage.hasOwnProperty("resultados")){
        resultadoLista = JSON.parse(localStorage.getItem("resultados") || "");
    }


    return resultadoLista;
}

/*Recupera a lista da fiscalização em local storage,
* insere uma nova entrada nessa lista e salva novamente*/
export function putFiscalizacao(fiscalizacao: fiscalizado){
    let resultadoLista: fiscalizado[] = getFiscalizacao();

    resultadoLista.push(fiscalizacao);

    postFiscalizacao(resultadoLista);
}

export function deletarEntrada(index: number){
    console.log("   Chegamos até o deletarEntrada(). Index = " + index);
    let resultadoLista: fiscalizado[] = getFiscalizacao();

    resultadoLista.splice(index,1);

    postFiscalizacao(resultadoLista);
}

export function limpar(){
    localStorage.removeItem("resultados");
}
