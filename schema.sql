-- =========================================================
-- IT Academy MySQL Database Schema
-- Database: it_academy
-- Table Prefix: ita_
-- Compatible with XAMPP MySQL / MariaDB (phpMyAdmin)
-- =========================================================

CREATE DATABASE IF NOT EXISTS `it_academy` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `it_academy`;

-- --------------------------------------------------------
-- Table: ita_site_settings
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ita_site_settings`;
CREATE TABLE `ita_site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `tagline` VARCHAR(255) NOT NULL,
  `heroSubtitle` TEXT NOT NULL,
  `footerNote` VARCHAR(255) NOT NULL,
  `deptTag` VARCHAR(100) NOT NULL DEFAULT 'IT DEPARTMENT',
  `logoUrl` LONGTEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ita_site_settings` (`id`, `name`, `tagline`, `heroSubtitle`, `footerNote`, `deptTag`, `logoUrl`) VALUES
(1, 'SharePoint Academy', 'Core Training Tracks', 'Welcome to the SharePoint Academy, hosted by the IT Department. Elevate your collaboration, design stunning intranets, and manage files securely with certified training paths.', 'SharePoint Academy · IT Department', 'IT DEPARTMENT', '');

-- --------------------------------------------------------
-- Table: ita_quick_links
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ita_quick_links`;
CREATE TABLE `ita_quick_links` (
  `id` VARCHAR(50) PRIMARY KEY,
  `label` VARCHAR(255) NOT NULL,
  `to_url` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ita_quick_links` (`id`, `label`, `to_url`, `description`, `sort_order`) VALUES
('ql1', 'New Hire?', '/paths', 'Start the onboarding path', 1),
('ql2', 'Browse courses', '/catalog', 'See the full catalog', 2),
('ql3', 'My progress', '/progress', 'Check completions & certificates', 3),
('ql4', 'Get help', '/resources', 'Guides, templates, videos', 4);

-- --------------------------------------------------------
-- Table: ita_news
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ita_news`;
CREATE TABLE `ita_news` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `body` TEXT NOT NULL,
  `date` DATE NOT NULL,
  `tag` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ita_news` (`id`, `title`, `body`, `date`, `tag`) VALUES
('n1', 'New course launched: Enterprise Security & Governance', 'A hands-on guide to tenant permissions, data protection, and compliance rules in SharePoint.', '2026-07-18', 'NEW COURSE'),
('n2', 'Enrollment deadline — Q3 Reliability cohort', 'Sign up for the Reliability Engineer path before August 15 to join the next cohort.', '2026-07-15', 'DEADLINE'),
('n3', 'Learner spotlight: IT Certification path', 'Three engineers completed the full security path this month — read what helped them most.', '2026-07-02', 'SPOTLIGHT');

-- --------------------------------------------------------
-- Table: ita_courses
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ita_courses`;
CREATE TABLE `ita_courses` (
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

INSERT INTO `ita_courses` (`id`, `title`, `category`, `level`, `format`, `duration`, `labsCount`, `owner`, `featured`, `audience`, `trainer`, `prerequisites`, `nextSession`, `description`, `modules_json`, `materials_json`) VALUES
('enterprise-governance', 'Enterprise Governance & Security', 'SECURITY', 'Advanced', 'Hybrid', '3 hours', 8, 'J. Ramirez', 1, 'IT Administrators, Security Officers, and Compliance Leads.', 'J. Ramirez', 'None', '2026-08-20 · 10:00 AM · Online', 'Manage group inheritances, secure documents from unauthorized sharing, and configure tenant data protection rules. Keep corporate libraries compliant.', '["Tenant Permissions", "Sensitivity Labels", "External Sharing Rules", "Audit Logging"]', '[{"id": "m1", "name": "SharePoint_Security_Guide.pdf", "type": "Guide"}]'),
('tct-basics', 'TCT Basics', 'Reliability', 'Beginner', 'Classroom', '2 hours', 4, 'J. Ramirez', 1, 'New reliability engineers and lab technicians.', 'J. Ramirez', 'None', '2026-08-22 · 9:00 AM · Room 3', 'Learn the basics of Temperature Cycling Testing (TCT), profile readings, and common failure modes.', '["Intro", "Theory", "Hands-on", "Assessment"]', '[{"id": "m1", "name": "JESD22-A104 Primer.pdf", "type": "Guide"}]'),
('hast-deep-dive', 'HAST Deep Dive', 'Reliability', 'Intermediate', 'Hybrid', '4 hours', 6, 'M. Santos', 0, 'Technicians who have completed TCT Basics.', 'M. Santos', 'TCT Basics', '2026-08-05 · Lab', 'In-depth exploration of Highly Accelerated Stress Testing (HAST) and JEDEC compliance.', '["Intro", "Theory", "Hands-on", "Assessment"]', '[{"id": "m2", "name": "HAST chamber walkthrough.mp4", "type": "Video"}]'),
('cal-metrology', 'Cal Metrology', 'Calibration', 'Advanced', 'Classroom', '8 hours', 10, 'R. Cruz', 0, 'Senior technicians and calibration leads.', 'R. Cruz', 'HAST Deep Dive', '2026-09-02 · Cal Lab', 'Metrology principles applied to calibration workflows and traceability records.', '["Intro", "Theory", "Hands-on", "Assessment"]', '[{"id": "m3", "name": "Cal worksheet template.xlsx", "type": "Template"}]'),
('excel-for-labs', 'Excel for Labs', 'Data & Tools', 'Beginner', 'E-learning', '3 hours', 5, 'A. Dela Peña', 0, 'Anyone working with lab data in Excel.', 'A. Dela Peña', 'None', 'Self-paced', 'Organize lab data with structured tables, build formulas, and export visual charts.', '["Intro", "Theory", "Hands-on", "Assessment"]', '[]'),
('power-bi-intro', 'Power BI Intro', 'Data & Tools', 'Intermediate', 'E-learning', '4 hours', 6, 'A. Dela Peña', 1, 'Trainers and admins who need reporting.', 'A. Dela Peña', 'Excel for Labs', '2026-07-24 · Teams', 'Connect Power BI to SharePoint lists, build interactive dashboards, and publish reports.', '["Intro", "Theory", "Hands-on", "Assessment"]', '[]');

-- --------------------------------------------------------
-- Table: ita_paths
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ita_paths`;
CREATE TABLE `ita_paths` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `sequence_json` JSON NOT NULL,
  `effort` VARCHAR(100) NOT NULL,
  `recommendedStart` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ita_paths` (`id`, `title`, `sequence_json`, `effort`, `recommendedStart`) VALUES
('new-hire', 'New Hire Onboarding', '["Orientation", "Safety", "Systems", "Team"]', '4 courses · ~2 weeks', 'Orientation'),
('lab-technician', 'Lab Technician', '["Equipment", "Test methods", "Cal basics", "5S"]', '5 courses · ~6 weeks', 'Equipment'),
('reliability-engineer', 'Reliability Engineer', '["JEDEC stds", "FA", "Data analysis", "Reporting"]', '6 courses · ~8 weeks', 'JEDEC stds'),
('future-leaders', 'Future Leaders (HiPo)', '["Process improvement", "Mentoring", "Projects"]', '4 courses + capstone', 'Process improvement');

-- --------------------------------------------------------
-- Table: ita_resources
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ita_resources`;
CREATE TABLE `ita_resources` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `course` VARCHAR(255) NOT NULL,
  `owner` VARCHAR(100) NOT NULL,
  `reviewDate` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ita_resources` (`id`, `name`, `type`, `course`, `owner`, `reviewDate`) VALUES
('r1', 'JESD22-A104 Primer.pdf', 'Guide', 'TCT Basics', 'J. Ramirez', '2026-12-01'),
('r2', 'HAST chamber walkthrough.mp4', 'Video', 'HAST Deep Dive', 'M. Santos', '2026-11-01'),
('r3', 'Cal worksheet template.xlsx', 'Template', 'Cal Metrology', 'R. Cruz', '2026-10-15'),
('r4', 'Reliability terms FAQ.pdf', 'SOP / Guide', 'All courses', 'J. Ramirez', '2026-09-20');

-- --------------------------------------------------------
-- Table: ita_events
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ita_events`;
CREATE TABLE `ita_events` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `time` VARCHAR(50) NOT NULL,
  `venue` VARCHAR(100) NOT NULL,
  `seats` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ita_events` (`id`, `title`, `date`, `time`, `venue`, `seats`) VALUES
('e1', 'TCT Basics', '2026-08-22', '9:00 AM', 'Room 3', 12),
('e2', 'Power BI Intro', '2026-08-24', '1:00 PM', 'Teams', 20),
('e3', '5S & Kaizen', '2026-08-29', '10:00 AM', 'Training Hall', 25),
('e4', 'HAST Deep Dive', '2026-09-05', '9:00 AM', 'Lab', 8);

-- --------------------------------------------------------
-- Table: ita_learner_progress
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ita_learner_progress`;
CREATE TABLE `ita_learner_progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `learner` VARCHAR(100) NOT NULL,
  `path_title` VARCHAR(255) NOT NULL,
  `path_percent` INT DEFAULT 0,
  `completions_json` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ita_learner_progress` (`id`, `learner`, `path_title`, `path_percent`, `completions_json`) VALUES
(1, 'You', 'Lab Technician', 60, '[{"id": "c1", "course": "TCT Basics", "status": "Completed", "score": 90, "date": "2026-07-10"}, {"id": "c2", "course": "Excel for Labs", "status": "Completed", "score": 85, "date": "2026-06-28"}, {"id": "c3", "course": "HAST Deep Dive", "status": "In progress", "score": null, "date": null}]');

-- --------------------------------------------------------
-- Table: ita_team_settings
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ita_team_settings`;
CREATE TABLE `ita_team_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ita_team_settings` (`id`, `title`, `description`) VALUES
(1, 'Meet Our IT & Engineering Team', 'The dedicated experts leading reliability, training, cloud architecture, and compliance across ASEPH.');

-- --------------------------------------------------------
-- Table: ita_team_members
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ita_team_members`;
CREATE TABLE `ita_team_members` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NOT NULL,
  `avatar` LONGTEXT,
  `bio` TEXT,
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ita_team_members` (`id`, `name`, `role`, `avatar`, `bio`, `sort_order`) VALUES
('tm1', 'J. Ramirez', 'Lead Reliability Engineer & Trainer', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 'Specializes in TCT, HAST testing standards, and compliance training.', 1),
('tm2', 'M. Santos', 'Senior Systems Architect', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'Leads SharePoint tenant governance, security policies, and infrastructure.', 2),
('tm3', 'A. Dela Peña', 'Data Analytics Specialist', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 'Drives Power BI dashboards, automated lab reporting, and Excel data models.', 3),
('tm4', 'R. Cruz', 'Metrology & Calibration Lead', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', 'Oversees equipment metrology, calibration workflows, and 5S standards.', 4);

-- --------------------------------------------------------
-- Table: ita_theme_settings
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ita_theme_settings`;
CREATE TABLE `ita_theme_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `primaryColor` VARCHAR(50) NOT NULL DEFAULT '#3b82f6',
  `secondaryColor` VARCHAR(50) NOT NULL DEFAULT '#8b5cf6',
  `bgColor` VARCHAR(50) NOT NULL DEFAULT '#f8fafc',
  `cardBg` VARCHAR(50) NOT NULL DEFAULT '#ffffff',
  `textColor` VARCHAR(50) NOT NULL DEFAULT '#0f172a',
  `headerTitle` VARCHAR(255) NOT NULL DEFAULT 'SharePoint Academy',
  `bgMediaType` VARCHAR(20) NOT NULL DEFAULT 'gradient',
  `bgMediaUrl` LONGTEXT,
  `carousel_json` JSON,
  `layout_json` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ita_theme_settings` (`id`, `primaryColor`, `secondaryColor`, `bgColor`, `cardBg`, `textColor`, `headerTitle`, `bgMediaType`, `bgMediaUrl`, `carousel_json`, `layout_json`) VALUES
(1, '#3b82f6', '#8b5cf6', '#f8fafc', '#ffffff', '#0f172a', 'SharePoint Academy', 'gradient', '',
 '[{"id":"slide1","title":"Master Your SharePoint Workspace","subtitle":"Welcome to the SharePoint Academy, hosted by the IT Department. Elevate your collaboration, design stunning intranets, and manage files securely.","image":"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80","buttonText":"View Courses","buttonUrl":"/catalog"}]',
 '["hero","quickLinks","news","team","courses","resources","events","progress"]');

-- --------------------------------------------------------
-- Table: ita_custom_containers
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ita_custom_containers`;
CREATE TABLE `ita_custom_containers` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` TEXT,
  `type` VARCHAR(50) NOT NULL DEFAULT 'info_card',
  `content_json` JSON,
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ita_custom_containers` (`id`, `title`, `subtitle`, `type`, `content_json`, `sort_order`) VALUES
('c_metrics', 'Academy Metrics & Badges', 'Key milestones achieved across teams', 'metrics', '[{"label":"Active Learners","value":"1,240 enrolled"},{"label":"Certificates Issued","value":"482 this month"},{"label":"Lab Rating","value":"4.9 / 5.0 ★"}]', 1);
