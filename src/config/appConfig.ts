interface IAppConfig {
  port: string;
  host: string;
  auth: {
    saltRounds: string;
    refreshTokenSecret: string;
    refreshTokenDuration: string;
    accessTokenDuration: string;
    accessTokenSecret: string;
  };
}

export const appConfig: IAppConfig = {
  port: process.env.PORT || '3000',
  host: process.env.HOST || 'localhost',
  auth: {
    saltRounds: '11',
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET || 'ENTER_ACCESS_TOKEN_SALT_HERE',
    refreshTokenSecret: process.env.AUTH_REFRESH_TOKEN_SECRET || 'ENTER_REFRESH_TOKEN_SALT_HERE',
    accessTokenDuration: process.env.AUTH_ACCESS_TOKEN_DURATION || '300000',
    refreshTokenDuration: process.env.AUTH_REFRESH_TOKEN_DURATION || '86400000'
  }
};
