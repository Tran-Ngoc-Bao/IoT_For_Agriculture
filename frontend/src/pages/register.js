import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Checkbox, FormControlLabel, Grid, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { useAuthContext } from 'src/contexts/auth-context';
import { useEffect, useState } from 'react';

async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
}

const Page = () => {
  const [devices, setDevices] = useState([]);
  const router = useRouter();
  const { user } = useAuth();
  const formik = useFormik({
    initialValues: {
      email: user.email,
      fullName: user.fullName,
      password: '',
      checkboxes: user.addresses, // Mảng để lưu trữ giá trị checkbox
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      fullName: Yup
        .string()
        .max(255)
        .required('Name is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required'),
      checkboxes: Yup
        .array()
        .min(1, 'Please select at least one option') // Kiểm tra ít nhất một checkbox đã được chọn
        .required('Please select at least one option') // Kiểm tra ít nhất một checkbox đã được chọn
    }),
    onSubmit: async (values, helpers) => {
      try {
        // Thêm giá trị của checkbox vào mảng checkboxes trong values
        values.checkboxes = values.checkboxes || []; // Kiểm tra nếu values.checkboxes là null hoặc undefined, gán giá trị mảng rỗng

        const data = {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          addresses: values.checkboxes
        };
        const res = await fetch("http://localhost:8000/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "JWT " + window.sessionStorage.getItem('token'), // Thay token bằng token đã lưu
          },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          router.push('/auth/login');
        } else {
          console.error("Failed to edit user data");
          throw new Error('Please check your address ');
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const result = await fetchData("http://localhost:8000/api/devices");
        setDevices(result);
      } catch (error) {
        // Handle error if needed
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAsync();
  }, []);

  return (
    <>
      <Head>
        <title>
          Account | Devias Kit
        </title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Account Edit
              </Typography>
              <div>
                <Grid
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <AccountProfile />
                </Grid>
              </div>
              {/* <Typography
                color="text.secondary"
                variant="body2"
              >
                Already have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography> */}
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  defaultValue={user.fullName}
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="fullName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                // value={formik.values.name}
                />
                <TextField
                  defaultValue={user.email}
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                // value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                // value={formik.values.password}
                />

              </Stack>

              <Stack spacing={1} sx={{ display: 'flex', flexDirection: 'column', }}>
                {devices?.map((device) => (
                  <FormControlLabel
                    key={device.id}
                    control={<Checkbox
                      name="checkboxes"
                      value={device.address}
                      checked={formik.values.checkboxes.includes(device.address)}
                      onChange={formik.handleChange}
                    />}
                    label={device.address}
                  />
                ))}
                {/* <FormControlLabel
                  control={<Checkbox
                    name="checkboxes"
                    value="Hà Nội"
                    defaultChecked={formik.values.checkboxes.includes("Hà Nội")}
                    onChange={formik.handleChange}
                  />}
                  label="Hà Nội"
                />
                <FormControlLabel
                  control={<Checkbox
                    name="checkboxes"
                    value="Hòa Bình"
                    defaultChecked={formik.values.checkboxes.includes("Hòa Bình")}
                    onChange={formik.handleChange}
                  />}
                  label="Hòa Bình"
                />
                <FormControlLabel
                  control={<Checkbox
                    name="checkboxes"
                    value="Lai Châu"
                    defaultChecked={formik.values.checkboxes.includes("Lai Châu")}
                    onChange={formik.handleChange}
                  />}
                  label="Lai Châu"
                />
                <FormControlLabel
                  control={<Checkbox
                    name="checkboxes"
                    value="Nam Định"
                    defaultChecked={formik.values.checkboxes.includes("Nam Định")}
                    onChange={formik.handleChange}
                  />}
                  label="Nam Định"
                />
                <FormControlLabel
                  control={<Checkbox
                    name="checkboxes"
                    value="Sơn La"
                    defaultChecked={formik.values.checkboxes.includes("Sơn La")}
                    onChange={formik.handleChange}
                  />}
                  label="Sơn La"
                /> */}
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Save change
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
