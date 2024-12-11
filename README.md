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
