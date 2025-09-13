
        <h1>Green University StudentBridge</h1>
        <p class="lead">Green University StudentBridge is a MERN stack web application designed to help students easily connect and share resources. It provides services like To-let (room renting), Lost & Found, Buy & Sell, Meal delivery, and Blood Help Board. The goal is to make student life easier by offering all these features on a single platform.</p>
      </header>

      <section aria-labelledby="intro">
        <h2 id="intro">Introduction</h2>
        <p>
          <strong>Green University StudentBridge</strong> is a lightweight web application built to help students discover housing, trade items, report lost belongings, coordinate meal subscriptions, and request or offer blood donations. The app prioritizes simplicity, fast local search, and student-to-student interactions.
        </p>
      </section>

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
