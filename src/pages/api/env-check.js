export default async function handler(req, res) {
  console.log('🔍 Environment Variables Check:');
  
  const requiredVars = [
    'MONGO_URI',
    'JWT_SECRET', 
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD'
  ];

  const envStatus = {};
  
  requiredVars.forEach(varName => {
    const isSet = !!process.env[varName];
    envStatus[varName] = isSet ? '✅ Set' : '❌ Missing';
    console.log(`${varName}: ${envStatus[varName]}`);
  });

  // Test database connection if MONGO_URI is set
  let dbStatus = 'Not tested';
  if (process.env.MONGO_URI) {
    try {
      console.log('🔍 Testing database connection...');
      const dbConnect = (await import('./lib/db.js')).default;
      await dbConnect();
      dbStatus = '✅ Connected';
      console.log('✅ Database connected successfully');
    } catch (error) {
      dbStatus = `❌ Error: ${error.message}`;
      console.error('❌ Database connection failed:', error.message);
    }
  } else {
    dbStatus = '❌ Skipped - MONGO_URI not set';
    console.log('❌ Skipping database test - MONGO_URI not set');
  }

  res.status(200).json({
    message: 'Environment check completed',
    environment: envStatus,
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
} 