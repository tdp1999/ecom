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
async;
canActivate(context
:
ExecutionContext;
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
(error);
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
- Try to implement RBAC
    - Add permission Module -> done
    - Add permission seeding -> done
    - Add DTO for list, detail (29/12) -> done
    - Add isSystem property to user table (29/12) -> done
    - Add role table (30/12) -> done
    - Aggregate role and permission. Find a way to aggregate everything quickly -> ?
    - Try to implement a cache functions 2/1/2025 -> stuck at CacheRepository interface -> done 3/1/2025
    - In the middle of writing test for cache function -> done 3/1/2025
    - Check CRUD role -> done 4/1/2025
    - Add Role to User entity, user get API -> done 4/1/2025
    - Assign permission to feature -> done 6/1/2025
- 6/1/2025: Tiep tuc xem bai giang 13
    - Add cart feature
    - Create cart database with 3 key as primary index
    - Cart has 5 apis:
        - list all product inside cart
        - add product to cart
        - remove product from cart
        - update quantity of product in cart
        - clear cart
    - Do the update quantity:
        - Study about unit of work pattern: 7/1/2025
        - Study about left join, right join in sql -> Không cần thiết sử dụng right join hay full join. Thuc te la mysql con k support full join
        - Study about locking types in sql -> normal, transaction: 12/1/2025
        - Implement unit of work pattern -> Think about re-organize the project theo huong domain, infras, application -> Think about domain service -> tach update cart thanh 1 use case (good)
            - Implement repository and entity
            - Study about transaction in nest, typeorm -> 20/1/2025
            - Tìm hiểu về concurrency in database -> Biết về distributed transaction challenge của microservice
            - Để giải quyết vấn đề này, ta phải sử dụng 2pc, 3pc hoặc giải pháp mới hơn: SAGA
            - Nhận ra mình chưa thể implement saga ở hiện tại -> Quay lại viết code hướng cơ bản (không dùng uow, hay saga, chỉ đơn thuần check data)
    - Add update quantity to product API
        - 22/1/2025: Reconstruct the whole flow
        - 23/1/2025: Finish add item to cart, update cart quantity.
        - 25/1/2025: Done all cart API. Try to register a new user -> Found a bug at register. -> Done -> Try to force logout before login -> done
        - 26/1/2025: List cart (missing) -> done
- 26/1/2025:
    - Add updatedAt auto update -> done
    - Add update many to cart -> not gonna do it. Move on to bigger things
- 7/2/2025: Back from Tet holiday (study new Angular) - Order feature
    - Add User address feature -> Billing address?
    - Order bao gom bang order va order item
    - Một vài điều nhận ra
        - Ta có thể vừa sử dụng zod, vừa làm đúng với ddd, entity là một class. Ta chỉ cần dùng factory method là được.
        - Để dùng một entity với class và zod có một cách, ta cần các hàm như toDomain ở persistance để chuyển data thành kiểu mong muốn. Lưu ý: chỉ chuyển khi cần data change, không chuyển khi get data for ui.
        - Về folder structure, tham khảo ở file docs/folder-structure.md
        - Aggregate có xuất hiện trong ddd và hexagonal, nhưng rule of thumb là các hàm bên trong aggregate phải được thực hiện bên trong 1 transaction (không thể làm saga hay 2PC) -> Có thể coi user và user item là 1 aggregate (user)
        - Từ ý trên, ta nhận thấy dto sẽ có 4 loại chính,
            - command.dto: dùng cho dto đưa data vào system, cần validate
            - query.dto: dùng cho dto truy vấn data, cần validate
            - outcome.dto: dùng để trả data cho những command, không cần validate / map
            - view.dto: dùng để trả data cho những query, không cần validate / map
        - Chấp nhận không thay đổi folder structure ở project này (mất thời gian), chỉ cần dùng chính xác ở những module sau
- 15/2/2025:
    - Viet address module với folder structure mới.
    - Ôn lại decorator pattern và học builder pattern
    - 
