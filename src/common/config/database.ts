import { DataSource } from "typeorm";
import { APP_CONFIGS } from ".";
import path from 'path'
import fs from 'fs'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: APP_CONFIGS.DATABASE_HOST,
    port: parseInt(APP_CONFIGS.DATABASE_PORT),
    username: APP_CONFIGS.DATABASE_USERNAME,
    password: APP_CONFIGS.DATABASE_PASSWORD,
    database: APP_CONFIGS.DATABASE_NAME,
    logging: true,
    entities: APP_CONFIGS.NODE_ENV === 'prod'
    ? ["./dist/models/entities/**/*{.ts,.js}"]
    : ["src/models/entities/**/*{.ts,.js}"],
    migrations: APP_CONFIGS.NODE_ENV === 'prod'
    ? ["./dist/migrations/**/*{.ts,.js}"]
    : ["src/migrations/**/*{.ts,.js}"],
    ssl: {
            ca: fs.readFileSync(path.resolve(__dirname, '../../../ca.pem')).toString(),
                rejectUnauthorized: true,
        },
    extra: {
        max: 10
    }
})

export const dbInitialization = async () => {
    try {
        await AppDataSource.initialize()
        console.log("Data Source has been initialized!")
    } catch (error) {
        console.error("Error during Data Source initialization", error)
    }     
}
