import {
    AppBar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    Container,
    Dialog,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    ListItemIcon,
    Menu,
    MenuItem,
    Paper,
    Select, SelectChangeEvent, Snackbar,
    Stack, styled, Switch, TextField,
    ThemeProvider,
    Toolbar,
    Typography
} from "@mui/material";
import Icon from '@mui/material/Icon'
import {theme} from "../assets/Themes";
import './Taxi.css';
import {useNavigate} from "react-router-dom";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, {useEffect, useState} from "react";
import Grid from '@mui/material/Unstable_Grid2';
import {fiscalizacaoFechada, TaxiFiscalizado} from "../assets/Tipos";
import {db, putFiscalizacaoNuvem, recuperar, salvar} from "../utils/FirebaseCrud";
import DocumentData from "firebase/compat";
import {getFiscalizacao, deletarEntrada, putFiscalizacao, limpar} from "../utils/LocalCrud";
import {ExpandMore} from "@mui/icons-material";
import {addDoc, collection} from "firebase/firestore";
import Escolar from "./Escolar";


export default function Taxi() {


//Aqui vamos fazer algo muito importante: usar um único onChance para controlar o form todo
//Primeiro setamos o objeto do formulário

    const estadoInicial: TaxiFiscalizado = {
        nomePermissionario: "",
        cotaxPermissionario: 0,
        ponto: 0,
        selo: "",
        prefixo: 0,
        placa: "",
        vencimentoPermissionario: "",
        nomeCondutor: "",
        cotaxCondutor: 0,
        vencimentoCondutor: "",
        observacoes: "",
        status: "Liberado",
        numeroDocumento: "",
        horario: ""
    }

    //Aqui estamos formatando a data e hora para o formato brasileiro, e eliminando os segundos
    const dataEHoraBrasileira: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }

    const dataBrasileira: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }


    const [atualizar, setAtualizar] = useState(false);

    const [openSnackbarSucessoUpload, setOpenSnackbarSucessoUpload] = useState(false);
    const [openSnackbarErroUpload, setOpenSnackbarErroUpload] = useState(false);

    const [resultados, setResultados] = useState<TaxiFiscalizado[]>([]);
    const [state, setState] = useState<TaxiFiscalizado>(estadoInicial);
    const [status, setStatus] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [openDialogLimpar, setOpenDialogLimpar] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [dialogSalvar, setDialogSalvar] = useState(false);
    const [expandedId, setExpandedId] = React.useState(-1);
    const [condutorIgualPerm, setcondutorIgualPerm] = useState(true); //controla o switch de mostrar o condutor
    function switchHandle(e: any) {
        setcondutorIgualPerm((e as any).target.checked); //vai retornar um false or true
    }


    //use effect controlado pelo estado de 'atualizar'. Ou seja, quando fechar o modal, o programa renderiza
    useEffect(() => {
        setResultados(getFiscalizacao());
    }, [atualizar])


    const handleDialogSalvar = () => {
        setOpenMenu(false);
        setDialogSalvar(true);

    }

    const handleClose = () => {
        setOpen(false);
        setAtualizar(!atualizar)
    };

    function handleDelete(index: number) {
        console.log("chegamos até o handle delete! Index = " + index);
        deletarEntrada(index);
        setAtualizar(!atualizar);
    }

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        e.preventDefault();
        const value = e.target.value;
        setState({
            ...state,
            [(e as any).target.id]: value
        });
    }

    //Aqui eu criei um evento só para lidar com o select, devido a tipagem
    //gerar alguns erros em tempo de execução
    const handleSelectChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        setState({
            ...state,
            status: value
        });
    };

    function handleSubmit(e: any) {
        e.preventDefault();

        //"validação" das propriedades obrigatórias
        if (

            state.cotaxPermissionario == estadoInicial.cotaxPermissionario ||
            state.ponto == estadoInicial.ponto ||
            state.selo == estadoInicial.selo ||
            state.prefixo == estadoInicial.prefixo ||
            state.placa == estadoInicial.placa ||
            state.vencimentoPermissionario == estadoInicial.vencimentoPermissionario

        ) {
            console.log("formulário vazio. Nada será registrado")
        } else {

            console.log("Tentando salvar os resultados: ");
            console.log(state);
            putFiscalizacao(state);
            //zerando o state novamente
            setState(estadoInicial);
            setAtualizar(!atualizar);
        }

    }

    const handleLimparPrompt = () => {
        setOpenMenu(false);
        setOpenDialogLimpar(true);

    }

    const handleLimparAccept = () => {
        limpar();
        setAtualizar(!atualizar);
        setOpenDialogLimpar(false);
    }

    function handleSalvar(e: any) {
        setOpenMenu(false);
        e.preventDefault();
        let nome = (e as any).target.nome.value;
        let matricula = (e as any).target.matricula.value;

        if (nome == "" || matricula == "") {
            console.log("nenhuma entrada")
        } else {
            let data = new Date();

            const horarioFormatado: string = data.toLocaleString('pt-BR', dataEHoraBrasileira);

            let novaFiscalizacao: fiscalizacaoFechada = {
                nome: nome,
                matricula: matricula,
                fiscalizados: resultados,
                data: horarioFormatado
            }
            console.log("Tentando salvar na nuvem...");

            //Foi a função diretamente aqui, ao invés da função do CRUD, para conseguirmos utilizar o
            //delay do assync para conseguir o efeito do delay até a inserção do DATABASE
            //Para uma futura implementação de um banco de dados relacional + API, se atentar ao tratamento de erros!!
            addDoc(collection(db, "/fiscalizacao"), novaFiscalizacao).then(response => {
                setOpenSnackbarSucessoUpload(true);
                //    Se a fiscalização foi salva com sucesso, então a tela é seguramente limpa
                limpar();
                setAtualizar(!atualizar);

            }).catch(error => {
                setOpenSnackbarErroUpload(true);
            })

        }
    }

    const handleExpandClick = (i: number) => {
        setExpandedId(expandedId === i ? -1 : i);
    };

    const handleClickOpen = () => {


        /*Setando a data e hora no momento em que abriu-se o modal*/

        let data = new Date();

        const horarioFormatado: string = data.toLocaleString('pt-BR', dataEHoraBrasileira);

        setState({
            ...state,
            horario: horarioFormatado
        });

        setOpen(true)
    };

    function formatadorDeData(data: string): string {
        let newData = new Date(data);
        let dataFormatada = newData.toLocaleString('pt-BR', dataBrasileira);

        return dataFormatada;
    }


    let navigate = useNavigate();
    return (
        <div>
            <AppBar position="relative" color="primary">
                <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <IconButton onClick={() => navigate('/')}>
                        <Icon className="botao" fontSize="medium">arrow_back</Icon>
                    </IconButton>
                    <Typography component={"span"} variant="h5" align="center">
                        Fiscalização de Taxi
                    </Typography>
                    <IconButton onClick={() => setOpenMenu(true)} id="botao-de-menu">
                        <Icon className="botao" fontSize="medium">menu</Icon>
                    </IconButton>

                </Toolbar>
            </AppBar>

            <Menu
                anchorEl={document.getElementById('botao-de-menu')}
                open={openMenu}
                onClose={() => setOpenMenu(false)}

            >
                <MenuItem onClick={handleDialogSalvar}><ListItemIcon><Icon>cloud_upload</Icon></ListItemIcon>Enviar
                    relatório</MenuItem>
                <MenuItem onClick={handleLimparPrompt}><ListItemIcon><Icon>clear</Icon></ListItemIcon>Limpar</MenuItem>

            </Menu>

            <Box sx={{
                pt: 4
            }}>

                {resultados.map((x, index) => (
                    <Card sx={{m: 1, bgcolor: "white"}} variant="elevation" key={index}>
                        <CardHeader sx={{textAlign: 'left'}}
                                    action={
                                        <IconButton onClick={() => handleDelete(index)}>
                                            <Icon>delete</Icon>
                                        </IconButton>
                                    }
                                    title={`Permissão ${x.prefixo}`}
                                    subheader={x.nomePermissionario}
                        >
                        </CardHeader>
                        <CardContent>
                            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                <Typography className="detalhe">{x.horario} </Typography>

                                {
                                    x.status == "Liberado" ?
                                        <Typography className="coisaBoa">{x.status}</Typography> :
                                        <Typography className="coisaRuim">{x.status}</Typography>
                                }

                            </Box>
                        </CardContent>
                        <CardActions disableSpacing>

                            <IconButton onClick={() => handleExpandClick(index)}><Icon>expand_more</Icon></IconButton>

                        </CardActions>
                        <Collapse in={expandedId === index} timeout="auto" unmountOnExit>
                            <CardContent>

                                <Grid container className="infoAdicionais">
                                    <Grid xs={4} className="label">Cotax</Grid>
                                    <Grid xs={8} className="dados">{x.cotaxPermissionario}</Grid>
                                    <Grid xs={4} className="label">Válidade</Grid>
                                    <Grid xs={8} className="dados">{formatadorDeData(x.vencimentoPermissionario)}</Grid>
                                    <Grid xs={4} className="label">Placa</Grid>
                                    <Grid xs={8} className="dados">{x.placa}</Grid>
                                    <Grid xs={4} className="label">Selo</Grid>
                                    <Grid xs={8} className="dados">{formatadorDeData(x.selo)}</Grid>
                                    <Grid xs={4} className="label">Ponto</Grid>
                                    <Grid xs={8} className="dados">{x.ponto}</Grid>
                                    <Grid xs={4} className="label">Cond.</Grid>

                                    {
                                        x.nomeCondutor == "" ?
                                            <Grid xs={8} className="dados">O mesmo</Grid> :
                                            <>
                                                <Grid xs={8} className="dados"> {x.nomeCondutor}</Grid>
                                                <Grid xs={4} className="label">Cotax cond.</Grid>
                                                <Grid xs={8} className="dados"> {x.cotaxCondutor}</Grid>
                                                <Grid xs={4} className="label">Validade cond.</Grid>
                                                <Grid xs={8} className="dados"> {x.vencimentoCondutor}</Grid>
                                            </>
                                    }
                                </Grid>

                            </CardContent>
                        </Collapse>
                    </Card>
                ))}


                <Container>

                    <IconButton onClick={() => handleClickOpen()}><Icon color="primary" fontSize="large"
                    >add_circle</Icon></IconButton>
                    <Divider sx={{mb: 2}}/>
                    <Typography
                        component={"span"}
                        variant="body1"
                        align="center"
                        color="text.secondary"
                        paragraph
                    >
                        Clique no ícone acima para adicionar uma nova entrada:
                    </Typography>


                    <Dialog open={dialogSalvar} onClose={() => setDialogSalvar(false)}>
                        <DialogTitle>Salvar fiscalização</DialogTitle>
                        <DialogContent>
                            <form id="salvarFiscalizacao" onSubmit={handleSalvar}>
                                <TextField
                                    sx={{mb: 2}}
                                    fullWidth
                                    id="nome"
                                    placeholder="Nome do Agente"
                                >
                                </TextField>
                                <TextField
                                    fullWidth
                                    id="matricula"
                                    type="number"
                                    placeholder="Matrícula do Agente"
                                >
                                </TextField>
                                <Button type="submit" onClick={() => setDialogSalvar(false)}>Salvar</Button>
                            </form>
                        </DialogContent>
                    </Dialog>


                    <Dialog open={open} onClose={() => handleClose()}>

                        <DialogTitle>Nova entrada</DialogTitle>
                        <DialogContent>


                            <form id="fiscalizacaoForm" onSubmit={handleSubmit}>
                                <Grid container spacing={1}>

                                    Veículo
                                    <Grid xs={12} className="papel" sx={{mb: 2, p: 1}}>
                                        <Grid container>
                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    required
                                                    id="prefixo"
                                                    variant="standard"
                                                    label="prefixo"
                                                    type="number"
                                                    value={state.prefixo}
                                                    onChange={handleChange}
                                                />
                                            </Grid>

                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    id="placa"
                                                    variant="standard"
                                                    label="Placa"
                                                    value={state.placa}
                                                    onChange={handleChange}
                                                >

                                                </TextField>
                                            </Grid>

                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    id="selo"
                                                    variant="standard"
                                                    label="Validade selo"
                                                    type="date"
                                                    value={state.selo}
                                                    onChange={handleChange}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>

                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    id="ponto"
                                                    variant="standard"
                                                    value={state.ponto}
                                                    onChange={handleChange}
                                                    label="ponto"
                                                    type="number"
                                                />
                                            </Grid>
                                        </Grid>

                                    </Grid>

                                    Permissionário
                                    <Grid xs={12} className="papel" sx={{mb: 2, p: 1}}>

                                        <Grid container>
                                            <Grid xs={12} sm={12}>
                                                <TextField
                                                    fullWidth
                                                    id="nomePermissionario"
                                                    variant="standard"
                                                    label="Nome"
                                                    value={state.nomePermissionario}
                                                    onChange={handleChange}
                                                />
                                            </Grid>

                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    id="cotaxPermissionario"
                                                    variant="standard"
                                                    label="Cotax"
                                                    type="number"
                                                    value={state.cotaxPermissionario}
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    id="vencimentoPermissionario"
                                                    variant="standard"
                                                    value={state.vencimentoPermissionario}
                                                    onChange={handleChange}
                                                    label="validade"
                                                    type="date"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>

                                        </Grid>

                                    </Grid>

                                    Condutor
                                    <Grid xs={12} className="papel" sx={{mb: 2, p: 1}}>


                                        <FormControlLabel
                                            control={
                                                <Switch defaultChecked={true}
                                                        onChange={switchHandle}/>
                                            }
                                            label="Condutor e permissionário são a mesma pessoa"
                                        />
                                        <Grid container>
                                            <Grid xs={12} sm={12}>
                                                <TextField
                                                    fullWidth
                                                    id="nomeCondutor"
                                                    disabled={condutorIgualPerm}
                                                    value={condutorIgualPerm ? state.nomePermissionario : state.nomeCondutor}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    label="Nome"
                                                />
                                            </Grid>

                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    id="cotaxCondutor"
                                                    value={condutorIgualPerm ? state.cotaxPermissionario : state.cotaxCondutor}
                                                    disabled={condutorIgualPerm}
                                                    onChange={handleChange}
                                                    variant="standard"
                                                    label="Cotax"
                                                    type="number"
                                                />
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    id="vencimentoCondutor"
                                                    disabled={condutorIgualPerm}
                                                    variant="standard"
                                                    value={condutorIgualPerm ? state.vencimentoPermissionario : state.vencimentoCondutor}
                                                    onChange={handleChange}
                                                    label="validade"
                                                    type="date"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>

                                        </Grid>


                                    </Grid>


                                    <Grid xs={12}>
                                        <FormControl fullWidth>

                                            <Select
                                                labelId="statusLabel"
                                                value={state.status}
                                                id="status"
                                                onChange={handleSelectChange}
                                            >
                                                <MenuItem value={"Liberado"}>Liberado</MenuItem>
                                                <MenuItem value={"Liberado e autuado"}>Liberado e autuado</MenuItem>
                                                <MenuItem value={"Afastado"}>Afastado</MenuItem>
                                                <MenuItem value={"Afastado e autuado"}>Afastado e autuado</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {
                                        state.status == 'Liberado' ? <></> :
                                            <Grid xs={12}>
                                                <TextField
                                                    fullWidth
                                                    id="numeroDocumento"
                                                    variant="standard"
                                                    value={state.numeroDocumento}
                                                    onChange={handleChange}
                                                    label="Nº documento"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                >

                                                </TextField>
                                            </Grid>
                                    }


                                    <Grid xs={12} sx={{mt: 2, p: 1}} className="papel">
                                        Observações

                                        <TextField
                                            fullWidth={true}
                                            id="observacoes"
                                            variant="standard"
                                            value={state.observacoes}
                                            onChange={handleChange}
                                            placeholder="Autuações, notificações ou qualquer outra observação sobre esta fiscalização"
                                            multiline
                                            rows={5}
                                        />

                                    </Grid>

                                </Grid>
                            </form>


                        </DialogContent>

                        <DialogActions>
                            <Button onClick={() => handleClose()}>Cancelar</Button>

                            {/*botão de submit do formulário 'fiscalizacaoForm'*/}
                            <Button form="fiscalizacaoForm" type="submit" onClick={() => handleClose()}>Salvar</Button>
                        </DialogActions>

                    </Dialog>


                </Container>
            </Box>


            {/*DIALOG PARA DELEÇÃO DE ENTRADAS*/}
            <Dialog
                open={openDialogLimpar}
                onClose={() => setOpenDialogLimpar(false)}
            >
                <DialogTitle>
                    Limpar Fiscalização
                </DialogTitle>
                <DialogContent>
                    Isto limpará todo o conteúdo da fiscalização. Tem certeza que deseja continuar?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLimparAccept}>Continuar</Button>
                    <Button onClick={() => setOpenDialogLimpar(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>

            {/*SNACKBARS*/}

            <Snackbar
                open={openSnackbarSucessoUpload}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbarSucessoUpload(false)}
                message="Fiscalização salva com sucesso na nuvem!"
            />
            <Snackbar
                open={openSnackbarErroUpload}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbarErroUpload(false)}
                message="Houve algum erro na sincronização do dispositivo com a nuvem..."
            />

        </div>
    )
}