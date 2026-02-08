// Professional Personal AI Assistant Chatbot for Avishek Giri
// Enhanced responses, sales bot functionality, and call scheduling

const getKeywords = (message) => {
    return message.toLowerCase().trim();
};

const getBotResponse = (userMessage, projects = [], experiences = []) => {
    const msg = getKeywords(userMessage);

    // ==================== GREETINGS ====================
    if (msg.match(/\b(hi|hello|hey|hola|namaste|good morning|good afternoon|good evening)\b/)) {
        return `Hello! 👋 Welcome to Avishek Giri's Portfolio!

I'm his personal AI assistant, here to help you learn about:
✨ His skills & expertise
💼 Professional experience
🚀 Projects he's built
🤝 How to work with him

What would you like to know? Feel free to ask anything!`;
    }

    // ==================== ABOUT AVISHEK ====================
    if (msg.match(/\b(who|about|tell me|introduce|know|background)\b/) && msg.match(/\b(avishek|you|yourself|him|he)\b/)) {
        return `**Avishek Giri** is a passionate Full Stack MERN Developer with 2+ years of hands-on experience in building modern, scalable web applications.

🎯 **What He Does:**
• Builds end-to-end web applications using MERN Stack
• Creates responsive, user-friendly interfaces
• Develops robust backend APIs & databases
• Integrates AI features into applications

💡 **His Approach:**
He believes in clean code, best practices, and delivering solutions that make a real impact for clients.

📊 **Portfolio Stats:**
• ${experiences.length}+ Professional Roles
• ${projects.length}+ Completed Projects
• Multiple satisfied clients

Would you like to discuss a project? Click the **"💼 Interested in Working Together?"** button below!`;
    }

    // ==================== SKILLS & TECH STACK ====================
    if (msg.match(/\b(skill|technology|tech|stack|expertise|know|tools|programming|languages|framework)\b/)) {
        return `**Avishek's Technical Expertise:**

🎨 **Frontend Development:**
• React.js - Dynamic, component-based UIs
• JavaScript (ES6+) - Modern JS features
• HTML5 & CSS3 - Semantic, accessible markup
• Responsive Design - Mobile-first approach

⚙️ **Backend Development:**
• Node.js & Express.js - Scalable server-side apps
• RESTful API Design - Clean, efficient endpoints
• Authentication (JWT) - Secure user management

🗄️ **Database:**
• MongoDB & Mongoose - NoSQL database solutions
• Database Architecture - Efficient data modeling

🛠️ **Tools & Platforms:**
• Git & GitHub - Version control
• Vercel - Deployment & hosting
• Cloudinary - Media management
• AI Integration - Smart features

**Ready to leverage these skills for your project?** Let me know what you're building!`;
    }

    // ==================== PROJECTS ====================
    if (msg.match(/\b(project|portfolio|work|built|created|showcase|examples)\b/) && !msg.match(/\b(work together|work with|hire)\b/)) {
        if (projects.length > 0) {
            const projectList = projects.slice(0, 4).map((p, i) =>
                `**${i + 1}. ${p.title}**\n   ${p.description?.substring(0, 100)}...`
            ).join('\n\n');

            return `**Avishek's Featured Projects:**

${projectList}

📂 Check out the **Projects section** below to explore all ${projects.length} projects with live demos!

**Interested in something similar?** Let's discuss your project idea!`;
        }
        return `Avishek has built multiple full-stack MERN applications. Check out the **Projects section** on this website to see his work!

**Want something built for you?** Click the **"💼 Interested in Working Together?"** button!`;
    }

    // ==================== EXPERIENCE ====================
    if (msg.match(/\b(experience|job|career|professional|worked|company|role|position)\b/) && !msg.match(/\b(work together|work with)\b/)) {
        if (experiences.length > 0) {
            const expList = experiences.map((e, i) =>
                `**${e.position}** at ${e.company} ${e.current ? '*(Current)*' : ''}`
            ).join('\n• ');

            return `**Avishek's Professional Experience:**

• ${expList}

📈 **${experiences.length}+ years** of building production-ready applications, solving complex problems, and delivering quality solutions.

**Want to add him to your team?** Let's connect!`;
        }
        return `Avishek has **2+ years** of professional experience as a Full Stack MERN Developer. Check the **Experience section** for details!`;
    }

    // ==================== SALES BOT: PROJECT/HIRE INTENT ====================
    if (msg.match(/\b(hire|work together|work with|collaborate|project for|need a developer|looking for|developer|build|create|want to make|need help|freelance|contract)\b/)) {
        return `That's great! 🎉 Avishek would love to help with your project!

**Here's how to get started:**

1️⃣ **Fill the form** - Click **"💼 Interested in Working Together?"** button below
2️⃣ **Share details** - Tell us about your project, budget, and timeline
3️⃣ **Get a proposal** - Avishek will review and respond within 24-48 hours

📧 **Quick Contact:**
• Email: avishekgiri31@gmail.com
• LinkedIn: https://www.linkedin.com/in/im-coderavi/

**Don't hesitate** - fill out the form below and let's make your project happen! 🚀`;
    }

    // ==================== CALL SCHEDULING ====================
    if (msg.match(/\b(call|schedule|meeting|discuss|talk|phone|video call|consultation|book)\b/)) {
        return `📞 **Want to schedule a call with Avishek?**

**Options to connect:**

1️⃣ **Email First** (Recommended)
   Send your availability to: **avishekgiri31@gmail.com**
   Include your timezone and preferred time slots.

2️⃣ **LinkedIn Message**
   Connect on LinkedIn: https://www.linkedin.com/in/im-coderavi/
   Send a direct message with your request.

3️⃣ **Fill the Contact Form**
   Use the **"💼 Interested in Working Together?"** button
   Mention "Schedule a Call" in your message.

**Avishek typically responds within 24-48 hours!**

What would you like to discuss in the call?`;
    }

    // ==================== PRICING / COST ====================
    if (msg.match(/\b(price|cost|rate|charge|budget|fee|quote|estimate|how much)\b/)) {
        return `💰 **Pricing Information**

Avishek's pricing depends on:
• Project scope & complexity
• Timeline requirements
• Features & integrations needed

**To get an accurate quote:**

1️⃣ Click **"💼 Interested in Working Together?"** below
2️⃣ Describe your project requirements
3️⃣ Include your budget range & timeline
4️⃣ Avishek will review and send a detailed proposal

**Typical Project Types:**
• Landing Pages & Portfolios
• Full-stack Web Applications
• API Development & Integration
• Custom Dashboard Solutions

**Ready to get started?** Fill out the form below! 📝`;
    }

    // ==================== CONTACT INFORMATION ====================
    if (msg.match(/\b(contact|email|reach|connect|get in touch|message|how can i)\b/) && !msg.match(/\b(hire|project|work)\b/)) {
        return `📬 **Contact Avishek:**

📧 **Email:** avishekgiri31@gmail.com
🔗 **LinkedIn:** https://www.linkedin.com/in/im-coderavi/
🌐 **Portfolio:** https://www.coderavi.in/

**For Project Inquiries:**
Use the **"💼 Interested in Working Together?"** button below to share your project details!

**Response Time:** Usually within 24-48 hours ⏰`;
    }

    // ==================== AVAILABILITY ====================
    if (msg.match(/\b(available|free|busy|time|when|freelance|open)\b/)) {
        const isCurrentlyWorking = experiences.some(e => e.current);
        return `📅 **Avishek's Availability**

${isCurrentlyWorking ? "Currently working professionally but **open to freelance projects!**" : "Currently **available** for new opportunities!"}

**For New Projects:**
• Freelance work ✅
• Contract projects ✅
• Consultation calls ✅

**Response Time:** 24-48 hours

**Interested?** Click **"💼 Interested in Working Together?"** and let's discuss your timeline!`;
    }

    // ==================== MERN / TECH SPECIFIC ====================
    if (msg.match(/\b(mern|react|node|mongodb|express|javascript|frontend|backend|fullstack|full stack|api)\b/)) {
        return `🔷 **Yes! Avishek specializes in the MERN Stack:**

• **M**ongoDB - NoSQL database
• **E**xpress.js - Backend framework  
• **R**eact.js - Frontend library
• **N**ode.js - Runtime environment

**Additional Expertise:**
• REST API Development
• JWT Authentication
• Cloudinary Integration
• Vercel Deployment
• AI Feature Integration

This stack is perfect for building modern, scalable web applications! 🚀

**Have a MERN project in mind?** Let's discuss it!`;
    }

    // ==================== THANK YOU ====================
    if (msg.match(/\b(thank|thanks|appreciate|helpful|great|awesome|nice)\b/)) {
        return `You're welcome! 😊

Feel free to:
• Ask more questions about Avishek
• Explore the portfolio sections below
• Click **"💼 Interested in Working Together?"** for project inquiries

I'm here to help! Have a great day! 🌟`;
    }

    // ==================== GOODBYE ====================
    if (msg.match(/\b(bye|goodbye|see you|later|take care)\b/)) {
        return `Goodbye! 👋

Before you go, remember:
📧 Email: avishekgiri31@gmail.com
🔗 LinkedIn: https://www.linkedin.com/in/im-coderavi/

Feel free to come back anytime! Have a wonderful day! 🌟`;
    }

    // ==================== DEFAULT RESPONSE ====================
    return `I'm here to help! 😊

**Ask me about:**

💡 **Skills & Expertise** - "What are Avishek's skills?"
📁 **Projects** - "Show me his projects"
💼 **Experience** - "Tell me about his experience"
📧 **Contact** - "How can I reach him?"
🤝 **Collaboration** - "I want to hire Avishek"
📞 **Schedule a Call** - "Can I schedule a call?"
💰 **Pricing** - "What are his rates?"

**Or click "💼 Interested in Working Together?"** to discuss your project directly!

What would you like to know?`;
};

module.exports = {
    getBotResponse
};
