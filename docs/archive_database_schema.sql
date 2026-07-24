-- CREATE DATABASE IF NOT EXISTS talent_shapers;
-- USE talent_shapers;

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(255),
    email VARCHAR(255),
    course VARCHAR(255),
    message TEXT,
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS courses;
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    no VARCHAR(10),
    name VARCHAR(255),
    tagline VARCHAR(255),
    dur VARCHAR(50),
    color VARCHAR(50),
    description TEXT,
    img VARCHAR(500),
    video VARCHAR(500),
    accent VARCHAR(50),
    level VARCHAR(100),
    category VARCHAR(100),
    topics JSON,
    careers JSON,
    highlights JSON,
    stat_label VARCHAR(100),
    stat_val VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    role VARCHAR(255),
    exp VARCHAR(50),
    past VARCHAR(255),
    color VARCHAR(50),
    img VARCHAR(500),
    cert VARCHAR(255),
    bio TEXT
);

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS blogs;
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(500),
    coverImage VARCHAR(500),
    content TEXT,
    author VARCHAR(100),
    tags JSON,
    publishDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'draft',
    excerpt TEXT,
    category VARCHAR(100),
    readTime VARCHAR(50),
    featured BOOLEAN DEFAULT false,
    color VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    text TEXT NOT NULL,
    rating INT DEFAULT 5
);

-- ==========================================
-- DATA SEEDING
-- ==========================================

-- Admin User
TRUNCATE TABLE admin_users;
INSERT INTO admin_users (username, password_hash) VALUES 
('admin', '$2b$10$Wmf4v9LtmCdq9Fmpkio6UeFQKVSgt6lVYH5XLNM8/Nw3l/JYEX9bm');

