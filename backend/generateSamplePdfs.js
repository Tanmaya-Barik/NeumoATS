import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '../client/public/samples');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function createPdf(filename, title, sections) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  let y = height - 50;

  // Title
  page.drawText(title, {
    x: 50,
    y,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.15),
  });
  y -= 25;

  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1.5,
    color: rgb(0.2, 0.5, 0.8),
  });
  y -= 25;

  for (const section of sections) {
    if (y < 80) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = height - 50;
    }

    if (section.heading) {
      page.drawText(section.heading.toUpperCase(), {
        x: 50,
        y,
        size: 12,
        font: boldFont,
        color: rgb(0.15, 0.35, 0.6),
      });
      y -= 16;
    }

    for (const item of section.items) {
      if (y < 60) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - 50;
      }

      if (typeof item === 'string') {
        // Bullet or line
        page.drawText(item, {
          x: 55,
          y,
          size: 10,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
          maxWidth: width - 110,
          lineHeight: 14,
        });
        y -= 18;
      } else if (item.boldPrefix) {
        page.drawText(item.boldPrefix, {
          x: 55,
          y,
          size: 10,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.1),
        });
        const prefixWidth = boldFont.widthOfTextAtSize(item.boldPrefix, 10);
        page.drawText(' ' + item.text, {
          x: 55 + prefixWidth,
          y,
          size: 10,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
          maxWidth: width - 110 - prefixWidth,
        });
        y -= 18;
      }
    }
    y -= 10;
  }

  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, pdfBytes);
  console.log(`Generated: ${filePath}`);
}

