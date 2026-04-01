import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./src/database/db.sqlite",
    migrations: [
        "./src/database/migrations/*.ts"
    ],
    entities: [
        "./src/entities/*.ts"
    ],
    synchronize: true
});

export const initDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Data Source inicializado");
    } catch (error) {
        console.error(error);
    }
};