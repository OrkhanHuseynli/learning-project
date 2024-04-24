select name, setting from pg_setting where category = 'File locations';
select name, context, unit, setting, boot_val, reset_val from "ed-ca".pg_catalog.pg_settings
where name IN ('listen_addresses', 'max_connections', 'shared_buffers', 'effective_cache_size',
               'work_mem', 'maintenance_work_mem')
order by context, name;


/* Retrieve a listing of recent conns and process IDs
 */

select * from pg_catalog.pg_stat_activity order by backend_start desc;


/*
 --------------------------------------
            ROLES AND PRIVELEGES
 --------------------------------------
 */
create role royalty inherit;
create role eli;
grant royalty to eli;


create database mydb;
create schema welsh_chronicles;
create role welsh_chronicles;
create schema scotland;
create role scotland;

grant all on SCHEMA scotland to scotland;
grant all on SCHEMA welsh_chronicles to welsh_chronicles;

show search_path;
select user;
alter database mydb SET search_path='"$user", public';
show search_path;

/* this will create tables in welsh_chronicles schema only
   as the current role is set for welsh_chronicles
 */
set role welsh_chronicles;
create table country (
    name varchar(400)
)
/* this will create tables in welsh_chronicles schema only
   as the current role is set for welsh_chronicles
 */
set role scotland;
create table map_shapes (name varchar(400))
create table country (
    name varchar(400)
)

/* this will create tables in welsh_chronicles schema only
   as the current role is set for welsh_chronicles
 */

set role scotland;
insert into country (name) values ('usa');

select * from scotland.country;


/*
     to grant priveleges to all roles
     use alias PUBLIC :


     GRANT USAGE ON SCHEMA my_schema TO PUBLIC

 */


/*
 --------------------------------------
         EXTENSIONS
 --------------------------------------
 */

select name, installed_version, left(comment, 30) as comment
from pg_available_extensions where installed_version IS NOT NULL;


/*
  check available extensions
 */
select * from pg_available_extensions order by name;


/*
    installing extension
 */

create extension fuzzystrmatch schema public;
CREATE EXTENSION btree_gist;


/*
   concat columns into one as a result
 */

select  STRING_AGG(schemaname || '-' || tablename) as schema_table, tableowner from pg_tables limit 10;

select version();

/*
 ----------------------------------------------
 ----------------- DATA TYPES -----------------
  ----------------------------------------------
 */

CREATE TABLE families_j (id serial PRIMARY KEY, profile json);
INSERT INTO families_j (profile) VALUES ('{"name": "Gomez", "members": [{"member": {"relation": "padre", "name": "Alex"}}, {"member": {"relation": "madre", "name": "Sonia"}}]}')
select json_extract_path_text(profile, 'name') as familiy,
       json_extract_path_text(json_array_elements(json_extract_path(profile, 'members') ),'member', 'name')
                                               AS memeber FROM  families_j;




/*
 ----------------- Tables are custom DATA TYPES -----------------
 */
CREATE table employees(id integer primary key, name varchar(300), title varchar(500));
CREATE TABLE department (id integer PRIMARY KEY , name varchar(300), employees employees[]);
INSERT INTO employees VALUES (1, 'Gregor', 'engineer'), (2, 'Michael', 'engineer'), (3, 'Abe', 'tester'), (4, 'Rose', 'QA'), (5, 'Soshi', 'tester'), (6, 'Arbi', 'QA');
INSERT INTO department VALUES (1, 'engineering', ARRAY(SELECT e FROM employees e where title = 'engineer'));
SELECT * FROM department;
delete from employees where name='Gregor';
select * from employees;
INSERT INTO department VALUES (2, 'QA dept', ARRAY[ROW(8, 'Met', 'QA')::employees, ROW(9, 'Obi', 'QA')::employees]);
select * from employees;
select * from department;

/*
 ----------------- Building Custom DATA TYPES -----------------
 */

create type complex_number as (r double precision, i double precision);
create table circuits (circuit_id serial PRIMARY KEY, ac_volt complex_number);
insert into circuits values (1, (2.001, 3.004));
select * from circuits;
select (ac_volt).i from circuits;


/*
 ----------------- Querying composite types -----------------
 */

CREATE TYPE complex AS (r double precision,   i double precision);

DROP TABLE IF EXISTS on_hand;
DROP TYPE IF EXISTS item_quality;
DROP TYPE IF EXISTS inventory_item;

