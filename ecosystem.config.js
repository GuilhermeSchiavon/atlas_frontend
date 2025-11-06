module.exports = {
  apps: [{
    name: '3300_ATLAS_DERMATORIGICO_GM_FRONT',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/atlas/frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3300
    }
  }]
}