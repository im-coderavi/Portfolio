// Simple rule-based chatbot with plain text responses

const getKeywords = (message) => {
    return message.toLowerCase().trim();
};

const getBotResponse = (userMessage, projects = [], experiences = [], knowledgeBase = []) => {
    const msg = getKeywords(userMessage);

    // First, try to find answer in knowledge base
    if (knowledgeBase.length > 0) {
        const kbAnswer = searchKnowledgeBase(msg, knowledgeBase);
        if (kbAnswer) {
            return kbAnswer;
        }
    }

    // Greetings
    if (msg.match(/\b(hi|hello|hey|hola|namaste)\b/)) {
        return "Hi there! 👋 I'm Avishek's AI assistant. I can help you learn about his skills, experience, and projects. What would you like to know?";
    }

    // About Avishek
    if (msg.match(/\b(who|about|tell me|introduce)\b/) && msg.match(/\b(avishek|you|yourself)\b/)) {
        return `Avishek Giri is a Full Stack MERN Developer with 2+ years of experience. He specializes in:

🚀 Skills:
- Frontend: React.js, JavaScript, HTML5, CSS3
- Backend: Node.js, Express.js, RESTful APIs
- Database: MongoDB, Mongoose
- Tools: Git, Vercel, Cloudinary
- Special: AI Integration, Responsive Design

💼 Experience: ${experiences.length} professional roles
📁 Projects: ${projects.length} completed projects

Would you like to know more about his projects or experience?`;
    }

    // Skills
    if (msg.match(/\b(skill|technology|tech stack|expertise|know)\b/)) {
        return `Avishek is proficient in:

Frontend:
✅ React.js - Building dynamic UIs
✅ JavaScript (ES6+)
✅ HTML5 & CSS3
✅ Responsive Design

Backend:
✅ Node.js & Express.js
✅ RESTful API Development
✅ Authentication (JWT)

Database:
✅ MongoDB & Mongoose
✅ Database Design

Tools & Others:
✅ Git & GitHub
✅ Vercel Deployment
✅ Cloudinary Integration
✅ AI Integration

Want to see his projects or discuss a collaboration?`;
    }

    // Projects
    if (msg.match(/\b(project|portfolio|work|built|created)\b/)) {
        if (projects.length > 0) {
            const projectList = projects.slice(0, 3).map((p, i) =>
                `${i + 1}. ${p.title} - ${p.description?.substring(0, 80)}...`
            ).join('\n');

            return `Avishek has worked on ${projects.length} projects! Here are some highlights:

${projectList}

You can explore all projects in the Projects section below. Interested in working together? Let me know!`;
        }
        return "Avishek has worked on multiple MERN stack projects. Check out the Projects section on this website to see his work!";
    }

    // Experience
    if (msg.match(/\b(experience|job|work|career|professional)\b/)) {
        if (experiences.length > 0) {
            const expList = experiences.map((e, i) =>
                `${i + 1}. ${e.position} at ${e.company} ${e.current ? '(Current)' : ''}`
            ).join('\n');

            return `Avishek has ${experiences.length}+ years of professional experience:

${expList}

He's passionate about building scalable web applications and solving complex problems. Want to discuss a project?`;
        }
        return "Avishek has 2+ years of professional experience as a Full Stack MERN Developer. Check the Experience section for details!";
    }

    // Contact / Hire
    if (msg.match(/\b(contact|email|reach|hire|work together|collaborate|project)\b/)) {
        return `Great! I'd love to help you connect with Avishek.

📧 Email: avishekgiri31@gmail.com
📝 Contact Form: Available on this website

Want to discuss a project?
Click the "💼 Interested in Working Together?" button below to share your details, and Avishek will reach out to you soon!

What kind of project are you thinking about?`;
    }

    // Pricing / Cost
    if (msg.match(/\b(price|cost|rate|charge|budget|fee)\b/)) {
        return `Pricing depends on the project scope and requirements.

To get an accurate quote:
1. Click "💼 Interested in Working Together?" below
2. Share your project details
3. Avishek will review and get back to you with a proposal

Every project is unique, so let's discuss your specific needs!`;
    }

    // Availability
    if (msg.match(/\b(available|free|busy|time|when)\b/)) {
        return `Avishek is currently ${experiences.some(e => e.current) ? 'working professionally' : 'available'} and open to new opportunities!

For project inquiries:
- Click "💼 Interested in Working Together?" below
- Share your timeline and requirements
- He'll respond within 24-48 hours

What's your project timeline?`;
    }

    // Technologies / Stack
    if (msg.match(/\b(mern|react|node|mongodb|express|stack)\b/)) {
        return `Yes! Avishek specializes in the MERN Stack:

🔷 MongoDB - NoSQL database
🔷 Express.js - Backend framework
🔷 React.js - Frontend library
🔷 Node.js - Runtime environment

He's also experienced with:
- Cloudinary (file storage)
- Vercel (deployment)
- JWT Authentication
- RESTful APIs
- AI Integration

Perfect for building modern, scalable web applications! 🚀`;
    }

    // Thank you
    if (msg.match(/\b(thank|thanks|appreciate)\b/)) {
        return "You're welcome! 😊 Feel free to ask anything else about Avishek's work, or use the contact form to reach out directly. Happy to help!";
    }

    // Default response
    return `I'm here to help! You can ask me about:

💡 Avishek's skills and expertise
📁 His projects and portfolio
💼 Work experience
📧 How to contact him
🤝 Collaboration opportunities

Or click "💼 Interested in Working Together?" to discuss your project directly!

What would you like to know?`;
};

// Search knowledge base for relevant answer
const searchKnowledgeBase = (query, knowledgeBase) => {
    const keywords = query.split(' ').filter(word => word.length > 3);

    for (const kb of knowledgeBase) {
        const content = kb.content.toLowerCase();
        const matchCount = keywords.filter(kw => content.includes(kw)).length;

        // If at least 2 keywords match, extract relevant chunk
        if (matchCount >= 2) {
            return extractRelevantChunk(kb.content, keywords);
        }
    }

    return null;
};

// Extract relevant chunk from knowledge base content
const extractRelevantChunk = (content, keywords) => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Find sentences containing keywords
    const relevantSentences = sentences.filter(sentence => {
        const lowerSentence = sentence.toLowerCase();
        return keywords.some(kw => lowerSentence.includes(kw));
    });

    if (relevantSentences.length > 0) {
        // Return first 3 relevant sentences as a chunk
        return relevantSentences.slice(0, 3).join('. ') + '.';
    }

    return null;
};

module.exports = {
    getBotResponse
};
