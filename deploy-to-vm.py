#!/usr/bin/env python3
"""
A9 Global Travels & Tours — One-Click Deploy to VM (192.168.100.247)
Uploads both backend + frontend code, installs dependencies, configures Nginx.
Run: python deploy-to-vm.py
"""

import paramiko
import os
import sys
import tarfile
import io
import time

VM_HOST = "192.168.100.247"
VM_USER = "mynewserver"
VM_PASS = "Boss2026!@#"
REMOTE_BASE = "/opt/a9global-v2"
BACKEND_DIR = os.path.join(os.path.dirname(__file__), "backend")
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")

def ssh_connect():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to {VM_HOST}...")
    for attempt in range(3):
        try:
            ssh.connect(VM_HOST, username=VM_USER, password=VM_PASS, timeout=15)
            print("✅ SSH connected")
            return ssh
        except Exception as e:
            print(f"  Attempt {attempt+1}: {e}")
            time.sleep(5)
    raise Exception("Failed to connect to VM")

def run_cmd(ssh, cmd, desc=""):
    if desc: print(f"  {desc}...")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if err: print(f"  ⚠️  {err.strip()}")
    return out

def upload_tar(ssh, local_dir, remote_path):
    """Create tar in memory and upload"""
    print(f"  Packing {os.path.basename(local_dir)}...")
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode='w:gz') as tar:
        for root, dirs, files in os.walk(local_dir):
            for f in files:
                if 'node_modules' in root or '.git' in root:
                    continue
                full = os.path.join(root, f)
                arcname = os.path.relpath(full, os.path.dirname(local_dir))
                tar.add(full, arcname=arcname)
    buf.seek(0)
    
    print(f"  Uploading ({buf.getbuffer().nbytes:,} bytes)...")
    sftp = ssh.open_sftp()
    sftp.putfo(buf, "/tmp/deploy.tar.gz")
    sftp.close()
    
    run_cmd(ssh, f"mkdir -p {remote_path}")
    run_cmd(ssh, f"tar xzf /tmp/deploy.tar.gz -C {remote_path}")
    run_cmd(ssh, "rm /tmp/deploy.tar.gz")