-- Trainers
TRUNCATE TABLE trainers;
INSERT INTO trainers (name, role, exp, past, color, img, cert, bio) VALUES 
('Vicky Singh', 'Senior Spoken English Trainer', '11 Years', 'Wipro · HCL', '#007AFF', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', 'TESOL Certified (USA)', 'Specialized in grammar, fluency building, and interview preparation. Coached thousands of working professionals in corporate communication.'),
('Rahul Verma', 'Communication & Soft Skills', '4 Years', 'Amazon India', '#34AADC', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', 'Public Speaking Coach', 'Helped over 1,000 learners become confident in spoken English through practical and interactive training methodology.'),
('Priya Deshmukh', 'English & Personality Dev.', '5 Years', 'British Council India', '#FF2D55', 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400', 'Personality Dev. Certified', 'Former communication trainer with the British Council. Specializes in group discussions, public speaking, and personality development.'),
('Arjun Nair', 'Soft Skills & Spoken English', '13 Years', 'Infosys · TCS', '#30D158', 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=400', 'Certified Soft Skills Trainer', 'Communication Coach for Infosys and TCS learning programs. Trained over 500 learners in workshops across India.');

-- Courses
TRUNCATE TABLE courses;
INSERT INTO courses (no, name, tagline, dur, color, description, img, video, accent, level, category, topics, careers, highlights, stat_label, stat_val) VALUES 
('01', 'Python Programming', 'The language powering the future.', '2–3 Months', '#007AFF', 'From zero to production-ready Python developer. Build web applications, automate workflows, and lay the foundation for AI/ML development.', 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1400', 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4', '#4da6ff', 'Beginner → Advanced', 'Programming', '["Core Python & OOP", "Django & Flask", "REST APIs", "SQL & NoSQL", "Automation Scripts", "Deployment"]', '["Python Developer", "Backend Engineer", "Automation Engineer", "Data Analyst"]', '["Beginner friendly — zero experience needed", "Build 3 real-world projects", "Industry expert trainers"]', 'Students Placed', '80+'),
('02', 'AI & Machine Learning', 'Build minds. Code intelligence.', '3–4 Months', '#34AADC', 'Master TensorFlow, Neural Networks, NLP, and Computer Vision. Deploy real ML models used in production at top tech companies.', 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1400', 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4', '#6fcfff', 'Intermediate', 'Data Science', '["NumPy & Pandas", "TensorFlow / Keras", "Deep Learning", "NLP & Computer Vision", "Model Evaluation", "Cloud Deploy"]', '["ML Engineer", "Data Scientist", "AI Researcher", "Data Analyst"]', '["Real industry datasets", "5 ML projects for portfolio", "Cloud deployment training"]', 'Avg. Salary', '₹6–18 LPA'),
('03', 'MERN Stack', 'One stack. Full power.', '3 Months', '#30D158', 'Become a complete full-stack developer with MongoDB, Express, React, and Node.js. Build and ship scalable web applications end-to-end.', 'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=1400', 'https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_25fps.mp4', '#70e88a', 'Beginner → Expert', 'Full Stack', '["MongoDB & Mongoose", "Express.js", "React & Redux", "Node.js", "JWT Auth", "AWS / Vercel"]', '["Full Stack Developer", "MERN Developer", "Frontend Engineer", "Backend Engineer"]', '["Full e-commerce app project", "Authentication & security", "Deploy to production"]', 'Hiring Partners', '40+'),
('04', 'ReactJS', 'The UI layer. Mastered.', '2 Months', '#0AC8B9', 'Modern React with TypeScript, Next.js, Redux Toolkit, and performance optimization. Build the interfaces millions interact with daily.', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1400', 'https://videos.pexels.com/video-files/3249283/3249283-uhd_2560_1440_25fps.mp4', '#5ee8de', 'Intermediate', 'Frontend', '["React Hooks & Patterns", "TypeScript", "Next.js App Router", "Redux Toolkit", "Performance", "Testing"]', '["React Developer", "Frontend Engineer", "UI Developer", "Next.js Developer"]', '["Production patterns & best practices", "Portfolio of React apps", "TypeScript throughout"]', 'Completion Rate', '96%'),
('05', 'SharePoint & Power Apps', 'Enterprise apps. Low code. High impact.', '2 Months', '#FF9F0A', 'Build mission-critical enterprise solutions with Microsoft 365 — SharePoint, Power Apps, Power Automate, and Teams integration.', 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1400', 'https://videos.pexels.com/video-files/3205567/3205567-uhd_2560_1440_25fps.mp4', '#ffc75a', 'Intermediate', 'Microsoft 365', '["SharePoint Online", "Power Apps Canvas", "Power Automate", "Teams Integration", "Power BI", "SPFx Dev"]', '["SharePoint Dev", "Power Platform Dev", "M365 Consultant", "Business Analyst"]', '["Microsoft cert prep included", "High-demand enterprise skills", "Real business app projects"]', 'Salary Premium', '+35%'),
('06', 'Spoken English', 'Speak. Lead. Succeed.', '1–2 Months', '#FF2D55', 'Professional communication skills taught by corporate trainers. From grammar fundamentals to boardroom presentations and job interviews.', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400', 'https://videos.pexels.com/video-files/3253701/3253701-uhd_2560_1440_25fps.mp4', '#ff7a93', 'All Levels', 'Communication', '["Grammar & Vocabulary", "Pronunciation", "Group Discussions", "Public Speaking", "Business English", "Mock Interviews"]', '["Any IT Role", "Team Lead", "Manager", "Business Professional"]', '["Ex-Wipro, Amazon, British Council trainers", "Daily conversation practice", "Mock GD & interview rounds"]', 'Confidence Score', '4.9★'),
('07', 'Interview Preparation', 'Get ready. Get hired.', '1 Month', '#BF5AF2', 'Crack any IT interview with DSA, system design, HR rounds, resume optimization, and offer negotiation mastery.', 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1400', 'https://videos.pexels.com/video-files/3044954/3044954-uhd_2560_1440_25fps.mp4', '#d98eff', 'All Levels', 'Career', '["DSA", "System Design", "Aptitude", "Resume Writing", "LinkedIn", "HR Mastery"]', '["Software Developer", "Any IT Role", "Product Manager", "Business Analyst"]', '["Company-specific prep", "10+ mock interviews", "Offer negotiation tips"]', 'Offer Rate', '88%'),
('08', 'Computer Fundamentals', 'Start here. Go anywhere.', '1 Month', '#636366', 'The perfect foundation for beginners. Master MS Office, internet essentials, basic programming concepts, and digital communication.', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1400', 'https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4', '#a0a0a5', 'Beginner', 'Basics', '["MS Office Suite", "Internet & Email", "Basic Typing", "Cloud Storage", "Digital Comm.", "Cybersecurity"]', '["Office Executive", "Data Entry", "Admin", "Any Digital Role"]', '["Zero prior knowledge needed", "Practical daily exercises", "Bridge to advanced courses"]', 'Enrolled', '200+');

-- Blogs
TRUNCATE TABLE blogs;
INSERT INTO blogs (title, coverImage, author, status, tags, excerpt, category, readTime, featured, color, publishDate) VALUES 
('How to Land Your First Python Developer Job in 2025', 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800', 'TSO Placement Team', 'published', '["Python", "Career", "Job Search"]', 'A complete roadmap from building your portfolio to acing the technical interview — from our placement team at TSO.', 'Career Tips', '8 min', true, '#007AFF', '2025-05-28 10:00:00'),
('AI & Machine Learning: What Skills Do You Actually Need?', 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800', 'TSO Data Science Team', 'published', '["AI", "Machine Learning", "Skills"]', 'Breaking down the real-world skills required to become an ML engineer — from fundamentals to specializations that companies hire for.', 'Tech Insights', '12 min', true, '#34AADC', '2025-05-20 10:00:00'),
('MERN vs Full Stack Python: Which Should You Learn in 2025?', 'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=800', 'TSO Development Team', 'published', '["MERN", "Python", "Comparison"]', 'An honest, data-backed comparison of two of the most popular full-stack paths to help you make an informed career decision.', 'Tech Insights', '7 min', false, '#30D158', '2025-05-15 10:00:00'),
('Top 20 SharePoint Interview Questions for 2025', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800', 'TSO Microsoft Team', 'published', '["SharePoint", "Interview", "Microsoft"]', 'Prepare for your SharePoint developer interview with this comprehensive list of commonly asked questions and expert answers.', 'Interview Prep', '10 min', false, '#FF9F0A', '2025-05-10 10:00:00'),
('From Non-Tech Background to Developer: Ridhi''s Journey at TSO', 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=800', 'TSO Community', 'published', '["Success Story", "Career Change", "TSO"]', 'How Ridhi transitioned from a marketing executive to a SharePoint developer at a top MNC within 5 months of joining TSO.', 'Student Stories', '5 min', false, '#FF2D55', '2025-05-05 10:00:00'),
('Why Power Apps is the Most In-Demand Skill Right Now', 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=800', 'TSO Microsoft Team', 'published', '["Power Apps", "Microsoft", "Demand"]', 'Microsoft Power Apps has exploded in demand. Here''s why learning low-code development is one of the smartest moves you can make.', 'Industry News', '6 min', false, '#BF5AF2', '2025-04-28 10:00:00'),
('7 Spoken English Mistakes That Will Cost You the Interview', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', 'Vicky Singh', 'published', '["Spoken English", "Interview", "Communication"]', 'Our ex-Wipro communication trainer reveals the 7 spoken English mistakes that kill candidates'' chances in technical and HR interviews.', 'Career Tips', '6 min', false, '#FF2D55', '2025-04-20 10:00:00'),
('How to Build a Tech Resume That Gets You Interviews', 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800', 'TSO Placement Team', 'published', '["Resume", "Career", "Job Search"]', 'Expert tips from our placement team on crafting a resume that passes ATS filters and impresses hiring managers at top IT companies.', 'Career Tips', '8 min', false, '#007AFF', '2025-04-15 10:00:00');

-- Testimonials
TRUNCATE TABLE testimonials;
INSERT INTO testimonials (name, role, text, rating) VALUES 
('Vivek Kumar', 'College Student', 'I never thought learning computers and spoken English could be this fun. The step-by-step guidance made all the difference. Highly recommend TSO.', 5),
('Rahul Chaudhary', 'Network Engineer', 'The personalized attention and well-structured curriculum at TSO greatly boosted my confidence. Truly a game-changer for my career.', 5),
('Ridhi Bhargav', 'Marketing Executive', 'These classes are a great combination! Improved my computer skills and spoken English, boosting confidence in the workplace.', 5),
('Shubham Sharma', 'Job Seeker', 'Learning both computers and spoken English in one place is so convenient. The interactive sessions and helpful trainers made it enjoyable.', 5),
('Divya Verma', 'Student', 'These classes changed my life! I learned essential computer skills and improved my spoken English with ease — perfect for beginners.', 5);
