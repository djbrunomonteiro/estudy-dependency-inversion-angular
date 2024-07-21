export default abstract class UserCase<E, S> {
    abstract execute(implementation: E): Promise<S>;
}
