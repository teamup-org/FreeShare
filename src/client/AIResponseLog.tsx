import React, {useState, useEffect} from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { set } from "mongoose";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";

const AIResponseLog = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [open, setOpen] = useState(false);
    const [ responses, setResponses ] = useState<any[]>([]);

    if (!isAuthenticated || !user) {
      return <Navigate to="/" />;
    }

    const userEmail: string = user.email || '';
    
    // example of retrieving AI Responses from the backend given user email
    const fetchResponses = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/ai_responses?email=${user.email}`);
        const data = await response.json();
        setResponses(data);
        console.log('Successfully fetched responses:', data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    useEffect(() => {
      if (open) {
        fetchResponses();
      }
    }, [open, user.email]);

    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleRefresh = () => {
      fetchResponses();
    };

    return (
      <div>
        <Button variant="outlined" onClick={handleOpen}>View Previous Rewrites</Button>
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            AI Responses
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleRefresh} startIcon={<RefreshIcon />}>Refresh</Button>
          </DialogActions>
          <DialogContent dividers>
            {responses.length > 0 ? (
              <Box
                sx={{
                  maxHeight: '60vh',
                  overflowY: 'auto',
                }}
              >
                {responses.map((response: any) => (
                  <Box key={response._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                    <Typography variant="body1"><strong>Original Message:</strong> {response.originalMessage}</Typography>
                    <Typography variant="body1"><strong>AI Response:</strong> {response.aiResponse}</Typography>
                    <Typography variant="body1"><strong>Tone:</strong> {response.tone}</Typography>
                    <Typography variant="body1"><strong>Temperature:</strong> {response.temperature}</Typography>
                    <Typography variant="body1"><strong>Max Words:</strong> {response.maxWords}</Typography>
                    <Typography variant="body1"><strong>Created At:</strong> {new Date(response.createdAt).toLocaleString()}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography>No responses found.</Typography>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
}

export default AIResponseLog;