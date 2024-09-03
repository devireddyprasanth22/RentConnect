import { useState, useEffect } from 'react'
import { supabase } from "../../supabase"

import { Box } from '@mui/material'

import NavigationMenu from '../navigation_menu/NavigationMenus'
import AccountDetails from './components/AccountDetails'
import Preferences from './components/Preferences'
import Essentials from './components/Essentials'
import AdditionalSupportingDocuments from './components/AdditionalSupportingDocuments'

function BuildRentalProfile() {
    const [userID, setUserID] = useState(null)
    
    useEffect(() => {
        // TODO: set this back to getting user id when login is workingPr
        async function getUserID() {
          const { data, error } = await supabase.auth.getUser()
          if (error) {
            console.error('Error getting user:', error)
          }
          if (data?.user) {
            //setUserID(data.user.id)
          }
        }
        getUserID()
        setUserID('c779fb8e-674f-46da-ba91-47cc5f2f269d')
    }, [])

    return (
        <Box sx={{ padding: 2 }}>
            <NavigationMenu />
            <Box display="flex" justifyContent="center">
                <Box margin={2} sx={{ width: '50%', marginTop: '64px', marginLeft: '190px' }} >
                    <AccountDetails userID={userID}/>
                    <Preferences />
                    <Essentials userID={userID}/>
                    <AdditionalSupportingDocuments userID={userID}/>
                </Box>
            </Box>
        </Box>
    )
}

export default BuildRentalProfile