CREATE TYPE item_quality AS (id varchar(400), status varchar(500));
CREATE TYPE inventory_item AS (
                                  name            text,
                                  supplier_id     integer,
                                  price           numeric,
                                  quality item_quality
                              );

CREATE TABLE on_hand (
                         item      inventory_item,
                         count     integer,
                         delivery_id integer,
                         postal_code text
);

INSERT INTO on_hand VALUES (ROW('fuzzy dice', 42, 1.99, ROW('aaaa1', 'sold')), 1000, 4, 'M1P Z3P'),
                           (ROW('memory', 55, 0.9,  ROW('bbbbb', 'purchased')), 400, 4, 'M1P P3P'),
                           (ROW('comma', 33, 3.9,  ROW('ccccc', 'sold')), 200, 5, 'A5S P1S'),
                           (ROW('cobe dice', 42, 1.99,  ROW('zzzz', 'purchased')), 777, 9, 'M1P E2R'),
                           (ROW('rabo', 55, 0.9,  ROW('vvvvv', 'sold')), 300, 9, 'A5S K43'),
                           (ROW('memo', 33, 3.9,  ROW('eeeee', 'ordered')), 999, 1, 'L3M K43');

select * from on_hand where (on_hand.item).name = 'memory';
select * from on_hand where ((on_hand.item).quality).status = 'sold';

select json_agg(f) as items_on_hand from (
                                             select * from on_hand
                                         ) as f;


select * from on_hand;

/*
  JSON data
 */
drop table if exists sample_table;
create table sample_table (json_data jsonb);
insert into sample_table
values
    ('{ "year": "2011", "make":"Toyota", "model":"Camry",  "misc": {"color": "Gray", "doors": "4",  "description": "nice 4x4 car with windows"}}'),
    ('{ "year": "2017", "make":"Honda", "model":"Civic", "misc": {"color": "White", "doors": "4",  "description": "grey car; refurbished"}}'),
    ('{ "year": "2017", "make":"Toyota", "model":"Camry", "misc": {"color": "Red", "doors": "2",  "description": "damaged but in good condition"}}'),
    ('{ "year": "2023", "make":"Honda", "model":"Accord"}'),
    ('{ "year": "1908", "make":"Ford", "model":"T", "misc": {"doors": "2", "description": "in good condition; can be purchased via e-transfer"}}');

select * from sample_table;
select json_data -> 'make' as make from sample_table;
select json_data -> 'misc' -> 'color' as color from sample_table;
select json_data -> 'make' as make from sample_table;
select json_data #> Array['misc','color'] as color from sample_table;
select * from sample_table where json_data #> Array['misc', 'doors'] ? '4';
select * from sample_table where json_data -> 'make' ?| Array['Toyota','Honda'];
select * from sample_table where json_data -> 'misc' ?& Array['color', 'doors'];
select * from sample_table where json_data @> '{"make": "Toyota"}';
select * from sample_table where json_data @> '{"misc": {"color":"Red", "doors":"2"}}';
select * from sample_table where '{"misc": {"color":"Red", "doors":"2"}}' <@ json_data;
/*
The ->> Operator
Now, as I said before, this isn't giving us text values. These quotations are an indicator that ->is returning JSON.
In order to grab the text value we need to use the ->> (Double Stabby) operator. This is equivalent to adding ::text
afterwards, typecasting it to a text.
 */
select json_data -> 'misc' ->> 'color' as color from sample_table;
select json_data  #>> Array['misc','color'] as color from sample_table;
select json_data ->> 'make' as make, json_data #>> Array['misc','color'] as color from sample_table;


/*
 ----------------- Window functions -----------------
 */

select delivery_id, AVG(count) OVER(PARTITION BY delivery_id) as count_avg FROM on_hand;
select delivery_id, AVG((item).price) OVER(PARTITION BY delivery_id) as sup_price_avg FROM on_hand;
select postal_code, delivery_id, AVG((item).price) OVER(PARTITION BY postal_code) as sup_price_avg FROM on_hand;
select  left(postal_code,3) as area_code, postal_code, delivery_id, AVG((item).price) OVER(PARTITION BY left(postal_code,3)) as sup_price_avg FROM on_hand;
select  left(postal_code,3) as area_code, (item).price as item_price, delivery_id, dense_rank() OVER(PARTITION BY left(postal_code,3) order BY (item).price) as dense_rank FROM on_hand;

/*
----------------------------------------------------
------------ Common Table Expressions --------------
----------------------------------------------------
 */

WITH cte AS (
    select (item).name as item_name, delivery_id, postal_code from on_hand
) select item_name, postal_code FROM cte where left(postal_code, 3) = 'M1P';

