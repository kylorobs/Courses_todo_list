
export function BindThis( _: any, _1 : string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;
    const newDescriptor: PropertyDescriptor = {
        get(){
            const boundMethod = originalMethod.bind(this);
            return boundMethod   
        }
    }
    return newDescriptor;
}