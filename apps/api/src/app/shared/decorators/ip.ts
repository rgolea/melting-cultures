import { createParamDecorator } from "@nestjs/common";
const localhost = null;
export const Ip = createParamDecorator(
  (_$, args) => {
    const ctx = args[2];
    if(!ctx) return localhost;
    const ip = ctx.headers && ctx.headers['x-forwarded-for'] || ctx.connection && ctx.connection.remoteAddress || localhost;
    if(ip === '::1') return localhost;
    return ip;
  }
)
