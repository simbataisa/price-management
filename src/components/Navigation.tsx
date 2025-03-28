import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Pricing System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Rules List
          </Button>
          <Button color="inherit" component={RouterLink} to="/create">
            Create Rule
          </Button>
          <Button color="inherit" component={RouterLink} to="/calculator">
            Calculator
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;