import useGetPropertyByPropertyID from '../../queries/Property/useGetPropertyByPropertyID'
import { Box, Typography, Button, Card, CardMedia } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AppLoader from "../../manager-components/property_page/AppLoader";


function ApplicationCard({ application }) {
    const navigate = useNavigate()
    const { property: prop, loading } = useGetPropertyByPropertyID(application.property_id)
    let property = prop[0];

    const applicationStatusColour = (status) => {
        switch (status) {
            case 'approved':
                return 'green'
            case 'progress':
                return 'grey'
            case 'rejected':
                return 'red'
            default:
                return 'grey'
        }
    }

    const applicationStatusText = (status) => {
        switch (status) {
            case 'approved':
                return 'Approved'
            case 'progress':
                return 'Processing'
            case 'rejected':
                return 'Rejected'
            default:
                return status
        }
    }

    if (loading) return <AppLoader />

    return (
        <Box>
            {property && (
                <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' }, marginBottom: 2 }}>
                    <CardMedia
                        component='img'
                        sx={{ width: {xs: '100%', sm: '100%', md: '300px'}, height: 250, objectFit: 'cover' }}
                        image={property.property_pictures[0]}
                        alt="Property Image"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', flexGrow: 1, padding: 2 }}>
                        <Typography variant="h7" gutterBottom>
                            {property.property_street_number} {property.property_street_name} {property.property_street_type}, {property.property_suburb}, {property.property_postcode}
                        </Typography>
                        <Typography variant="h7" gutterBottom>
                            {property.property_type} - ${property.property_rent} {property.property_rent_frequency}
                        </Typography>
                        <Typography variant="h7" gutterBottom>
                            {property.property_bedroom_count} BED {property.property_bathroom_count} BATH {property.property_car_spot_count} CAR
                        </Typography>
                        <Typography variant="h7" gutterBottom>
                            APPLICATION STATUS
                        </Typography>
                        <Box sx={{width: 100, height: 40, borderRadius: 2, color: 'white', backgroundColor: applicationStatusColour(application.application_status), display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            {applicationStatusText(application.application_status)}
                        </Box>
                        <Button variant='contained' sx={{ marginTop: 2 }} onClick={() => navigate(`/renter_messages/${property.property_manager_id}`)}>
                            <Typography>
                                MESSAGE MANAGER
                            </Typography>
                        </Button>
                    </Box>
                </Card>
            )}
        </Box>
    )
}

export default ApplicationCard