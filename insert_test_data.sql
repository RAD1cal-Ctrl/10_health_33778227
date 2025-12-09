USE health;

INSERT INTO users (username, first_name, last_name, email, hashed_password, role) VALUES
('gold', 'Gold', 'User', 'gold@example.com', '$2b$10$sIXi4jHcyppECTO2usM2uuNegEDySNq1PjUZN.v.5uEc/P7QynHpW', 'user');

INSERT INTO workouts (user_id, workout_date, type, duration_minutes, intensity, notes) VALUES
(1, '2025-01-01', 'Running', 30, 'medium', 'New Year run'),
(1, '2025-01-02', 'Gym', 45, 'high', 'Upper body'),
(1, '2025-01-03', 'Walking', 60, 'low', 'Evening walk with friends');
