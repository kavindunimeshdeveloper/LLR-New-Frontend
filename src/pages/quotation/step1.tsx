import { Box, Card, CardContent, CardHeader, Grid, Stack, Typography, Select, MenuItem, FormControl, SelectChangeEvent, ToggleButton, Collapse, InputBase, Checkbox } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ArticleIcon from '@mui/icons-material/Article';

// streper
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { ReactNode, useState } from 'react';
import Header from './components/header';
import StepLink from './components/stepLink';




const MuiToggleButton = styled(ToggleButton)({
    "&.Mui-selected, &.Mui-selected:hover": {
        color: "white",
        backgroundColor: '#0070F3'
    }
});

const DMuiToggleButton = styled(ToggleButton)({
    border: 'none',
    fontStyle: 'underline',
    "&.Mui-selected, &.Mui-selected:hover": {
        color: "white",
        backgroundColor: '#d9534f'
    }
});

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
        border: '1px solid #ced4da',
        fontSize: 16,
        width: '100%',
        padding: '16.5px 12px',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),

        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}));


function Qstep1() {

    const theme = useTheme();
    const [age, setAge] = useState<string | number>('');
    const [open, setOpen] = useState(false);

    const [selected, setSelected] = useState(1);
    const [include, setInclude] = useState(1);

    const [inpF1, setInpF1] = useState(true);
    const [inpF2, setInpF2] = useState(true);
    const [inpF3, setInpF3] = useState(true);

    const steps = ['Cover Options', "About your Property", "Agreements", "Your Quote"];
    const handleChange = (event: SelectChangeEvent<typeof age>) => {
        setAge(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handle_toggle = (num: any) => {
        setSelected(num);
        if (num == 1) {
            setInpF1(true)
            setInpF2(true)
            setInpF3(true)
        } else if (num == 2) {
            setInpF1(true)
            setInpF2(true)
            setInpF3(false)
        } else if (num == 3) {
            setInpF3(true)
            setInpF1(false)
            setInpF2(false)
        }
    }

    const handle_include = (num: any) => {
        setInclude(num);
    }

    return (
        <div>
            <Box>
                <Box sx={{ my: 6 }}>
                    <Stepper activeStep={0} alternativeLabel>
                        {steps.map(label => {
                            const stepProps: { completed?: boolean } = {}
                            const labelProps: { optional?: ReactNode } = {}

                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel  {...labelProps}>{label}</StepLabel>
                                </Step>
                            )
                        })}
                    </Stepper>
                </Box>
                <Grid container spacing={6}>
                    <Header></Header>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="About your cover" titleTypographyProps={{ style: { fontWeight: '700' } }}></CardHeader>
                            <hr color='#ECEEF6' />
                            <CardContent>
                                <Typography sx={{ fontSize: 14, mt: -5 }} color='#000000' gutterBottom>
                                    What cover do you need?
                                </Typography>
                                <Stack direction={'row'}>
                                    <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Grid item xs={12} sm={4} sx={{
                                            [theme.breakpoints.down('sm')]: {
                                                marginTop: 5,
                                            }
                                        }}>
                                            <MuiToggleButton
                                                value="checkd"
                                                selected={selected == 1 ? true : false}
                                                onChange={() => {
                                                    handle_toggle(1)
                                                }} sx={{ borderRadius: 1, border: '2px solid #0070F3', width: '75%', height: 200, backgroundColor: '#white', color: '#0062cc' }}>
                                                <Stack spacing={10}>
                                                    <Typography variant='subtitle2' color={'inherit'}>
                                                        Buildings & Contents
                                                    </Typography>
                                                    <EmojiTransportationIcon sx={{ fontSize: 60, textAlign: 'center', alignSelf: 'center', color: 'inherit' }}></EmojiTransportationIcon>
                                                </Stack>
                                            </MuiToggleButton>
                                        </Grid>
                                        <Grid item xs={12} sm={4} sx={{
                                            [theme.breakpoints.down('sm')]: {
                                                marginTop: 5,
                                            }
                                        }}>
                                            <MuiToggleButton
                                                value="checkd"
                                                selected={selected == 2 ? true : false}
                                                color="primary"
                                                onChange={() => {
                                                    handle_toggle(2)
                                                }} sx={{ borderRadius: 1, border: '2px solid #0070F3', width: '75%', height: 200, backgroundColor: '#white', color: '#0062cc' }}>
                                                <Stack spacing={10}>
                                                    <Typography variant='subtitle2' color={'inherit'}>
                                                        Buildings only Cover
                                                    </Typography>
                                                    <ApartmentIcon sx={{ fontSize: 60, textAlign: 'center', alignSelf: 'center', color: 'inherit' }}></ApartmentIcon>
                                                </Stack>
                                            </MuiToggleButton>
                                        </Grid>
                                        <Grid item xs={12} sm={4} sx={{
                                            [theme.breakpoints.down('sm')]: {
                                                marginTop: 5,
                                            }
                                        }}>
                                            <MuiToggleButton
                                                value="checkd"
                                                selected={selected == 3 ? true : false}
                                                color="primary"
                                                onChange={() => {
                                                    handle_toggle(3)
                                                }} sx={{ borderRadius: 1, border: '2px solid #0070F3', width: '75%', height: 200, backgroundColor: '#white', color: '#0062cc' }}>
                                                <Stack spacing={10}>
                                                    <Typography variant='subtitle2' color={'inherit'}>
                                                        Contents only Cover
                                                    </Typography>
                                                    <ArticleIcon sx={{ fontSize: 60, textAlign: 'center', alignSelf: 'center', color: 'inherit' }}></ArticleIcon>
                                                </Stack>
                                            </MuiToggleButton>
                                        </Grid>
                                    </Grid>
                                </Stack>
                                <Grid container xs={12} sm={6} sx={{ my: 6 }} >
                                    <Collapse in={inpF1} sx={{ width: '100%' }}>
                                        <FormControl fullWidth sx={{ my: 3 }}>
                                            <Typography color='black'>What is the rebuild value of your property?</Typography>
                                            <Select id="select" open={open}
                                                onClose={handleClose}
                                                onOpen={handleOpen}
                                                value={age}
                                                onChange={handleChange}>
                                                <MenuItem value="10">Ten</MenuItem>
                                                <MenuItem value="20">Twenty</MenuItem>
                                                <MenuItem value="30">Twsenty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Collapse>
                                    <Collapse in={inpF2} sx={{ width: '100%' }}>
                                        <FormControl fullWidth sx={{ my: 3 }}>
                                            <Typography color='black'>Choose your excess</Typography>
                                            <Select id="select" open={open}
                                                onClose={handleClose}
                                                onOpen={handleOpen}
                                                value={age}
                                                onChange={handleChange}>
                                                <MenuItem value="10">Ten</MenuItem>
                                                <MenuItem value="20">Twenty</MenuItem>
                                                <MenuItem value="30">Twsenty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Collapse>
                                    <Collapse in={inpF3} sx={{ width: '100%' }}>
                                        <FormControl fullWidth sx={{ my: 3 }}>
                                            <Typography color='black'>What is the replacement value of your contents?</Typography>
                                            <Select id="select" open={open}
                                                onClose={handleClose}
                                                onOpen={handleOpen}
                                                value={age}
                                                onChange={handleChange}>
                                                <MenuItem value="10">Ten</MenuItem>
                                                <MenuItem value="20">Twenty</MenuItem>
                                                <MenuItem value="30">Twsenty</MenuItem>
                                            </Select>
                                        </FormControl>

                                    </Collapse>
                                </Grid>
                                <Grid container xs={12} sx={{ my: 6 }} >
                                    <Grid item xs={12}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 400, my: 3 }}>
                                            Accidental damage (for Buildings)?
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} >
                                        <MuiToggleButton value="1" selected={include == 1 ? true : false} onChange={() => {
                                            handle_include(1)
                                        }} sx={{
                                            borderRadius: 0.5, textTransform: 'none', px: 16, color: '#0063cc', borderColor: '#0062cc'
                                        }}>
                                            Include
                                        </MuiToggleButton>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} sx={{
                                        [theme.breakpoints.down('sm')]: {
                                            marginTop: 5,
                                        }
                                    }}>
                                        <DMuiToggleButton sx={{ color: '#d9534f', borderRadius: 0.5, textTransform: 'none', px: 10, textDecoration: 'underline' }} value="2" selected={include == 2 ? true : false} onChange={() => {
                                            handle_include(2)
                                        }}>
                                            Do not Include
                                        </DMuiToggleButton>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Grid container xs={12} sx={{ my: 6 }} spacing={5}>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <FormControl variant="standard" sx={{ width: '100%' }}>
                                            <Typography sx={{ fontSize: 14, mt: -5 }} color='#000000' gutterBottom>
                                                When would you like your cover to start?
                                            </Typography>
                                            <BootstrapInput defaultValue="Start date" id="bootstrap-input" />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <Grid container sm={12}>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <MuiToggleButton value="1" selected={include == 1 ? true : false} onChange={() => {
                                                    handle_include(1)
                                                }} sx={{
                                                    borderRadius: 0.5, textTransform: 'none', px: 16, color: '#0063cc', borderColor: '#0062cc'
                                                }}>
                                                    Today
                                                </MuiToggleButton>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6} sx={{
                                                [theme.breakpoints.down('sm')]: {
                                                    marginTop: 5,
                                                }
                                            }}>
                                                <MuiToggleButton sx={{ borderRadius: 0.5, textTransform: 'none', px: 10, color: '#0063cc', borderColor: '#0062cc' }} value="2" selected={include == 2 ? true : false} onChange={() => {
                                                    handle_include(2)
                                                }}>
                                                    Tomorrow
                                                </MuiToggleButton>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="About you" titleTypographyProps={{ style: { fontWeight: '700' } }}></CardHeader>
                            <hr color='#ECEEF6' />
                            <CardContent>
                                <Grid container xs={12} sm={6} >
                                    <FormControl fullWidth sx={{ width: '95%' }} >
                                        <Typography color='#0A3360'>Title (optional)</Typography>
                                        <Select id="select" open={open}
                                            onClose={handleClose}
                                            onOpen={handleOpen}
                                            value={"3"}
                                            onChange={handleChange}>
                                            <MenuItem value="10">Ten</MenuItem>
                                            <MenuItem value="20">Twenty</MenuItem>
                                            <MenuItem value="30">Twsenty</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid container xs={12} sx={{ my: 3 }} spacing={6} >
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="standard" size='medium'>
                                            <Typography sx={{ fontSize: 14, mt: -5 }} color='#0A3360' gutterBottom>
                                                First Name
                                            </Typography>
                                            <BootstrapInput defaultValue="First Name" id="bootstrap-input" size='medium' />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="standard">
                                            <Typography sx={{ fontSize: 14, mt: -5 }} color='#0A3360' gutterBottom>
                                                Last Name
                                            </Typography>
                                            <BootstrapInput defaultValue="Last Name" id="bootstrap-input" />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Contact details" titleTypographyProps={{ style: { fontWeight: '700' } }}></CardHeader>
                            <hr color='#ECEEF6' />
                            <CardContent>
                                <Grid container xs={12} sm={6} >
                                    <FormControl fullWidth variant="standard" sx={{ width: '95%' }} >
                                        <Typography sx={{ fontSize: 14, mt: -5 }} color='#0A3360' gutterBottom>
                                            Email
                                        </Typography>
                                        <BootstrapInput defaultValue="Enter Your Email" id="bootstrap-input" />
                                    </FormControl>
                                </Grid>
                                <Grid container xs={12} sx={{ my: 3 }} spacing={6} >
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="standard">
                                            <Typography sx={{ fontSize: 14, mt: -5 }} color='#0A3360' gutterBottom>
                                                Mobile Number
                                            </Typography>
                                            <BootstrapInput defaultValue="Enter Your Mobile Number" id="bootstrap-input" />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="standard">
                                            <Typography sx={{ fontSize: 14, mt: -5 }} color='#0A3360' gutterBottom>
                                                Alternative Number
                                            </Typography>
                                            <BootstrapInput defaultValue="(Optional)" id="bootstrap-input" />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography color={'#0A3360'} sx={{ mt: 6, fontWeight: 400, fontSize: 17 }}>
                            You will receive an automatic email with your quote
                        </Typography>
                        <Stack direction={"row"} sx={{ alignItems: 'flex-start', my: 3 }}>
                            <Checkbox defaultChecked color="default" size="medium" />
                            <Typography variant='subtitle2' sx={{ mb: 2, mt: -1 }}>
                                I agree to Landlord's Rescue keeping me informed by email with personalised news, offers, products and promotions it believes would interest me.
                                We collect and use pertinent information about you in order to offer you with insurance and to comply with applicable laws. This includes your name and contact information, as well as potentially more sensitive information, such as information on any criminal convictions you may have. Due to the nature of insurance, your information may be shared with and used by a variety of third parties in the insurance industry, including insurers, reinsurers, loss adjusters, subcontractors, regulators, law enforcement agencies, fraud and crime prevention and detection agencies, and mandatory insurance databases. We shall release your personal information only to the extent necessary or permitted by law in connection with the insurance that we provide. For additional information, please refer to our Privacy Statement. Privacy Policy
                                By providing us with your details you confirm that you agree with our terms and conditions. Terms.
                            </Typography>
                        </Stack>
                        <StepLink prev="0" next="2" ></StepLink>
                    </Grid>
                </Grid>
            </Box>
        </div >
    )
}

export default Qstep1
