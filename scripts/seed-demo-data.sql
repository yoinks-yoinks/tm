-- Demo Seed Data for Pakistan Audience
-- This script adds sample tasks and tags for demonstration

-- NOTE: Replace 'USER_ID_HERE' with your actual user ID after running
-- You can find your user ID by checking the database or the session

-- Sample Tags (will be inserted for the demo user)
-- Colors: gray, red, orange, yellow, green, teal, blue, indigo, purple, pink

-- Work Tags
INSERT OR IGNORE INTO tag (id, name, color, user_id, created_at) VALUES
('tag_work', 'Work', 'blue', 'USER_ID_HERE', strftime('%s', 'now')),
('tag_personal', 'Personal', 'green', 'USER_ID_HERE', strftime('%s', 'now')),
('tag_urgent', 'Urgent', 'red', 'USER_ID_HERE', strftime('%s', 'now')),
('tag_meeting', 'Meeting', 'purple', 'USER_ID_HERE', strftime('%s', 'now')),
('tag_development', 'Development', 'indigo', 'USER_ID_HERE', strftime('%s', 'now')),
('tag_design', 'Design', 'pink', 'USER_ID_HERE', strftime('%s', 'now')),
('tag_marketing', 'Marketing', 'orange', 'USER_ID_HERE', strftime('%s', 'now')),
('tag_finance', 'Finance', 'teal', 'USER_ID_HERE', strftime('%s', 'now')),
('tag_hr', 'HR', 'yellow', 'USER_ID_HERE', strftime('%s', 'now')),
('tag_client', 'Client', 'gray', 'USER_ID_HERE', strftime('%s', 'now'));

-- Sample Tasks for Pakistan Tech Demo
-- Status: todo, in_progress, completed
-- Priority: low, medium, high, urgent

-- Completed Tasks
INSERT OR IGNORE INTO task (id, title, description, status, priority, due_date, user_id, created_at, updated_at) VALUES
('task_01', 'Complete NUST Project Proposal', 'Finalize the project proposal for NUST university collaboration on AI research', 'completed', 'high', strftime('%s', 'now', '-2 days'), 'USER_ID_HERE', strftime('%s', 'now', '-7 days'), strftime('%s', 'now')),
('task_02', 'Submit PSX Financial Report', 'Submit quarterly financial report to Pakistan Stock Exchange', 'completed', 'urgent', strftime('%s', 'now', '-1 day'), 'USER_ID_HERE', strftime('%s', 'now', '-14 days'), strftime('%s', 'now')),
('task_03', 'Review Karachi Office Budget', 'Review and approve budget allocation for Karachi regional office', 'completed', 'medium', strftime('%s', 'now', '-3 days'), 'USER_ID_HERE', strftime('%s', 'now', '-10 days'), strftime('%s', 'now')),
('task_04', 'Launch JazzCash Integration', 'Complete mobile payment integration with JazzCash API', 'completed', 'high', strftime('%s', 'now', '-5 days'), 'USER_ID_HERE', strftime('%s', 'now', '-21 days'), strftime('%s', 'now')),
('task_05', 'Finalize Lahore Team Hiring', 'Complete hiring process for 5 developers in Lahore office', 'completed', 'medium', strftime('%s', 'now', '-4 days'), 'USER_ID_HERE', strftime('%s', 'now', '-30 days'), strftime('%s', 'now'));

-- In Progress Tasks
INSERT OR IGNORE INTO task (id, title, description, status, priority, due_date, user_id, created_at, updated_at) VALUES
('task_06', 'Develop Easypaisa Payment Module', 'Build and test Easypaisa payment gateway integration for e-commerce platform', 'in_progress', 'high', strftime('%s', 'now', '+3 days'), 'USER_ID_HERE', strftime('%s', 'now', '-5 days'), strftime('%s', 'now')),
('task_07', 'Design Islamabad Conference Banner', 'Create promotional materials for Pakistan Tech Summit in Islamabad', 'in_progress', 'medium', strftime('%s', 'now', '+5 days'), 'USER_ID_HERE', strftime('%s', 'now', '-3 days'), strftime('%s', 'now')),
('task_08', 'Update SECP Compliance Documents', 'Review and update all Securities and Exchange Commission compliance paperwork', 'in_progress', 'urgent', strftime('%s', 'now', '+1 day'), 'USER_ID_HERE', strftime('%s', 'now', '-2 days'), strftime('%s', 'now')),
('task_09', 'Prepare Peshawar Branch Expansion Plan', 'Draft business case for new branch in Peshawar region', 'in_progress', 'medium', strftime('%s', 'now', '+7 days'), 'USER_ID_HERE', strftime('%s', 'now', '-4 days'), strftime('%s', 'now')),
('task_10', 'Coordinate with PTA for License Renewal', 'Work with Pakistan Telecommunication Authority for service license renewal', 'in_progress', 'high', strftime('%s', 'now', '+2 days'), 'USER_ID_HERE', strftime('%s', 'now', '-1 day'), strftime('%s', 'now'));

