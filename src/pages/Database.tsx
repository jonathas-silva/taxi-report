import {
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    AppBar, Toolbar, Typography, IconButton, Dialog, TextField, Collapse, Box, Snackbar
} from "@mui/material";
import React, {useState} from "react";
import {recuperar} from "../utils/FirebaseCrud";
import {fiscalizacaoFechada} from "../assets/TiposTaxi";
import Icon from "@mui/material/Icon";
import {useNavigate} from "react-router-dom";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";


export default function Database() {

    function handleDetalhes(resultado: fiscalizacaoFechada) {
        setResultadosAtivos(resultado);
        setDialogDetalhes(!dialogDetalhes);
    }


    const [resultados, setResultados] = useState<fiscalizacaoFechada[]>();

    const [resultadosAtivos, setResultadosAtivos] = useState<fiscalizacaoFechada>();

    const [dialogDetalhes, setDialogDetalhes] = useState(false);

    const [expandedId, setExpandedId] = React.useState(-1);

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleClick = () => {
        recuperar().then(resultados => {
            setResultados(resultados);
            console.log("carregou");
        })
    }

    const handleExpandClick = (i: number) => {
        setExpandedId(expandedId === i ? -1 : i);
    };

    function criarCsv(resultado: fiscalizacaoFechada){

        let fiscalizacaoConvertida: string = "";

        //entradas comuns para cada fiscalização
        let nome: string = resultado.nome;
        let matricula: string = resultado.matricula.toString();
        let data:string = resultado.data;

        //agora vamos criar as linhas do csv no formato:
        /*
            Nome, Matrícula, data, ponto, prefixo, placa, selo, cotax Permissionário,
            validade Cotax Permissionário, cotax condutor, validade cotax condutor,
            status e observações.
        */
        resultado.fiscalizados.forEach(x=>{
            fiscalizacaoConvertida += `${nome};${matricula};${data};${x.ponto};${x.prefixo};${x.placa};`;
            fiscalizacaoConvertida += `${x.selo};${x.cotaxPermissionario};${x.vencimentoPermissionario};`;

            /*Se o cotax do condutor for igual a 0, significa que o condutor e permissionário são o mesmo.
            * Neste caso, é inserido apenas um traço indicando que não há esse dado*/
            if (x.cotaxCondutor == ""){
                fiscalizacaoConvertida += `- ; -;`
            } else {
                fiscalizacaoConvertida += `${x.cotaxCondutor};${x.vencimentoCondutor};`;
            }

            fiscalizacaoConvertida += `${x.status};${x.numeroDocumento || '-'};${x.observacoes || '-'}\n`
        })

        navigator.clipboard.writeText(fiscalizacaoConvertida).then(
            response => {
                setOpenSnackbar(true);
            }
        )
    }



    let navigate = useNavigate();
    return (
        <div>
            <AppBar position="relative" sx={{display: 'flex', alignItems: 'center'}}>
                <Toolbar>
                    <IconButton onClick={() => navigate('/')}>
                        <Icon className="botao" fontSize="medium">arrow_back</Icon>
                    </IconButton>
                    <Typography variant="h5" align="center">
                        Fiscalizações Efetuadas
                    </Typography>
                </Toolbar>
            </AppBar>

            <Button onClick={handleClick}>Carregar DB</Button>

            <div>

                <TableContainer sx={{
                    bgcolor: 'white'
                }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Agente</TableCell>
                                <TableCell align="center">Data e Hora</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>

                        {
                            resultados?.map((resultado, index) =>

                                    <TableBody key={index}>
                                        <TableRow hover>
                                            <TableCell align="center" onClick={() => handleExpandClick(index)}>{resultado.nome}</TableCell>
                                            <TableCell align="center" onClick={() => handleExpandClick(index)}>{resultado.data} </TableCell>
                                            <TableCell align="center" ><IconButton onClick={()=>criarCsv(resultado)}><Icon color="primary" className="botao" fontSize="medium">backup_table</Icon>
                                            </IconButton></TableCell>
                                        </TableRow>
                                        <TableRow >
                                            <TableCell align="center" style={{ padding: 0, border: 0 }} colSpan={3}>
                                                <Collapse in={expandedId === index}>
                                                    <Table
                                                        sx={{
                                                        bgcolor: '#E0F7FA',
                                                        width:'100%'
                                                    }}>
                                                        <TableHead sx={{
                                                            bgcolor: '#B2EBF2',
                                                            width:'100%'
                                                        }}>
                                                            <TableRow>
                                                                <TableCell align="center">Ponto</TableCell>
                                                                <TableCell align="center">Permissão</TableCell>
                                                                <TableCell align="center">Cotax</TableCell>
                                                                <TableCell align="center">Status</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>

                                                                {
                                                                    resultado.fiscalizados.map((taxi, index)=>
                                                                        <TableRow key={index}>
                                                                            <TableCell align="center">{taxi.ponto}</TableCell>
                                                                            <TableCell align="center">{taxi.prefixo}</TableCell>
                                                                            <TableCell align="center">{taxi.cotaxPermissionario}</TableCell>
                                                                            <TableCell align="center">{taxi.status}</TableCell>
                                                                        </TableRow>
                                                                    )
                                                                }

                                                        </TableBody>
                                                    </Table>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>


                            </TableBody>
                            )
                        }

                    </Table>
                </TableContainer>

            </div>

            <Dialog open={false} onClose={() => setDialogDetalhes(false)}>
                <DialogTitle>Detalhes da Fiscalização</DialogTitle>
                <DialogContent>
                    {
                        resultadosAtivos?.fiscalizados.map(
                            (x) => (
                                <li>{x.nomePermissionario}</li>
                            )
                        )
                    }
                </DialogContent>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={()=> setOpenSnackbar(false)}
                message="Conteúdo CSV copiado para a área de transferência"
            />

        </div>

    )
}