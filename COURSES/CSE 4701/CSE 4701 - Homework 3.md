***Riley Francis - rif17002***
- - -
### Question 1
![[CSE 4701 - HW3 - Q1-img.png]]
### Question 2
Assume that all attribute types are `int`.
##### 1. Translate strong entities and un-nest composite attributes 
```SQL
create table A (
	a1, 
	a11,
	a12,
	a2,
	a3,
	primary key (a1)
);

create table B(
	b1,
	b2,
	primary key (b1, b2)
);

create table C(
	c1,
	c11,
	c12,
	c2,
	primary key (c2)
);

create table E (
	e1,
	e2,
	primary key (e1)
);
```
##### 2. Translate weak entities
```SQL
-- other tables remain the same

create table D(
	d1,
	a1,
	c2,
	foreign key (c2) references C(c2),
	foreign key (a1) references A(a1)
	primary key (d1, a1, c2)
);
```
##### 3. Translate multi-valued attributes
```SQL
-- other tables remain the same

-- Multivalued attribute b3 for B
create table B_b3 (
    b1,
    b2,
    b3,
    primary key (b1, b2, b3),
    foreign key (b1, b2) references B(b1, b2)
);

-- Multivalued attribute d2 for D
create table D_d2 (
    d1,
    a1,
    c2,
    d2,
    primary key (d1, a1, c2, d2),
    foreign key (d1, a1, c2) references D(d1, a1, c2)
);
```
##### 4. Translate relationships

```SQL
create table A (
    a1,
    a11,
    a12,
    a2,
    a3,
    -- Relationship X
    b1,
    b2,                   
    primary key (a1),
    foreign key (b1, b2) references B(b1, b2)
);

create table B (
    b1,
    b2,
    primary key (b1, b2)
);

create table C (
    c1,
    c11,
    c12,
    c2,
    primary key (c2)
);

create table E (
    e1,
    e2,
    primary key (e1)
);

-- Weak entity D (dependent on A and C)
create table D (
    d1,
    a1,
    c2,
    primary key (d1, a1, c2),
    foreign key (a1) references A(a1),
    foreign key (c2) references C(c2)
);

-- Multivalued attribute b3 for entity B
create table B_b3 (
    b1,
    b3,
    primary key (b1, b3),
    foreign key (b1) references B(b1)
);

-- Multivalued attribute d2 for weak entity D
create table D_d2 (
    d1,
    a1,
    c2,
    d2,
    primary key (d1, a1, c2, d2),
    foreign key (d1, a1, c2) references D(d1, a1, c2)
);

-- Relationship Z between B and E
create table Z (
    b1,
    b2,
    e1,
    c2,
    z1,
    primary key (b1, b2, c2, e1),
    foreign key (b1, b2) references B(b1, b2),
    foreign key (e1) references E(e1),
    foreign key (c2) references C(c2)
);
```