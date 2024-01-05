import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { redirect } from 'next/navigation';
import { useAuthContext } from 'src/contexts/auth-context';
import { useAuth } from 'src/hooks/use-auth';

// const user = {
//   avatar: '/assets/avatars/avatar-anika-visser.png',
//   city: 'Los Angeles',
//   country: 'USA',
//   jobTitle: 'Senior Developer',
//   name: 'Anika Visser',
//   timezone: 'GTM-7'
// };

export const AccountProfile = () => {
  // const { user } = useAuthContext();
  const { user } = useAuth();

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {user.fullName}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.city} {user.country}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.timezone}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        {/* <Button
          fullWidth
          variant="text"
        >
          Upload picture
        </Button> */}
      </CardActions>
    </Card>
  )
};