def main():
    print("=" * 60)
    print("A9 Global Travels & Tours — VM Deploy")
    print("=" * 60)
    
    ssh = ssh_connect()
    
    # Check prerequisites
    print("\n📋 Checking prerequisites...")
    out = run_cmd(ssh, "which node npm nginx python3 && node -v && npm -v")
    print(f"    {out.strip()}")
    
    # Check MongoDB
    out = run_cmd(ssh, "which mongod && systemctl is-active mongod 2>/dev/null || echo 'mongod not running'")
    print(f"    MongoDB: {out.strip()}")
    
    # Stop old A9 services
    print("\n🛑 Stopping old services...")
    run_cmd(ssh, "systemctl stop a9-global 2>/dev/null; pkill -f 'python3 -B app.py' 2>/dev/null; echo done")
    
    # Upload backend
    print("\n📦 Uploading BACKEND...")
    upload_tar(ssh, BACKEND_DIR, f"{REMOTE_BASE}/backend")
    
    # Upload frontend
    print("\n📦 Uploading FRONTEND...")
    upload_tar(ssh, FRONTEND_DIR, f"{REMOTE_BASE}/frontend")
    
    # Install backend
    print("\n🔧 Installing backend dependencies...")
    run_cmd(ssh, f"cd {REMOTE_BASE}/backend && npm install --production")
    
    # Install frontend
    print("\n🔧 Installing frontend dependencies...")
    run_cmd(ssh, f"cd {REMOTE_BASE}/frontend && npm install")
    
    # Create .env if missing
    print("\n⚙️  Configuring environment...")
    run_cmd(ssh, f"""
if [ ! -f {REMOTE_BASE}/backend/.env ]; then
    cp {REMOTE_BASE}/backend/.env.example {REMOTE_BASE}/backend/.env
    echo "Created .env from example (edit {REMOTE_BASE}/backend/.env to set real values)"
fi
""")
    
    # Build frontend
    print("\n🏗️  Building frontend (Next.js)...")
    out = run_cmd(ssh, f"cd {REMOTE_BASE}/frontend && npm run build 2>&1")
    print(f"    {out.strip()[-500:]}")
    
    # Create systemd service for backend
    print("\n📝 Creating systemd service...")
    service = f"""
[Unit]
Description=A9 Global API Server
After=network.target mongod.service

[Service]
Type=simple
User={VM_USER}
WorkingDirectory={REMOTE_BASE}/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
"""
    sftp = ssh.open_sftp()
    sftp.putfo(io.BytesIO(service.encode()), "/tmp/a9global-api.service")
    sftp.close()
    
    run_cmd(ssh, "sudo mv /tmp/a9global-api.service /etc/systemd/system/")
    run_cmd(ssh, "sudo systemctl daemon-reload")
    run_cmd(ssh, "sudo systemctl enable a9global-api")
    
    # Create systemd service for frontend
    frontend_service = f"""
[Unit]
Description=A9 Global Frontend (Next.js)
After=network.target

[Service]
Type=simple
User={VM_USER}
WorkingDirectory={REMOTE_BASE}/frontend
ExecStart=/usr/bin/npx next start -p 3000
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=NEXT_PUBLIC_API_URL=http://localhost:5000/api

[Install]
WantedBy=multi-user.target
"""
    sftp = ssh.open_sftp()
    sftp.putfo(io.BytesIO(frontend_service.encode()), "/tmp/a9global-fe.service")
    sftp.close()
    
    run_cmd(ssh, "sudo mv /tmp/a9global-fe.service /etc/systemd/system/")
    run_cmd(ssh, "sudo systemctl daemon-reload")
    run_cmd(ssh, "sudo systemctl enable a9global-fe")
    
    # Update Nginx config
    print("\n🌐 Configuring Nginx...")
    nginx_conf = """
server {
    listen 80;
    server_name _;
    
    # Frontend (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Uploaded files
    location /uploads/ {
        alias {REMOTE_BASE}/backend/uploads/;
    }
}
""".replace("{REMOTE_BASE}", REMOTE_BASE)
    
    sftp = ssh.open_sftp()
    sftp.putfo(io.BytesIO(nginx_conf.encode()), "/tmp/a9global-nginx")
    sftp.close()
    
    run_cmd(ssh, "sudo mv /tmp/a9global-nginx /etc/nginx/sites-available/a9global")
    run_cmd(ssh, "sudo ln -sf /etc/nginx/sites-available/a9global /etc/nginx/sites-enabled/ 2>/dev/null")
    run_cmd(ssh, "sudo nginx -t && sudo systemctl reload nginx")
    
    # Start services
    print("\n🚀 Starting services...")
    run_cmd(ssh, "sudo systemctl start a9global-api")
    run_cmd(ssh, "sudo systemctl start a9global-fe")
    time.sleep(3)
    
    # Verify
    print("\n🔍 Verifying...")
    out = run_cmd(ssh, "systemctl is-active a9global-api a9global-fe nginx")
    print(f"    Services: {out.strip()}")
    
    out = run_cmd(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost:5000/")
    print(f"    Backend (port 5000): HTTP {out.strip()}")
    
    out = run_cmd(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/")
    print(f"    Frontend (port 3000): HTTP {out.strip()}")
    
    out = run_cmd(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost/")
    print(f"    Nginx (port 80): HTTP {out.strip()}")
    
    # Seed database
    print("\n🌱 Seeding database...")
    out = run_cmd(ssh, f"cd {REMOTE_BASE}/backend && node seed.js 2>&1")
    print(f"    {out.strip()[:300]}")
    
    print("\n" + "=" * 60)
    print("✅ DEPLOYMENT COMPLETE!")
    print(f"   Website: http://{VM_HOST}/")
    print(f"   Admin:   http://{VM_HOST}/admin/login")
    print("   Admin credentials: admin@a9global.com / admin123")
    print("=" * 60)
    
    ssh.close()

if __name__ == "__main__":
    main()
