import uvicorn
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"[*] Starting Smart Attendance System Backend on http://localhost:{port}")
    print(f"[*] Interactive API Docs available at http://localhost:{port}/docs")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
