import multiprocessing
import os

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', '5001')}"
backlog = 2048

# Worker processes
workers = 1  # Single worker for memory-intensive tasks
worker_class = 'sync'
worker_connections = 1000
timeout = 300  # 5 minutes timeout for long-running conversions
keepalive = 120  # Increased keepalive for render.com

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'
access_log_format = '%({x-forwarded-for}i)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = 'pdf2jpg-server'

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# Restart workers after this many requests
max_requests = 1000
max_requests_jitter = 50

# SSL (if needed)
keyfile = None
certfile = None

def when_ready(server):
    server.log.info("Server is ready. Notifying systemd.")

def on_exit(server):
    server.log.info("Server is stopping.")

# Limits
limit_request_line = 0
limit_request_fields = 100
limit_request_field_size = 0 