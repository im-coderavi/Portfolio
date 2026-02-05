# Remaining Files to Update for API Configuration

The following files still need to be updated to use the centralized API configuration (`API_URL`):

## Admin Panel Files

### 1. Admin.jsx (`d:\PORTFOLIO\client\src\pages\Admin.jsx`)
**Lines to update:**
- Line 22: `axios.get('http://localhost:5000/api/projects')`
- Line 36: `axios.get('http://localhost:5000/api/admin/settings'`
- Line 54: `axios.post('http://localhost:5000/api/admin/settings'`
- Line 84: `axios.post('http://localhost:5000/api/admin/projects'`
- Line 98: `http://localhost:5000/api/admin/projects/${editingProject._id}`
- Line 114: `axios.delete(\`http://localhost:5000/api/admin/projects/${id}\``
- Line 230: Image URL: `http://localhost:5000${project.image}`

**Add import:**
```javascript
import API_URL from '../config/api';
```

**Replace all instances of `'http://localhost:5000'` with `\`${API_URL}\``**

### 2. ExperienceManager.jsx (`d:\PORTFOLIO\client\src\components\admin\ExperienceManager.jsx`)
**Lines to update:**
- Line 26: `axios.get('http://localhost:5000/api/experiences')`
- Line 60: `http://localhost:5000/api/admin/experiences/${editingExperience._id}`
- Line 66: `'http://localhost:5000/api/admin/experiences'`
- Line 99: `axios.delete(\`http://localhost:5000/api/admin/experiences/${id}\``

**Add import:**
```javascript
import API_URL from '../../config/api';
```

### 3. ProjectForm.jsx (`d:\PORTFOLIO\client\src\components\admin\ProjectForm.jsx`)
**Lines to update:**
- Line 28: Image URL: `http://localhost:5000${initialData.image}`

**Add import:**
```javascript
import API_URL from '../../config/api';
```

## Status

✅ **Already Updated:**
- App.jsx
- Contact.jsx
- Experience.jsx
- Projects.jsx
- AdminLogin.jsx
- config/api.js (created)
- .env (created)
- .env.production (created)

❌ **Needs Update:**
- Admin.jsx
- ExperienceManager.jsx
- ProjectForm.jsx

## Quick Fix Commands

You can manually update these files by:
1. Adding the import statement at the top
2. Replacing all `'http://localhost:5000'` with `\`${API_URL}\``
3. Replacing all `` `http://localhost:5000` `` with `\`${API_URL}\``

Or I can continue updating them automatically!
