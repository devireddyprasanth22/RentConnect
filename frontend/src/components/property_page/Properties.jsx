import React, { useEffect, useState } from 'react'
import { Container } from "@mui/material"
import { PropertyStatCards } from './PropertyStatCards';
import { PropertiesTable } from './PropertiesTable';
import { PropertySearch } from './PropertySearch';

// Demo Images
import ListingImage from './listing.jpg'
import ListingImageApt from './listing2.jpg'
import useApp from '../../hooks/useApp';

function createData(id, address, vacancy, attendees, applications, listingImage, type, price, available, bedrooms, bathrooms, car_spaces, propManager) {
  return { id, address, vacancy, attendees, applications, listingImage, type, price, available, bedrooms, bathrooms, car_spaces, propManager };
}

const defaultRows = [
  createData(crypto.randomUUID(), '1702/655 Chapel Street, South Yarra 3141', 25, 31, 15, ListingImageApt, "Apartment", "750 per week", "31st March 2024", 3, 3, 2, "Jensen Huang"),
  createData(crypto.randomUUID(), '123 Fake Street, Melbourne 3000', 30, 10, 13, ListingImage, "House", "800 per week", "31st Feb 2024", 3, 2, 1, "Jensen Huang"),
  createData(crypto.randomUUID(), '123 Fake Street, Melbourne 3000', 30, 10, 13, ListingImage, "House", "800 per week", "31st Feb 2024", 1, 1, 0, "Elon Musk"),
];

// this information will be queried from firebase
const propManagers = [
  "Jensen Huang",
  "Mark Zuckerberg",
  "Elon Musk"
]

export default function Properties() {
  const { fetchProperties } = useApp();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = null;
    fetchProperties("testID", setLoading, setProperties).then((res) => {
      unsub = res;
    })

    return () => {
      if (unsub) {
        unsub()
      }
    }
  }, [])

  return (
    <Container sx={{ mt: 5, height: "80vh" }} >
      <PropertyStatCards />
      <PropertySearch
        filterProperties={setProperties}
        unfilteredProperties={defaultRows}
        propManagers={propManagers}
        properties={properties}
      />
      <PropertiesTable
        properties={properties}
        handleAddProperties={setProperties}
        propManagers={propManagers}
      />
    </Container >
  )
}
