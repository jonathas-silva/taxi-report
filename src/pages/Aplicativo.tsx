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
    FormGroup,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    Switch,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import Icon from '@mui/material/Icon'
import './Taxi.css';
import {useNavigate} from "react-router-dom";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, {useEffect, useState} from "react";
import Grid from '@mui/material/Unstable_Grid2';
import {fiscalizacaoFechada, TaxiFiscalizado} from "../assets/TiposTaxi";
import {db} from "../utils/FirebaseCrud";
import {
    deletarEntradaAplicativo,
    deletarEntradaTaxi,
    getFiscalizacaoAplicativo,
    getFiscalizacaoTaxi, limparAplicativo,
    limparTaxi, putFiscalizacaoAplicativo,
    putFiscalizacaoTaxi
} from "../utils/LocalCrud";
import {addDoc, collection} from "firebase/firestore";
import {aplicativoFiscalizado, fiscalizacaoFechadaApp} from "../assets/TiposAplicativo";
import {CheckBox} from "@mui/icons-material";


export default function Aplicativo() {


//Aqui vamos fazer algo muito importante: usar um único onChance para controlar o form todo
//Primeiro setamos o objeto do formulário

    const estadoInicial: aplicativoFiscalizado = {
        nome: "",
        local: "",
        horario: "",
        aplicativo: "Uber",
        placa: "",
        modelo: "",
        cor: "",
        letraCnh: "B",
        ear: "Sim",
        qrCode: "Sim",
        status: "Liberado",
        observacoes: "",
        aitp: "",
        trav: ""
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

    const [resultados, setResultados] = useState<aplicativoFiscalizado[]>([]);
    const [state, setState] = useState<aplicativoFiscalizado>(estadoInicial);
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
        setResultados(getFiscalizacaoAplicativo());
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
        deletarEntradaAplicativo(index);
        setAtualizar(!atualizar);
    }


    /*Em comparação com a página 'Táxi', foi feito um teste de mudança do controle do estado
    * do componente de e.target.id para e.target.name, porque aparentemente os componentes
    * do tipo select não são acessados dessa forma pelo id, mas pelo nome sim*/
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        e.preventDefault();
        const value = e.target.value;
        setState({
            ...state,
            [(e as any).target.name]: value
        });
    }


    function handleSubmit(e: any) {
        e.preventDefault();

        //zerando o estado
        putFiscalizacaoAplicativo(state);
        setState(estadoInicial);
        setAtualizar(!atualizar);
        console.log(state);

    }

    const handleLimparPrompt = () => {
        setOpenMenu(false);
        setOpenDialogLimpar(true);

    }

    const handleLimparAccept = () => {
        limparAplicativo();
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

            let novaFiscalizacao: fiscalizacaoFechadaApp = {
                nome: nome,
                matricula: matricula,
                fiscalizados: resultados,
                data: horarioFormatado
            }
            console.log("Tentando salvar na nuvem...");

            //Foi a função diretamente aqui, ao invés da função do CRUD, para conseguirmos utilizar o
            //delay do assync para conseguir o efeito do delay até a inserção do DATABASE
            //Para uma futura implementação de um banco de dados relacional + API, se atentar ao tratamento de erros!!
            addDoc(collection(db, "/transAplicativo"), novaFiscalizacao).then(response => {
                setOpenSnackbarSucessoUpload(true);
                //    Se a fiscalização foi salva com sucesso, então a tela é seguramente limpa
                limparAplicativo();
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

        console.log(state);

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
                        Transporte por Aplicativo
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
                                    title={`Placa ${x.placa}`}
                                    subheader={x.nome}
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

                                    <Grid xs={12} sx={{mb: 2}}>
                                        <TextField
                                            fullWidth
                                            name="local"
                                            variant="standard"
                                            label="Endereço"
                                            value={state.local}
                                            onChange={handleChange}
                                        />
                                    </Grid>


                                    Condutor
                                    <Grid xs={12} className="papel" sx={{mb: 2, p: 1}}>

                                        <Grid container>
                                            <Grid xs={12} sm={12}>
                                                <TextField
                                                    fullWidth
                                                    name="nome"
                                                    variant="standard"
                                                    label="Nome"
                                                    value={state.nome}
                                                    onChange={handleChange}

                                                />
                                            </Grid>

                                            <Grid xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    name="letraCnh"
                                                    variant="standard"
                                                    label="Categoria CNH"
                                                    type="number"
                                                    select
                                                    value={state.letraCnh}
                                                    onChange={handleChange}

                                                >
                                                    <MenuItem value={"B"}>B</MenuItem>
                                                    <MenuItem value={"AB"}>AB</MenuItem>
                                                    <MenuItem value={"AC"}>AC</MenuItem>
                                                    <MenuItem value={"AD"}>AD</MenuItem>
                                                    <MenuItem value={"AE"}>AE</MenuItem>
                                                    <MenuItem value={"C"}>C</MenuItem>
                                                    <MenuItem value={"D"}>D</MenuItem>
                                                    <MenuItem value={"E"}>E</MenuItem>


                                                </TextField>
                                            </Grid>
                                            <Grid xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    name="aplicativo"
                                                    variant="standard"
                                                    label="Aplicativo"
                                                    type="number"
                                                    select
                                                    value={state.aplicativo}
                                                    onChange={handleChange}

                                                >
                                                    <MenuItem value={"Uber"}>Uber</MenuItem>
                                                    <MenuItem value={"99"}>99 Táxi</MenuItem>
                                                    <MenuItem value={"Cabify"}>Cabify</MenuItem>
                                                    <MenuItem value={"InDriver"}>InDriver</MenuItem>



                                                </TextField>
                                            </Grid>
                                            <Grid xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    name="ear"
                                                    variant="standard"
                                                    label="Exerce ativ. remunerada?"
                                                    type="number"
                                                    select
                                                    value={state.ear}
                                                    onChange={handleChange}

                                                >
                                                    <MenuItem value="Sim">Sim</MenuItem>
                                                    <MenuItem value="Não">Não</MenuItem>

                                                </TextField>
                                            </Grid>

                                        </Grid>

                                    </Grid>

                                    Veículo
                                    <Grid xs={12} className="papel" sx={{mb: 2, p: 1}}>
                                        <Grid container>


                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    name="placa"
                                                    variant="standard"
                                                    label="Placa"
                                                    value={state.placa.toUpperCase()}
                                                    onChange={handleChange}
                                                >

                                                </TextField>
                                            </Grid>

                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    name="modelo"
                                                    variant="standard"
                                                    label="Marca/ modelo"
                                                    value={state.modelo}
                                                    onChange={handleChange}
                                                />
                                            </Grid>


                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    name="cor"
                                                    variant="standard"
                                                    label="Cor"
                                                    value={state.cor}
                                                    onChange={handleChange}
                                                />
                                            </Grid>

                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    name="qrCode"
                                                    variant="standard"
                                                    label="Possui QRCODE?"
                                                    select
                                                    value={state.qrCode}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={"Sim"}>Sim</MenuItem>
                                                    <MenuItem value={"Não"}>Não</MenuItem>

                                                </TextField>
                                            </Grid>
                                        </Grid>

                                    </Grid>


                                    <Grid xs={12}>
                                        <TextField
                                            name="status"
                                            fullWidth
                                            select
                                            value={state.status}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={"Liberado"}>Liberado</MenuItem>
                                            <MenuItem value={"Autuado"}>Autuado</MenuItem>
                                            <MenuItem value={"Autuado e removido"}>Autuado e Removido</MenuItem>
                                        </TextField>

                                    </Grid>

                                    {
                                        state.status != 'Liberado' ?
                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    name="aitp"
                                                    variant="standard"
                                                    value={state.aitp}
                                                    onChange={handleChange}
                                                    label="Nº do AITP"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                >

                                                </TextField>
                                            </Grid> : <></>
                                    }

                                    {
                                        state.status == 'Autuado e removido' ?
                                            <Grid xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    name="trav"
                                                    variant="standard"
                                                    value={state.trav}
                                                    onChange={handleChange}
                                                    label="Nº do TRAV"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                >

                                                </TextField>
                                            </Grid> : <></>

                                    }


                                    <Grid xs={12} sx={{mt: 2, p: 1}} className="papel">
                                        Observações

                                        <TextField
                                            fullWidth={true}
                                            name="observacoes"
                                            variant="standard"
                                            value={state.observacoes}
                                            onChange={handleChange}
                                            placeholder="Autuações adicionais e ocorrências sobre esta fiscalização"
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