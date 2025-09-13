<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Green University StudentBridge — Overview</title>
  <style>
    :root{
      --bg:#f7fafc;
      --card:#ffffff;
      --accent:#0ea5a3;
      --muted:#6b7280;
      --text:#0f172a;
      --radius:10px;
      --maxw:900px;
      --pad:20px;
      --shadow: 0 6px 18px rgba(15,23,42,0.08);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    body{
      margin:0;
      background:var(--bg);
      color:var(--text);
      display:flex;
      align-items:flex-start;
      justify-content:center;
      padding:40px 16px;
      line-height:1.5;
    }
    .container{
      width:100%;
      max-width:var(--maxw);
    }
    .card{
      background:var(--card);
      border-radius:var(--radius);
      padding:var(--pad);
      box-shadow:var(--shadow);
      border:1px solid rgba(15,23,42,0.04);
    }
    header h1{
      margin:0 0 6px 0;
      font-size:22px;
      letter-spacing:-0.2px;
    }
    header p.lead{
      margin:0 0 18px 0;
      color:var(--muted);
      font-size:14px;
    }
    section + section{
      margin-top:18px;
    }
    h2{
      font-size:16px;
      margin:0 0 10px 0;
      color:var(--accent);
    }
    ul{
      margin:0;
      padding-left:18px;
      color:var(--text);
    }
    li{
      margin-bottom:8px;
      font-size:14px;
    }
    .two-col{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:18px;
    }
    .badge{
      display:inline-block;
      background:rgba(14,165,163,0.08);
      color:var(--accent);
      padding:6px 10px;
      border-radius:999px;
      font-weight:600;
      font-size:12px;
    }
    @media (max-width:700px){
      .two-col{ grid-template-columns:1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card" role="main">
      <header>
        <h1>Green University StudentBridge</h1>
        <p class="lead">Green University StudentBridge is a MERN stack web application designed to help students easily connect and share resources. It provides services like To-let (room renting), Lost & Found, Buy & Sell, Meal delivery, and Blood Help Board. The goal is to make student life easier by offering all these features on a single platform.</p>
      </header>


      <section aria-labelledby="features">
        <h2 id="features">Features</h2>
        <ul>
          <li><strong>Authentication & Authorization</strong> — JWT-based signup/login for students.</li>
          <li><strong>To-let</strong> — Post and browse available seats/rooms with images and contact details.</li>
          <li><strong>Lost & Found</strong> — Report and search lost items within the community.</li>
          <li><strong>Buy & Sell</strong> — Create listings to trade items with other students.</li>
          <li><strong>Meal Delivery</strong> — Manage meal subscription details.</li>
          <li><strong>Blood Help Board</strong> — Post donor or requester information; filtering available.</li>
          <li><strong>Like/Dislike & Ratings</strong> — Reaction-based rating calculated from likes/dislikes.</li>
          <li><strong>Contact Form</strong> — Users can message the admin (emails delivered to configured inbox).</li>
          <li><strong>Image Uploads</strong> — Multer-powered uploads (max 5 images per post) served from `/uploads`.</li>
        </ul>
      </section>

      <section aria-labelledby="tech">
        <h2 id="tech">Tech Stack</h2>
        <div class="two-col">
          <div>
            <h3 style="margin:0 0 8px 0; font-size:14px;">Frontend</h3>
            <ul>
              <li>HTML, CSS, JavaScript</li>
              <li>Bootstrap (for quick UI components)</li>
              <li>EJS (server-rendered templates)</li>
            </ul>
          </div>
          <div>
            <h3 style="margin:0 0 8px 0; font-size:14px;">Backend & Infra</h3>
            <ul>
              <li>Node.js & Express.js</li>
              <li>MongoDB with Mongoose ODM</li>
              <li>JWT (authentication), Multer (file upload), Nodemailer (email)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</body>
</html>
