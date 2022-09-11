import {AppBar, Box, Button, Container, Stack, Toolbar, Typography} from "@mui/material";

export default function Inicio(){
    return(
        <>
            <AppBar position="relative" sx={{display: 'flex', alignItems: 'center'}}>
                <Toolbar >
                    <Typography variant="h5" align="center" >
                        Fiscalização de Taxi
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{
                bgcolor: 'background.paper',
                pt: 4
            }}>

                <Container>


                    <Typography
                        variant="h5"
                        align="center"
                        color="text.secondary"
                        paragraph
                    >
                        Selecione abaixo o que deseja fazer:
                    </Typography>
                    <Stack>
                        <Button
                            variant="contained"
                            sx={{mt:4, mb:1}}
                        >Nova Fiscalização</Button>
                    </Stack>
                    <Stack>
                        <Button variant="outlined">Banco de Dados</Button>
                    </Stack>
                </Container>
            </Box>
        </>
    )
}