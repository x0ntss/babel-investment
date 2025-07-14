import Link from 'next/link';
import Box from '@mui/material/Box';

const AdminDashboard = () => {
  return (
    <Box>
      <Link href="/admin/pages/Banners">Manage Banners</Link>
    </Box>
  );
};

export default AdminDashboard; 