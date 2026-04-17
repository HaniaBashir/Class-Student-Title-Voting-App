-- Clean reset for this class-project setup
delete from public.submission_votes;
delete from public.submissions;
delete from public.titles;
delete from public.students;
delete from public.voter_credentials;

-- Students
insert into public.students (roll_number, student_name)
values
  ('211-2710', 'Muhammad Umar Iftikhar'),
  ('221-1502', 'Areeba Naeem'),
  ('221-1532', 'Shiza Najeeb'),
  ('221-1541', 'Ubaid Ur Rehman'),
  ('221-1542', 'Warda Aziz'),
  ('221-2407', 'Syed Hashir Ayaz'),
  ('221-2413', 'Fatima Wajahat'),
  ('221-2415', 'Kashaf Fatima'),
  ('221-2421', 'Muhammad Hassaan Mansur'),
  ('221-2457', 'Maadeha Asif'),
  ('221-2464', 'Husnain Akram'),
  ('221-2466', 'Rubban Iftikhar Ahmed'),
  ('221-2481', 'Anhar Munir'),
  ('221-2504', 'Muhammad Abdullah Iqbal'),
  ('221-2506', 'Hania Bashir'),
  ('221-2518', 'Abdur Rehman'),
  ('221-2534', 'Muhammad Safi Ur Rehman'),
  ('221-2555', 'Syed Haroon Rasheed'),
  ('221-2559', 'Muhammad Bilal Raza Attari'),
  ('221-2560', 'Abdul Moiz Hassan'),
  ('221-2584', 'Esha Riaz'),
  ('221-2623', 'Muhammad Sheryar Ali'),
  ('221-2627', 'Abdullah Tariq'),
  ('221-2629', 'Abdul Faheem'),
  ('221-2632', 'Humair Naseer'),
  ('221-2633', 'Noor Junaina'),
  ('221-2635', 'Syed Muhammad Pasha'),
  ('221-2662', 'Muhammad Hammad Ur Rehman'),
  ('221-2690', 'Muhammad Ahtisham'),
  ('221-2698', 'Muhammad Tayyab'),
  ('221-2705', 'Hassan'),
  ('221-2730', 'Syed Burhan Haider'),
  ('221-2733', 'Maham Imran'),
  ('221-8778', 'Faiz Ur Rahman'),
  ('221-8796', 'Muhammad Usman Ghani'),
  ('221-8799', 'Saif Ur Rehman'),
  ('221-8804', 'Safdar Jan'),
  ('22K-4826', 'Sajad Ahmed');

-- Titles
-- Replace these rows with your final event titles if needed.
insert into public.titles (title_name, display_order, title_type)
values
  ('Best Smile', 1, 'single'),
  ('Most Helpful', 2, 'single'),
  ('Class Comedian', 3, 'single'),
  ('Most Likely to Be CEO', 4, 'single'),
  ('Most Likely to Build a Startup', 5, 'single'),
  ('Best Problem Solver', 6, 'single'),
  ('Most Likely to Survive Production Bugs', 7, 'single'),
  ('Best Dressed', 8, 'single'),
  ('Most Creative Mind', 9, 'single'),
  ('Most Calm Under Pressure', 10, 'single'),
  ('Most Likely to Become a Great Team Lead', 11, 'single'),
  ('Best Presentation Skills', 12, 'single'),
  ('Most Reliable', 13, 'single'),
  ('Quiet Genius', 14, 'single'),
  ('Best Debugger', 15, 'single'),
  ('Most Likely to Become a Researcher', 16, 'single'),
  ('Best Laugh', 17, 'single'),
  ('Best Duo', 18, 'duo'),
  ('Most Likely to Work at Google', 19, 'single'),
  ('Best Collaborator', 20, 'single'),
  ('Future Tech Icon', 21, 'single');

-- Voter credentials
-- Replace placeholder passwords before real use. Emails are generated during export.
insert into public.voter_credentials (roll_number, student_name, voter_password)
values
  ('211-2710', 'Muhammad Umar Iftikhar', 'vote-211-2710'),
  ('221-1502', 'Areeba Naeem', 'vote-221-1502'),
  ('221-1532', 'Shiza Najeeb', 'vote-221-1532'),
  ('221-1541', 'Ubaid Ur Rehman', 'vote-221-1541'),
  ('221-1542', 'Warda Aziz', 'vote-221-1542'),
  ('221-2407', 'Syed Hashir Ayaz', 'vote-221-2407'),
  ('221-2413', 'Fatima Wajahat', 'vote-221-2413'),
  ('221-2415', 'Kashaf Fatima', 'vote-221-2415'),
  ('221-2421', 'Muhammad Hassaan Mansur', 'vote-221-2421'),
  ('221-2457', 'Maadeha Asif', 'vote-221-2457'),
  ('221-2464', 'Husnain Akram', 'vote-221-2464'),
  ('221-2466', 'Rubban Iftikhar Ahmed', 'vote-221-2466'),
  ('221-2481', 'Anhar Munir', 'vote-221-2481'),
  ('221-2504', 'Muhammad Abdullah Iqbal', 'vote-221-2504'),
  ('221-2506', 'Hania Bashir', 'vote-221-2506'),
  ('221-2518', 'Abdur Rehman', 'vote-221-2518'),
  ('221-2534', 'Muhammad Safi Ur Rehman', 'vote-221-2534'),
  ('221-2555', 'Syed Haroon Rasheed', 'vote-221-2555'),
  ('221-2559', 'Muhammad Bilal Raza Attari', 'vote-221-2559'),
  ('221-2560', 'Abdul Moiz Hassan', 'vote-221-2560'),
  ('221-2584', 'Esha Riaz', 'vote-221-2584'),
  ('221-2623', 'Muhammad Sheryar Ali', 'vote-221-2623'),
  ('221-2627', 'Abdullah Tariq', 'vote-221-2627'),
  ('221-2629', 'Abdul Faheem', 'vote-221-2629'),
  ('221-2632', 'Humair Naseer', 'vote-221-2632'),
  ('221-2633', 'Noor Junaina', 'vote-221-2633'),
  ('221-2635', 'Syed Muhammad Pasha', 'vote-221-2635'),
  ('221-2662', 'Muhammad Hammad Ur Rehman', 'vote-221-2662'),
  ('221-2690', 'Muhammad Ahtisham', 'vote-221-2690'),
  ('221-2698', 'Muhammad Tayyab', 'vote-221-2698'),
  ('221-2705', 'Hassan', 'vote-221-2705'),
  ('221-2730', 'Syed Burhan Haider', 'vote-221-2730'),
  ('221-2733', 'Maham Imran', 'vote-221-2733'),
  ('221-8778', 'Faiz Ur Rahman', 'vote-221-8778'),
  ('221-8796', 'Muhammad Usman Ghani', 'vote-221-8796'),
  ('221-8799', 'Saif Ur Rehman', 'vote-221-8799'),
  ('221-8804', 'Safdar Jan', 'vote-221-8804'),
  ('22K-4826', 'Sajad Ahmed', 'vote-22k-4826');