/*  you can stud as many cte as you and also reference preceding cte */

WITH cte AS (
    select (item).name as item_name, delivery_id, postal_code from on_hand
    ),
     cte2 AS(
         select item_name, postal_code from cte
     )
select item_name, postal_code FROM cte2 where left(postal_code, 3) = 'M1P';


/*
  Recursive CTE
  example is taken from https://mariadb.com/kb/en/recursive-common-table-expressions-overview
 */

drop table if exists folks;
create table folks (id numeric, name text, father numeric, mother numeric);
insert into folks values (100, 'Alex', 20, 30), (20, 'John', Null, 50),  (30, 'Alice', Null, Null),
                         (50, 'Mary', Null, Null), (99, 'Susan', 44, 55),(77, 'Jeremy', Null, 33);

select * from folks;


with recursive ancestors as (
    select * from folks
    where name = 'Alex'
    union
    select f.* from folks as f, ancestors AS a
    where f.id = a.father or f.id = a.mother
) select * from ancestors;


/*
 Laterals
 */

DROP TABLE if exists students;
DROP TABLE if exists courses;

CREATE TABLE students (student_id INT, name VARCHAR);
INSERT INTO students (student_id, name) VALUES (1, 'Collin'), (2, 'Ramsey'), (5, 'Maple');


CREATE TABLE courses (course_ID INT, course_name VARCHAR, stu_Allocated_course_ID INT, project_names text);
INSERT INTO courses (course_ID,course_name,stu_Allocated_course_ID,project_names) VALUES
                                                                                      (111,'Machine Learning',1,'Face detector'),
                                                                                      (112,'Big data',1,'Traffic control'),
                                                                                      (112,'Big data',55,'Traffic control'),
                                                                                      (113,'Cloud Computing',2,'Web application');

select * from courses;

select * from students as s inner join courses as c ON s.student_id = c.stu_Allocated_course_ID;
SELECT * FROM students AS s, LATERAL (SELECT * FROM courses AS c WHERE c.stu_Allocated_course_ID = s.student_id) AS iv2
ORDER BY course_ID;


/*
----------------------------------------------------
----------------- Inherited Tables -----------------
----------------------------------------------------
 */
create table contractors (primary key(id), contract text, duration int) inherits(employees);
create index idx_contractors_name_contract on contractors USING btree(name, contract);
alter table contractors ADD constraint chk_duration CHECK(duration >= 3::int AND duration < 6);

select * from contractors;

insert into contractors values (1, 'Jason', 'expert', 'this is the title of contract', 5);
select * from contractors;
select * from employees; /* will contain contractors too) */
insert into contractors values (2, 'Albi', 'expert', 'this is the title of contract', 10); /* will fail due to check violations" */
insert into contractors values (33, 'Jason', 'expert', 'this is the title of contract', 5);
INSERT INTO employees VALUES (33, 'Samuel', 'engineer');

select from employees;

/*
 ----------------------------------------------
 ----------------- Constraints -----------------
  ----------------------------------------------
 */

 /*
   ------------- Exclusion Constraints --------------
   pre-requisite `CREATE EXTENSION btree_gist;`
  */

create table schedules(id serial primary key, room smallint, time_slot tstzrange);
alter table  schedules add constraint ex_schedules EXCLUDE USING gist (room WITH =, time_slot WITH &&);

insert into schedules values (1, 10, '["2017-05-05 19:00:00+02","2017-05-05 21:00:00+02")'::tstzrange);
insert into schedules values (2, 10, '["2017-05-05 20:00:00+02","2017-05-05 21:00:00+02")'::tstzrange); /* should not pass */
insert into schedules values (2, 10, '["2017-05-05 22:00:00+02","2017-05-05 23:00:00+02")'::tstzrange); /* should  pass */
select * from schedules;




/*
  ------------- Exclusion Index --------------
 */

select * from employees;
create index idx_1 on employees using btree( name text_pattern_ops);
create index idx_2 on employees using btree( name);
create index idx_4 on employees using btree( name text_ops);
create index idx_contractors_duration_ on contractors using btree(duration);
create index idx_name_duration on contractors using btree(name, duration);


explain analyze select * from employees where name like 'S__e_';
explain analyze select * from employees where name = 'Samuel';

explain analyze select * from contractors where duration > 3 AND duration < 6;
explain analyze select * from contractors where name like 'S__e_' AND duration > 3 AND duration < 6;
explain analyze select * from contractors where name = 'Samuel' AND duration > 3 AND duration < 6;
