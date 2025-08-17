// 🛠️ حل مؤقت لنظام الرصد (بديل عن react-native-auth-monitor)
module.exports = {
  init: (config) => ({
    logActivity: (activity) => console.log('[MONITOR]', activity),
    checkSecurity: () => ({
      status: 'secure',
      lastScan: new Date().toISOString()
    })
  })
};
