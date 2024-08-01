import { supabase } from "../../supabase";
import { Box, Button, Fade, Modal, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const CheckoutModal = ({ onClose, checkoutKey }) => {
  const [dueDate, setDueDate] = useState(dayjs().add(1, 'day'));
  const [issueDate, setIssueDate] = useState(dayjs());
  const [borrower, setBorrower] = useState("");

  async function editRowInTable() {
    const { data, error } = await supabase
      .from('KEY')
      .update([
        {
          key_status: "On Loan",
          key_issued: issueDate,
          key_due: dueDate
        },
      ])
      .eq("key_id", checkoutKey.key_id)

    if (error) {
      console.error("Error updating row:", error)
    }
    else {
      console.log('Row updated')
    }
  }

  const handleSubmit = async e => {
    await editRowInTable();
    onClose(e)
  }

  return (
    <Modal open={true} onClose={onClose}>
      <Fade in={true}>
        <Box sx={style} >
          <Typography variant='h5' >Check Out Key</Typography>
          <Stack mt={2}>
            <Typography variant='caption1' fontWeight={700}>Key Information</Typography>
          </Stack>
          <Stack direction='column' mb={2}>
            <Typography> Manager: John Smith</Typography>
            <Typography>Address: {checkoutKey.prop_add}</Typography>
          </Stack>
          <Typography variant='caption1' fontWeight={700}>Checkout Information</Typography>
          <Stack direction='column' spacing={2} mt={1}>
            <TextField label="Borrower" value={borrower} onChange={(e) => setBorrower(e.target.value)} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker', 'DatePicker']}>
                <DatePicker
                  label="Issue Date"
                  value={issueDate}
                  onChange={(newValue) => setIssueDate(newValue)}
                />
                <DatePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={(newValue) => setDueDate(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Button
              variant='contained'
              disabled={dueDate.diff(issueDate) < 0 || !borrower}
              onClick={(e) => handleSubmit(e)}
            >
              Check Out
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  )
}

export default CheckoutModal
