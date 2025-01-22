export interface IUseCase<P> {
    execute(payload: P): Promise<boolean>;
}
