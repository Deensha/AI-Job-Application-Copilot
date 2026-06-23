from flask import Flask,jsonify,request
from flask_cors import CORS
import sqlite3
import pdfplumber
import re
import io
import requests
import json
from reportlab.pdfgen import canvas
from flask import send_file
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)   #creating a server
CORS(app)


@app.route("/debug-activities", methods=["GET"])
def debug_activities():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM activities")
    rows = cursor.fetchall()

    conn.close()

    return jsonify(rows)
def add_activity(user_id, activity):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO activities (user_id, activity)
        VALUES (?, ?)
    """, (user_id, activity))

    conn.commit()
    conn.close()


OPENROUTER_API_KEY=os.getenv("OPENROUTER_API_KEY")
def init_db():  #this is executes the functinon when flask starts 
    conn=sqlite3.connect("users.db") #connection to database
    c=conn.cursor()  #this is used to run the sql commands 

    c.execute(
        """CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT,
        password TEXT
        )
""")
    

    conn.commit()  #save changes permanently
    conn.close()  #close database connection 
init_db()





@app.route("/")
def home():
    return jsonify({
    "message":"Flask backend is working",
    "status":"success"

    })

@app.route("/signup",methods=["POST"])  #this is an api endpoint
def signup():
    data=request.get_json()  #frontend sends json data it will receives the data


    print("REQUEST RECEIVED")
    print(data)

    username=data.get("username")
    email=data.get("email")
    password=data.get("password")

    if not username or not email or not password:
        return jsonify({
          "message":"All fields are required ",
    "status":"error"
        }),400
    
    conn=sqlite3.connect("users.db")
    c=conn.cursor()
    c.execute(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        (username, email, password)
    )

    conn.commit()
    conn.close()
    return jsonify({
        "message": "User registered successfully",
        "user": {
            "username": username,
            "email": email,
            
    },"status":"success"}),200



@app.route("/login",methods=["POST"])
def login():
    data=request.json
    email=data.get("email")
    password=data.get("password")

    conn=sqlite3.connect("users.db")
    cursor=conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email=? AND password=?", (email,password))
    user = cursor.fetchone()

    conn.close()

   
    # STEP 3: check password
    if user:
        return jsonify({"success": True, "message": "Login successful","user":{"id": user[0], "username":user[1],"email":user[2]}}),200
    else:
        return jsonify({"success": False, "message": "No account found"}),200


STOPWORDS = {"the", "and", "is", "in", "to", "for", "a", "of", "on", "with", "as"}

def extract_keywords(text):
    text = text.lower()
    words = re.findall(r"[a-zA-Z]+", text)
    return set([w for w in words if w not in STOPWORDS])



@app.route("/atsanalyser",methods=["POST"])
def atsanalyser():
  resume=request.files.get("resume")
  jd=request.form.get("jd")
  if not resume:
    return jsonify({"error": "No resume uploaded"}), 400

  if not jd:
    return jsonify({"error": "No JD provided"}), 400
  resume.seek(0)

  #extracting text from pdf
  resume_text=""

  with pdfplumber.open(resume) as pdf:
      
      for page in pdf.pages:
         text=page.extract_text()
         if text:
             resume_text+=text+" "

  #keyword extraction
  print(resume_text)
  resume_keywords=extract_keywords(resume_text)
  jd_keywords = extract_keywords(jd)


  matched=resume_keywords.intersection(jd_keywords)
  if len(jd_keywords) == 0:
        score = 0
  else:
        score =round ((len(matched) / len(jd_keywords)) * 100,2)

#   print("Score:", score)

#   print("Resume File:",resume.filename)
#   print("JD:",jd)
#   print("extracted resume text:",resume_text)
  
  return jsonify({"message":"Received Successfully", "resume_text": resume_text,
        "jd": jd,"score": score,
    "matched_keywords": list(matched),
    "total_jd_keywords": len(jd_keywords)}),200


@app.route("/resumetailor", methods=["POST"])
def resumetailor():
    resume = request.files.get("resume")
    jd = request.form.get("jd")

    if not resume:
        return jsonify({"error": "No resume uploaded"}), 400

    if not jd:
        return jsonify({"error": "No JD provided"}), 400

    resume.seek(0)

    # extracting text from pdf
    resume_text = ""

    with pdfplumber.open(resume) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                resume_text += text + " "

    # keyword extraction
    print(resume_text)
    resume_keywords = extract_keywords(resume_text)
    jd_keywords = extract_keywords(jd)

    matched = resume_keywords.intersection(jd_keywords)

    print("Resume Keywords:", resume_keywords)
    print("JD Keywords:", jd_keywords)
    print("Matched:", matched)

    prompt = f"""
You are an expert ATS Resume Optimization Specialist.

Resume:
{resume_text}

Job Description:
{jd}

Task:
Optimize the resume for the job description while preserving the original resume structure.

Rules:
1. Do NOT invent skills, projects, experience, certifications, or achievements.
2. Keep all section headings and overall structure intact.
3. Improve the Professional Summary.
4. Reorder existing skills based on relevance to the Job Description.
5. Highlight the most relevant projects and experiences.
6. Improve ATS keyword alignment using only information already present in the resume.
7. Maintain a professional resume format.
8. Return the complete optimized resume.

