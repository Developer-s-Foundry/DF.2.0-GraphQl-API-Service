import {IsDefined, IsNumber, validate, ValidateIf } from 'class-validator';



export class timeStampDto {

    @IsNumber()
    year!: number

    @IsNumber()
    @ValidateIf((opts) => opts.day != undefined || opts.day != null)
    @IsDefined({message:'month is missing'})
    month?: number
    
    @IsNumber()
    @ValidateIf((opts) => opts.hour != undefined || opts.day != null)
     @IsDefined({message:' day is missing'})
    day?: number 
    
    @IsNumber()
    @ValidateIf((opts) => opts.minute != undefined || opts.day != null)
     @IsDefined({message:'hour is missing'})
    hour?: number
    
    @IsNumber()
    minute?: number
}