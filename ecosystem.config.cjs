module.exports = {
  apps: [{
    name: 'lk21-streaming',
    script: './server.mjs',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    max_memory_restart: '450M',
    node_args: '--max-old-space-size=450 --env-file=.env',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    restart_delay: 5000,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    merge_logs: true,
  }],
};
