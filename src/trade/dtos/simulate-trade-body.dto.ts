import { IsEnum, IsIn, IsNumber } from "class-validator";
import apiConfig from "./../../config/config";
import { OperationTypesEnum } from "../enums/operation-types.enum";

export class SimulateTradeBodyDto {
  @IsEnum(OperationTypesEnum)
  operation: OperationTypesEnum;

  @IsNumber()
  limit: number;

  @IsNumber()
  amount: number;
}
