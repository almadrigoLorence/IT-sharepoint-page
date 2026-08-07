-- =========================================================
-- ASEPH / SharePoint Academy MySQL Database Schema
-- Compatible with XAMPP MySQL / MariaDB (phpMyAdmin)
-- =========================================================

CREATE DATABASE IF NOT EXISTS `aseph_academy` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `aseph_academy`;

-- --------------------------------------------------------
-- Table: site_settings
-- --------------------------------------------------------
DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `tagline` VARCHAR(255) NOT NULL,
  `heroSubtitle` TEXT NOT NULL,
  `footerNote` VARCHAR(255) NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `site_settings` (`id`, `name`, `tagline`, `heroSubtitle`, `footerNote`) VALUES
(1, 'SharePoint Academy', 'Core Training Tracks', 'A training hub for enterprise governance, cloud infrastructure, reliability, and modern IT skills.', 'SharePoint Academy · IT Department');

-- --------------------------------------------------------
-- Table: quick_links
-- --------------------------------------------------------
DROP TABLE IF EXISTS `quick_links`;
CREATE TABLE `quick_links` (
  `id` VARCHAR(50) PRIMARY KEY,
  `label` VARCHAR(255) NOT NULL,
  `to_url` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `quick_links` (`id`, `label`, `to_url`, `description`, `sort_order`) VALUES
('ql1', 'New Hire?', '/paths', 'Start the onboarding path', 1),
('ql2', 'Browse courses', '/catalog', 'See the full catalog', 2),
('ql3', 'My progress', '/progress', 'Check completions & certificates', 3),
('ql4', 'Get help', '/resources', 'Guides, templates, videos', 4);

-- --------------------------------------------------------
-- Table: news
-- --------------------------------------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `body` TEXT NOT NULL,
  `date` DATE NOT NULL,
  `tag` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `news` (`id`, `title`, `body`, `date`, `tag`) VALUES
('n1', 'New course launched: Enterprise Security & Governance', 'A hands-on guide to tenant permissions, data protection, and compliance rules in SharePoint.', '2026-07-18', 'NEW COURSE'),
('n2', 'Enrollment deadline — Q3 Reliability cohort', 'Sign up for the Reliability Engineer path before August 15 to join the next cohort.', '2026-07-15', 'DEADLINE'),
('n3', 'Learner spotlight: IT Certification path', 'Three engineers completed the full security path this month — read what helped them most.', '2026-07-02', 'SPOTLIGHT');

-- --------------------------------------------------------
-- Table: courses
-- --------------------------------------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `level` VARCHAR(50) NOT NULL,
  `format` VARCHAR(50) NOT NULL,
  `duration` VARCHAR(50) NOT NULL,
  `labsCount` INT DEFAULT 0,
  `owner` VARCHAR(100) NOT NULL,
  `featured` TINYINT(1) DEFAULT 0,
  `audience` TEXT NOT NULL,
  `trainer` VARCHAR(100) NOT NULL,
  `prerequisites` VARCHAR(255) NOT NULL,
  `nextSession` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `modules_json` JSON,
  `materials_json` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `courses` (`id`, `title`, `category`, `level`, `format`, `duration`, `labsCount`, `owner`, `featured`, `audience`, `trainer`, `prerequisites`, `nextSession`, `description`, `modules_json`, `materials_json`) VALUES
('enterprise-governance', 'Enterprise Governance & Security', 'SECURITY', 'Advanced', 'Hybrid', '3 hours', 8, 'J. Ramirez', 1, 'IT Administrators, Security Officers, and Compliance Leads.', 'J. Ramirez', 'None', '2026-08-20 · 10:00 AM · Online', 'Manage group inheritances, secure documents from unauthorized sharing, and configure tenant data protection rules. Keep corporate libraries compliant.', '["Tenant Permissions", "Sensitivity Labels", "External Sharing Rules", "Audit Logging"]', '[{"id": "m1", "name": "SharePoint_Security_Guide.pdf", "type": "Guide"}]'),
('tct-basics', 'TCT Basics', 'Reliability', 'Beginner', 'Classroom', '2 hours', 4, 'J. Ramirez', 1, 'New reliability engineers and lab technicians.', 'J. Ramirez', 'None', '2026-08-22 · 9:00 AM · Room 3', 'Learn the basics of Temperature Cycling Testing (TCT), profile readings, and common failure modes.', '["Intro", "Theory", "Hands-on", "Assessment"]', '[{"id": "m1", "name": "JESD22-A104 Primer.pdf", "type": "Guide"}]'),
('hast-deep-dive', 'HAST Deep Dive', 'Reliability', 'Intermediate', 'Hybrid', '4 hours', 6, 'M. Santos', 0, 'Technicians who have completed TCT Basics.', 'M. Santos', 'TCT Basics', '2026-08-05 · Lab', 'In-depth exploration of Highly Accelerated Stress Testing (HAST) and JEDEC compliance.', '["Intro", "Theory", "Hands-on", "Assessment"]', '[{"id": "m2", "name": "HAST chamber walkthrough.mp4", "type": "Video"}]'),
('cal-metrology', 'Cal Metrology', 'Calibration', 'Advanced', 'Classroom', '8 hours', 10, 'R. Cruz', 0, 'Senior technicians and calibration leads.', 'R. Cruz', 'HAST Deep Dive', '2026-09-02 · Cal Lab', 'Metrology principles applied to calibration workflows and traceability records.', '["Intro", "Theory", "Hands-on", "Assessment"]', '[{"id": "m3", "name": "Cal worksheet template.xlsx", "type": "Template"}]'),
('excel-for-labs', 'Excel for Labs', 'Data & Tools', 'Beginner', 'E-learning', '3 hours', 5, 'A. Dela Peña', 0, 'Anyone working with lab data in Excel.', 'A. Dela Peña', 'None', 'Self-paced', 'Organize lab data with structured tables, build formulas, and export visual charts.', '["Intro", "Theory", "Hands-on", "Assessment"]', '[]'),
('power-bi-intro', 'Power BI Intro', 'Data & Tools', 'Intermediate', 'E-learning', '4 hours', 6, 'A. Dela Peña', 1, 'Trainers and admins who need reporting.', 'A. Dela Peña', 'Excel for Labs', '2026-07-24 · Teams', 'Connect Power BI to SharePoint lists, build interactive dashboards, and publish reports.', '["Intro", "Theory", "Hands-on", "Assessment"]', '[]');

-- --------------------------------------------------------
-- Table: paths
-- --------------------------------------------------------
DROP TABLE IF EXISTS `paths`;
CREATE TABLE `paths` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `sequence_json` JSON NOT NULL,
  `effort` VARCHAR(100) NOT NULL,
  `recommendedStart` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `paths` (`id`, `title`, `sequence_json`, `effort`, `recommendedStart`) VALUES
('new-hire', 'New Hire Onboarding', '["Orientation", "Safety", "Systems", "Team"]', '4 courses · ~2 weeks', 'Orientation'),
('lab-technician', 'Lab Technician', '["Equipment", "Test methods", "Cal basics", "5S"]', '5 courses · ~6 weeks', 'Equipment'),
('reliability-engineer', 'Reliability Engineer', '["JEDEC stds", "FA", "Data analysis", "Reporting"]', '6 courses · ~8 weeks', 'JEDEC stds'),
('future-leaders', 'Future Leaders (HiPo)', '["Process improvement", "Mentoring", "Projects"]', '4 courses + capstone', 'Process improvement');

-- --------------------------------------------------------
-- Table: resources
-- --------------------------------------------------------
DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `course` VARCHAR(255) NOT NULL,
  `owner` VARCHAR(100) NOT NULL,
  `reviewDate` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `resources` (`id`, `name`, `type`, `course`, `owner`, `reviewDate`) VALUES
('r1', 'JESD22-A104 Primer.pdf', 'Guide', 'TCT Basics', 'J. Ramirez', '2026-12-01'),
('r2', 'HAST chamber walkthrough.mp4', 'Video', 'HAST Deep Dive', 'M. Santos', '2026-11-01'),
('r3', 'Cal worksheet template.xlsx', 'Template', 'Cal Metrology', 'R. Cruz', '2026-10-15'),
('r4', 'Reliability terms FAQ.pdf', 'SOP / Guide', 'All courses', 'J. Ramirez', '2026-09-20');

-- --------------------------------------------------------
-- Table: events
-- --------------------------------------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `time` VARCHAR(50) NOT NULL,
  `venue` VARCHAR(100) NOT NULL,
  `seats` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `events` (`id`, `title`, `date`, `time`, `venue`, `seats`) VALUES
('e1', 'TCT Basics', '2026-08-22', '9:00 AM', 'Room 3', 12),
('e2', 'Power BI Intro', '2026-08-24', '1:00 PM', 'Teams', 20),
('e3', '5S & Kaizen', '2026-08-29', '10:00 AM', 'Training Hall', 25),
('e4', 'HAST Deep Dive', '2026-09-05', '9:00 AM', 'Lab', 8);

-- --------------------------------------------------------
-- Table: learner_progress
-- --------------------------------------------------------
DROP TABLE IF EXISTS `learner_progress`;
CREATE TABLE `learner_progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `learner` VARCHAR(100) NOT NULL,
  `path_title` VARCHAR(255) NOT NULL,
  `path_percent` INT DEFAULT 0,
  `completions_json` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `learner_progress` (`id`, `learner`, `path_title`, `path_percent`, `completions_json`) VALUES
(1, 'You', 'Lab Technician', 60, '[{"id": "c1", "course": "TCT Basics", "status": "Completed", "score": 90, "date": "2026-07-10"}, {"id": "c2", "course": "Excel for Labs", "status": "Completed", "score": 85, "date": "2026-06-28"}, {"id": "c3", "course": "HAST Deep Dive", "status": "In progress", "score": null, "date": null}]');

-- --------------------------------------------------------
-- Table: team_settings
-- --------------------------------------------------------
DROP TABLE IF EXISTS `team_settings`;
CREATE TABLE `team_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `team_settings` (`id`, `title`, `description`) VALUES
(1, 'Meet Our IT & Engineering Team', 'The dedicated experts leading reliability, training, cloud architecture, and compliance across ASEPH.');

-- --------------------------------------------------------
-- Table: team_members
-- --------------------------------------------------------
DROP TABLE IF EXISTS `team_members`;
CREATE TABLE `team_members` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NOT NULL,
  `avatar` LONGTEXT,
  `bio` TEXT,
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `team_members` (`id`, `name`, `role`, `avatar`, `bio`, `sort_order`) VALUES
('tm1', 'J. Ramirez', 'Lead Reliability Engineer & Trainer', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 'Specializes in TCT, HAST testing standards, and compliance training.', 1),
('tm2', 'M. Santos', 'Senior Systems Architect', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'Leads SharePoint tenant governance, security policies, and infrastructure.', 2),
('tm3', 'A. Dela Peña', 'Data Analytics Specialist', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 'Drives Power BI dashboards, automated lab reporting, and Excel data models.', 3),
('tm4', 'R. Cruz', 'Metrology & Calibration Lead', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', 'Oversees equipment metrology, calibration workflows, and 5S standards.', 4);

-- --------------------------------------------------------
-- Table: theme_settings
-- --------------------------------------------------------
DROP TABLE IF EXISTS `theme_settings`;
CREATE TABLE `theme_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `primaryColor` VARCHAR(50) NOT NULL DEFAULT '#0078d4',
  `secondaryColor` VARCHAR(50) NOT NULL DEFAULT '#107c41',
  `bgColor` VARCHAR(50) NOT NULL DEFAULT '#0b0f19',
  `cardBg` VARCHAR(50) NOT NULL DEFAULT '#161e2e',
  `textColor` VARCHAR(50) NOT NULL DEFAULT '#f3f4f6',
  `headerTitle` VARCHAR(255) NOT NULL DEFAULT 'ASEPH Academy',
  `carousel_json` JSON,
  `layout_json` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `theme_settings` (`id`, `primaryColor`, `secondaryColor`, `bgColor`, `cardBg`, `textColor`, `headerTitle`, `carousel_json`, `layout_json`) VALUES
(1, '#0078d4', '#107c41', '#0b0f19', '#161e2e', '#f3f4f6', 'ASEPH Academy', 
 '[{"id":"slide1","title":"SharePoint & IT Training Hub","subtitle":"Accelerate your technical mastery in security, reliability, and enterprise tools.","image":"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80","buttonText":"Explore Courses","buttonUrl":"/catalog"},{"id":"slide2","title":"Interactive Learning Paths","subtitle":"Structured step-by-step career development tracks for engineers and technicians.","image":"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80","buttonText":"View Paths","buttonUrl":"/paths"}]',
 '["carousel","quickLinks","news","team","courses","resources","events","progress"]');

