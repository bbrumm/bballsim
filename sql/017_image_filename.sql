ALTER TABLE team
ADD COLUMN image_filename TEXT;

SELECT * FROM team;

UPDATE team SET image_filename = 'atlanta.png' WHERE id = 1;
UPDATE team SET image_filename = 'boston.png' WHERE id = 2;
UPDATE team SET image_filename = 'brooklyn.png' WHERE id = 3;
UPDATE team SET image_filename = 'charlotte.png' WHERE id = 4;
UPDATE team SET image_filename = 'chicago.png' WHERE id = 5;
UPDATE team SET image_filename = 'cleveland.png' WHERE id = 6;
UPDATE team SET image_filename = 'dallas.png' WHERE id = 7;
UPDATE team SET image_filename = 'denver.png' WHERE id = 8;
UPDATE team SET image_filename = 'detroit.png' WHERE id = 9;
UPDATE team SET image_filename = 'golden_state.png' WHERE id = 10;
UPDATE team SET image_filename = 'houston.png' WHERE id = 11;
UPDATE team SET image_filename = 'indiana.png' WHERE id = 12;
UPDATE team SET image_filename = 'lac.png' WHERE id = 13;
UPDATE team SET image_filename = 'lal.png' WHERE id = 14;
UPDATE team SET image_filename = 'memphis.png' WHERE id = 15;
UPDATE team SET image_filename = 'miami.png' WHERE id = 16;
UPDATE team SET image_filename = 'milwaukee.png' WHERE id = 17;
UPDATE team SET image_filename = 'minnesota.png' WHERE id = 18;
UPDATE team SET image_filename = 'new_orleans.png' WHERE id = 19;
UPDATE team SET image_filename = 'new_york.png' WHERE id = 20;
UPDATE team SET image_filename = 'oklahoma_city.png' WHERE id = 21;
UPDATE team SET image_filename = 'orlando.png' WHERE id = 22;
UPDATE team SET image_filename = 'philadelphia.png' WHERE id = 23;
UPDATE team SET image_filename = 'phoenix.png' WHERE id = 24;
UPDATE team SET image_filename = 'portland.png' WHERE id = 25;
UPDATE team SET image_filename = 'sacramento.png' WHERE id = 26;
UPDATE team SET image_filename = 'san_antonio.png' WHERE id = 27;
UPDATE team SET image_filename = 'toronto.png' WHERE id = 28;
UPDATE team SET image_filename = 'utah.png' WHERE id = 29;
UPDATE team SET image_filename = 'washington.png' WHERE id = 30;