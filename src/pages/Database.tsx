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
    AppBar, Toolbar, Typography, IconButton, Dialog, TextField, Collapse, Box
} from "@mui/material";
import React, {useState} from "react";
import {recuperar} from "../utils/FirebaseCrud";
import {fiscalizacaoFechada} from "../assets/Tipos";
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

    const handleClick = () => {
        recuperar().then(resultados => {
            setResultados(resultados);
            console.log("carregou");
        })
    }

    const handleExpandClick = (i: number) => {
        setExpandedId(expandedId === i ? -1 : i);
    };


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
                            </TableRow>
                        </TableHead>

                        {
                            resultados?.map((resultado, index) =>

                                    <TableBody key={index}>
                                        <TableRow onClick={() => handleExpandClick(index)} hover>
                                            <TableCell align="center">{resultado.nome}</TableCell>
                                            <TableCell align="center">{resultado.data}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" style={{ padding: 0, border: 0 }} colSpan={2}>
                                                <Collapse in={expandedId === index}>
                                                    <Table
                                                        sx={{
                                                        bgcolor: 'lightblue',
                                                        width:'100%'
                                                    }}>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="center">Ponto</TableCell>
                                                                <TableCell align="center">Permissão</TableCell>
                                                                <TableCell align="center">Cotax</TableCell>
                                                                <TableCell align="center">Status</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>

                                                                {
                                                                    resultado.fiscalizados.map(taxi=>
                                                                        <TableRow>
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
                            x => (
                                <li>{x.nomePermissionario}</li>
                            )
                        )
                    }
                </DialogContent>
            </Dialog>

        </div>

    )
}