async function run() {
  // 1. Frontend Lead Job Description
  await createPdf('Frontend_Lead_JD.pdf', 'JOB DESCRIPTION: Senior Frontend Architect / Lead', [
    {
      heading: 'Company Overview & Role Summary',
      items: [
        'Company: CloudScale AI Technologies | Location: San Francisco, CA (Hybrid / Remote)',
        'Role: Senior Frontend Architect / Lead Engineer',
        'We are seeking an experienced Frontend Architect to design and scale our enterprise React web application, lead code reviews, and establish frontend testing standards.',
      ]
    },
    {
      heading: 'Key Responsibilities',
      items: [
        '• Architect, develop, and maintain performant web applications using React 18, TypeScript, and Next.js.',
        '• Manage complex state with Redux Toolkit and optimize frontend data caching with GraphQL.',
        '• Implement modern responsive UI components using Tailwind CSS.',
        '• Maintain comprehensive unit and integration testing pipelines with Jest and Cypress (min 85% coverage).',
        '• Manage deployment workflows and CDN asset distribution using AWS CloudFront and GitHub Actions.',
      ]
    },
    {
      heading: 'Required Technical Qualifications',
      items: [
        '• 5+ years building scalable single-page applications with React and TypeScript.',
        '• Proven experience with Redux Toolkit, Next.js (App Router), and Tailwind CSS.',
        '• Hands-on proficiency with Jest or Vitest for automated testing.',
        '• Experience integrating GraphQL queries and mutations.',
        '• Familiarity with AWS CloudFront CDN distribution and modern cloud infrastructure.',
      ]
    }
  ]);

  // 2. Alex Morgan Resume (High Match, Genuine)
  await createPdf('Alex_Morgan_React_Resume.pdf', 'ALEX MORGAN - SENIOR FULL-STACK REACT ENGINEER', [
    {
      heading: 'Contact Information',
      items: [
        'Email: alex.morgan.dev@email.com | GitHub: github.com/alexmorgan-dev | Portfolio: alexmorgan.io',
      ]
    },
    {
      heading: 'Professional Summary',
      items: [
        'Senior Frontend Engineer with 6+ years of expertise designing high-traffic SaaS applications using React, TypeScript, Next.js, and Redux Toolkit. Passionate about component architecture and test automation.',
      ]
    },
    {
      heading: 'Work Experience',
      items: [
        { boldPrefix: 'Senior Frontend Engineer | Veloce Systems', text: '(2022 - Present)' },
        '• Spearheaded migration of core web portal from legacy SPA to Next.js 14, improving LCP by 42%.',
        '• Designed and implemented global state architecture using Redux Toolkit, reducing boilerplate by 60%.',
        '• Authored over 350 unit and integration tests using Jest and React Testing Library, achieving 88% test coverage.',
        '• Built a modular design system of 50+ accessible components utilizing Tailwind CSS.',
        { boldPrefix: 'Software Engineer | NexaCorp Solutions', text: '(2019 - 2022)' },
        '• Engineered responsive React components in TypeScript used by 120,000+ monthly active enterprise users.',
        '• Integrated RESTful microservices and optimized rendering lifecycles, cutting page load time by 35%.',
        '• Collaborated in Agile sprints, leading bi-weekly code reviews and mentoring 3 junior developers.',
      ]
    },
    {
      heading: 'Technical Skills Summary',
      items: [
        'Languages & Frameworks: React, TypeScript, JavaScript (ES6+), Next.js, HTML5, CSS3/Tailwind CSS',
        'State & Testing: Redux Toolkit, React Context, Jest, React Testing Library',
        'Additional Tools: GraphQL, Docker, Git, Webpack, Vite',
      ]
    },
    {
      heading: 'Featured Projects',
      items: [
        { boldPrefix: 'FinTrack Pro Analytics:', text: 'Real-time dashboard built with React 18, TypeScript, and Tailwind CSS. Implemented Redux Toolkit store with WebSockets.' },
        { boldPrefix: 'OpenDev Component Kit:', text: 'Open-source Tailwind CSS React component library with 1,200+ GitHub stars, tested thoroughly with Jest.' },
      ]
    }
  ]);

  // 3. Jordan Lee Junior Resume (Lower Match, Missing Core Tech)
  await createPdf('Jordan_Lee_Junior_Resume.pdf', 'JORDAN LEE - JUNIOR WEB DEVELOPER', [
    {
      heading: 'Contact Information',
      items: [
        'Email: jordan.lee@email.com | LinkedIn: linkedin.com/in/jordanlee-web',
      ]
    },
    {
      heading: 'Summary',
      items: [
        'Recent Computer Science graduate with hands-on experience building foundational websites with HTML, CSS, JavaScript, and beginner React projects. Looking for an entry-level frontend role.',
      ]
    },
    {
      heading: 'Experience & Projects',
      items: [
        { boldPrefix: 'Junior Web Intern | Local Digital Agency', text: '(2024)' },
        '• Maintained client WordPress websites and updated static HTML/CSS landing pages.',
        '• Assisted senior developers with bug fixing in JavaScript form validation.',
        { boldPrefix: 'Student Portfolio Project:', text: 'Created a personal portfolio using vanilla JavaScript and basic React hooks.' },
        { boldPrefix: 'Todo List App:', text: 'Built a simple task management app with localStorage in React.' },
      ]
    },
    {
      heading: 'Skills',
      items: [
        'HTML5, CSS3, JavaScript, Basic React, Git, Bootstrap',
      ]
    }
  ]);

  // 4. Keyword Stuffed / Manipulated Resume (Tests Feature 5 Cheat Detector)
  await createPdf('Manipulated_Candidate_Resume.pdf', 'DEVIN CHET - SOFTWARE DEVELOPER', [
    {
      heading: 'Contact Information',
      items: [
        'Email: devin.c@email.com | Phone: 555-0192',
      ]
    },
    {
      heading: 'Summary',
      items: [
        'Developer with general knowledge of web technologies and fast learning capabilities.',
      ]
    },
    {
      heading: 'Work Experience',
      items: [
        { boldPrefix: 'Web Assistant | TechCorp', text: '(2023 - 2024)' },
        '• Handled website updates and general maintenance tasks.',
      ]
    },
    {
      heading: 'Technical Skills (Manipulated / Verbatim Copying from JD)',
      items: [
        '• Architect, develop, and maintain performant web applications using React 18, TypeScript, and Next.js.',
        '• Manage complex state with Redux Toolkit and optimize frontend data caching with GraphQL.',
        '• Maintain comprehensive unit and integration testing pipelines with Jest and Cypress (min 85% coverage).',
        '• React React React TypeScript TypeScript Next.js GraphQL AWS CloudFront Tailwind CSS Jest Redux Toolkit React React React TypeScript Next.js Next.js GraphQL AWS AWS CloudFront Jest Jest Cypress',
      ]
    }
  ]);

  console.log('All sample PDFs generated successfully!');
}

run().catch(console.error);
