CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(50) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role_id BIGINT NOT NULL,
                       CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE meetings (
                          id BIGSERIAL PRIMARY KEY,
                          title VARCHAR(30) NOT NULL,
                          transcript TEXT NOT NULL,
                          uploader_id BIGINT NOT NULL,
                          CONSTRAINT fk_uploader_id FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
                       id BIGSERIAL PRIMARY KEY,
                       description JSONB,
                       status VARCHAR(20) DEFAULT 'CREATED' CHECK (status IN ('CREATED','PROCESSING','FINISHED')),
                       deadline DATE,
                       assigned_user BIGINT,
                       meeting_id BIGINT NOT NULL,
                       CONSTRAINT fk_assigned_user FOREIGN KEY(assigned_user) REFERENCES users(id) ON DELETE CASCADE,
                       CONSTRAINT fk_meeting_id FOREIGN KEY(meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
);