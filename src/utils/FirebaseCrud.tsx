//imports do firebase
import {initializeApp} from 'firebase/app';
import {addDoc, collection, Firestore, getDocs, getFirestore} from "firebase/firestore";

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

const db = getFirestore(app);

async function putFiscalizacao(data: any) {
    addDoc(collection(db, "/fiscalizacao"), data);
}

export function salvar(dados: any){

    putFiscalizacao(dados).then(
        response => {
            console.log('Dados salvos com sucesso!');
        }
    ).catch(error => {
        console.log('Algum erro ocorreu. Segue: ');
        console.log(error);
    })

}