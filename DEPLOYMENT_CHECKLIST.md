# ULTRA_POS Deployment Checklist

> **Quick Reference Guide** - Print this page for deployment day  
> **Follows**: 5-Phase Deployment Process (Prepare → Backup → Deploy → Verify → Confirm/Rollback)

---

## ⏰ Pre-Deployment (Day Before)

### Code & Build
- [ ] All code committed and pushed to repository
- [ ] All tests passing locally
- [ ] Code reviewed and approved
- [ ] Version updated in `package.json` (use `npm version patch|minor|major`)
- [ ] `node_modules` up to date (`npm install`)

### Documentation
- [ ] Release notes drafted (features, fixes, breaking changes)
- [ ] User documentation updated if needed
- [ ] Deployment window scheduled (avoid Fridays!)

### Safety
- [ ] Rollback plan documented
- [ ] Team notified of deployment
- [ ] Time allocated for post-deployment monitoring (15+ min)

---

## 🚀 Deployment Day

### Phase 1: PREPARE ✅

```powershell
# Run pre-deployment verification
.\scripts\pre-deploy-check.ps1
```

**Manual Checks:**
- [ ] Pre-deployment check passed
- [ ] Version number is correct
- [ ] No uncommitted changes
- [ ] All dependencies installed

**If checks fail:** Fix issues before continuing!

---

### Phase 2: BACKUP 💾

```powershell
# Create backup manually or let deploy.ps1 do it
$version = "2.0.4"  # Current version
$backupDir = "backup\v$version-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force
Copy-Item "dist\*.exe" -Destination $backupDir -Force
```

**Verify:**
- [ ] Backup folder created
- [ ] Previous executables copied
- [ ] Backup path documented

**⚠️ CRITICAL:** No backup = no rollback!

---

### Phase 3: DEPLOY 🏗️

**Option A: Auto Deployment (Recommended)**
```powershell
.\scripts\deploy.ps1
```

**Option B: Manual Build**
```powershell
npm run build
```

**During Build:**
- [ ] Monitor output for errors
- [ ] Don't walk away from terminal
- [ ] Note any warnings

**Expected Duration:** 5-10 minutes

---

### Phase 4: VERIFY 🔍

```powershell
# Run automated post-deployment verification
.\scripts\post-deploy-verify.ps1
```

**Automated Checks:**
- [ ] dist/ folder exists
- [ ] Executables created
- [ ] File sizes reasonable (>10MB)
- [ ] Build log clean

**Manual Installation Test:**
- [ ] **Install** Setup.exe on test machine
- [ ] **Launch** application starts without errors
- [ ] **Login** authentication works
- [ ] **POS** create a test sale
- [ ] **Print** receipt generates correctly
- [ ] **Database** data persists
- [ ] **License** activation functions

**Timing:** First 5 minutes - active monitoring

---

### Phase 5: CONFIRM or ROLLBACK ⚖️

**✅ If All Tests Pass:**
- [ ] Deployment verified successful
- [ ] Documentation updated
- [ ] Distribution files ready
- [ ] Team notified

**Proceed to Distribution** ↓

---

**❌ If Issues Found:**

```powershell
# Quick rollback
.\scripts\rollback.ps1 -List              # See available backups
.\scripts\rollback.ps1 -BackupPath "backup\v2.0.4-..."
```

**Rollback Decision Tree:**
- Service down → **Rollback immediately**
- Critical errors → **Rollback**
- Performance >50% degraded → **Consider rollback**
- Minor issues & quick fix available → **Fix forward**

---

## 📦 Distribution (After Verification)

### Files to Distribute
- [ ] `ULTRA_POS Cashier System-X.X.X-Setup.exe` (from `dist/`)
- [ ] `ULTRA_POS Cashier System-X.X.X-Portable.exe` (from `dist/`)

### Upload Locations
- [ ] Upload to server/cloud
- [ ] Test download links
- [ ] Release notes published
- [ ] Version documentation updated

---

## 📊 Post-Deployment (First 24 Hours)

### Immediate (15 minutes)
- [ ] Application running stable
- [ ] No error reports
- [ ] Key features working

### First Hour
- [ ] Monitor logs (if available)
- [ ] Check download metrics
- [ ] Stand by for user feedback

### Next Day
- [ ] Review any reported issues
- [ ] Collect user feedback
- [ ] Document lessons learned

---

## 🚨 Emergency Procedures

### If Application Won't Start

```powershell
# Run emergency diagnostics
.\scripts\emergency-diag.ps1 -Full
```

**Common Issues:**
1. **Database corrupted** → Restore from backup
2. **DLL missing** → Rebuild application
3. **License issue** → Reset license file
4. **Logs location:** `%APPDATA%\ULTRA_POS Cashier System\logs`

### Emergency Contacts
- **Developer:** [Your contact]
- **Support:** [Support channel]
- **Documentation:** `DEPLOYMENT.md`, `README.md`

---

## 📋 Scripts Quick Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `pre-deploy-check.ps1` | Pre-deployment verification | `.\scripts\pre-deploy-check.ps1` |
| `deploy.ps1` | Full 5-phase deployment | `.\scripts\deploy.ps1` |
| `post-deploy-verify.ps1` | Post-build checks | `.\scripts\post-deploy-verify.ps1` |
| `rollback.ps1` | Restore from backup | `.\scripts\rollback.ps1 -BackupPath "..."` |
| `emergency-diag.ps1` | System diagnostics | `.\scripts\emergency-diag.ps1 -Full` |

---

## ❌ Anti-Patterns (DON'T DO THIS!)

| ❌ Don't | ✅ Do |
|----------|-------|
| Deploy on Friday | Deploy Monday-Wednesday |
| Skip backup | **Always backup first** |
| Walk away after deploy | Monitor for 15+ minutes |
| Multiple changes at once | One change at a time |
| Skip testing | Test on clean machine |
| Deploy without verification | Run all checks |

---

## ✅ Success Criteria

**Deployment is successful when:**
1. ✅ All automated checks pass
2. ✅ Manual installation test complete
3. ✅ Key features verified working
4. ✅ No critical errors in logs
5. ✅ Rollback plan validated
6. ✅ Team confirmed deployment

---

**Remember:** *Speed over perfection in emergencies - Rollback first, debug later!*

---

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**For:** ULTRA_POS Cashier System v2.0.4+
