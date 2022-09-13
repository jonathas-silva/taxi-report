import {createTheme} from "@mui/material";
import purple from '@mui/material/colors/purple'

const papelDeParede = purple[100];

export const theme = createTheme(
    {
        palette: {
            background: {
                default: '#fff',
                paper: '#f5f5f5'
            }

        }
    }
)