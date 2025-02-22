import React, {useState } from 'react';
import {Stack, Typography, Box, Grid, Divider, Card, CardContent, Button } from '@mui/material';
import BathtubIcon from '@mui/icons-material/Bathtub';
import BedIcon from '@mui/icons-material/Bed';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { UpcomingViewingsTable } from './UpcomingViewingsTable';
import InspectionRequestModal from './InspectionRequestModal';
import ImageCarousel from '../../manager-components/property_page/ImageCarousel';
import MapComponent from '../../manager-components/inspection_run/MapNav';

// Demo Images
import NavigationMenu from '../../manager-components/navigation_menu/NavigationMenus';
import { useNavigate, useParams } from 'react-router-dom';
import useGetPropertyByPropertyID from '../../queries/Property/useGetPropertyByPropertyID';
import AppLoader from "../../manager-components/property_page/AppLoader";
import Paper from "@mui/material/Paper";

export default function PropertyDetailsTenant() {
    const navigate = useNavigate();

    // Dummy viewings
    const viewing1 = {
        date: "4th May 2024",
        time: "11:25 AM"
    }
    const viewing2 = {
        date: "22nd May 2024",
        time: "2:45 PM"
    }

    // Cuncomment below to view the table
    const viewings = [
        // viewing1,
        // viewing2
    ]

    // property ID to query database
    const { propertyId } = useParams();
    const { property, loading } = useGetPropertyByPropertyID(propertyId);

    // For request inspection modal
    const [inspectionRequestOpen, setInspectionRequestOpen] = useState(false);
    const [inspectionRequestData, setInspectionRequestData] = useState(property[0]);
    const handleInspectionRequestOpen = () => setInspectionRequestOpen(true);
    const handleInspectionRequestClose = () => setInspectionRequestOpen(false);

    // Edit modal submit functionality
    const handleInspectionRequestSubmit = () => {
        console.log("Viewing request submitted ", inspectionRequestData);
        // Foer editting, handle database changes here
        handleInspectionRequestClose();
    };

    if (loading) return <AppLoader />

    if (!property) {
        return <Typography>No property found.</Typography>
    }

    let prop = property[0];

    return <>
        {inspectionRequestOpen && (
            <InspectionRequestModal
                open={inspectionRequestOpen}
                handleClose={handleInspectionRequestClose} 
                data={inspectionRequestData}
                setData={setInspectionRequestData}
                handleSubmit={handleInspectionRequestSubmit}
            />
        )}
    <NavigationMenu>
        <div style={{padding: "20px", marginTop: "64px"}}>
            <Paper sx={{ mt: 2, borderRadius: 3 }} elevation={3}>
                <Card>
                    <CardContent>
                        <Grid container justifyContent='flex-end'>
                            <Stack direction='row' spacing={1}>
                                <Button
                                    xs={{ mt: 5, mr: 2 }}
                                    variant='contained'
                                    size='medium'
                                    style={{ colour: 'white' }}
                                    onClick={() => navigate('/renter_messages/' + prop.property_manager_id)}
                                >
                                    Message the agent
                                </Button>
                                <Button
                                    xs={{ mt: 5, mr: 2 }}
                                    variant='contained'
                                    size='medium'
                                    style={{ backgroundColor: 'green', colour: 'white' }}
                                    endIcon={<OpenInNewIcon />}
                                >
                                    Apply
                                </Button>
                            </Stack>
                        </Grid>
                        <Divider sx={{ mt: 2, mb: 2 }}/>
                        <Grid container spacing={2} sx={{maxHeight: '100%'}}>
                            <Grid item xs={4}>
                                <Typography variant="h4" gutterBottom>
                                    {'' + prop.property_street_number + ' ' + prop.property_street_name + ' ' + prop.property_street_type}
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    {prop.property_suburb + ', ' + prop.property_state}
                                </Typography>
                                <Box>
                                    <Typography variant="h7">
                                        {prop.property_type}
                                    </Typography>
                                    <Typography sx={{ mt: 13, fontWeight: 'bold' }} variant="h5">
                                        ${'' + prop.property_rent} per week
                                    </Typography>
                                    <Typography sx={{ mt: 13 }} variant="h6">
                                        <BedIcon /> {'' + prop.property_bedroom_count} <BathtubIcon /> {'' + prop.property_bathroom_count} <DriveEtaIcon /> {'' + prop.property_car_spot_count} <SquareFootIcon /> {'' + prop.property_footprint}m²
                                    </Typography>
                                    <Typography sx={{ mt: 2 }}>
                                        Available from: {prop.property_lease_start}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={8} id="photos">
                                {
                                    prop.property_pictures && prop.property_pictures.length > 0 && (
                                        <ImageCarousel images={prop.property_pictures} />
                                    )
                                }
                            </Grid>
                        </Grid>
                        <Divider sx={{ mt: 2, mb: 2 }}/>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="h5" gutterBottom>
                                    Description
                                </Typography>
                                <Typography>
                                    {prop.property_description}
                                </Typography>
                                <Divider sx={{ mt: 2, mb: 2 }}/>
                                <Typography variant="h5" gutterBottom>
                                    Amenities
                                </Typography>
                                <Typography>
                                    {prop.property_amenities}
                                </Typography>
                                <Divider sx={{ mt: 2, mb: 2 }}/>
                                <Box>
                                    <Typography variant="h5">
                                        Upcoming viewings
                                    </Typography>
                                    <UpcomingViewingsTable
                                        viewings={viewings}
                                        property={prop}
                                    />
                                </Box>
                            </Grid>
                            <Divider orientation='vertical' flexItem sx={{ mx: 2 }} />
                            <Box
                                display="flex"
                                // alignItems="center"
                                justifyContent="center"
                                style={{ height: '100vh' }}
                            >
                                <MapComponent 
                                    origin={`${prop.property_street_number} ${prop.property_street_name} ${prop.property_street_type}, ${prop.property_suburb}, ${prop.property_state}`}
                                    destination=""
                                    waypoints={[]}
                                />
                            </Box>
                        </Grid>
                    </CardContent>
                </Card>
            </Paper>
        </div>
        </NavigationMenu>
    </>
}

// Function to display amenities of a property
/*
function AmenitiesList({ amenities }) {
    const amenitiesArray = Object.values(amenities);

    // Split index for the two columns
    const halfLength = Math.ceil(amenitiesArray.length / 2);
    const firstColumnItems = amenitiesArray.slice(0, halfLength);
    const secondColumnItems = amenitiesArray.slice(halfLength);

    return (
        <Grid container>
            <Grid item xs={6}>
                {firstColumnItems.map(([label, IconComponent], index) => (
                    <Grid container key={index} alignItems='center' spacing={2}>
                        <Grid item>
                            <IconComponent />
                        </Grid>
                        <Grid item>
                            <Typography>{label}</Typography>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
            <Grid item xs={6}>
                {secondColumnItems.map(([label, IconComponent], index) => (
                    <Grid container key={index} alignItems='center' spacing={2}>
                        <Grid item>
                            <IconComponent />
                        </Grid>
                        <Grid item>
                            <Typography>{label}</Typography>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Grid>

    );
}
 */