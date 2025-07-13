export default async function handler(req, res) {
  try {
    // Log environment variables status (without exposing values)
    console.log('🔍 Environment Variables Check:');
    console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '✅ Set' : '❌ Missing');
    console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '✅ Set' : '❌ Missing');

    // Test database connection
    console.log('🔍 Testing Database Connection...');
    try {
      const dbConnect = (await import('./lib/db.js')).default;
      await dbConnect();
      console.log('✅ Database connected successfully');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      console.error('Full error:', dbError);
    }

    // Test a simple API route
    console.log('🔍 Testing API functionality...');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('User agent:', req.headers['user-agent']);

    res.status(200).json({
      message: 'Debug completed - check Vercel function logs',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Debug API Error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      message: 'Debug completed with errors - check Vercel function logs',
    });
  }
} 