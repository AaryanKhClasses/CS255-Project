CREATE TABLE IF NOT EXISTS User(
    id              INT PRIMARY KEY AUTO_INCREMENT,
    username        VARCHAR(255) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    passwordHash    TEXT NOT NULL,
    createdAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Expenses(
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            TEXT NOT NULL,
    amount          FLOAT NOT NULL,
    remarks         TEXT,
    expenseDate     DATE NOT NULL,
    userID          INT NOT NULL,
    category        VARCHAR(100),
    tags            VARCHAR(255),
    createdAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Category(
    id              INT PRIMARY KEY AUTO_INCREMENT,
    userID          INT NOT NULL,
    name            VARCHAR(100) NOT NULL,
    createdAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Tags(
    id              INT PRIMARY KEY AUTO_INCREMENT,
    userID          INT NOT NULL,
    name            VARCHAR(100) NOT NULL,
    createdAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES User(id) ON DELETE CASCADE
);
