import {AppBar, Box, Button, Container, Divider, IconButton, Stack, Toolbar, Typography} from "@mui/material";
import Icon from '@mui/material/Icon'

export default function Nova(){
    return(
        <>
            <AppBar position="relative" color="secondary"  sx={{display: 'flex', alignItems: 'center'}}>
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
                        variant="body1"
                        align="center"
                        color="text.secondary"
                        paragraph
                    >
                        Clique no ícone abaixo para adicionar uma nova entrada:
                    </Typography>

                    <Divider sx={{mb:2}}/>

                    <IconButton><Icon color="primary" fontSize="large">add_circle</Icon></IconButton>

                </Container>
            </Box>
        </>
    )
}