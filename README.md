# Data Analytics API
A powerful RESTful API built with Node.js, Express, and MongoDB that provides advanced data analytics using the MongoDB aggregation pipeline.
This project focuses on transforming raw data into meaningful insights such as counts, summaries, and time-based analytics.
# Features
Build analytics using MongoDB Aggregation Pipeline
Generate summaries (counts, totals, grouped data)
Analyze notes by category
Analyze posts per month
Filter analytics by user or date
Clean REST API structure
Scalable and production-ready backend structure
# Tech Stack
Node.js
Express.js
MongoDB
Mongoose
REST API architecture
# Project Structure
Copy code

# project-root
│
├── models/          → Database schemas (MongoDB models)
├── routes/          → API routes
├── index.js         → Entry point
├── package.json
└── README.md
⚙️ Installation & Setup
1. Clone repository
Copy code

git clone <repo-link>
cd project-name
2. Install dependencies
Copy code

npm install
3. Add environment variables
Create .env file:
Copy code

MONGO_URI=your_mongodb_connection
PORT=3000
4. Run server
Copy code

npm start
or
Copy code

node index.js
Server will run on:
Copy code

http://localhost:3000
# Analytics Functionality
This API uses MongoDB aggregation pipeline stages such as:
$match → filter data
$group → grouping & counting
$project → format output
$sort → sorting results
# Example Analytics Endpoints
1️⃣ Notes per Category
Returns number of notes grouped by category.
Copy code

GET /analytics/notes-per-category
Example response
Copy code
Json
[
  {
    "category": "Work",
    "totalNotes": 12
  },
  {
    "category": "Study",
    "totalNotes": 7
  }
]
2️⃣ Posts per Month
Returns number of posts created each month.
Copy code

GET /analytics/posts-per-month
Example response
Copy code
Json
[
  {
    "month": "2026-01",
    "totalPosts": 15
  },
  {
    "month": "2026-02",
    "totalPosts": 9
  }
]
3️⃣ Filtered Analytics (User or Date)
You can filter analytics using query parameters.
Copy code

GET /analytics/posts?userId=123
GET /analytics/posts?startDate=2026-01-01&endDate=2026-02-01
This combines:
filtering
aggregation
grouping
computed summaries
# Example Aggregation Pipeline
Example: count posts per category
Copy code
Js
Post.aggregate([
  { $match: { userId: req.params.userId } },
  {
    $group: {
      _id: "$category",
      totalPosts: { $sum: 1 }
    }
  },
  {
    $project: {
      category: "$_id",
      totalPosts: 1,
      _id: 0
    }
  }
]);
# Goals of This Project
Practice MongoDB aggregation pipeline
Build real-world backend analytics
Improve backend architecture skills
Prepare for backend internships
Understand how companies process data
# Future Improvements
Add authentication (JWT)
Add dashboard-ready endpoints
Export analytics as CSV
Add pagination & caching
Deploy to cloud (Render / Railway)
# Author
Youssef Ahmed 
# Thank You For Reading
