CREATE TABLE IF NOT EXISTS User(
    id              INT PRIMARY KEY,
    username        TEXT NOT NULL,
    passwordHash    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Expenses(
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            TEXT NOT NULL,
    amount          FLOAT NOT NULL,
    remarks         TEXT,
    expenseDate     DATE NOT NULL
    -- userID      INT NOT NULL
);
-- ALTER TABLE Expenses ADD FOREIGN KEY (userID) REFERENCES User(id);
