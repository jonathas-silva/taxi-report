import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Dialog,
    Divider,
    FormControlLabel,
    IconButton,
    Paper,
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


export default function Nova() {


//Aqui vamos fazer algo muito importante: usar um único onChance para controlar o form todo
//Primeiro setamos o objeto do formulário


    const [state, setState] = useState({
        nomePermissionario: "",
        cotaxPermissionario: "",
        ponto: "",
        selo: "",
        prefixo: "",
        placa: "",
        vencimentoPermissionario: "",
        nomeCondutor: "",
        cotaxCondutor: "",
        vencimentoCondutor: "",
        observacoes: ""
    });

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
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


        salvar(state);


        //zerando o state novamente
        setState({
            nomePermissionario: "",
            cotaxPermissionario: "",
            ponto: "",
            selo: "",
            prefixo: "",
            placa: "",
            vencimentoPermissionario: "",
            nomeCondutor: "",
            cotaxCondutor: "",
            vencimentoCondutor: "",
            observacoes: ""
        })
    }

    const [condutorIgualPerm, setcondutorIgualPerm] = useState(true); //controla o switch de mostrar o condutor
    function switchHandle(e: any) {
        setcondutorIgualPerm((e as any).target.checked); //vai retornar um false or true
    }

    let navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true)
    };
    const handleClose = () => {
        setOpen(false)
    };

    const [lista, setLista] = useState<Promise<any>>();
    useEffect(() => {

        //Busca o banco de dados sempre que o modal de inserção for alterado
        recuperar().then(
            response => {
                setLista(response);
            }
        ).catch(error => {
            console.log('Um erro ocorreu: '+ error);
        })
        console.log(lista);
    }, [open]);


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


                {
                    lista?.map ( x => (

                        <Card sx={{m:1}}>
                            <CardContent>
                                <Grid container>
                                    <Grid xs={12}>
                                        Permissionário: {x.nomePermissionario}
                                    </Grid>
                                    <Grid xs={6}>
                                        Cotax: {x.cotaxPermissionario}
                                    </Grid>
                                    <Grid xs={6}>
                                        Validade: {x.vencimentoPermissionario}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))
                }


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
                                        <Grid xs={12} className="papel" sx={{mb:2, p:1}}>
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
                                        <Grid xs={12} className="papel" sx={{mb:2, p:1}}>

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
                                        <Grid xs={12} className="papel" sx={{mb:2, p:1}}>



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

                                        <Grid xs={12} sx={{mt: 2, p:1}} className="papel">
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