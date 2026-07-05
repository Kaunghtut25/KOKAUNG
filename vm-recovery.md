# VM Recovery Guide — A9 Global Deployment

## Current Issue
VM `myserver` is experiencing **kernel panic** during boot:
```
Kernel panic - not syncing: Fatal exception in interrupt
```
Likely caused by filesystem corruption from multiple hard poweroffs (VBoxManage controlvm poweroff).

## Recovery Steps (Try in order)

### Method 1: Safe Mode Boot
```powershell
# In PowerShell:
& "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" startvm myserver

# IMMEDIATELY open the VM window (not headless) and press ESC during GRUB
# Select "Advanced options" → recovery mode kernel → "fsck" (check filesystems)
# Then select "resume" to boot normally
```

### Method 2: Start VM with GUI visible
```powershell
& "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" controlvm myserver poweroff
Start-Sleep 5
& "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" startvm myserver
# This opens the VM window — watch the boot process
```

### Method 3: Reset VM to last working state
```powershell
& "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" controlvm myserver poweroff
Start-Sleep 5
& "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" snapshot myserver list
# If a snapshot exists, restore it
```

## After VM Recovery — Deploy
```powershell
cd C:\Users\Dell\.openclaw-autoclaw\workspace\a9global-v2
python deploy-to-vm.py
```

## Manual Deploy (if script fails)
```bash
# SSH to VM
ssh mynewserver@192.168.100.247

# Kill old Flask app
sudo systemctl stop a9-global
sudo pkill -f 'python3 -B app.py'

# The deploy script handles everything else automatically
```

## Project Location
- Full source: `C:\Users\Dell\.openclaw-autoclaw\workspace\a9global-v2\`
- Backend: 35 files (Express + Mongoose + seed data)
- Frontend: 42 files (Next.js 14 + Tailwind luxury theme)
- Deploy script: `deploy-to-vm.py`