Output only the optimized resume.
"""
    
  

    try:
      response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "openai/gpt-4o-mini",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )
      data = response.json()
      print("OPENROUTER RESPONSE:", data)

      if response.status_code != 200 or "choices" not in data:
        return jsonify({
            "error": "AI failed",
            "details": data
        }), 500

      result = data["choices"][0]["message"]["content"]
      result = result.replace("```", "")  # remove markdown formatting

      pdf_buffer = io.BytesIO()
      pdf = canvas.Canvas(pdf_buffer)

      y = 800

      for line in result.split("\n"):
        pdf.drawString(50, y, line[:100])
        y -= 15
        if y < 50:
          pdf.showPage()
          y = 800

      pdf.save()
      pdf_buffer.seek(0)

      return send_file(
    pdf_buffer,
    as_attachment=True,
    download_name="tailored_resume.pdf",
    mimetype="application/pdf"
)

    except Exception as e:
       return jsonify({
         "error": "Server crashed",
         "details": str(e)
    }), 500


@app.route("/interviewcoach", methods=["POST"])
def interviewcoach():

    data = request.get_json()

    jd = data.get("jd")

    if not jd:
        return jsonify({"error": "No JD provided"}), 400

    prompt = f"""
You are an expert interview coach.

Job Description:
{jd}

Generate:

1. 5 Technical Questions
2. 5 HR Questions
3. 5 Project Based Questions

Return ONLY valid JSON.

{{
    "technical": [
        "Question 1",
        "Question 2"
    ],
    "hr": [
        "Question 1",
        "Question 2"
    ],
    "project": [
        "Question 1",
        "Question 2"
    ]
}}
"""

    try:

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
        )

        data = response.json()

        print("OPENROUTER RESPONSE:", data)
        if response.status_code != 200 or "choices" not in data:
          return jsonify({
        "error": "AI failed",
        "details": data
    }), 500
        result = data["choices"][0]["message"]["content"]
        print("AI CONTENT:")
        print(result)
        print("AI CONTENT:")
        result = result.replace("```json", "")
        result = result.replace("```", "")
        result = result.strip()


        questions = json.loads(result)

        return jsonify({
            "technical": questions.get("technical", []),
            "hr": questions.get("hr", []),
            "project": questions.get("project", [])
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
    

@app.route("/jobtracker", methods=["POST"])
def jobtracker():
    data = request.get_json()

    user_id = data.get("user_id")
    company = data.get("company")
    role = data.get("role")
    status = data.get("status")
    date = data.get("date")

    # ✅ FIX 1: validation
    if not user_id or not company or not role or not status or not date:
        return jsonify({"error": "Missing fields"}), 400

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO applications (user_id, company, role, status, applied_date)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, company, role, status, date))

    activity = f"Applied for {role} at {company}"

    cursor.execute("""
        INSERT INTO activities (user_id, activity)
        VALUES (?, ?)
    """, (user_id, activity))

    conn.commit()
    conn.close()

    return jsonify({"message": "success"})

@app.route("/jobtracker/<int:user_id>", methods=["GET"])
def get_jobtracker(user_id):

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, company, role, status, applied_date
        FROM applications
        WHERE user_id = ?
        ORDER BY id DESC
    """, (user_id,))

    rows = cursor.fetchall()
    conn.close()

    applications = []

    for row in rows:
        applications.append({
            "id": row[0],
            "company": row[1],
            "role": row[2],
            "status": row[3],
            "date": row[4]
        })

    return jsonify(applications)



@app.route("/add-activity", methods=["POST"])
def add_activity():
    data = request.get_json()
    user_id = data.get("user_id")
    activity = data.get("activity")

    if not user_id or not activity:
        return jsonify({"error": "Missing data"}), 400

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO activities (user_id, activity)
        VALUES (?, ?)
    """, (user_id, activity))

    conn.commit()
    conn.close()

    return jsonify({"message": "Activity added successfully"})


@app.route("/activities/<int:user_id>", methods=["GET"])
def get_activities(user_id):

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, activity, created_at
        FROM activities
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT 5
    """, (user_id,))

    rows = cursor.fetchall()
    conn.close()

    activities = [
        {
            "id": row[0],
            "activity": row[1],
            "created_at": row[2]
        }
        for row in rows
    ]

    return jsonify(activities)

@app.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT username,email,password
        FROM users
        WHERE id=?
    """, (user_id,))

    user = cursor.fetchone()

    conn.close()

    if user:
        return jsonify({
            "username": user[0],
            "email": user[1],
            "password": user[2]
        })

    return jsonify({
        "message": "User not found"
    }), 404

@app.route("/update-user/<int:user_id>", methods=["PUT"])
def update_user(user_id):

    data = request.json

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET username=?,
            email=?,
            password=?
        WHERE id=?
    """, (username, email, password, user_id))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Profile Updated Successfully"
    })

if __name__ == "__main__":
    app.run(debug=True)



