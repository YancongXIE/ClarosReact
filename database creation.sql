CREATE TABLE IF NOT EXISTS distribution (
    distributionID INTEGER PRIMARY KEY AUTO_INCREMENT,
    distributionDetails VARCHAR(255),
    adminID INTEGER NOT NULL,
    UNIQUE (adminID, distributionDetails)
);

CREATE TABLE IF NOT EXISTS study (
    studyID INTEGER PRIMARY KEY AUTO_INCREMENT,
    studyDate VARCHAR(255) NOT NULL,
    studyName VARCHAR(255) NOT NULL,
    distributionID INTEGER NOT NULL,
    adminID INTEGER NOT NULL,
    FOREIGN KEY (distributionID) REFERENCES distribution(distributionID)
);

CREATE TABLE IF NOT EXISTS respondent (
    respondentID INTEGER PRIMARY KEY AUTO_INCREMENT,
    studyID INTEGER NOT NULL,
    username VARCHAR (255) NOT NULL,
    rawPassword VARCHAR (255) NOT NULL,
    adminID INTEGER NOT NULL,
    FOREIGN KEY (studyID) REFERENCES study(studyID)
);

CREATE TABLE IF NOT EXISTS studyRound (
    roundID INTEGER PRIMARY KEY AUTO_INCREMENT,
    studyID INTEGER NOT NULL,
    studyRound INTEGER NOT NULL,
    roundDate VARCHAR(255) NOT NULL,
    adminID INTEGER NOT NULL,
    FOREIGN KEY (studyID) REFERENCES study(studyID)
);

CREATE TABLE IF NOT EXISTS statement (
    statementID INTEGER PRIMARY KEY AUTO_INCREMENT,
    short VARCHAR(255) NOT NULL,
    statementText VARCHAR(255) NOT NULL,
    adminID INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS studyStatement (
    studyStatementID INTEGER PRIMARY KEY AUTO_INCREMENT,
    studyID INTEGER NOT NULL,
    statementID INTEGER NOT NULL,
    adminID INTEGER NOT NULL,
    UNIQUE (studyID,statementID),
    FOREIGN KEY (studyID) REFERENCES study(studyID),
    FOREIGN KEY (statementID) REFERENCES statement(statementID)
);

CREATE TABLE IF NOT EXISTS qSort (
    respondentID INTEGER NOT NULL,
    roundID INTEGER NOT NULL,
    studyStatementID INTEGER NOT NULL,
    qSortValue INTEGER NOT NULL,
    adminID INTEGER NOT NULL,
    PRIMARY KEY (respondentID, roundID, studyStatementID),
    UNIQUE (respondentID, roundID, studyStatementID, qSortValue),
    FOREIGN KEY (roundID) REFERENCES studyRound(roundID),
    FOREIGN KEY (studyStatementID) REFERENCES studyStatement(studyStatementID)
);

