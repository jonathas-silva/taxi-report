import {Button, Dialog, FormControl, FormControlLabel, MenuItem, Select, Switch, TextField} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Unstable_Grid2";
import DialogActions from "@mui/material/DialogActions";
import React, { useState } from "react";



export default function Escolar(props:any){
    const [open, setOpen] = useState(props.show);


    return (
        <div>
            <Dialog open={open} onClose={() => setOpen(false)}>

                <DialogTitle>Nova entrada</DialogTitle>
                <DialogContent>


                    <form id="fiscalizacaoForm" >
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

                                        />
                                    </Grid>

                                    <Grid xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="placa"
                                            variant="standard"
                                            label="Placa"

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

                                        />
                                    </Grid>

                                    <Grid xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="cotaxPermissionario"
                                            variant="standard"
                                            label="Cotax"
                                            type="number"

                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="vencimentoPermissionario"
                                            variant="standard"

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

                                        id="status"

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

                                    placeholder="Autuações, notificações ou qualquer outra observação sobre esta fiscalização"
                                    multiline
                                    rows={5}
                                />

                            </Grid>

                        </Grid>
                    </form>


                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>

                    {/*botão de submit do formulário 'fiscalizacaoForm'*/}
                    <Button form="fiscalizacaoForm" type="submit" onClick={() => setOpen(false)}>Salvar</Button>
                </DialogActions>

            </Dialog>
        </div>
    )
}