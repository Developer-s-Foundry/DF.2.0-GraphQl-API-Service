import { Application, json, urlencoded } from "express";

const expressConfig = async (app: Application): Promise<void> => {
  app.use(
    urlencoded({
      extended: true,
    })
  );
  app.use(json());
};

export default expressConfig