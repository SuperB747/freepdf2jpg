import multiprocessing
import os

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', '5001')}"
backlog = 2048

# Worker processes
workers = 1  # For memory-intensive tasks like PDF conversion, use single worker
worker_class = 'sync'
worker_connections = 1000
timeout = 300  # 5 minutes timeout for long-running conversions
keepalive = 2

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Process naming
proc_name = 'pdf2jpg-server'

# SSL
keyfile = None
certfile = None

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# Limits
limit_request_line = 0
limit_request_fields = 100
limit_request_field_size = 0 