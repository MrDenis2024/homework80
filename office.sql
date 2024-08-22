create schema office collate utf8mb3_general_ci;

USE office;

create table categories
(
    id          int auto_increment
        primary key,
    title       varchar(255) not null,
    description TEXT         null
);

create table locations
(
    id          int auto_increment
        primary key,
    title       varchar(255) not null,
    description text         null
);

create table items
(
    id          int auto_increment
        primary key,
    category_id int                    not null,
    location_id int                    not null,
    name        varchar(255)           not null,
    description TEXT                   null,
    image       varchar(255)           null,
    date_added  DATETIME default NOW() null,
    constraint items_categories_id_fk
        foreign key (category_id) references categories (id),
    constraint items_locations_id_fk
        foreign key (location_id) references locations (id)
);

INSERT INTO categories (title, description) VALUES ('Мебель', NULL), ('Компьютерное оборудование', 'Миниторы, клавиатуры, мышки и т.д'), ('Бытовая техника', 'Кондиционеры, куллеры кофемашины и т.д.');

INSERT INTO locations (title, description) VALUES ('Кабинет директора', 'Личный кабинет директора'), ('Кабинет 204', 'Кабинет бухгалтерии'), ('Учительская', NULL);

INSERT INTO items (category_id, location_id, name, description, image) VALUES (1, 1, 'Стол компьютерный', NULL, NULL), (2, 1, 'Компьютер', 'Компьютер и его периферия', NULL), (3, 1, 'Кондиционер', NULL, NULL);

INSERT INTO items (category_id, location_id, name, description, image) VALUES (2, 2, 'Компьютер', 'Компьютер и его периферия', NULL), (1, 2, 'Стол', 'Компьютерный стол', NULL), (1,2, 'Кресло', 'Компьютерное кресло', NULL), (3, 2, 'Куллер', NULL, NULL);

INSERT INTO  items (category_id, location_id, name, description, image) VALUES (1, 3, 'Стол', 'Обеденный стол', NULL), (1, 3, 'Стул', NULL, NULL), (3, 3, 'Куллер', NULL, NULL);