import React, { useEffect, useState } from "react";
import { Typography, Button, Grid, Paper, Stack } from "@mui/material";
import { supabase } from "../../supabase";
import NavigationMenu from "../navigation_menu/NavigationMenus";
import InspectionTable from "./InspectionTable";
import HistoryTable from "./HistoryTable";

const Inspection = () => {
  const [activeSection, setActiveSection] = useState("inspection");
  const [inspectionsData, setInspectionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(null);
  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    async function getUserID() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserID(data.user.id);
      }
    }
    getUserID();
  }, []);

  useEffect(() => {
    async function getAccountType() {
      if (userID) {
        // Check if user is a renter
        const renterResponse = await supabase
          .from("RENTER")
          .select("renter_id")
          .eq("renter_id", userID)
          .single();

        if (renterResponse.data) {
          setAccountType("RENTER");
          return;
        }

        // Check if user is a property manager
        const managerResponse = await supabase
          .from("PROPERTY MANAGER")
          .select("property_manager_id")
          .eq("property_manager_id", userID)
          .single();

        if (managerResponse.data) {
          setAccountType("PROPERTY MANAGER");
        }
      }
    }
    getAccountType();
  }, [userID]);

  useEffect(() => {
    const fetchInspectionsData = async () => {
      try {
        const [inspections, properties, renters] = await Promise.all([
          supabase.from("INSPECTION").select("*"),
          supabase.from("PROPERTY").select("*"),
          supabase.from("RENTER").select("*"),
        ]);

        if (inspections.error || properties.error || renters.error) {
          throw new Error("Error fetching data from Supabase");
        }

        const mergedInspectionsData = inspections.data.map((inspection) => {
          const property = properties.data.find(
            (property) => property.property_id === inspection.property_id
          );

          const renter = renters.data.find(
            (renter) => renter.renter_id === inspection.renter_id
          );

          return {
            ...inspection,
            propertyData: property || {},
            renterData: renter || {},
          };
        });

        setInspectionsData(mergedInspectionsData);
        console.log("Inspection data loaded:", mergedInspectionsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inspection data:", error);
        setError("Failed to load inspection data. Please try again.");
        setLoading(false);
      }
    };

    if (accountType === "PROPERTY MANAGER" || accountType === "RENTER") {
      fetchInspectionsData();
    }
  }, [accountType]);

  const renderContent = () => {
    if (loading) {
      return (
        <Paper sx={{ borderRadius: 3, padding: 2, marginTop: 2 }}>
          <Stack textAlign="center">
            <Typography variant="h6">Loading inspections...</Typography>
          </Stack>
        </Paper>
      );
    }

    if (error) {
      return (
        <Paper sx={{ borderRadius: 3, padding: 2, marginTop: 2 }}>
          <Stack textAlign="center">
            <Typography variant="h6">{error}</Typography>
          </Stack>
        </Paper>
      );
    }

    if (activeSection === "inspection") {
      if (pendingInspections.length > 0) {
        return (
          <InspectionTable
            inspectionsData={inspectionsData}
            setInspections={setInspectionsData}
          />
        );
      } else {
        return (
          <Paper sx={{ borderRadius: 3, padding: 2, marginTop: 2 }}>
            <Stack textAlign="center">
              <Typography variant="h6">No inspections available.</Typography>
            </Stack>
          </Paper>
        );
      }
    }

    if (activeSection === "history") {
      if (inspectionsData.length > 0) {
        return (
          <HistoryTable
            inspectionsData={inspectionsData}
            setInspections={setInspectionsData}
          />
        );
      } else {
        return (
          <Paper sx={{ borderRadius: 3, padding: 2, marginTop: 2 }}>
            <Stack textAlign="center">
              <Typography variant="h6">
                No inspection history available.
              </Typography>
            </Stack>
          </Paper>
        );
      }
    }
  };

  const pendingInspections = inspectionsData.filter(
    (inspection) => inspection.inspection_type === "pending"
  );

  if (accountType == null) {
    return (
      <Paper sx={{ borderRadius: 3, padding: 2, marginTop: 2 }}>
        <Stack textAlign="center">
          <Typography variant="h6">
            You do not have access to this content.
          </Typography>
        </Stack>
      </Paper>
    );
  } else if (accountType === "RENTER") {
    return (
      <NavigationMenu>
        <Grid
          container
          spacing={2}
          style={{ padding: "30px", paddingTop: "110px" }}
          justifyContent="flex-start"
        >
          <Button
            variant={activeSection === "inspection" ? "contained" : "outlined"}
            onClick={() => setActiveSection("inspection")}
            style={{ margin: "10px", fontSize: "150%" }}
          >
            Inspection
          </Button>

          <Button
            variant={activeSection === "history" ? "contained" : "outlined"}
            onClick={() => setActiveSection("history")}
            style={{ margin: "10px", fontSize: "150%" }}
          >
            History
          </Button>
        </Grid>
        <div style={{ padding: "20px" }}>{renderContent()}</div>
      </NavigationMenu>
    );
  } else if (accountType === "PROPERTY MANAGER") {
    return (
      <NavigationMenu>
        <Grid
          container
          spacing={2}
          style={{ padding: "30px", paddingTop: "110px" }}
          justifyContent="flex-start"
        >
          <Button
            variant={activeSection === "inspection" ? "contained" : "outlined"}
            onClick={() => setActiveSection("inspection")}
            style={{ margin: "10px", fontSize: "150%" }}
          >
            Inspection
          </Button>

          <Button
            variant={activeSection === "history" ? "contained" : "outlined"}
            onClick={() => setActiveSection("history")}
            style={{ margin: "10px", fontSize: "150%" }}
          >
            History
          </Button>
        </Grid>
        <div style={{ padding: "20px" }}>{renderContent()}</div>
      </NavigationMenu>
    );
  }
};
export default Inspection;
