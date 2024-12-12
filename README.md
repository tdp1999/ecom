Develop Journal

- 27/11:
    + Auth service khong the catch error throw tu rpc repo -> Them cac function fromJson, toJson vao DomainError
    + Không biết cách viết một decorator -> Nghĩ tới monkey patching
    + Không hiểu tại sao Observable đi qua rpc call lại trở thành promise wrap observable ``` Promise {
    Observable {
        source: Observable {
          source: [Observable],
          operator: [Function (anonymous)]
        },
        operator: [Function (anonymous)]
    }
} ``` -> Cần phải catch sau khi await (Xem fle client.rpc.decorator.ts)
- 3/12: back to the passportjs implementation, done jwt service, chua them vao ham login
- 4/12: xong tao 2 guards, khong hieu link giua guard va strategy la gi. Co bug luc login (done)
- 5/12: khong biet doi 401 error message nhu the nao
- 6/12: xong customize error message. Xem tiep bai giang 11.
- 8/12: lam api get profile. Add check user trong guard (Bai giang 11/24:00)
- 9/12: tach error ra thanh tung truong hop https://claude.ai/chat/22f8090d-6b77-4ee4-89dd-b59a41baddb6
- 10/12: I mixed up the condition of exist.
- 11/12: tiep tuc bai giang 11. Chua Clear 11. lam api get profile.
- 12/12: read this about custom decorator: https://docs.nestjs.com/custom-decorators. Cannot understand how hutton service do it => Understand it now. When a request go through the guard, the guard will eventually check all the criteria

```typescript
async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride(METADATA_SKIP_AUTH, [context.getClass(), context.getHandler()]);
    if (skipAuth) {
      return true;
    }

    const req = context.getType() === 'http' ? context.switchToHttp().getRequest() : context.switchToRpc().getContext();
    try {
      const authorization = req.headers?.['authorization'] || req?.getHeaders?.()?.headers?.get('authorization')[0] || '';
      const accessToken = authorization?.replace('Bearer ', '');
      if (!accessToken) {
        throw new Error('30009');
      }

      const credential = await this.clientService.send<CredentialInterface>(AuthVerifyAccessTokenAction.create({ accessToken }));
      if (!credential) {
        throw new Error('30006');
      }
      const user = await this.clientService.send<UserInterface>(UserReadByIdAction.create({ id: credential?.sourceId }));
      if (!user) {
        throw new Error('30008');
      } else if (!user.isActive) {
        throw new Error('30002');
      } else if (user.status !== UserStatus.enabled) {
        throw new Error('30003');
      } else if (credential.version < user.lastCredentialChange) {
        throw new Error('30017');
      }
      user.credential = credential;
      req.user = user;

      const salesperson = await this.clientService.send<AgentInterface>(SalespersonReadByUserIdAction.create({ userId: credential.sourceId }));
      req.salesperson = salesperson;
      return true;
    } catch (error) {
      const code = parseInt(error.message);
      if (!Number.isNaN(code)) {
        Logger.error('ERROR AuthGuard', JSON.stringify(CredentialError[code]));
        throw new UnauthorizedException(CredentialError[code]);
      } else {
        Logger.error('ERROR AuthGuard', JSON.stringify(error));
        throw new InternalServerErrorException(CredentialError[30000]);
      }
    }
  }
  ```
 - 12/12: after checking, it will attach the user information into the request, so inside controller, data can be accessed. With Passport.js, we'll do it inside the strategy.
 - 12/12: tiep tuc bai giang 11. Xong bai giang 11. Qua bai giang 12. Bo passport strategy la jwt. Su dung guard thuan.
