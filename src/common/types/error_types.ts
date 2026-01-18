
export class LogError extends Error {
    private statusCode: number
    private data: any

    constructor(message: string, statusCode: number, data: any = null  ) {
        super(message)
        this.statusCode = statusCode
        this.data = data

        Object.setPrototypeOf(this, LogError.prototype);  
    } 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
}