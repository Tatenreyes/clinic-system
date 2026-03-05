#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
```

---

**Step 3 — Create `.gitignore`** in the root:
```
venv/
.env
*.pyc
__pycache__/
staticfiles/
db.sqlite3
*.sqlite3