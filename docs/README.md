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
async
canActivate(context
:
ExecutionContext
):
Promise < boolean > {
    const skipAuth = this.reflector.getAllAndOverride(METADATA_SKIP_AUTH, [context.getClass(), context.getHandler()]);
    if(skipAuth) {
        return true;
    }

    const req = context.getType() === 'http' ? context.switchToHttp().getRequest() : context.switchToRpc().getContext();
    try {
        const authorization = req.headers?.['authorization'] || req?.getHeaders?.()?.headers?.get('authorization')[0] || '';
        const accessToken = authorization?.replace('Bearer ', '');
        if(!accessToken
)
{
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
} catch
(error)
{
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
- 14/12: xong bo passport. Xem tiep bai giang 12
- 15/12: Lam permission guard, permission decorator to skip. // chua lam
- 15/12: Doc va hieu cac design pattern sau:
    - Decorator pattern va no khac gi so voi decorator o angular va nestjs // decorator.ts
    - Factory Method pattern // done
- 15/12: Them with log o error guard // remove
- 17/12: Nghien cuu permission/policy guard, lam prototype cho cac app sau nay. Find out what is the best way to create a custom guard/decorator
- 18/12: Read about execution context, argument host and metadata in decorator:
    - Argument host (host):
        - được dùng để truy cập các object request, response của api. Được dùng ở filter để lấy request.
        - Dựa trên tính chất platform diagnostic của nestjs, ta cần chuyển đổi host sang context (http, rpc).
    - execution context (ctx):
        - được extends từ argument host, có thêm 2 method là getHandler và getClass.
- dùng ở guard và interceptor để check metadata
    - metadata được set bởi reflector hoặc hàm SetMetadata của nestjs.
        - Để lấy ra được metadata nào đã set, ta cần dùng reflector.get...
        - Có 3 cách get chính: get bình thường, nhận vào tên token và class/method được gắn metadata. còn lại là get-override hoặc get-merge.
- 21/12: Try to implement RBAC
- 21/12: Try to implement a seeder feature
- 22/12: Done seeder feature
- 23/12: Update default auditable entity -> done all
- 24/12: Test lại tất cả các API
    - Add logic delete at cho all api -> done
    - Sửa bug -> done
- 25/12: Try to implement RBAC
    - Add a feature to inject remark to error -> done
- 26/12: Try to implement RBAC
    - Add permission Module -> done
    - ADd permission seeding
    - Add new role
    - Add role/group module
