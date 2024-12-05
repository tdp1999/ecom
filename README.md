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
- 4/12: xong tao 2 guards, khong hieu link giua guard va strategy la gi. Co bug luc login
