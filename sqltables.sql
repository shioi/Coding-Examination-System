create database Exam;
use Exam;
show tables;

create table exams (
id varchar(30) PRIMARY KEY,
name varchar(20),
duration int,
totalMarks int,
password varchar(200),
examstatus varchar(200),
Date datetime
);
desc exams;
ALTER TABLE exams
  ADD COLUMN author varchar(200),
  ADD FOREIGN KEY exams(author) REFERENCES login(registerno);
  
update exams set author="2247102";
select * from exams;


insert into exams values
(101,"Python Programming", 120, 50, "here", "upcoming","2022-03-30 14:00:00");
create table Question (
id varchar(30) PRIMARY KEY,
Question NVARCHAR(8000),
Marks int
);

create table Question(
id varchar(40) PRIMARY KEY,
Question nvarchar(8000)
);
desc Question;
alter table Question modify column Marks INT NOT NULL;

insert into Question values
("2022MCA171CAT1", "You are travelling to an institution situated in Mumbai by flight for taking part in
Hackathon. You happen to meet a person by name “Xia” whose responses were very
limited. Here is how the conversation goes.
Xia answers “Sure” if asked a question such as “How are you?”. He answered
“Whoa, chill out!” if somebody “YELLED AT HIM” (all uppercase). He answered
“Calm down, I know what I’m doing!” if a question was “yelled at you”. He says
“Fine. Be that way!” if addressed without actually saying anything, He answered
“Whatever” to anything else.
Your journey ends, and you felt that the conversation was more like a game!!!
The Hackathon event started saying this is a warm-up session; you can code any
interesting scenario you have come across in the last 48 hours. You also have to
mention few test cases to validate your program. You decided to code the
conversation scene with Xia using python and naming the script as TalkWithXia.
Following are few testcases to help you implement the conversation:");



create table ExamQuestion(
questionId varchar(30),
examId varchar(30),
foreign key(questionId) references Question(id),
foreign key(examId) references exams(id)
);
drop table ExamQuestion;
insert into ExamQuestion values
("2022MCA171CAT1", 101);

select * from exams;

insert into Question values
("2022MCA171CAT12", "
The UScereal data set has been collected from the 1993-ASA Statistical Graphics Exposition,
and is taken from the mandatory F&amp;DA food label. The recorded variables are:
 mfr-Manufacturer, represented by its first initial: G=General Mills, K=Kelloggs,
N=Nabisco, P=Post, Q=Quaker Oats, R=Ralston Purina.
 calories - number of calories in one portion.
 protein - grams of protein in one portion.
 fat - grams of fat in one portion.
 sodium - milligrams of sodium in one portion.
 fibre - grams of dietary fibre in one portion.
 carbo -grams of complex carbohydrates in one portion.
 sugars -grams of sugars in one portion.
 shelf-display shelf (1, 2, or 3, counting from the floor).
 potassium - grams of potassium.
 vitamins-vitamins and minerals (none, enriched, or 100%).

1. Import the given “UScereal.csv” file as dataframe using pandas and perform the
following: (5 X 3 = 15 Marks)
a. How many different manufacturers have participated?
b. Print the name of the cereals whose vitamin values are “None”
c. Display the cereals whose shelf display is 3
d. Which is the cereal with highest carbohydrates. Identify the manufacturer as well.
e. How many cereals calories range between 150 and 200
2. Use appropriate chart for displaying shelf values with respect to the manufacturer (7
Marks)
3. Use appropriate chart to display cereals whose fat is greater than 1.5 (7 Marks)
4. Using bar chart display the number of cereals presented by each manufacturer (6 Marks)
Instructions:
 Upload your python script along with output file
 Use appropriate format for generating chart.
 You are bound by the code of ethics and discipline, do adhere to it.
 Name the files as Reg.No_CAT3.py, Reg.No_CAT3.txt.
");

insert into ExamQuestion values
("2022MCA171CAT12", 101);

select * from Question;

select * from exams;

show tables;

select * from ExamQuestion;

select * from Question where id in (
select questionId from ExamQuestion where examId = 101);

show tables;

desc ExamQuestion;
desc exams;
desc Question;
insert into Question values 
("MCABasic", "Write a program to print the sum of three numbers");

select * from ExamQuestion;

insert into ExamQuestion values
("MCABasic",101);

create table TestCases
(qid VARCHAR(30),
path VARCHAR(100),
FOREIGN KEY(qid) REFERENCES Question(id)
);
desc TestCases;
insert into TestCases
values(101,"MCABasic","MCABasic");

update TestCases set path="../../testCases/MCABasic/";	

select path from TestCases where qid="MCABasic";
SET foreign_key_checks = 0;
alter table exams modify column id varchar(50);

show tables;

desc TestCases;
desc exams;



truncate table exams;
truncate table Question;
truncate table ExamQuestion;
truncate table TestCases;

select * from exams;
select * from Question;
select * from ExamQuestion;
select * from TestCases;

show tables;

#create table for users
create table login (
registerno varchar(200) PRIMARY KEY,
firstname varchar(200) NOT NULL,
lastname varchar(200) NOT NULL,
email varchar(100) NOT NULL,
password varchar(300) NOT NULL,
isProfessor int NOT NULL);

desc login;
drop table login;
select * from login;
truncate table login;

#table to store which student is taking the exams
create table examtakingstudent (
registerno varchar(200),
examid varchar(30),
status varchar(20),
marks int,
FOREIGN KEY(registerno) references login(registerno),
FOREIGN KEY(examid) references exams(id)
);

drop table examtakingstudent;

select * from examtakingstudent;
select * from Question;

#storing user code for each question
create table usercode(
registerno varchar(200),
qid varchar(40),
codeval nvarchar(8000),
status varchar(50),
foreign key(registerno) references login(registerno),
foreign key(qid) references Question(id)
);
desc usercode;

#student status
create table userexamstatus(
id int PRIMARY KEY AUTO_INCREMENT,
registerno varchar(30),
examid varchar(30),
remaining_time int,
FOREIGN KEY(registerno) references login(registerno),
FOREIGN KEY(examid) references exams(id)
);
desc userexamstatus;
select * from exams;
select * from userexamstatus;
update userexamstatus set remaining_time=10 where id=4;

show tables;
select * from Question;
truncate userexamstatus;

SET FOREIGN_KEY_CHECKS=1;
select * from TestCases;
select * from login;

select * from exams;

SELECT * from exams WHERE id in( select examid from examtakingstudent where registerno=2247123 && status="Done");
select * from login;
select * from login where registerno in (select registerno from examtakingstudent where examid="CAT-3-2023-04-13");
select * from exams;
select * from examtakingstudent;
update examtakingstudent set status="not-attempted" where registerno="2247123" and examid="neexam-2023-04-13";

select * from userexamstatus;
