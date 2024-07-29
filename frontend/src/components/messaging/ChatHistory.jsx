import React from 'react'
import { Box } from '@mui/material'
import ChatBox from './ChatBox'

function ChatHistory({ data, handleSelectChat, selectedChatIndex }) {
    return (
        <Box sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            '&::-webkit-scrollbar': {
                display: 'none',
            },
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
        }}>
            {data && (
                <Box sx={{padding: 2}}>
                    {data.map((singleData, index) =>
                        <ChatBox key={`chatBox-${index}`} data={singleData} handleSelectChat={handleSelectChat} index={index} selectedChatIndex={selectedChatIndex} />
                    )}
                </Box>
            )}
        </Box>
    )
}

export default ChatHistory
