import {AppBar, Box, Button, Container, Stack, Toolbar, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Menu(){

    let navigate = useNavigate();


    return(
        <>
            <AppBar position="relative" sx={{display: 'flex', alignItems: 'center'}}>
                <Toolbar >
                    <Typography variant="h5" align="center" >
                        RDF Eletrônico
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{
                bgcolor: 'background.paper',
                pt: 4
            }}>

                <Container>


                    <Typography
                        fontSize="large"
                        align="center"
                        color="text.secondary"
                        paragraph
                    >
                        Selecione abaixo a modalidade que deseja fiscalizar:
                    </Typography>
                    <Stack>
                        <Button
                            variant="contained"
                            sx={{mt:4, mb:1}}
                            onClick={()=>navigate('/nova')}
                            
                        >Táxi</Button>
                    </Stack>
                    <Stack>
                        <Button variant="outlined"
                                onClick={()=>navigate('/dashboard')}
                        >Banco de Dados</Button>
                    </Stack>
                </Container>
            </Box>
        </>
    )
}