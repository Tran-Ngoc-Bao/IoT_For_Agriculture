import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Checkbox, FormControlLabel, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
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
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      password: '',
      checkboxes: [], // Mảng để lưu trữ giá trị checkbox
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      name: Yup
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

        await auth.signUp(values.email, values.name, values.password, values.checkboxes);
        router.push('/');
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
          Register | Devias Kit
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
                Register
              </Typography>
              <Typography
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
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
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
                  value={formik.values.password}
                />

              </Stack>

              <Stack spacing={1} sx={{ display: 'flex', flexDirection: 'column', }}>
                {devices?.map((device) => (
                  <FormControlLabel
                    key={device.id}
                    control={<Checkbox
                      name="checkboxes"
                      value={device.address}
                      // checked={formik.values.checkboxes.includes("Hà Nội")}
                      onChange={formik.handleChange}
                    />}
                    label={device.address}
                  />
                ))}
                {/* <FormControlLabel
                  control={<Checkbox
                    name="checkboxes"
                    value="Hà Nội"
                    // checked={formik.values.checkboxes.includes("Hà Nội")}
                    onChange={formik.handleChange}
                  />}
                  label="Hà Nội"
                />
                <FormControlLabel
                  control={<Checkbox
                    name="checkboxes"
                    value="Hòa Bình"
                    checked={formik.values.checkboxes.includes("Hòa Bình")}
                    onChange={formik.handleChange}
                  />}
                  label="Hòa Bình"
                />
                <FormControlLabel
                  control={<Checkbox
                    name="checkboxes"
                    value="Lai Châu"
                    checked={formik.values.checkboxes.includes("Lai Châu")}
                    onChange={formik.handleChange}
                  />}
                  label="Lai Châu"
                />
                <FormControlLabel
                  control={<Checkbox
                    name="checkboxes"
                    value="Nam Định"
                    checked={formik.values.checkboxes.includes("Nam Định")}
                    onChange={formik.handleChange}
                  />}
                  label="Nam Định"
                />
                <FormControlLabel
                  control={<Checkbox
                    name="checkboxes"
                    value="Sơn La"
                    checked={formik.values.checkboxes.includes("Sơn La")}
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
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