-- Todo Tasks
INSERT OR IGNORE INTO task (id, title, description, status, priority, due_date, user_id, created_at, updated_at) VALUES
('task_11', 'Schedule Meeting with PITB Team', 'Arrange meeting with Punjab Information Technology Board for smart city project', 'todo', 'high', strftime('%s', 'now', '+4 days'), 'USER_ID_HERE', strftime('%s', 'now', '-1 day'), strftime('%s', 'now')),
('task_12', 'Review Faisalabad Factory Automation', 'Evaluate automation proposals for textile manufacturing unit', 'todo', 'medium', strftime('%s', 'now', '+10 days'), 'USER_ID_HERE', strftime('%s', 'now'), strftime('%s', 'now')),
('task_13', 'Update Pakistan Market Analysis Report', 'Refresh quarterly market analysis for investors', 'todo', 'medium', strftime('%s', 'now', '+14 days'), 'USER_ID_HERE', strftime('%s', 'now'), strftime('%s', 'now')),
('task_14', 'Plan Multan Office Team Building', 'Organize team building event for Multan regional team', 'todo', 'low', strftime('%s', 'now', '+21 days'), 'USER_ID_HERE', strftime('%s', 'now'), strftime('%s', 'now')),
('task_15', 'Implement FBR Tax Calculation Module', 'Build Federal Board of Revenue tax calculation feature', 'todo', 'urgent', strftime('%s', 'now', '+2 days'), 'USER_ID_HERE', strftime('%s', 'now'), strftime('%s', 'now')),
('task_16', 'Prepare Rawalpindi Office Lease Agreement', 'Review and finalize office space lease for Rawalpindi expansion', 'todo', 'medium', strftime('%s', 'now', '+8 days'), 'USER_ID_HERE', strftime('%s', 'now'), strftime('%s', 'now')),
('task_17', 'Design Urdu Language Support UI', 'Create RTL (Right-to-Left) interface for Urdu language support', 'todo', 'high', strftime('%s', 'now', '+6 days'), 'USER_ID_HERE', strftime('%s', 'now'), strftime('%s', 'now')),
('task_18', 'Submit NADRA Integration Request', 'Apply for NADRA database integration for identity verification', 'todo', 'high', strftime('%s', 'now', '+3 days'), 'USER_ID_HERE', strftime('%s', 'now'), strftime('%s', 'now'));

-- Task-Tag Relationships
INSERT OR IGNORE INTO task_tag (task_id, tag_id) VALUES
-- Completed tasks
('task_01', 'tag_work'),
('task_01', 'tag_meeting'),
('task_02', 'tag_finance'),
('task_02', 'tag_urgent'),
('task_03', 'tag_finance'),
('task_04', 'tag_development'),
('task_05', 'tag_hr'),

-- In Progress tasks
('task_06', 'tag_development'),
('task_06', 'tag_client'),
('task_07', 'tag_design'),
('task_07', 'tag_marketing'),
('task_08', 'tag_finance'),
('task_08', 'tag_urgent'),
('task_09', 'tag_work'),
('task_10', 'tag_work'),
('task_10', 'tag_client'),

-- Todo tasks
('task_11', 'tag_meeting'),
('task_11', 'tag_client'),
('task_12', 'tag_work'),
('task_13', 'tag_marketing'),
('task_14', 'tag_personal'),
('task_14', 'tag_hr'),
('task_15', 'tag_development'),
('task_15', 'tag_finance'),
('task_15', 'tag_urgent'),
('task_16', 'tag_work'),
('task_17', 'tag_design'),
('task_17', 'tag_development'),
('task_18', 'tag_development'),
('task_18', 'tag_client');
