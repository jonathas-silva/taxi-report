import {
    AppBar,
    Box,
    Button,
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
import React, {useState} from "react";
import Grid from '@mui/material/Unstable_Grid2';


const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


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
        vencimentoCondutor: ""
    });

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        e.preventDefault();
        const value = e.target.value;
        setState({
            ...state,
            [(e as any).target.id]: value
        });
    }

    function handleSubmit(e:any) {
        e.preventDefault();
        console.log("chegamos aqui");
        console.log(state);

    }

    const [condutorIgualPerm, setcondutorIgualPerm] = useState(true); //controla o switch de mostrar o condutor
    function switchHandle(e: any){
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



    return (
        <>
            <AppBar position="relative" color="primary" sx={{display: 'flex', alignItems: 'center'}}>
                <Toolbar>
                    <IconButton onClick={() => navigate('/')}><Icon className="botao"
                                                                    fontSize="medium">arrow_back</Icon></IconButton>
                    <Typography variant="h5" align="center">
                        Fiscalização de Taxi
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{
                pt: 4
            }}>

                <Container>


                    <Typography
                        variant="body1"
                        align="center"
                        color="text.secondary"
                        paragraph
                    >
                        Clique no ícone abaixo para adicionar uma nova entrada:
                    </Typography>

                    <Divider sx={{mb: 2}}/>


                    <IconButton onClick={handleClickOpen}><Icon color="primary" fontSize="large"
                                      >add_circle</Icon></IconButton>

                    <Dialog open={open} onClose={handleClose}>

                        <DialogTitle>Nova entrada</DialogTitle>
                        <DialogContent>
                            <DialogContentText>


                                <form id="fiscalizacaoForm" onSubmit={handleSubmit}>
                                    <Grid container spacing={1}>

                                        <Grid xs={12}>
                                            Veículo
                                            <Item>

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

                                            </Item></Grid>


                                        <Grid xs={12} sx={{mt: 2}}>
                                            Permissionário
                                            <Item>
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
                                            </Item>
                                        </Grid>

                                        <Grid xs={12} sx={{mt: 2}}>
                                            Condutor

                                            <Item>
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

                                            </Item>
                                        </Grid>

                                        <Grid xs={12} sx={{mt:2}}>
                                            Observações
                                            <Item>
                                                <TextField
                                                    fullWidth={true}
                                                    id="observacoes"
                                                    variant="standard"
                                                    placeholder="Autuações, notificações ou qualquer outra observação sobre esta fiscalização"
                                                    multiline
                                                    rows={5}
                                                />
                                            </Item>
                                        </Grid>

                                    </Grid>
                                </form>


                            </DialogContentText>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleClose}>Cancelar</Button>

                            {/*botão de submit do formulário 'fiscalizacaoForm'*/}
                            <Button form="fiscalizacaoForm" type="submit" onClick={handleClose} >Salvar</Button>
                        </DialogActions>

                    </Dialog>


                </Container>
            </Box>
        </>
    )
}