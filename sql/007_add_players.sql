CREATE TABLE player (
	id INTEGER,
	first_name TEXT,
	last_name TEXT,
	rating_ovr INTEGER,
	team_id INTEGER,
	CONSTRAINT pk_player PRIMARY KEY (id),
	CONSTRAINT fk_player_team
		FOREIGN KEY (team_id)
		REFERENCES team (id)
);

/*
Add data
Source: the Google Sheet called "Player Names"
*/

INSERT INTO player (id, first_name, last_name, rating_ovr, team_id) VALUES
(1, 'Sam', 'Murphy', 57, 1),
(2, 'Ryan', 'Harper', 60, 1),
(3, 'Adison', 'Barnes', 90, 1),
(4, 'Alford', 'Martin', 58, 1),
(5, 'Mike', 'Fowler', 99, 1),
(6, 'Spike', 'Roberts', 58, 1),
(7, 'Alexander', 'Payne', 99, 1),
(8, 'Ned', 'Anderson', 63, 1),
(9, 'Eric', 'Moore', 73, 1),
(10, 'Max', 'Carroll', 97, 1),
(11, 'Rafael', 'West', 52, 2),
(12, 'Oscar', 'Murray', 59, 2),
(13, 'Edgar', 'Thompson', 63, 2),
(14, 'Byron', 'Cole', 53, 2),
(15, 'Arnold', 'Martin', 58, 2),
(16, 'Miller', 'Cunningham', 77, 2),
(17, 'Ryan', 'Hamilton', 75, 2),
(18, 'Edward', 'Walker', 99, 2),
(19, 'Maximilian', 'Hawkins', 76, 2),
(20, 'Eddy', 'Campbell', 52, 2),
(21, 'Kellan', 'Harrison', 64, 3),
(22, 'Jared', 'Kelly', 66, 3),
(23, 'Walter', 'Mitchell', 68, 3),
(24, 'Daniel', 'Henderson', 88, 3),
(25, 'Arnold', 'Adams', 90, 3),
(26, 'Henry', 'Brown', 68, 3),
(27, 'Eric', 'Gray', 87, 3),
(28, 'Haris', 'Moore', 64, 3),
(29, 'Dexter', 'Parker', 82, 3),
(30, 'Rafael', 'Casey', 95, 3),
(31, 'Dainton', 'Allen', 66, 4),
(32, 'David', 'Perkins', 65, 4),
(33, 'Patrick', 'Elliott', 60, 4),
(34, 'Clark', 'Brooks', 77, 4),
(35, 'Freddie', 'Reed', 73, 4),
(36, 'Frederick', 'Parker', 73, 4),
(37, 'James', 'Wilson', 71, 4),
(38, 'Edgar', 'Richards', 61, 4),
(39, 'Eddy', 'Parker', 50, 4),
(40, 'Frederick', 'Alexander', 56, 4),
(41, 'Aston', 'Ross', 92, 5),
(42, 'Kellan', 'Myers', 50, 5),
(43, 'Frederick', 'Mitchell', 81, 5),
(44, 'Miller', 'Casey', 61, 5),
(45, 'Paul', 'Kelly', 89, 5),
(46, 'Tyler', 'Clark', 95, 5),
(47, 'Bruce', 'Gibson', 68, 5),
(48, 'Jordan', 'Johnson', 98, 5),
(49, 'James', 'Smith', 63, 5),
(50, 'Rafael', 'Hamilton', 80, 5),
(51, 'Maximilian', 'Robinson', 72, 6),
(52, 'Lyndon', 'Harrison', 60, 6),
(53, 'Frederick', 'Evans', 89, 6),
(54, 'Dale', 'Bennett', 77, 6),
(55, 'Haris', 'Morrison', 90, 6),
(56, 'Oscar', 'Farrell', 53, 6),
(57, 'Robert', 'West', 82, 6),
(58, 'Carl', 'Foster', 61, 6),
(59, 'Dale', 'Williams', 71, 6),
(60, 'Arthur', 'Hawkins', 64, 6),
(61, 'Fenton', 'Allen', 93, 7),
(62, 'Fenton', 'Cooper', 98, 7),
(63, 'Reid', 'Elliott', 79, 7),
(64, 'Alford', 'Douglas', 74, 7),
(65, 'Alexander', 'Holmes', 63, 7),
(66, 'Rafael', 'Barrett', 82, 7),
(67, 'Miller', 'Campbell', 61, 7),
(68, 'Edgar', 'Richardson', 88, 7),
(69, 'Victor', 'Montgomery', 60, 7),
(70, 'Garry', 'Morrison', 75, 7),
(71, 'Garry', 'Scott', 96, 8),
(72, 'Eric', 'Barrett', 62, 8),
(73, 'Ryan', 'Russell', 96, 8),
(74, 'Justin', 'Lloyd', 61, 8),
(75, 'Edwin', 'Morris', 90, 8),
(76, 'Rafael', 'Robinson', 91, 8),
(77, 'Spike', 'Farrell', 70, 8),
(78, 'Antony', 'Ellis', 56, 8),
(79, 'Reid', 'Hunt', 79, 8),
(80, 'George', 'Martin', 51, 8),
(81, 'Julian', 'Ellis', 69, 9),
(82, 'Albert', 'Reed', 66, 9),
(83, 'Arnold', 'Warren', 50, 9),
(84, 'Andrew', 'Brown', 61, 9),
(85, 'Abraham', 'Stevens', 73, 9),
(86, 'Kristian', 'Martin', 73, 9),
(87, 'Alford', 'Scott', 95, 9),
(88, 'Tyler', 'Crawford', 75, 9),
(89, 'Antony', 'Morrison', 77, 9),
(90, 'Carlos', 'Lloyd', 71, 9),
(91, 'Aldus', 'Watson', 85, 10),
(92, 'George', 'Smith', 95, 10),
(93, 'Rafael', 'Adams', 97, 10),
(94, 'Edgar', 'Riley', 60, 10),
(95, 'Preston', 'Morrison', 50, 10),
(96, 'Jacob', 'Gibson', 51, 10),
(97, 'Frederick', 'Cameron', 85, 10),
(98, 'Blake', 'Barnes', 59, 10),
(99, 'Paul', 'Barnes', 61, 10),
(100, 'Arthur', 'Morgan', 59, 10),
(101, 'Tyler', 'Davis', 81, 11),
(102, 'Ashton', 'Alexander', 61, 11),
(103, 'Abraham', 'Holmes', 69, 11),
(104, 'Lucas', 'Ross', 76, 11),
(105, 'Reid', 'Bennett', 56, 11),
(106, 'Garry', 'West', 96, 11),
(107, 'Wilson', 'Sullivan', 64, 11),
(108, 'Marcus', 'Brown', 93, 11),
(109, 'Lucas', 'Jones', 72, 11),
(110, 'Bruce', 'Scott', 71, 11),
(111, 'Ryan', 'Carroll', 60, 12),
(112, 'Edwin', 'Crawford', 50, 12),
(113, 'Adam', 'Cole', 91, 12),
(114, 'Paul', 'Ellis', 91, 12),
(115, 'John', 'Dixon', 61, 12),
(116, 'Alen', 'Douglas', 92, 12),
(117, 'Wilson', 'Taylor', 58, 12),
(118, 'Ryan', 'Harris', 71, 12),
(119, 'Alexander', 'Cole', 84, 12),
(120, 'Aston', 'Thompson', 75, 12),
(121, 'Ryan', 'Johnson', 65, 13),
(122, 'Jack', 'Rogers', 95, 13),
(123, 'Bruce', 'Harrison', 92, 13),
(124, 'Dominik', 'Adams', 86, 13),
(125, 'Dominik', 'Moore', 57, 13),
(126, 'John', 'Mitchell', 62, 13),
(127, 'Leonardo', 'Murray', 99, 13),
(128, 'Ryan', 'Perry', 88, 13),
(129, 'James', 'Tucker', 79, 13),
(130, 'Antony', 'Gibson', 54, 13),
(131, 'Ryan', 'Richards', 63, 14),
(132, 'Kelvin', 'Richardson', 54, 14),
(133, 'Jack', 'Spencer', 59, 14),
(134, 'Martin', 'Dixon', 85, 14),
(135, 'Vincent', 'Montgomery', 51, 14),
(136, 'Ted', 'Spencer', 59, 14),
(137, 'Alen', 'Ryan', 81, 14),
(138, 'Clark', 'Edwards', 71, 14),
(139, 'Kelvin', 'Miller', 78, 14),
(140, 'Lucas', 'Stevens', 76, 14),
(141, 'Alan', 'Johnson', 67, 15),
(142, 'Alexander', 'Murphy', 69, 15),
(143, 'Spike', 'Tucker', 61, 15),
(144, 'Alan', 'Armstrong', 55, 15),
(145, 'Tyler', 'Evans', 68, 15),
(146, 'Wilson', 'Hill', 95, 15),
(147, 'Andrew', 'Taylor', 66, 15),
(148, 'Michael', 'Murphy', 89, 15),
(149, 'Lyndon', 'Morrison', 67, 15),
(150, 'Wilson', 'Stewart', 53, 15),
(151, 'Frederick', 'Gibson', 66, 16),
(152, 'Tyler', 'Taylor', 56, 16),
(153, 'Tyler', 'Wells', 88, 16),
(154, 'Tony', 'Henderson', 89, 16),
(155, 'Roland', 'Morris', 53, 16),
(156, 'Aston', 'Hamilton', 65, 16),
(157, 'Wilson', 'Russell', 76, 16),
(158, 'Aiden', 'Wells', 58, 16),
(159, 'Byron', 'Hamilton', 69, 16),
(160, 'Kevin', 'Perkins', 95, 16),
(161, 'Kevin', 'Hall', 65, 17),
(162, 'Owen', 'Hall', 52, 17),
(163, 'Aldus', 'Williams', 63, 17),
(164, 'Charlie', 'Farrell', 59, 17),
(165, 'Ryan', 'Ferguson', 91, 17),
(166, 'Roman', 'Gray', 85, 17),
(167, 'James', 'Barrett', 52, 17),
(168, 'Elian', 'Brown', 62, 17),
(169, 'Nicholas', 'Baker', 67, 17),
(170, 'Garry', 'Higgins', 70, 17),
(171, 'John', 'Morrison', 84, 18),
(172, 'Harold', 'Kelley', 66, 18),
(173, 'Thomas', 'Montgomery', 67, 18),
(174, 'Eric', 'Jones', 80, 18),
(175, 'Ryan', 'Phillips', 61, 18),
(176, 'Adrian', 'Harper', 97, 18),
(177, 'Ned', 'Spencer', 51, 18),
(178, 'Jared', 'Mitchell', 74, 18),
(179, 'Henry', 'Walker', 91, 18),
(180, 'Martin', 'Grant', 71, 18),
(181, 'Lyndon', 'Martin', 54, 19),
(182, 'Frederick', 'Cooper', 66, 19),
(183, 'Brad', 'Hunt', 64, 19),
(184, 'Ted', 'Cameron', 70, 19),
(185, 'Antony', 'Brooks', 70, 19),
(186, 'Alan', 'Farrell', 68, 19),
(187, 'Dale', 'Hall', 95, 19),
(188, 'Victor', 'Watson', 87, 19),
(189, 'Edward', 'Barnes', 57, 19),
(190, 'Tyler', 'Payne', 66, 19),
(191, 'Aiden', 'Montgomery', 52, 20),
(192, 'Lyndon', 'Alexander', 96, 20),
(193, 'Charlie', 'Allen', 77, 20),
(194, 'Kristian', 'Turner', 98, 20),
(195, 'George', 'Ross', 95, 20),
(196, 'Elian', 'Watson', 54, 20),
(197, 'Andrew', 'Wright', 77, 20),
(198, 'Eric', 'Edwards', 93, 20),
(199, 'Ryan', 'Montgomery', 52, 20),
(200, 'Ryan', 'Howard', 76, 20),
(201, 'Byron', 'Fowler', 57, 21),
(202, 'Lyndon', 'Ferguson', 63, 21),
(203, 'Kristian', 'Ross', 58, 21),
(204, 'Oliver', 'Walker', 72, 21),
(205, 'Tony', 'Robinson', 63, 21),
(206, 'James', 'Wright', 97, 21),
(207, 'Clark', 'Cunningham', 70, 21),
(208, 'Daniel', 'Lloyd', 62, 21),
(209, 'David', 'Sullivan', 74, 21),
(210, 'Harold', 'Miller', 89, 21),
(211, 'Kelvin', 'Williams', 88, 22),
(212, 'Martin', 'Andrews', 99, 22),
(213, 'Jacob', 'Warren', 64, 22),
(214, 'Roland', 'Tucker', 77, 22),
(215, 'Carlos', 'Hill', 89, 22),
(216, 'Dominik', 'Bailey', 84, 22),
(217, 'Roland', 'Richardson', 69, 22),
(218, 'Victor', 'Hawkins', 52, 22),
(219, 'Marcus', 'Thompson', 94, 22),
(220, 'Tony', 'Roberts', 79, 22),
(221, 'Ned', 'Payne', 85, 23),
(222, 'Walter', 'Casey', 65, 23),
(223, 'Sawyer', 'Hawkins', 69, 23),
(224, 'Ashton', 'Mitchell', 50, 23),
(225, 'Clark', 'Perry', 74, 23),
(226, 'Aldus', 'Thompson', 51, 23),
(227, 'Thomas', 'Adams', 73, 23),
(228, 'Lyndon', 'Cole', 97, 23),
(229, 'Bruce', 'Smith', 65, 23),
(230, 'Andrew', 'Casey', 77, 23),
(231, 'Oliver', 'Hall', 52, 24),
(232, 'Paul', 'Reed', 82, 24),
(233, 'Lyndon', 'Cunningham', 70, 24),
(234, 'Steven', 'Foster', 90, 24),
(235, 'Carl', 'Morris', 55, 24),
(236, 'Fenton', 'Harper', 56, 24),
(237, 'Lyndon', 'Clark', 90, 24),
(238, 'Jacob', 'Jones', 61, 24),
(239, 'David', 'Barrett', 99, 24),
(240, 'Abraham', 'Henderson', 87, 24),
(241, 'Walter', 'Ellis', 51, 25),
(242, 'Marcus', 'Chapman', 96, 25),
(243, 'Nicholas', 'Elliott', 59, 25),
(244, 'Andrew', 'Bailey', 91, 25),
(245, 'Eddy', 'Cooper', 57, 25),
(246, 'Clark', 'Morrison', 94, 25),
(247, 'Thomas', 'Hunt', 72, 25),
(248, 'Daniel', 'Scott', 74, 25),
(249, 'Henry', 'Clark', 73, 25),
(250, 'Kellan', 'Watson', 88, 25),
(251, 'David', 'Riley', 58, 26),
(252, 'Michael', 'Cunningham', 50, 26),
(253, 'Stuart', 'Baker', 61, 26),
(254, 'Harold', 'Hill', 55, 26),
(255, 'Leonardo', 'Taylor', 74, 26),
(256, 'Dominik', 'Ross', 73, 26),
(257, 'Owen', 'Brown', 63, 26),
(258, 'James', 'Allen', 83, 26),
(259, 'David', 'Payne', 97, 26),
(260, 'Roman', 'Anderson', 73, 26),
(261, 'Miller', 'Elliott', 98, 27),
(262, 'Ryan', 'Davis', 96, 27),
(263, 'George', 'Cameron', 87, 27),
(264, 'Dainton', 'Douglas', 76, 27),
(265, 'Lyndon', 'Roberts', 84, 27),
(266, 'Alexander', 'Harper', 60, 27),
(267, 'Roland', 'Hill', 91, 27),
(268, 'Preston', 'Henderson', 75, 27),
(269, 'Clark', 'Hill', 92, 27),
(270, 'Andrew', 'Ferguson', 52, 27),
(271, 'Wilson', 'Scott', 87, 28),
(272, 'Alford', 'Murphy', 67, 28),
(273, 'Albert', 'Ryan', 75, 28),
(274, 'Stuart', 'Miller', 77, 28),
(275, 'Adrian', 'Thomas', 98, 28),
(276, 'Roland', 'Murray', 50, 28),
(277, 'Justin', 'Wells', 94, 28),
(278, 'Carlos', 'Barnes', 52, 28),
(279, 'Ryan', 'Harris', 61, 28),
(280, 'Edgar', 'Harper', 72, 28),
(281, 'Albert', 'Barnes', 76, 29),
(282, 'William', 'Hunt', 75, 29),
(283, 'Clark', 'Farrell', 88, 29),
(284, 'Ted', 'Harrison', 57, 29),
(285, 'Victor', 'Gibson', 55, 29),
(286, 'Stuart', 'Douglas', 84, 29),
(287, 'Clark', 'Payne', 68, 29),
(288, 'David', 'Cunningham', 84, 29),
(289, 'Lucas', 'Riley', 78, 29),
(290, 'Alan', 'Mason', 55, 29),
(291, 'Roland', 'Hawkins', 78, 30),
(292, 'Edward', 'Carter', 52, 30),
(293, 'Clark', 'Johnson', 91, 30),
(294, 'Preston', 'Ferguson', 56, 30),
(295, 'James', 'Ferguson', 56, 30),
(296, 'Fenton', 'Reed', 90, 30),
(297, 'Henry', 'Alexander', 89, 30),
(298, 'Carl', 'Reed', 59, 30),
(299, 'Carlos', 'Harris', 70, 30),
(300, 'Richard', 'Adams', 85, 30)