//imports do firebase
import {initializeApp} from 'firebase/app';
import {addDoc, collection, Firestore, getDocs, getFirestore} from "firebase/firestore";
import {fiscalizacaoFechada} from "../assets/Tipos";
import {Snackbar} from "@mui/material";
import React, { useState } from "react";

const firebaseConfig = {
    apiKey: "AIzaSyAqhkxkgulL8T0fh_2Aau9iNIJOyMUHfvM",
    authDomain: "taxi-report.firebaseapp.com",
    projectId: "taxi-report",
    storageBucket: "taxi-report.appspot.com",
    messagingSenderId: "1089360542977",
    appId: "1:1089360542977:web:e69824d9ee8ec92764ef00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


//PUT
export async function putFiscalizacaoNuvem(data: fiscalizacaoFechada) {
    addDoc(collection(db, "/fiscalizacao"), data);
}

export function salvar(dados: fiscalizacaoFechada) {
    putFiscalizacaoNuvem(dados).then(
        response => {
            console.log("ok");
        }
    ).catch(error => {
        console.log(error);
    })

}

//GET
 export async function recuperar(): Promise<any>{
    const resultadosCollection = collection(db, "fiscalizacao");
    const resultadosSnapshot = await getDocs(resultadosCollection);
    const resultadosLista = resultadosSnapshot.docs.map(doc => doc.data());

    return resultadosLista;
}





