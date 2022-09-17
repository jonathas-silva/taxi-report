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
    MenuItem,
    Paper,
    Select, SelectChangeEvent,
    Stack, styled, Switch, TextField,
    ThemeProvider,
    Toolbar,
    Typography
} from "@mui/material";
import Icon from '@mui/material/Icon'
import {theme} from "../assets/Themes";
import './Nova.css';
import {useNavigate} from "react-router-dom";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, {useEffect, useState} from "react";
import Grid from '@mui/material/Unstable_Grid2';
import {fiscalizado} from "../assets/Tipos";
import {recuperar, salvar} from "../utils/FirebaseCrud";
import DocumentData from "firebase/compat";
import {getFiscalizacao, putFiscalizacao} from "../utils/LocalCrud";
import {ExpandMore} from "@mui/icons-material";


export default function Nova() {


//Aqui vamos fazer algo muito importante: usar um único onChance para controlar o form todo
//Primeiro setamos o objeto do formulário

    const estadoInicial: fiscalizado = {
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
        horario: ""
    }

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {


        /*Setando a data e hora no momento em que abriu-se o modal*/

        let data = new Date();

        //Aqui estamos formatando a data e hora para o formato brasileiro, e eliminando os segundos
        const opcoes: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }

        const horarioFormatado: string = data.toLocaleString('pt-BR', opcoes);

        setState({
            ...state,
            horario: horarioFormatado
        });

        setOpen(true)
    };
    const handleClose = () => {
        setOpen(false);
        setAtualizar(!atualizar)
    };

    const [atualizar, setAtualizar] = useState(false);
    const [resultados, setResultados] = useState<fiscalizado[]>([]);
    const [state, setState] = useState<fiscalizado>(estadoInicial);

    const [status, setStatus] = useState<string>('');

    //use effect controlado pelo estado de 'atualizar'. Ou seja, quando fechar o modal, o programa renderiza
    useEffect(() => {
        setResultados(getFiscalizacao());
    }, [atualizar])

    //Aqui eu criei um evento só para lidar com o select, devido a tipagem
    //gerar alguns erros em tempo de execução
    const handleSelectChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        setState({
            ...state,
            status: value
        });
    };

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        e.preventDefault();
        const value = e.target.value;
        setState({
            ...state,
            [(e as any).target.id]: value
        });
    }

    function handleSubmit(e: any) {
        e.preventDefault();


        console.log("Tentando salvar os resultados: ");
        console.log(state);
        putFiscalizacao(state);
        //zerando o state novamente
        setState(estadoInicial);
        setAtualizar(!atualizar);


    }

    const [condutorIgualPerm, setcondutorIgualPerm] = useState(true); //controla o switch de mostrar o condutor
    function switchHandle(e: any) {
        setcondutorIgualPerm((e as any).target.checked); //vai retornar um false or true
    }

    let navigate = useNavigate();


    const [expandedId, setExpandedId] = React.useState(-1);

    const handleExpandClick = (i: number) => {
        setExpandedId(expandedId === i ? -1 : i);
    };

    return (
        <div>
            <AppBar position="relative" color="primary" sx={{display: 'flex', alignItems: 'center'}}>
                <Toolbar>
                    <IconButton onClick={() => navigate('/')}><Icon className="botao"
                                                                    fontSize="medium">arrow_back</Icon></IconButton>
                    <Typography component={"span"} variant="h5" align="center">
                        Fiscalização de Taxi
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{
                pt: 4
            }}>

                {resultados.map((x, index) => (
                    <Card sx={{m: 1}} variant="elevation" key={index}>
                        <CardHeader sx={{textAlign: 'left'}}
                                    action={
                                        <IconButton>
                                            <Icon color="warning">delete</Icon>
                                        </IconButton>
                                    }
                                    title={`Permissão ${x.prefixo}`}
                                    subheader={x.nomePermissionario}
                        >
                        </CardHeader>
                        <CardContent>
                            {/*               <Box sx={{display: 'flex', alignItems: 'center', justifyContent:'space-between'}}>
                                <Typography variant="h6">Permissão {x.prefixo}</Typography>
                                <Typography variant="subtitle1" className="label">{x.horario}</Typography>
                            </Box>*/}
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
                                    <Grid xs={8} className="dados">{x.vencimentoPermissionario}</Grid>
                                    <Grid xs={4} className="label">Placa</Grid>
                                    <Grid xs={8} className="dados">{x.placa}</Grid>
                                    <Grid xs={4} className="label">Selo</Grid>
                                    <Grid xs={8} className="dados">{x.vencimentoCondutor}</Grid>
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
                                            <InputLabel id="statusLabel">Status</InputLabel>
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
        </div>
    )
}