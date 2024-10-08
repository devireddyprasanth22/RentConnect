import { supabase } from "../../supabase";
import { v4 as uuidv4 } from 'uuid';

const useEditProperty = () => {
  const editProperty = async (
    propertyID,
    propertyStreetNumber,
    propertyStreetName,
    propertyStreetType,
    propertySuburb,
    propertyState,
    propertyBedroomsCount,
    propertyBathroomCount,
    propertyCarSpotCount,
    propertyType,
    propertyRent,
    propertyFootprint,
    propertyDescription,
    propertyAmenities,
    propertyPictures,
    propertyRentFrequency,
    propertyManagerID,
    propertyLeaseStart,
    propertyUnitNumber,
    propertyPostcode,
    deletedPhotos
  ) => {
    try {
      // Handle deleted photos first
      if (deletedPhotos.length > 0) {
        const deletedFileNames = deletedPhotos.map((photoUrl) => {
          const filePath = photoUrl.split('/storage/v1/object/public/')[1];
          return filePath;
        });

        // Remove deleted files
        const { error: deleteError } = await supabase.storage
          .from("property_images")
          .remove(deletedFileNames);

        if (deleteError) throw deleteError
      }

      // Handle image upload if necessary
      const uploadedPhotoUrls = [];

      for (const file of propertyPictures) {
        console.log(file)
        if (typeof file !== 'string') {
          // Generate a unique name for the file using uuid
          const fileName = uuidv4();

          // Upload new photos
          const { data, error: uploadError } = await supabase.storage
            .from('property_images')
            .upload(`properties/${propertyID}/${fileName}`, file);

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('property_images')
            .getPublicUrl(`properties/${propertyID}/${fileName}`);
          uploadedPhotoUrls.push(publicUrlData.publicUrl);
        } else {
          // Keep existing photo URLs
          uploadedPhotoUrls.push(file);
        }
      }

      // Update property details in the database
      const { data, error } = await supabase
        .from("PROPERTY")
        .update({
          property_street_number: propertyStreetNumber,
          property_street_name: propertyStreetName,
          property_street_type: propertyStreetType,
          property_suburb: propertySuburb,
          property_state: propertyState,
          property_bedroom_count: propertyBedroomsCount,
          property_bathroom_count: propertyBathroomCount,
          property_car_spot_count: propertyCarSpotCount,
          property_type: propertyType,
          property_rent: propertyRent,
          property_footprint: propertyFootprint,
          property_description: propertyDescription,
          property_amenities: propertyAmenities,
          property_pictures: uploadedPhotoUrls,
          property_rent_frequency: propertyRentFrequency,
          property_manager_id: propertyManagerID,
          property_lease_start: propertyLeaseStart,
          property_unit_number: propertyUnitNumber,
          property_postcode: propertyPostcode,
        })
        .eq("property_id", propertyID); // Match the record by property ID

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(error.message);
    }
  };

  return { editProperty };
};

export default useEditProperty;
